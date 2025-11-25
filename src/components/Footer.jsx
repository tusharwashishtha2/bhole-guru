import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();
    return (
        <footer className="bg-luminous-maroon text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h3 className="text-3xl font-display font-bold mb-6 text-luminous-gold">Bhole Guru</h3>
                        <p className="text-white/80 leading-relaxed mb-6">
                            Bringing the sanctity of ancient traditions to your modern home.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-luminous-gold font-display font-bold mb-6">Explore</h4>
                        <ul className="space-y-3 text-white/80">
                            <li><Link to="/shop" className="hover:text-luminous-gold">Collection</Link></li>
                            <li><Link to="/about" className="hover:text-luminous-gold">Our Story</Link></li>
                            <li><Link to="/order-tracking" className="hover:text-luminous-gold">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-luminous-gold font-display font-bold mb-6">Account</h4>
                        <ul className="space-y-3 text-white/80">
                            {!user && (
                                <>
                                    <li><Link to="/login" className="hover:text-luminous-gold">Login</Link></li>
                                    <li><Link to="/signup" className="hover:text-luminous-gold">Register</Link></li>
                                </>
                            )}
                            {user && (
                                <li><Link to="/profile" className="hover:text-luminous-gold">My Profile</Link></li>
                            )}
                            {user?.isAdmin && (
                                <li><Link to="/admin" className="hover:text-luminous-gold flex items-center gap-2"><ShieldCheck size={14} /> Admin Access</Link></li>
                            )}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-luminous-gold font-display font-bold mb-6">Visit Us</h4>
                        <ul className="space-y-3 text-white/80">
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-luminous-gold" />
                                <span>Indore, Madhya Pradesh, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-luminous-gold" />
                                <span>7000308463</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
                    <p>&copy; {new Date().getFullYear()} Bhole Guru. Designed with Devotion.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
