import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MyOrders = () => {
    const { getUserOrders, setCurrentOrderId } = useOrder();
    const { user } = useAuth();

    const userOrders = getUserOrders(user?.email);

    // Sort orders by date (newest first)
    const sortedOrders = [...userOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order Placed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Packed': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Out for Delivery': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const handleTrackOrder = (orderId) => {
        setCurrentOrderId(orderId);
    };

    return (
        <div className="bg-royal-maroon min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-royal-gold mb-4">My Orders</h1>
                    <p className="text-royal-ivory/70">Track your spiritual journey essentials</p>
                </div>

                <div className="max-w-3xl mx-auto mt-8 space-y-6">
                    {sortedOrders.length === 0 ? (
                        <div className="bg-royal-maroon/50 border border-royal-gold/10 rounded-2xl p-12 text-center backdrop-blur-sm">
                            <div className="w-20 h-20 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package size={40} className="text-royal-gold" />
                            </div>
                            <h3 className="text-xl font-bold text-royal-ivory mb-2">No orders yet</h3>
                            <p className="text-royal-ivory/60 mb-8">Looks like you haven't placed any orders yet.</p>
                            <Button to="/shop">Start Shopping</Button>
                        </div>
                    ) : (
                        sortedOrders.map((order, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={order.id}
                                className="bg-royal-maroon/50 rounded-2xl overflow-hidden border border-royal-gold/10 hover:border-royal-gold/30 transition-all duration-300 shadow-lg"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-royal-gold">Order #{order.id}</h3>
                                                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-royal-ivory/60 flex items-center gap-1">
                                                <Clock size={14} /> Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <Link
                                            to="/order-tracking"
                                            onClick={() => handleTrackOrder(order.id)}
                                            className="flex items-center text-royal-gold font-medium hover:text-white transition-colors text-sm uppercase tracking-wider"
                                        >
                                            Track Order <ChevronRight size={18} />
                                        </Link>
                                    </div>

                                    <div className="border-t border-royal-gold/10 pt-4">
                                        <div className="flex flex-col gap-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-royal-maroon rounded-md overflow-hidden flex-shrink-0 border border-royal-gold/10">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-medium text-royal-ivory line-clamp-1">{item.name}</p>
                                                        <p className="text-xs text-royal-ivory/50">Qty: {item.quantity} • ₹{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-royal-gold/10">
                                            <span className="text-sm text-royal-ivory/60">Total Amount</span>
                                            <span className="font-bold text-royal-gold text-lg">₹{order.total}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Preview */}
                                <div className="bg-royal-maroon/80 px-6 py-3 border-t border-royal-gold/10 flex items-center gap-2 text-xs text-royal-ivory/60">
                                    {order.status === 'Delivered' ? (
                                        <>
                                            <CheckCircle size={14} className="text-green-400" />
                                            <span>Delivered on {new Date(order.timeline[order.timeline.length - 1].time).toLocaleDateString()}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Truck size={14} className="text-royal-gold" />
                                            <span>{order.status === 'Order Placed' ? 'Processing' : 'In Transit'}</span>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
