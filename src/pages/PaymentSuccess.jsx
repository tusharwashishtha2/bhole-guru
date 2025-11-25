import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-lg text-center max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle size={48} className="text-green-600" />
                </motion.div>

                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Order Placed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your spiritual essentials will be delivered soon.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-mono font-bold text-gray-900">#BG-{Math.floor(Math.random() * 100000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Estimated Delivery</span>
                        <span className="font-bold text-gray-900">3-5 Days</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button to="/shop" className="w-full justify-center">
                        <ShoppingBag size={20} className="mr-2" /> Continue Shopping
                    </Button>
                    <Link to="/" className="block w-full py-3 text-gray-600 font-medium hover:text-saffron-600 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
