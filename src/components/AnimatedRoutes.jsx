import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderTracking from '../pages/OrderTracking';
import PaymentSuccess from '../pages/PaymentSuccess';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Wishlist from '../pages/Wishlist';
import About from '../pages/About';
import Contact from '../pages/Contact';

import PrivacyPolicy from '../pages/PrivacyPolicy';
import Terms from '../pages/Terms';
import RefundPolicy from '../pages/RefundPolicy';
import NotFound from '../pages/NotFound';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
                <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                <Route path="/track-order" element={<PageTransition><OrderTracking /></PageTransition>} />
                <Route path="/payment-success" element={<PageTransition><PaymentSuccess /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
                <Route path="/refund-policy" element={<PageTransition><RefundPolicy /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
