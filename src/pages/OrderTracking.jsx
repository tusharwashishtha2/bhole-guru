import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, Phone, ArrowRight, X, Download, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import Invoice from '../components/Invoice';
import 'leaflet/dist/leaflet.css';

const OrderTracking = () => {
    const { getOrder, currentOrderId, cancelOrder, setCurrentOrderId, orders } = useOrder();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
    const invoiceRef = useRef();
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [manualOrderId, setManualOrderId] = useState('');

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

            // Auto-select most recent order if no ID provided
            if (!orderId && orders && orders.length > 0) {
                orderId = orders[0]._id || orders[0].id;
                setSearchParams({ orderId });
            }

            if (!orderId) return;

            // First try to get from context
            const foundOrder = getOrder(orderId);
            if (foundOrder) {
                setOrder(foundOrder);
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
            }
        };

        fetchOrderDetails();
    }, [searchParams, currentOrderId, getOrder, orders, setSearchParams]);

    useEffect(() => {
        if (order?.status === 'Delivered') {
            setShowDeliveredPopup(true);
            triggerConfetti();
        }
    }, [order?.status]);

    // Handle loading or no order state
    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-luminous-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-luminous-maroon">
                        <Truck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
                    <p className="text-gray-500 mb-6">Enter your Order ID to see real-time updates.</p>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Order ID (e.g., 674...)"
                            value={manualOrderId}
                            onChange={(e) => setManualOrderId(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                        />
                        <Button onClick={() => {
                            if (manualOrderId.trim()) {
                                setSearchParams({ orderId: manualOrderId.trim() });
                            }
                        }}>
                            Track
                        </Button>
                    </div>

                    <div className="text-sm text-gray-400">
                        Don't have an Order ID? <Link to="/profile" className="text-luminous-maroon hover:underline">Check My Orders</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative overflow-hidden">
            {/* Delivered Popup */}
            <AnimatePresence>
                {showDeliveredPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center relative"
                        >
                            <button
                                onClick={() => setShowDeliveredPopup(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Delivered!</h2>
                            <p className="text-gray-500 mb-6">
                                Your package has been successfully delivered. Thank you for shopping with Bhole Guru!
                            </p>
                            <Button onClick={() => setShowDeliveredPopup(false)} className="w-full">
                                Awesome!
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Cosmic Background Animation */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                scale: Math.random() * 0.5 + 0.5,
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                            animate={{
                                y: [null, Math.random() * window.innerHeight],
                                opacity: [null, Math.random() * 0.5 + 0.2, 0]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                            }}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luminous-gold/10 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="container mx-auto px-4 pt-32 relative z-10">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 max-w-3xl mx-auto border border-white/20">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                                {getStatusTitle(order.status)}
                            </h1>
                            <p className="text-gray-500">Order #{order.id || order._id}</p>
                            {order.trackingNumber && (
                                <p className="text-luminous-maroon font-bold mt-1">Tracking ID: {order.trackingNumber}</p>
                            )}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusStep === 4 ? 'bg-green-100 text-green-700' : isCancelled ? 'bg-red-100 text-red-700' : 'bg-luminous-gold/10 text-luminous-maroon'}`}>
                            <span className={`w-2 h-2 rounded-full ${statusStep === 4 ? 'bg-green-500' : isCancelled ? 'bg-red-500' : 'bg-luminous-maroon animate-pulse'}`}></span>
                            {order.status}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {!isCancelled ? (
                        <div className="relative mb-12">
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
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-green-500 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
                                                <Icon size={20} />
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

                    {/* Delivery Partner Info */}
                    <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-400">
                                {order.courierName ? <Truck size={32} /> : <Package size={32} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{order.courierName || 'Pending Assignment'}</h3>
                                <p className="text-gray-500 text-sm">Courier Partner</p>
                                {order.trackingNumber && (
                                    <div className="flex items-center text-luminous-maroon text-sm mt-1">
                                        <span className="font-bold">{order.trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <a
                                href="tel:+919876543210"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                                <Phone size={18} /> Call Support
                            </a>
                            {order.status === 'Processing' && (
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                            await cancelOrder(order._id || order.id);
                                        }
                                    }}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Button className="flex-1 sm:flex-none" to="/">
                                Back to Home
                            </Button>
                        </div>
                    </div>

                    {/* Invoice Download Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={isGeneratingInvoice}
                            className="flex items-center gap-2 text-gray-500 hover:text-luminous-maroon transition-colors text-sm font-medium"
                        >
                            <Download size={16} />
                            {isGeneratingInvoice ? 'Generating Invoice...' : 'Download Invoice'}
                        </button>
                    </div>
                </div>

                {/* Hidden Invoice Component for PDF Generation */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    <Invoice ref={invoiceRef} order={order} />
                </div>

                {/* Continue Shopping Promo */}
                <div className="mt-8 text-center relative z-10">
                    <Link to="/shop" className="inline-flex items-center text-white hover:text-luminous-gold font-medium transition-colors">
                        Continue Shopping <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
