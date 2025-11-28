import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-bold text-stone-900 mb-8 text-center"
                >
                    Privacy Policy
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-sm prose prose-stone max-w-none"
                >
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>Welcome to Bhole Guru. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

                    <h3>2. Data We Collect</h3>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                    </ul>

                    <h3>3. How We Use Your Data</h3>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>

                    <h3>4. Data Security</h3>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

                    <h3>5. Contact Us</h3>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: support@bholeguru.com</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
