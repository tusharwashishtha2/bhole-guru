import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { User, Package, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight, ShoppingBag, Plus, Edit2, Trash2, Save, X, Phone, Mail, KeyRound, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, logout, updateUserProfile, sendOtp, verifyOtp } = useAuth();
    const { orders, fetchMyOrders } = useOrder();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('orders');

    // Address State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: ''
    });

    // Account Settings State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpTarget, setOtpTarget] = useState(''); // 'email' or 'phone'
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const API_URL = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com');
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Image upload failed');

            const data = await uploadRes.json();
            await updateUserProfile({ image: data.imageUrl });
            addToast('Profile picture updated', 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    const userOrders = orders;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
                    <p className="text-gray-500 mb-6">You need to be logged in to view your profile.</p>
                    <Link to="/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // --- Address Handlers ---
    const handleAddAddress = () => {
        setEditingAddressId(null);
        setAddressForm({ type: 'Home', street: '', city: '', state: '', zip: '' });
        setShowAddressForm(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setAddressForm(address);
        setShowAddressForm(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const newAddress = { ...addressForm, id: editingAddressId || Date.now() };

        let updatedAddresses;
        if (editingAddressId) {
            updatedAddresses = (user.addresses || []).map(addr => addr.id === editingAddressId ? newAddress : addr);
        } else {
            updatedAddresses = [...(user.addresses || []), newAddress];
        }

        try {
            await updateUserProfile({ addresses: updatedAddresses });
            setShowAddressForm(false);
            addToast('Address saved successfully', 'success');
        } catch (error) {
            addToast(error, 'error');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        const updatedAddresses = (user.addresses || []).filter(addr => addr.id !== id);
        try {
            await updateUserProfile({ addresses: updatedAddresses });
            addToast('Address deleted', 'info');
        } catch (error) {
            addToast(error, 'error');
        }
    };

    // --- Profile Handlers ---
    const handleStartEditProfile = () => {
        setProfileForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
        });
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        // Check if sensitive info changed
        const emailChanged = profileForm.email !== user.email;
        const phoneChanged = profileForm.phone !== user.phone;

        if (emailChanged || phoneChanged) {
            // Trigger OTP
            setOtpTarget(emailChanged ? profileForm.email : profileForm.phone);
            try {
                await sendOtp(emailChanged ? profileForm.email : profileForm.phone);
                setOtpStep(true);
                addToast(`OTP sent to ${emailChanged ? profileForm.email : profileForm.phone}`, 'info');
                alert("Your OTP is 123456");
            } catch (error) {
                addToast('Failed to send OTP', 'error');
            }
        } else {
            // Just update name
            try {
                await updateUserProfile({ name: profileForm.name });
                setIsEditingProfile(false);
                addToast('Profile updated successfully', 'success');
            } catch (error) {
                addToast(error, 'error');
            }
        }
    };

    const handleVerifyProfileOtp = async () => {
        try {
            await verifyOtp(otpTarget, otp);
            await updateUserProfile({
                name: profileForm.name,
                email: profileForm.email,
                phone: profileForm.phone
            });
            setOtpStep(false);
            setIsEditingProfile(false);
            setOtp('');
            addToast('Profile updated successfully', 'success');
        } catch (error) {
            addToast('Invalid OTP', 'error');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h2>
                        {userOrders.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 mb-4">No orders found</p>
                                <Link to="/shop">
                                    <Button>Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            userOrders.map((order) => (
                                <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Order Placed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    {order.trackingNumber && (
                                        <div className="mb-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                            <span className="font-bold">Tracking:</span> {order.trackingNumber} ({order.courierName})
                                        </div>
                                    )}
                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                                <span className="font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total: ₹{order.total}</span>
                                        <Link to="/order-tracking" className="text-luminous-maroon font-bold text-sm hover:underline">
                                            Track Order
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'addresses':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                            <Button onClick={handleAddAddress} size="sm" className="flex items-center gap-2">
                                <Plus size={16} /> Add New
                            </Button>
                        </div>

                        <AnimatePresence>
                            {showAddressForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white p-6 rounded-xl border border-luminous-gold/30 mb-6 overflow-hidden"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-luminous-maroon">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                                        <button onClick={() => setShowAddressForm(false)}><X size={20} /></button>
                                    </div>
                                    <form onSubmit={handleSaveAddress} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Address Type</label>
                                            <select
                                                value={addressForm.type}
                                                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                                            <input
                                                required
                                                value={addressForm.street}
                                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                placeholder="123, Temple Street"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                                                <input
                                                    required
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    placeholder="Varanasi"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                                                <input
                                                    required
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    placeholder="UP"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ZIP</label>
                                                <input
                                                    required
                                                    value={addressForm.zip}
                                                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-luminous-gold outline-none"
                                                    placeholder="221001"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                                            <Button type="submit">Save Address</Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {(!user.addresses || user.addresses.length === 0) ? (
                            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                                <MapPin className="mx-auto text-gray-300 mb-3" size={32} />
                                <p className="text-gray-500">No addresses saved yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.addresses.map(addr => (
                                    <div key={addr.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} className="text-luminous-maroon" />
                                                <h3 className="font-bold text-gray-900">{addr.type}</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditAddress(addr)} className="text-gray-400 hover:text-luminous-maroon"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{addr.street}</p>
                                        <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.zip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'account':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Details</h2>

                        {!isEditingProfile ? (
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                                    <div className="relative group">
                                        <div className="w-20 h-20 bg-luminous-maroon text-white rounded-full flex items-center justify-center font-bold text-3xl overflow-hidden border-2 border-luminous-gold">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name ? user.name[0].toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-white text-luminous-maroon p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luminous-maroon"></div>
                                            ) : (
                                                <Camera size={14} />
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-gray-500 text-sm">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400" />
                                            <p className="font-bold text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" />
                                            <p className="font-bold text-gray-900">{user.phone || 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={handleStartEditProfile} variant="outline">Edit Profile</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl border border-luminous-gold/30 shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-luminous-maroon">Edit Profile</h3>
                                    <button onClick={() => { setIsEditingProfile(false); setOtpStep(false); }}><X size={20} /></button>
                                </div>

                                {!otpStep ? (
                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                            <input
                                                required
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-luminous-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-luminous-gold outline-none"
                                            />
                                            {profileForm.email !== user.email && (
                                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><KeyRound size={12} /> OTP verification required for email change</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-luminous-gold outline-none"
                                                placeholder="Enter phone number"
                                            />
                                            {profileForm.phone !== user.phone && (
                                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><KeyRound size={12} /> OTP verification required for phone change</p>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                                            <Button type="submit">Save Changes</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-center mb-4">
                                            <div className="w-12 h-12 bg-luminous-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 text-luminous-maroon">
                                                <KeyRound size={24} />
                                            </div>
                                            <h4 className="font-bold text-gray-900">Verify Changes</h4>
                                            <p className="text-sm text-gray-500">Enter the OTP sent to {otpTarget}</p>
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-luminous-gold outline-none text-center text-2xl tracking-widest font-bold"
                                            placeholder="• • • • • •"
                                            maxLength={6}
                                        />
                                        <Button onClick={handleVerifyProfileOtp} className="w-full">Verify & Update</Button>
                                        <button onClick={() => setOtpStep(false)} className="w-full text-center text-sm text-gray-500 hover:underline mt-2">Cancel</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-luminous-bg/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-luminous-maroon text-white rounded-full flex items-center justify-center font-bold text-xl overflow-hidden border border-luminous-gold/30">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name ? user.name[0].toUpperCase() : 'U'
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Hello,</p>
                                        <h3 className="font-bold text-gray-900">{user.name || 'User'}</h3>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-luminous-bg text-luminous-maroon font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Package size={20} />
                                        <span>Orders</span>
                                    </div>
                                    <ChevronRight size={16} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-0'} />
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-luminous-bg text-luminous-maroon font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} />
                                        <span>Addresses</span>
                                    </div>
                                    <ChevronRight size={16} className={activeTab === 'addresses' ? 'opacity-100' : 'opacity-0'} />
                                </button>
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'account' ? 'bg-luminous-bg text-luminous-maroon font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User size={20} />
                                        <span>Account Settings</span>
                                    </div>
                                    <ChevronRight size={16} className={activeTab === 'account' ? 'opacity-100' : 'opacity-0'} />
                                </button>
                                <div className="my-2 border-t border-gray-100"></div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
