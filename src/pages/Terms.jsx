import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-bold text-stone-900 mb-8 text-center"
                >
                    Terms & Conditions
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-sm prose prose-stone max-w-none"
                >
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Agreement to Terms</h3>
                    <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Bhole Guru ("we," "us" or "our"), concerning your access to and use of the Bhole Guru website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>

                    <h3>2. Intellectual Property Rights</h3>
                    <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

                    <h3>3. User Representations</h3>
                    <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.</p>

                    <h3>4. Products</h3>
                    <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.</p>

                    <h3>5. Contact Us</h3>
                    <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: support@bholeguru.com</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
