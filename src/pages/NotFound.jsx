import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-9xl font-display font-bold text-luminous-maroon opacity-20">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 -mt-12 mb-4 relative z-10">Page Not Found</h2>
                <p className="text-stone-600 mb-8 max-w-md mx-auto">
                    The path you are looking for seems to be lost in the cosmos. Let's guide you back to the sanctuary.
                </p>
                <Button to="/">Return Home</Button>
            </motion.div>
        </div>
    );
};

export default NotFound;
