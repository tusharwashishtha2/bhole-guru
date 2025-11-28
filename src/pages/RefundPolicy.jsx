import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-bold text-stone-900 mb-8 text-center"
                >
                    Refund & Cancellation Policy
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-sm prose prose-stone max-w-none"
                >
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Cancellation Policy</h3>
                    <p>You can cancel your order at any time before it has been shipped. Once the order status changes to "Shipped", it cannot be cancelled. To cancel an order, please visit the "Order Tracking" page and click on the "Cancel Order" button.</p>

                    <h3>2. Refund Policy</h3>
                    <p>If you cancel your order before it has been shipped, we will refund the entire amount to your original payment method within 5-7 business days.</p>
                    <p>For Cash on Delivery (COD) orders, there is no refund required as no payment was made.</p>

                    <h3>3. Returns</h3>
                    <p>We accept returns only if the product received is damaged or defective. You must report the issue within 24 hours of delivery with photographic evidence. Please contact our support team to initiate a return.</p>
                    <p>Due to the spiritual nature of our products (Rudraksha, Malas, etc.), we do not accept returns for "change of mind" once the product has been used or worn.</p>

                    <h3>4. Contact Us</h3>
                    <p>If you have any questions about our Returns and Refunds Policy, please contact us at: support@bholeguru.com</p>
                </motion.div>
            </div>
        </div>
    );
};

export default RefundPolicy;
