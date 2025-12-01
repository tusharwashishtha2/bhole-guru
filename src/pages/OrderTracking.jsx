import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, Phone, ArrowRight, X, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import Invoice from '../components/Invoice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const OrderTracking = () => {
    const { getOrder, currentOrderId, cancelOrder, setCurrentOrderId } = useOrder();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
    const invoiceRef = useRef();
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [manualOrderId, setManualOrderId] = useState('');

    // Mock coordinates for demo (Varanasi)
    const position = [25.3176, 82.9739];

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

    const getTimeForStatus = (statusKey) => {
        if (!order) return '';
        // This is a simplified logic. Ideally, backend should provide timestamps for each status change.
        // For now, we use createdAt for placed, and current time for others if active.
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

    const statusStep = getStatusStep(order.status);
    const isCancelled = order.status === 'Cancelled';

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
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

            {/* Map Header */}
            <div className="h-[40vh] bg-gray-200 relative overflow-hidden w-full z-0">
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            Order Location <br /> {order.shippingAddress?.city || 'Varanasi'}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
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
                                {steps.map((step, index) => {
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
                            <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                                <Phone size={18} /> Call
                            </Button>
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
                <div className="mt-8 text-center">
                    <Link to="/shop" className="inline-flex items-center text-luminous-maroon hover:text-luminous-saffron font-medium transition-colors">
                        Continue Shopping <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
