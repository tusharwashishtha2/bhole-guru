import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { Package, Truck, CheckCircle, Clock, Trash2, ShoppingBag, Plus, Edit2, X, Save, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
const Admin = () => {
    const { orders, updateOrderStatus, deleteOrder } = useOrder();
    const { products, addProduct, updateProduct, deleteProduct } = useProduct();
    const { user, logout, getAllUsers, updateUser, deleteUser } = useAuth();
    const { addToast } = useToast(); // Assuming useToast is available or imported

    const [usersList, setUsersList] = useState([]);

    React.useEffect(() => {
        if (activeTab === 'users') {
            getAllUsers().then(setUsersList).catch(console.error);
        }
    }, [activeTab]);

    const handleUpdateUser = async (id, data) => {
        try {
            await updateUser(id, data);
            alert('User updated successfully');
            getAllUsers().then(setUsersList);
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsersList(prev => prev.filter(u => u._id !== id));
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const {
        sacredOfferings,
        updateSacredOffering,
        heroSection,
        updateHeroSection,
        divineFavorites,
        updateDivineFavorites,
        divineEssentials,
        updateDivineEssential,
        categories,
        addCategory,
        removeCategory
    } = useContent();

    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'content', 'categories'
    const [newCategory, setNewCategory] = useState('');

    // Product Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Puja Thali',
        image: '',
        description: '',
        features: ''
    });

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
                <div className="flex justify-center mb-8 border-b border-gray-200">
                    <div className="flex gap-8">
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
                                        key={order.id}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 font-serif">Order #{order.id}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <Clock size={14} /> {new Date(order.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-4 py-1 rounded-full text-sm font-bold mt-2 md:mt-0 border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p className="font-bold text-gray-700 mb-2">Items:</p>
                                            <ul className="space-y-2 text-gray-600 text-sm mb-3">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-3">
                                                        <span className="w-2 h-2 bg-luminous-maroon rounded-full"></span>
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="text-gray-400">x{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                                <span className="text-gray-500 font-medium">Total Amount</span>
                                                <span className="font-bold text-luminous-maroon text-lg">₹{order.total}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'Packed')}
                                                disabled={order.status !== 'Order Placed'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Order Placed'
                                                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                                                    : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Package size={18} /> Mark Packed
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const tracking = prompt('Enter Tracking Number:');
                                                    if (tracking) {
                                                        const courier = prompt('Enter Courier Name (e.g., DTDC, BlueDart):');
                                                        updateOrderStatus(order.id, 'Shipped', { trackingNumber: tracking, courierName: courier });
                                                    }
                                                }}
                                                disabled={order.status !== 'Packed'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Packed'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                                    : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Truck size={18} /> Mark Shipped
                                            </button>

                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                                disabled={order.status !== 'Shipped'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${order.status === 'Shipped'
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                                                    : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Truck size={18} /> Out for Delivery
                                            </button>

                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
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
                                                        deleteOrder(order.id);
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
                                                            const newPass = prompt(`Enter new password for ${u.name}:`);
                                                            if (newPass) handleUpdateUser(u._id, { password: newPass });
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
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Hero Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Hero Section</h2>
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
                            </div>

                            {/* Divine Favorites */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Divine Favorites Section</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>

                            {/* Divine Essentials */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Divine Essentials</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {divineEssentials.map((item) => (
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
                            </div>

                            {/* Sacred Offerings */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6 border-b pb-2">Sacred Offerings (Carousel)</h2>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
