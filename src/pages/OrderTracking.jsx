import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, Phone, ArrowRight, X, Download, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Invoice from '../components/Invoice';
import 'leaflet/dist/leaflet.css';

const OrderTracking = () => {
    const { getOrder, currentOrderId, cancelOrder, setCurrentOrderId, orders, loading } = useOrder();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const invoiceRef = useRef();
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [manualOrderId, setManualOrderId] = useState('');
    const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
    const [isDeliveredView, setIsDeliveredView] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Derived state helpers
    const getStatusStep = (status) => {
        switch (status) {
            case 'Order Placed': return 0;
            case 'Processing': return 1;
            case 'Packed': return 2;
            case 'Out for Delivery': return 3;
            case 'Delivered': return 4;
            case 'Cancelled': return -1;
            default: return 0;
        }
    };

    const getStatusTitle = (status) => {
        switch (status) {
            case 'Order Placed': return 'Order Placed';
            case 'Processing': return 'Processing Order';
            case 'Packed': return 'Packed & Ready';
            case 'Out for Delivery': return 'Out for Delivery';
            case 'Delivered': return 'Arrived Home';
            case 'Cancelled': return 'Order Cancelled';
            default: return 'Order Status';
        }
    };

    // Derived state
    const statusStep = order ? getStatusStep(order.status) : 0;
    const isCancelled = order ? order.status === 'Cancelled' : false;

    const handleDownloadInvoice = async () => {
        if (invoiceRef.current) {
            setIsGeneratingInvoice(true);
            try {
                await invoiceRef.current.generatePdf();
            } catch (error) {
                console.error("Failed to generate invoice:", error);
            } finally {
                setIsGeneratingInvoice(false);
            }
        }
    };

    const triggerConfetti = () => {
        import('canvas-confetti').then((confetti) => {
            confetti.default({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    };

    const getTimeForStatus = (statusKey) => {
        if (!order) return '';
        if (statusKey === 'Order Placed') return new Date(order.createdAt || order.date).toLocaleDateString();
        if (order.status === statusKey) return 'In Progress';
        if (getStatusStep(order.status) > getStatusStep(statusKey)) return 'Completed';
        return '';
    };

    const steps = [
        { statusKey: 'Order Placed', label: 'Order Placed', icon: Package },
        { statusKey: 'Processing', label: 'Processing', icon: CheckCircle },
        { statusKey: 'Packed', label: 'Packed', icon: Package },
        { statusKey: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
        { statusKey: 'Delivered', label: 'Delivered', icon: MapPin }
    ];

    useEffect(() => {
        const fetchOrderDetails = async () => {
            let orderId = searchParams.get('orderId') || currentOrderId;

            // If no order ID and no orders loaded, try to fetch user's orders first
            if (!orderId && (!orders || orders.length === 0)) {
                try {
                    const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/orders/myorders';
                    const token = localStorage.getItem('bhole_guru_token');
                    if (token) {
                        const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
                        const data = await response.json();
                        if (response.ok && data.length > 0) {
                            orderId = data[0]._id || data[0].id;
                            setSearchParams({ orderId });
                            setOrder(data[0]);
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to auto-fetch recent order", e);
                }
            }

            // Auto-select most recent order if no ID provided but orders exist in context
            if (!orderId && orders && orders.length > 0) {
                orderId = orders[0]._id || orders[0].id;
                setSearchParams({ orderId });
            }

            if (!orderId) {
                setIsInitializing(false);
                return;
            }

            // First try to get from context
            const foundOrder = getOrder(orderId);
            if (foundOrder) {
                setOrder(foundOrder);
                setIsInitializing(false);
                return;
            }

            // If not in context, fetch from API
            try {
                const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/orders';
                const token = localStorage.getItem('bhole_guru_token');
                const response = await fetch(`${API_URL}/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                }
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setIsInitializing(false);
            }
        };

        fetchOrderDetails();
    }, [searchParams, currentOrderId, getOrder, orders, setSearchParams]);

    useEffect(() => {
        const hasSeen = localStorage.getItem(`seen_delivered_${order?._id}`);
        if (order?.status === 'Delivered') {
            if (!hasSeen && user?.role !== 'admin') {
                setShowDeliveredPopup(true);
                triggerConfetti();
            } else {
                setIsDeliveredView(true);
            }
        }
    }, [order?.status, order?._id, user?.role]);

    const handleClosePopup = () => {
        setShowDeliveredPopup(false);
        localStorage.setItem(`seen_delivered_${order?._id}`, 'true');
        setIsDeliveredView(true);
    };

    // Handle loading or no order state
    if ((loading || isInitializing) && !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-luminous-maroon border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6 text-center">
                    We couldn't find an order with the provided ID. Please check the ID or try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Enter Order ID"
                        value={manualOrderId}
                        onChange={(e) => setManualOrderId(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luminous-maroon"
                    />
                    <Button
                        onClick={() => {
                            if (manualOrderId) {
                                setSearchParams({ orderId: manualOrderId });
                                setCurrentOrderId(manualOrderId);
                                setIsInitializing(true); // Re-trigger fetch
                            }
                        }}
                        disabled={!manualOrderId}
                        className="bg-luminous-maroon text-white hover:bg-luminous-maroon/90"
                    >
                        Track Order
                    </Button>
                </div>
                <Link to="/" className="mt-8 text-luminous-maroon hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Order Tracking</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {getStatusTitle(order.status)}
                    </span>
                </div>

                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-1">Order ID: <span className="font-medium text-gray-700">{order._id || order.id}</span></p>
                    <p className="text-sm text-gray-500">Placed on: <span className="font-medium text-gray-700">{new Date(order.createdAt || order.date).toLocaleDateString()}</span></p>
                </div>

                {/* Progress Bar */}
                {!isCancelled ? (
                    <div className="relative mb-12 px-2">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                            style={{ width: `${(statusStep / (steps.length - 1)) * 100}%` }}
                        ></div>

                        <div className="flex justify-between relative z-10">
                            {Array.isArray(steps) && steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= statusStep;
                                const time = getTimeForStatus(step.statusKey);

                                return (
                                    <div key={index} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                            <Icon size={16} className="md:w-5 md:h-5" />
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <p className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                            <p className="text-[10px] text-gray-400 min-h-[15px]">{time || (isActive ? 'Processing...' : '')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
                        <h3 className="text-red-800 font-bold text-lg mb-2">This order has been cancelled</h3>
                        <p className="text-red-600">If you have any questions, please contact our support team.</p>
                    </div>
                )}

                {/* Driver Details Card */}
                {order.driverDetails?.name && statusStep >= 3 && (
                    <div className="bg-gradient-to-r from-luminous-gold/10 to-luminous-maroon/5 border border-luminous-gold/20 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <img
                                    src={order.driverDetails.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt={order.driverDetails.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{order.driverDetails.name}</h3>
                                <p className="text-xs text-gray-500">Delivery Partner • {order.driverDetails.phone}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                            <p className="text-xl font-bold text-luminous-maroon">{order.status}</p>
                        </div>
                    </div>
                )}

                {/* Delivery Partner Info & Actions */}
                <div className="border-t border-gray-100 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                            {order.courierName ? <Truck size={32} /> : <Package size={32} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{order.courierName || 'Pending Assignment'}</h3>
                            <p className="text-gray-500 text-sm">Courier Partner</p>
                            {order.trackingNumber && (
                                <div className="flex items-center text-luminous-maroon text-sm mt-1 bg-luminous-gold/10 px-2 py-1 rounded-md inline-block">
                                    <span className="font-bold">{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-end gap-3 w-full lg:w-auto">
                        <a
                            href="tel:+917000308463"
                            className="flex-1 sm:flex-none min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 shadow-sm"
                        >
                            <Phone size={18} /> Call Support
                        </a>

                        {order.status === 'Processing' && (
                            <button
                                className="flex-1 sm:flex-none min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-semibold shadow-sm"
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to cancel this order?')) {
                                        await cancelOrder(order._id || order.id);
                                    }
                                }}
                            >
                                <X size={18} /> Cancel Order
                            </button>
                        )}

                        <Link
                            to="/"
                            className="flex-1 sm:flex-none min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-luminous-maroon text-white rounded-xl hover:bg-luminous-maroon/90 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Invoice Download Button */}
                <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
                    <button
                        onClick={handleDownloadInvoice}
                        disabled={isGeneratingInvoice}
                        className="group flex items-center gap-2 text-gray-500 hover:text-luminous-maroon transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-luminous-gold/5"
                    >
                        <Download size={16} className="group-hover:scale-110 transition-transform" />
                        {isGeneratingInvoice ? 'Generating Invoice...' : 'Download Invoice'}
                    </button>
                </div>
            </div>

            {/* Hidden Invoice Component for PDF Generation - Fixed Width */}
            <div style={{ position: 'fixed', top: '0', left: '-9999px', width: '794px' }}>
                <Invoice ref={invoiceRef} order={order} />
            </div>

            {/* Continue Shopping Promo */}
            <div className="mt-8 text-center relative z-10">
                <Link to="/shop" className="inline-flex items-center text-white hover:text-luminous-gold font-medium transition-colors">
                    Continue Shopping <ArrowRight size={18} className="ml-2" />
                </Link>
            </div>

            {/* Delivered Popup */}
            <AnimatePresence>
                {showDeliveredPopup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <div className="mb-6">
                                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Order Delivered!</h3>
                                <p className="text-gray-600">Your order <span className="font-semibold">#{order._id?.substring(0, 8)}</span> has been successfully delivered.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => navigate('/shop')}
                                    className="w-full bg-luminous-maroon text-white hover:bg-luminous-maroon/90"
                                >
                                    Shop Again
                                </Button>
                                <Button
                                    onClick={handleClosePopup}
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    View Order Details
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderTracking;
