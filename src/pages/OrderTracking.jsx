import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, Phone, Star, ArrowRight, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import confetti from 'canvas-confetti';

const OrderTracking = () => {
    const { id } = useParams();
    const { getOrder, currentOrderId } = useOrder();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);

    useEffect(() => {
        const targetOrderId = id || currentOrderId;
        if (targetOrderId) {
            const currentOrder = getOrder(targetOrderId);
            setOrder(currentOrder);

            // Check if just delivered to show popup
            // Use sessionStorage to ensure it only shows once per session/refresh
            if (currentOrder?.status === 'Delivered') {
                const hasShownPopup = sessionStorage.getItem(`popup_shown_${currentOrderId}`);
                if (!hasShownPopup) {
                    setShowDeliveredPopup(true);
                    triggerConfetti();
                    sessionStorage.setItem(`popup_shown_${currentOrderId}`, 'true');
                }
            }
        }
    }, [currentOrderId, getOrder, order?.status]);

    const triggerConfetti = () => {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        var random = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'Order Placed': return 0;
            case 'Packed': return 1;
            case 'Out for Delivery': return 2;
            case 'Delivered': return 3;
            default: return 0;
        }
    };

    const getStatusTitle = (status) => {
        switch (status) {
            case 'Order Placed': return 'Order Confirmed';
            case 'Packed': return 'Order Packed';
            case 'Out for Delivery': return 'Out for Delivery';
            case 'Delivered': return 'Order Delivered';
            default: return 'Order Status';
        }
    };

    // Helper to get time for a specific status from timeline
    const getTimeForStatus = (statusLabel) => {
        if (!order || !order.timeline) return '';
        const entry = order.timeline.find(t => t.status === statusLabel);
        if (!entry) return '';
        return new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const steps = [
        { icon: CheckCircle, label: "Order Placed", statusKey: "Order Placed" },
        { icon: Package, label: "Packed", statusKey: "Packed" },
        { icon: Truck, label: "Out for Delivery", statusKey: "Out for Delivery" },
        { icon: MapPin, label: "Delivered", statusKey: "Delivered" }
    ];

    // Handle loading or no order state
    if (!order) {
        const targetOrderId = id || currentOrderId;
        // If there's no ID, show empty state immediately
        if (!targetOrderId) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Order</h2>
                        <p className="text-gray-500 mb-6">It looks like you haven't placed an order yet.</p>
                        <Button to="/shop">Start Shopping</Button>
                    </div>
                </div>
            );
        }
        // If there is an ID but no order yet (loading), show loader
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luminous-maroon"></div>
            </div>
        );
    }

    const statusStep = getStatusStep(order.status);

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
            <div className="h-[40vh] bg-gray-200 relative overflow-hidden w-full">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/75.8577,22.7196,13,0/1000x600?access_token=mock')] bg-cover bg-center opacity-60 grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>

                {/* Animated Delivery Partner */}
                <motion.div
                    className="absolute top-1/2 left-1/4 transform -translate-y-1/2"
                    animate={{ left: statusStep >= 3 ? '75%' : statusStep >= 2 ? '50%' : '25%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                >
                    <div className="relative">
                        <div className="w-12 h-12 bg-luminous-maroon rounded-full flex items-center justify-center text-white shadow-lg z-10 relative">
                            <Truck size={24} />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 blur-sm rounded-full"></div>

                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-luminous-maroon rounded-full animate-ping opacity-20"></div>
                    </div>
                </motion.div>

                {/* Destination Pin */}
                <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2 -mt-6">
                    <MapPin size={40} className="text-red-600 drop-shadow-lg" fill="currentColor" />
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                                {getStatusTitle(order.status)}
                            </h1>
                            <p className="text-gray-500">Order #{order.id}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusStep === 3 ? 'bg-green-100 text-green-700' : 'bg-luminous-gold/10 text-luminous-maroon'}`}>
                            <span className={`w-2 h-2 rounded-full ${statusStep === 3 ? 'bg-green-500' : 'bg-luminous-maroon animate-pulse'}`}></span>
                            {order.status}
                        </div>
                    </div>

                    {/* Progress Bar */}
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

                    {/* Delivery Partner Info */}
                    <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"
                                    alt="Driver"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60';
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Ramesh Kumar</h3>
                                <p className="text-gray-500 text-sm">Delivery Partner</p>
                                <div className="flex items-center text-yellow-400 text-sm mt-1">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-gray-700 font-bold ml-1">4.8</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                                <Phone size={18} /> Call
                            </Button>
                            <Button className="flex-1 sm:flex-none" to="/">
                                Back to Home
                            </Button>
                        </div>
                    </div>
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
