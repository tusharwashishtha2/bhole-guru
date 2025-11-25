import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import EmptyState from '../components/ui/EmptyState';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-luminous-bg dark:bg-stone-950 transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <EmptyState
                        icon={ShoppingBag}
                        title="Your Cart is Empty"
                        description="Looks like you haven't added any divine artifacts to your cart yet. Explore our collection to find something special."
                        actionLabel="Start Shopping"
                        actionLink="/shop"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-luminous-bg dark:bg-stone-950 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <SectionHeading title="Your Cart" subtitle="Review your selected artifacts" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm flex gap-6 items-center border border-luminous-gold/10">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-stone-800 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-serif font-bold text-lg text-luminous-maroon dark:text-luminous-gold">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.category}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center border border-gray-200 dark:border-stone-700 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50 dark:hover:bg-stone-800 text-gray-600 dark:text-gray-300"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-50 dark:hover:bg-stone-800 text-gray-600 dark:text-gray-300"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span className="font-bold text-lg text-luminous-maroon dark:text-luminous-saffron">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-luminous-gold/20 sticky top-24">
                            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 dark:border-stone-700 my-4"></div>
                                <div className="flex justify-between font-bold text-xl text-luminous-maroon dark:text-luminous-gold">
                                    <span>Total</span>
                                    <span>₹{getCartTotal()}</span>
                                </div>
                            </div>
                            <Button onClick={() => navigate('/checkout')} className="w-full flex items-center justify-center gap-2">
                                Proceed to Checkout <ArrowRight size={18} />
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure Checkout powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
