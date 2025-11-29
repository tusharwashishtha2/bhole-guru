import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from './Button';
import { Link } from 'react-router-dom';

const QuickViewModal = () => {
    const { isOpen, selectedProduct, closeQuickView } = useQuickView();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);

    if (!selectedProduct) return null;

    const isWishlisted = isInWishlist(selectedProduct.id);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeQuickView}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white dark:bg-stone-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={closeQuickView}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 rounded-full hover:bg-gray-100 dark:hover:bg-black/80 transition-colors"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Image Section */}
                        <div className="relative h-64 md:h-full bg-gray-100 dark:bg-stone-800">
                            <img
                                src={selectedProduct.images?.[0] || selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            {selectedProduct.originalPrice && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 flex flex-col h-full">
                            <div className="mb-auto">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-luminous-gold uppercase tracking-wider">
                                        {selectedProduct.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                        <Star size={14} fill="currentColor" /> {selectedProduct.rating}
                                    </div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-luminous-gold mb-4">
                                    {selectedProduct.name}
                                </h2>

                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-3xl font-bold text-luminous-maroon dark:text-luminous-saffron">₹{selectedProduct.price}</span>
                                    {selectedProduct.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through mb-1">₹{selectedProduct.originalPrice}</span>
                                    )}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                                    {selectedProduct.description}
                                </p>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-stone-800 text-gray-600 dark:text-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-stone-800 text-gray-600 dark:text-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => toggleWishlist(selectedProduct)}
                                        className={`p-3 rounded-lg border transition-colors ${isWishlisted
                                            ? 'border-luminous-maroon bg-luminous-maroon text-white'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-luminous-maroon hover:text-luminous-maroon'
                                            }`}
                                    >
                                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => {
                                            addToCart(selectedProduct, quantity);
                                            closeQuickView();
                                        }}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </Button>
                                    <Link to={`/product/${selectedProduct.id}`} onClick={closeQuickView}>
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                            View Details <ArrowRight size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
