import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { useToast } from '../context/ToastContext';
import { Package, Truck, CheckCircle, Clock, Trash2, ShoppingBag, Plus, Edit2, X, Save, Image as ImageIcon, MapPin, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
            >
                <h2 className="text-2xl font-bold text-gray-800 font-serif">{title}</h2>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {isOpen && (
                <div className="p-6 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
};

const Admin = () => {
    const { orders, updateOrderStatus, deleteOrder, fetchAllOrders } = useOrder();
    const { products, addProduct, updateProduct, deleteProduct } = useProduct();
    const { user, logout } = useAuth();
    const { addToast } = useToast();

    const {
        sacredOfferings,
        updateSacredOffering,
        heroSection,
        updateHeroSection,
        divineFavorites,
        updateDivineFavorites,
        divineEssentials,
        updateDivineEssential,
        updateDivineEssentialsSection,
        categories,
        addCategory,
        removeCategory,
        shubhAarambh,
        updateShubhAarambh,
        aromaticBliss,
        updateAromaticBliss,
        templeCorridor,
        updateTempleCorridor,
        royalTreasury,
        updateRoyalTreasury
    } = useContent();

    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'content', 'categories', 'users'
    const [newCategory, setNewCategory] = useState('');
    const [usersList, setUsersList] = useState([]);

    // Product Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Reset Password Modal State
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Puja Thali',
        image: '',
        description: '',
        features: ''
    });

    const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/users';

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) return;
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setUsersList(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const updateUser = async (id, data) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                if (data.password) {
                    addToast('Password updated successfully', 'success');
                } else {
                    addToast('User updated successfully', 'success');
                }
                fetchAllUsers();
            } else {
                addToast('Failed to update user', 'error');
            }
        } catch (error) {
            addToast('Error updating user', 'error');
        }
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                addToast('User deleted successfully', 'success');
                setUsersList(prev => prev.filter(u => u._id !== id));
            } else {
                addToast('Failed to delete user', 'error');
            }
        } catch (error) {
            addToast('Error deleting user', 'error');
        }
    };

    React.useEffect(() => {
        if (activeTab === 'users') {
            fetchAllUsers();
        } else if (activeTab === 'orders') {
            fetchAllOrders();
        }
    }, [activeTab]);

    const handleUpdateUser = (id, data) => {
        updateUser(id, data);
    };

    const handleDeleteUser = (id) => {
        deleteUser(id);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            category: categories[0] || 'Puja Thali',
            image: '',
            description: '',
            features: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await addProduct({
                ...formData,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                features: formData.features.split(',').map(f => f.trim()),
                images: [formData.image]
            });
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(editingId, {
                ...formData,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                features: formData.features.split(',').map(f => f.trim()),
                images: [formData.image]
            });
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const startEditing = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            image: product.images?.[0] || product.image,
            description: product.description,
            features: product.features ? product.features.join(', ') : ''
        });
        setEditingId(product.id || product._id);
        setIsEditing(true);
        setShowAddForm(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order Placed': return 'text-blue-600 bg-blue-100 border-blue-200';
                const getStatusColor = (status) => {
                    switch (status) {
                        case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
                        case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-200';
                        case 'Packed': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
                        case 'Shipped': return 'text-purple-600 bg-purple-100 border-purple-200';
                        case 'Out for Delivery': return 'text-orange-600 bg-orange-100 border-orange-200';
                        case 'Delivered': return 'text-green-600 bg-green-100 border-green-200';
                        case 'Cancelled': return 'text-red-600 bg-red-100 border-red-200';
                        default: return 'text-gray-600 bg-gray-100 border-gray-200';
                    }
                };

                return (
                    <div className="bg-gray-50 min-h-screen pb-20 pt-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                                <p className="text-gray-500">Manage orders, inventory, and site content</p>
                            </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                                        <h3 className="text-2xl font-bold text-gray-900">₹{orders.reduce((acc, order) => acc + order.total, 0).toLocaleString()}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Products</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex justify-start md:justify-center mb-8 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex gap-8 px-4 min-w-max">
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'orders' ? 'text-luminous-maroon' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Orders
                                        {activeTab === 'orders' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-luminous-maroon rounded-t-full" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'products' ? 'text-luminous-maroon' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Products
                                        {activeTab === 'products' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-luminous-maroon rounded-t-full" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'content' ? 'text-luminous-maroon' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Site Content
                                        {activeTab === 'content' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-luminous-maroon rounded-t-full" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('categories')}
                                        className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'categories' ? 'text-luminous-maroon' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Categories
                                        {activeTab === 'categories' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-luminous-maroon rounded-t-full" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'users' ? 'text-luminous-maroon' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Users
                                        {activeTab === 'users' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-luminous-maroon rounded-t-full" />}
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="max-w-6xl mx-auto">
                                {activeTab === 'categories' ? (
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Manage Categories</h2>

                                        <div className="flex gap-4 mb-8">
                                            <input
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="New Category Name"
                                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                            />
                                            <Button onClick={() => {
                                                if (newCategory.trim()) {
                                                    addCategory(newCategory.trim());
                                                    setNewCategory('');
                                                }
                                            }}>
                                                <Plus size={20} className="mr-2" /> Add
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {categories.map((cat, index) => (
                                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                    <span className="font-medium text-gray-800">{cat}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Delete category "${cat}"?`)) removeCategory(cat);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : activeTab === 'orders' ? (
                                    <div className="space-y-6">
                                        {orders.length === 0 ? (
                                            <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-200">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                    <Package size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                                                <p className="text-gray-500">Orders placed by customers will appear here.</p>
                                            </div>
                                        ) : (
                                            orders.map((order, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    key={order._id || order.id}
                                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 font-serif">Order #{order._id || order.id}</h3>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <Clock size={14} /> {new Date(order.createdAt || order.date).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-1 rounded-full text-sm font-bold mt-2 md:mt-0 border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        <p className="font-bold text-gray-700 mb-2">Items:</p>
                                                        <ul className="space-y-2 text-gray-600 text-sm mb-3">
                                                            {(order.orderItems || order.items || []).map((item, idx) => (
                                                                <li key={idx} className="flex items-center gap-3">
                                                                    <span className="w-2 h-2 bg-luminous-maroon rounded-full"></span>
                                                                    <span className="font-medium">{item.name}</span>
                                                                    <span className="text-gray-400">x{item.quantity || item.qty}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                                            <span className="text-gray-500 font-medium">Total Amount</span>
                                                            <span className="font-bold text-luminous-maroon text-lg">₹{order.totalPrice || order.total}</span>
                                                        </div>
                                                    </div>

                                                    {/* Payment Details Section */}
                                                    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                        <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                                                            <ShoppingBag size={16} /> Payment Details
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-500 text-xs uppercase font-bold">Method</p>
                                                                <p className="font-medium text-gray-900">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                                                            </div>
                                                            {order.paymentMethod !== 'cod' && order.paymentResult && order.paymentResult.id && (
                                                                <div>
                                                                    <p className="text-gray-500 text-xs uppercase font-bold">Transaction ID / UTR</p>
                                                                    <p className="font-mono font-bold text-luminous-maroon bg-white px-2 py-1 rounded border border-blue-200 inline-block mt-1">
                                                                        {order.paymentResult.id}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Shipping Address Section */}
                                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="text-gray-400 mt-1" size={18} />
                                                            <div>
                                                                <h4 className="font-bold text-gray-700 text-sm">Shipping Address</h4>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {order.shippingAddress?.address}<br />
                                                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                                                    {order.shippingAddress?.country}
                                                                </p>
                                                                {order.shippingAddress && (
                                                                    <a
                                                                        href={order.shippingAddress.location?.lat
                                                                            ? `https://www.google.com/maps/dir/?api=1&destination=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`
                                                                            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)}`
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                                                    >
                                                                        <MapPin size={14} /> Get Directions
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3">
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id || order.id, 'Packed')}
                                                            disabled={!['Order Placed', 'Processing', 'Pending', 'Paid'].includes(order.status?.trim())}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${['Order Placed', 'Processing', 'Pending', 'Paid'].includes(order.status?.trim())
                                                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                                                                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <Package size={18} /> Mark Packed
                                                        </button>

                                                        <button
                                                            onClick={() => updateOrderStatus(order._id || order.id, 'Shipped')}
                                                            disabled={order.status !== 'Packed'}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Packed'
                                                                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                                                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <Truck size={18} /> Mark Shipped
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                const driverName = prompt("Enter Driver Name:");
                                                                if (driverName) {
                                                                    const driverPhone = prompt("Enter Driver Phone Number:");
                                                                    if (driverPhone) {
                                                                        updateOrderStatus(order._id || order.id, 'Out for Delivery', {
                                                                            driverDetails: { name: driverName, phone: driverPhone }
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                            disabled={order.status !== 'Shipped'}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Shipped'
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                                                                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <Truck size={18} /> Assign Driver
                                                        </button>

                                                        <button
                                                            onClick={() => updateOrderStatus(order._id || order.id, 'Delivered')}
                                                            disabled={order.status !== 'Out for Delivery'}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Out for Delivery'
                                                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <CheckCircle size={18} /> Mark Delivered
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this order?')) {
                                                                    deleteOrder(order._id || order.id);
                                                                }
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-white text-red-500 border border-red-200 hover:bg-red-50 ml-auto shadow-sm"
                                                        >
                                                            <Trash2 size={18} /> Delete
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                ) : activeTab === 'products' ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800 font-serif">Product Inventory</h2>
                                            <Button onClick={() => {
                                                resetForm();
                                                setShowAddForm(true);
                                            }}>
                                                <Plus size={20} className="mr-2" /> Add New Product
                                            </Button>
                                        </div>

                                        <AnimatePresence>
                                            {showAddForm && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-white p-6 rounded-xl shadow-lg border border-luminous-gold/30 mb-8 overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-xl font-bold text-luminous-maroon">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                                                        <button onClick={() => { setShowAddForm(false); resetForm(); }}><X size={20} /></button>
                                                    </div>
                                                    <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                                                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none" placeholder="e.g. Brass Diya" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                                                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none" placeholder="499" />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Original Price (₹)</label>
                                                                    <input required type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none" placeholder="999" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none">
                                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                                                                <div className="space-y-3">
                                                                    {/* File Upload */}
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-luminous-gold transition-colors cursor-pointer relative">
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={handleImageUpload}
                                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        />
                                                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                                                            <ImageIcon size={24} />
                                                                            <span className="text-sm font-medium">Click to upload image</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* URL Fallback */}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-400">OR</span>
                                                                        <input
                                                                            name="image"
                                                                            value={formData.image}
                                                                            onChange={handleInputChange}
                                                                            className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-luminous-gold outline-none"
                                                                            placeholder="Paste image URL"
                                                                        />
                                                                    </div>

                                                                    {/* Preview */}
                                                                    {formData.image && (
                                                                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                                            >
                                                                                <X size={12} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                                                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none h-24" placeholder="Product details..." />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-1">Features (comma separated)</label>
                                                                <input name="features" value={formData.features} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none" placeholder="Handmade, Pure Brass, Washable" />
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                                            <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>Cancel</Button>
                                                            <Button type="submit" className="flex items-center gap-2">
                                                                <Save size={18} /> {isEditing ? 'Update Product' : 'Save Product'}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {products.map(product => (
                                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                                        <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800">
                                                            {product.category}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex-grow">
                                                        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <span className="text-luminous-maroon font-bold">₹{product.price}</span>
                                                            <span className="text-gray-400 text-sm line-through">₹{product.originalPrice}</span>
                                                        </div>
                                                        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                                                    </div>
                                                    <div className="p-4 border-t border-gray-100 flex gap-2 bg-gray-50">
                                                        <button
                                                            onClick={() => startEditing(product)}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
                                                        >
                                                            <Edit2 size={16} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm(`Delete "${product.name}"?`)) deleteProduct(product.id);
                                                            }}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors"
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : activeTab === 'users' ? (
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Manage Users</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase">
                                                        <th className="pb-3 font-bold">Name</th>
                                                        <th className="pb-3 font-bold">Email</th>
                                                        <th className="pb-3 font-bold">Role</th>
                                                        <th className="pb-3 font-bold text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {usersList.map((u) => (
                                                        <tr key={u._id} className="group hover:bg-gray-50 transition-colors">
                                                            <td className="py-4 font-medium text-gray-900">{u.name}</td>
                                                            <td className="py-4 text-gray-600">{u.email}</td>
                                                            <td className="py-4">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {u.role}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-right flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedUserForReset(u);
                                                                        setNewPassword('');
                                                                        setShowResetPasswordModal(true);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-bold px-3 py-1 rounded hover:bg-blue-50"
                                                                >
                                                                    Reset Password
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm(`Delete user ${u.name}?`)) handleDeleteUser(u._id);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <AnimatePresence>
                                            {showResetPasswordModal && (
                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                                                    <motion.div
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.9, opacity: 0 }}
                                                        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
                                                    >
                                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Password</h3>
                                                        <p className="text-gray-500 mb-4">Enter new password for <strong>{selectedUserForReset?.name}</strong></p>
                                                        <input
                                                            type="text"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-luminous-gold outline-none"
                                                            placeholder="New Password"
                                                            autoFocus
                                                        />
                                                        <div className="flex justify-end gap-3">
                                                            <Button variant="outline" onClick={() => setShowResetPasswordModal(false)}>Cancel</Button>
                                                            <Button onClick={() => {
                                                                if (newPassword) {
                                                                    handleUpdateUser(selectedUserForReset._id, { password: newPassword });
                                                                    setShowResetPasswordModal(false);
                                                                }
                                                            }}>Save Password</Button>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {/* Hero Section */}
                                        <CollapsibleSection title="Hero Section" id="hero">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                                                        <input
                                                            value={heroSection.title}
                                                            onChange={(e) => updateHeroSection({ title: e.target.value })}
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                                        <textarea
                                                            value={heroSection.subtitle}
                                                            onChange={(e) => updateHeroSection({ subtitle: e.target.value })}
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none h-24"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
                                                        <input
                                                            value={heroSection.ctaText}
                                                            onChange={(e) => updateHeroSection({ ctaText: e.target.value })}
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image</label>
                                                    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden group">
                                                        <img src={heroSection.bgImage} alt="Hero" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-full font-bold hover:bg-gray-100">
                                                                Change Image
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onloadend = () => updateHeroSection({ bgImage: reader.result });
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <input
                                                        value={heroSection.bgImage}
                                                        onChange={(e) => updateHeroSection({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="Or paste image URL"
                                                    />
                                                </div>
                                            </div>
                                        </CollapsibleSection>

                                        {/* Divine Favorites */}
                                        <CollapsibleSection title="Divine Favorites Section" id="divineFavorites">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        value={divineFavorites.title}
                                                        onChange={(e) => updateDivineFavorites({ title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
                                                    <input
                                                        value={divineFavorites.subtitle}
                                                        onChange={(e) => updateDivineFavorites({ subtitle: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image URL</label>
                                                    <input
                                                        value={divineFavorites.bgImage || ''}
                                                        onChange={(e) => updateDivineFavorites({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Color Class</label>
                                                    <input
                                                        value={divineFavorites.bgColor || ''}
                                                        onChange={(e) => updateDivineFavorites({ bgColor: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="e.g. bg-stone-900"
                                                    />
                                                </div>
                                            </div>
                                        </CollapsibleSection>

                                        {/* Divine Essentials */}
                                        <CollapsibleSection title="Divine Essentials" id="divineEssentials">
                                            {/* Section Settings */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        value={divineEssentials.title || ''}
                                                        onChange={(e) => updateDivineEssentialsSection({ title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
                                                    <input
                                                        value={divineEssentials.subtitle || ''}
                                                        onChange={(e) => updateDivineEssentialsSection({ subtitle: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image URL</label>
                                                    <input
                                                        value={divineEssentials.bgImage || ''}
                                                        onChange={(e) => updateDivineEssentialsSection({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Color Class</label>
                                                    <input
                                                        value={divineEssentials.bgColor || ''}
                                                        onChange={(e) => updateDivineEssentialsSection({ bgColor: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="e.g. bg-stone-900"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {divineEssentials.items && divineEssentials.items.map((item) => (
                                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden group">
                                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => updateDivineEssential(item.id, { img: reader.result });
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => updateDivineEssential(item.id, { title: e.target.value })}
                                                            className="w-full p-1 border rounded text-sm font-bold"
                                                            placeholder="Title"
                                                        />
                                                        <input
                                                            value={item.desc}
                                                            onChange={(e) => updateDivineEssential(item.id, { desc: e.target.value })}
                                                            className="w-full p-1 border rounded text-sm text-gray-500"
                                                            placeholder="Description"
                                                        />
                                                        <input
                                                            value={item.link}
                                                            onChange={(e) => updateDivineEssential(item.id, { link: e.target.value })}
                                                            className="w-full p-1 border rounded text-xs text-blue-500"
                                                            placeholder="Link"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>

                                        {/* Sacred Offerings */}
                                        {/* Sacred Offerings */}
                                        <CollapsibleSection title="Sacred Offerings (Carousel)" id="sacredOfferings">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {sacredOfferings.map((item) => (
                                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden group">
                                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => updateSacredOffering(item.id, { img: reader.result });
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => updateSacredOffering(item.id, { title: e.target.value })}
                                                            className="w-full p-1 border rounded text-sm font-bold"
                                                            placeholder="Title"
                                                        />
                                                        <select
                                                            value={item.category}
                                                            onChange={(e) => updateSacredOffering(item.id, { category: e.target.value })}
                                                            className="w-full p-1 border rounded text-xs"
                                                        >
                                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>

                                        {/* Shubh Aarambh Section */}
                                        <CollapsibleSection title="Shubh Aarambh (New Beginnings)" id="shubhAarambh">
                                            <div className="flex justify-between items-center mb-6 border-b pb-2">
                                                <h3 className="text-lg font-bold text-gray-700">Items</h3>
                                                <Button onClick={() => {
                                                    const newItem = { title: 'New Item', img: '', link: '' };
                                                    updateShubhAarambh([...(shubhAarambh || []), newItem]);
                                                }}>
                                                    <Plus size={16} className="mr-2" /> Add Item
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {shubhAarambh && shubhAarambh.map((item, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative group">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Delete this item?')) {
                                                                    const newList = shubhAarambh.filter((_, i) => i !== index);
                                                                    updateShubhAarambh(newList);
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden group/img">
                                                            <img src={item.img || "https://via.placeholder.com/150?text=No+Image"} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => {
                                                                                    const newList = [...shubhAarambh];
                                                                                    newList[index] = { ...item, img: reader.result };
                                                                                    updateShubhAarambh(newList);
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newList = [...shubhAarambh];
                                                                newList[index] = { ...item, title: e.target.value };
                                                                updateShubhAarambh(newList);
                                                            }}
                                                            className="w-full p-2 border rounded text-sm font-bold focus:ring-2 focus:ring-luminous-gold outline-none"
                                                            placeholder="Title"
                                                        />
                                                        <input
                                                            value={item.link}
                                                            onChange={(e) => {
                                                                const newList = [...shubhAarambh];
                                                                newList[index] = { ...item, link: e.target.value };
                                                                updateShubhAarambh(newList);
                                                            }}
                                                            className="w-full p-2 border rounded text-xs text-blue-500 focus:ring-2 focus:ring-luminous-gold outline-none"
                                                            placeholder="Link (e.g. /shop)"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>

                                        {/* Aromatic Bliss Section */}
                                        <CollapsibleSection title="Aromatic Bliss (Incense)" id="aromaticBliss">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        value={aromaticBliss?.title || ''}
                                                        onChange={(e) => updateAromaticBliss({ title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
                                                    <input
                                                        value={aromaticBliss?.subtitle || ''}
                                                        onChange={(e) => updateAromaticBliss({ subtitle: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image URL</label>
                                                    <input
                                                        value={aromaticBliss?.bgImage || ''}
                                                        onChange={(e) => updateAromaticBliss({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-gray-700">Items</h3>
                                                <Button onClick={() => {
                                                    const newItem = { title: 'New Scent', img: '', link: '' };
                                                    updateAromaticBliss({ items: [...(aromaticBliss?.items || []), newItem] });
                                                }} size="sm">
                                                    <Plus size={16} className="mr-2" /> Add Scent
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {aromaticBliss?.items && aromaticBliss.items.map((item, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2 relative group">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Delete this item?')) {
                                                                    const newItems = aromaticBliss.items.filter((_, i) => i !== index);
                                                                    updateAromaticBliss({ items: newItems });
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>

                                                        {/* Image Upload for Aromatic Bliss */}
                                                        <div className="relative h-24 bg-gray-100 rounded-md overflow-hidden group/img">
                                                            <img src={item.img || "https://via.placeholder.com/150?text=No+Image"} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => {
                                                                                    const newItems = [...aromaticBliss.items];
                                                                                    newItems[index] = { ...item, img: reader.result };
                                                                                    updateAromaticBliss({ items: newItems });
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newItems = [...aromaticBliss.items];
                                                                newItems[index] = { ...item, title: e.target.value };
                                                                updateAromaticBliss({ items: newItems });
                                                            }}
                                                            className="w-full p-1 border rounded text-sm font-bold"
                                                            placeholder="Scent Name"
                                                        />
                                                        <input
                                                            value={item.link || ''}
                                                            onChange={(e) => {
                                                                const newItems = [...aromaticBliss.items];
                                                                newItems[index] = { ...item, link: e.target.value };
                                                                updateAromaticBliss({ items: newItems });
                                                            }}
                                                            className="w-full p-1 border rounded text-xs text-blue-500"
                                                            placeholder="Link (e.g. /shop)"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>

                                        {/* Temple Corridor Section */}
                                        <CollapsibleSection title="The Temple Corridor (Dhoop)" id="templeCorridor">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        value={templeCorridor?.title || ''}
                                                        onChange={(e) => updateTempleCorridor({ title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
                                                    <input
                                                        value={templeCorridor?.subtitle || ''}
                                                        onChange={(e) => updateTempleCorridor({ subtitle: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image URL</label>
                                                    <input
                                                        value={templeCorridor?.bgImage || ''}
                                                        onChange={(e) => updateTempleCorridor({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-gray-700">Items</h3>
                                                <Button onClick={() => {
                                                    const newItem = { title: 'New Dhoop', img: '', link: '' };
                                                    updateTempleCorridor({ items: [...(templeCorridor?.items || []), newItem] });
                                                }} size="sm">
                                                    <Plus size={16} className="mr-2" /> Add Dhoop
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {templeCorridor?.items && templeCorridor.items.map((item, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2 relative group">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Delete this item?')) {
                                                                    const newItems = templeCorridor.items.filter((_, i) => i !== index);
                                                                    updateTempleCorridor({ items: newItems });
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div className="relative h-24 bg-gray-100 rounded-md overflow-hidden group/img">
                                                            <img src={item.img || "https://via.placeholder.com/150?text=No+Image"} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => {
                                                                                    const newItems = [...templeCorridor.items];
                                                                                    newItems[index] = { ...item, img: reader.result };
                                                                                    updateTempleCorridor({ items: newItems });
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newItems = [...templeCorridor.items];
                                                                newItems[index] = { ...item, title: e.target.value };
                                                                updateTempleCorridor({ items: newItems });
                                                            }}
                                                            className="w-full p-1 border rounded text-sm font-bold"
                                                            placeholder="Title"
                                                        />
                                                        <input
                                                            value={item.link || ''}
                                                            onChange={(e) => {
                                                                const newItems = [...templeCorridor.items];
                                                                newItems[index] = { ...item, link: e.target.value };
                                                                updateTempleCorridor({ items: newItems });
                                                            }}
                                                            className="w-full p-1 border rounded text-xs text-blue-500"
                                                            placeholder="Link (e.g. /shop)"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>

                                        {/* Royal Treasury Section */}
                                        <CollapsibleSection title="Royal Treasury (Lamps)" id="royalTreasury">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        value={royalTreasury?.title || ''}
                                                        onChange={(e) => updateRoyalTreasury({ title: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
                                                    <input
                                                        value={royalTreasury?.subtitle || ''}
                                                        onChange={(e) => updateRoyalTreasury({ subtitle: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Image URL</label>
                                                    <input
                                                        value={royalTreasury?.bgImage || ''}
                                                        onChange={(e) => updateRoyalTreasury({ bgImage: e.target.value })}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-gray-700">Items</h3>
                                                <Button onClick={() => {
                                                    const newItem = { title: 'New Lamp', img: '', link: '' };
                                                    updateRoyalTreasury({ items: [...(royalTreasury?.items || []), newItem] });
                                                }} size="sm">
                                                    <Plus size={16} className="mr-2" /> Add Lamp
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {royalTreasury?.items && royalTreasury.items.map((item, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2 relative group">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Delete this item?')) {
                                                                    const newItems = royalTreasury.items.filter((_, i) => i !== index);
                                                                    updateRoyalTreasury({ items: newItems });
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div className="relative h-24 bg-gray-100 rounded-md overflow-hidden group/img">
                                                            <img src={item.img || "https://via.placeholder.com/150?text=No+Image"} alt={item.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                <label className="cursor-pointer bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold hover:bg-gray-100">
                                                                    Change
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => {
                                                                                    const newItems = [...royalTreasury.items];
                                                                                    newItems[index] = { ...item, img: reader.result };
                                                                                    updateRoyalTreasury({ items: newItems });
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newItems = [...royalTreasury.items];
                                                                newItems[index] = { ...item, title: e.target.value };
                                                                updateRoyalTreasury({ items: newItems });
                                                            }}
                                                            className="w-full p-1 border rounded text-sm font-bold"
                                                            placeholder="Title"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        };

        export default Admin;
