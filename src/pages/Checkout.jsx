import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, MapPin, CheckCircle, Loader, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { addOrder } = useOrder();
    const { user, updateUserProfile } = useAuth();
    const { addToast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default to Online
    const [loading, setLoading] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Address State
    const [address, setAddress] = useState({
        fullName: user?.name || '',
        addressLine1: '',
        city: '',
        pincode: '',
        phone: user?.phone || '' // Pre-fill phone if available
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 49;
    const total = subtotal + shipping;

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        const shippingAddress = `${address.addressLine1}, ${address.city}, ${address.pincode}`;

        try {
            // 1. Create Order on Backend
            const orderData = {
                orderItems: cart,
                shippingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: shipping,
                totalPrice: total
            };

            const data = await addOrder(orderData);

            if (!data) {
                setLoading(false);
                return;
            }

            if (paymentMethod === 'cod') {
                // COD Flow
                clearCart();
                setIsOrderPlaced(true);
                setLoading(false);
            } else {
                // Razorpay Flow
                const res = await loadRazorpayScript();

                if (!res) {
                    addToast('Razorpay SDK failed to load. Are you online?', 'error');
                    setLoading(false);
                    return;
                }

                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "Bhole Guru",
                    description: "Divine Artifacts Purchase",
                    image: "https://res.cloudinary.com/dnhb4llf9/image/upload/v1732163668/bhole-guru-logo_v2_small.png", // Use your logo URL
                    order_id: data.razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verifyUrl = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com') + '/api/orders/verify';
                            const verifyRes = await fetch(verifyUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('bhole_guru_token')}`
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: data.order._id
                                })
                            });

                            const verifyData = await verifyRes.json();

                            if (verifyRes.ok) {
                                clearCart();
                                setIsOrderPlaced(true);
                            } else {
                                addToast(verifyData.message || 'Payment verification failed', 'error');
                            }
                        } catch (error) {
                            console.error(error);
                            addToast('Payment verification failed', 'error');
                        }
                    },
                    prefill: {
                        name: address.fullName,
                        email: user?.email,
                        contact: address.phone
                    },
                    notes: {
                        address: shippingAddress
                    },
                    theme: {
                        color: "#800000" // Luminous Maroon
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setLoading(false);
            }

            // Auto-save address to profile if empty
            if (user && (!user.address || !user.phone)) {
                updateUserProfile({
                    phone: address.phone,
                    address: address.addressLine1,
                    city: address.city,
                    pincode: address.pincode
                }).catch(err => console.error("Failed to auto-save address", err));
            }

        } catch (error) {
            console.error(error);
            setLoading(false);
            addToast('Something went wrong', 'error');
        }
    };

    if (cart.length === 0 && !isOrderPlaced) {
        setTimeout(() => {
            if (!isOrderPlaced) navigate('/cart');
        }, 100);
        if (!isOrderPlaced) return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-24 relative">
            {/* Order Placed Success Modal */}
            <AnimatePresence>
                {isOrderPlaced && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                            <p className="text-gray-500 mb-6">
                                Your order has been successfully placed. You can track its status in the profile or tracking page.
                            </p>
                            <Button onClick={() => navigate('/track-order')} className="w-full">
                                Track Order
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-gray-600 hover:text-luminous-maroon mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Cart
                </button>

                <SectionHeading title="Checkout" center />

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* Left Column: Address & Payment */}
                    <div className="lg:w-2/3 space-y-6">

                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                                <MapPin className="text-luminous-maroon" /> Delivery Address
                            </h3>
                            <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                        placeholder="Enter your full name"
                                        value={address.fullName}
                                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                        placeholder="House No., Building, Street"
                                        value={address.addressLine1}
                                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                        placeholder="City"
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        required
                                        type="text"
                                        pattern="[0-9]{6}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                        placeholder="123456"
                                        value={address.pincode}
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                        placeholder="10-digit mobile number"
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                                <CreditCard className="text-luminous-maroon" /> Payment Method
                            </h3>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-luminous-maroon bg-luminous-bg' : 'border-gray-200 hover:border-luminous-gold/50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-luminous-maroon focus:ring-luminous-maroon"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <span className="block font-bold text-gray-900">Online Payment</span>
                                        <span className="text-sm text-gray-500">Credit/Debit Card, UPI, Netbanking (Razorpay)</span>
                                    </div>
                                    <ShieldCheck className="text-blue-600" size={24} />
                                </label>

                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-luminous-maroon bg-luminous-bg' : 'border-gray-200 hover:border-luminous-gold/50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-luminous-maroon focus:ring-luminous-maroon"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <span className="block font-bold text-gray-900">Cash on Delivery</span>
                                        <span className="text-sm text-gray-500">Pay nicely when you receive the order</span>
                                    </div>
                                    <Banknote className="text-green-600" size={24} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-xl font-bold font-serif mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=500&auto=format&fit=crop';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span className="text-luminous-maroon">₹{total}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full py-4 text-lg mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader className="animate-spin" size={20} /> Processing...
                                    </div>
                                ) : (
                                    `Pay ₹${total}`
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                <ShieldCheck size={12} /> Secure Payment by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
