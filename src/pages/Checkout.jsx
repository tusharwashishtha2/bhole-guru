import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, MapPin, CheckCircle, Smartphone, Lock, Loader, X } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { addOrder } = useOrder();
    const { user } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // UPI State
    const [upiId, setUpiId] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    // Card State
    const [showCardModal, setShowCardModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [processingPayment, setProcessingPayment] = useState(false);

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 49;
    const total = subtotal + shipping;

    const handlePayment = (e) => {
        e.preventDefault();

        if (paymentMethod === 'upi') {
            if (!upiId.includes('@')) {
                alert('Please enter a valid UPI ID (e.g., name@upi)');
                return;
            }
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShowOtpModal(true);
                alert(`OTP sent to your registered mobile number linked to ${upiId}`);
            }, 1500);
        } else if (paymentMethod === 'card') {
            setShowCardModal(true);
        } else {
            processOrder();
        }
    };

    const verifyOtp = () => {
        if (otp === '1234') {
            setShowOtpModal(false);
            processOrder();
        } else {
            setOtpError('Invalid OTP. Please try again (Hint: 1234)');
        }
    };

    const handleCardPayment = (e) => {
        e.preventDefault();
        setProcessingPayment(true);
        // Simulate gateway processing
        setTimeout(() => {
            setProcessingPayment(false);
            setShowCardModal(false);
            processOrder();
        }, 3000);
    };

    const processOrder = () => {
        setLoading(true);
        // Simulate final processing
        setTimeout(() => {
            setLoading(false);

            // Create real order in context
            addOrder({
                items: cart,
                total: total,
                paymentMethod: paymentMethod,
                shippingAddress: "123, Temple Street, Varanasi" // Mock address for now
            }, user?.email); // Pass user email

            clearCart();
            setIsOrderPlaced(true); // Show success popup
        }, 2000);
    };

    if (cart.length === 0 && !isOrderPlaced) {
        // Only redirect if not order placed (to allow popup to show)
        // We use a small timeout to avoid flash if state updates are slow
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
                            <Button onClick={() => navigate('/order-tracking')} className="w-full">
                                Track Order
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-xl font-bold mb-4 text-center">Enter OTP</h3>
                        <p className="text-gray-500 text-center mb-6 text-sm">
                            Please enter the 4-digit OTP sent to your mobile number to verify payment.
                        </p>
                        <div className="flex justify-center mb-6">
                            <input
                                type="text"
                                maxLength="4"
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value); setOtpError(''); }}
                                className="text-center text-3xl tracking-widest w-40 border-b-2 border-luminous-maroon focus:outline-none font-bold"
                                placeholder="••••"
                                autoFocus
                            />
                        </div>
                        {otpError && <p className="text-red-500 text-center text-sm mb-4">{otpError}</p>}
                        <Button onClick={verifyOtp} className="w-full mb-3">Verify & Pay</Button>
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="w-full text-gray-500 text-sm hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Card Payment Modal (Simulated Gateway) */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-md">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative">
                        {/* Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Lock size={16} className="text-green-600" />
                                <span className="font-bold text-gray-700">Secure Payment Gateway</span>
                            </div>
                            <div className="text-sm font-bold text-gray-900">₹{total}</div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {processingPayment ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Loader className="animate-spin text-luminous-maroon mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-gray-800">Processing Payment...</h3>
                                    <p className="text-gray-500 text-sm mt-2">Please do not close this window.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleCardPayment} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                maxLength="19"
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none font-mono"
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            />
                                            <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none font-mono"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                                            <input
                                                required
                                                type="password"
                                                placeholder="123"
                                                maxLength="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none font-mono"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Name on Card"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full py-3 mt-4">
                                        Pay ₹{total}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setShowCardModal(false)}
                                        className="w-full text-center text-gray-500 text-sm mt-3 hover:text-gray-800"
                                    >
                                        Cancel Transaction
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-center gap-4 opacity-50 grayscale">
                            {/* Mock Logos */}
                            <div className="h-6 w-10 bg-blue-600 rounded"></div>
                            <div className="h-6 w-10 bg-red-500 rounded"></div>
                            <div className="h-6 w-10 bg-orange-500 rounded"></div>
                        </div>
                    </div>
                </div>
            )}

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
                                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none" placeholder="Enter your full name" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none" placeholder="House No., Building, Street" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none" placeholder="City" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input required type="text" pattern="[0-9]{6}" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none" placeholder="123456" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input required type="tel" pattern="[0-9]{10}" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none" placeholder="10-digit mobile number" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                                <CreditCard className="text-luminous-maroon" /> Payment Method
                            </h3>
                            <div className="space-y-3">
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

                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-luminous-maroon bg-luminous-bg' : 'border-gray-200 hover:border-luminous-gold/50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-luminous-maroon focus:ring-luminous-maroon"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <span className="block font-bold text-gray-900">UPI (GPay, PhonePe)</span>
                                        <span className="text-sm text-gray-500">Instant payment via UPI ID</span>
                                    </div>
                                    <Smartphone className="text-blue-600" size={24} />
                                </label>
                                {paymentMethod === 'upi' && (
                                    <div className="ml-9 mt-2 p-3 bg-gray-50 rounded-lg animate-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID (e.g. name@upi)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-luminous-maroon"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                )}

                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-luminous-maroon bg-luminous-bg' : 'border-gray-200 hover:border-luminous-gold/50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-luminous-maroon focus:ring-luminous-maroon"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                                        <span className="text-sm text-gray-500">Secure payment via Card</span>
                                    </div>
                                    <CreditCard className="text-purple-600" size={24} />
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
                                {loading ? 'Processing...' : `Pay ₹${total}`}
                            </Button>

                            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                <CheckCircle size={12} /> Secure Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
