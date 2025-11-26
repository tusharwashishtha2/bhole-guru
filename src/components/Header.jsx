import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Heart, Sun, Moon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { products } from '../data/products';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const { cart } = useCart();
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Click outside to close suggestions
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 1) {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limit to 5 suggestions
            setSearchResults(results);
            setShowSuggestions(true);
        } else {
            setSearchResults([]);
            setShowSuggestions(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-luminous-bg/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm py-3'
                : 'bg-luminous-bg/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center gap-4">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-2xl md:text-3xl font-display font-bold text-luminous-maroon dark:text-luminous-gold tracking-tight transition-colors flex-shrink-0"
                >
                    Bhole Guru
                </Link>

                {/* Global Search Bar - Desktop */}
                <div className="hidden md:block flex-grow max-w-md relative" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search for divine artifacts..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                            className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-stone-900/80 border border-luminous-gold/30 rounded-full focus:outline-none focus:border-luminous-gold focus:ring-1 focus:ring-luminous-gold/50 transition-all text-sm shadow-sm dark:text-white"
                        />
                        <Search className="absolute left-3.5 top-2.5 text-luminous-gold" size={16} />
                    </form>

                    {/* Search Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-luminous-gold/20 overflow-hidden z-50"
                            >
                                <ul>
                                    {searchResults.map(product => (
                                        <li key={product.id}>
                                            <Link
                                                to={`/product/${product.id}`}
                                                onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                                                className="flex items-center gap-3 p-3 hover:bg-luminous-gold/10 transition-colors border-b border-gray-100 dark:border-stone-800 last:border-0"
                                            >
                                                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h4>
                                                    <p className="text-xs text-luminous-gold">{product.category}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="p-2 text-center bg-gray-50 dark:bg-stone-800">
                                        <Link
                                            to="/shop"
                                            className="text-xs font-bold text-luminous-maroon dark:text-luminous-gold hover:underline flex items-center justify-center gap-1"
                                        >
                                            View all results <ArrowRight size={12} />
                                        </Link>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 flex-shrink-0">
                    <Link to="/" className="text-xs font-bold uppercase tracking-widest text-luminous-text dark:text-stone-300 hover:text-luminous-saffron dark:hover:text-luminous-gold transition-colors drop-shadow-sm">Home</Link>
                    <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-luminous-text dark:text-stone-300 hover:text-luminous-saffron dark:hover:text-luminous-gold transition-colors drop-shadow-sm">Shop</Link>
                    <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-luminous-text dark:text-stone-300 hover:text-luminous-saffron dark:hover:text-luminous-gold transition-colors drop-shadow-sm">About</Link>
                    {user && !user.isAdmin && (
                        <Link to="/track-order" className="text-xs font-bold uppercase tracking-widest text-luminous-text dark:text-stone-300 hover:text-luminous-saffron dark:hover:text-luminous-gold transition-colors drop-shadow-sm">Track</Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="text-luminous-text dark:text-luminous-gold hover:text-luminous-saffron transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Wishlist Icon */}
                    <Link to="/wishlist" className="relative text-luminous-text dark:text-luminous-gold hover:text-luminous-saffron transition-colors">
                        <Heart size={20} />
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-luminous-maroon text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative text-luminous-text dark:text-luminous-gold hover:text-luminous-saffron transition-colors">
                        <ShoppingCart size={20} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-luminous-saffron text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            {user.isAdmin && (
                                <Link to="/admin" className="hidden md:block text-xs font-bold uppercase tracking-widest text-luminous-maroon dark:text-luminous-gold hover:text-luminous-saffron transition-colors">
                                    Admin
                                </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-2 text-luminous-maroon dark:text-luminous-gold hover:text-luminous-saffron transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-luminous-maroon/10 dark:bg-luminous-gold/10 flex items-center justify-center group-hover:bg-luminous-maroon/20 dark:group-hover:bg-luminous-gold/20 transition-colors">
                                    <User size={16} />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-luminous-maroon dark:text-luminous-gold hover:text-luminous-saffron transition-colors">
                                Login
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-luminous-maroon dark:text-luminous-gold"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-luminous-bg dark:bg-stone-950 border-t border-luminous-gold/20 shadow-xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                    {/* Mobile Search */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-luminous-gold/30 rounded-lg focus:outline-none focus:border-luminous-gold shadow-sm dark:text-white"
                        />
                        <Search className="absolute left-3.5 top-3.5 text-luminous-gold" size={18} />

                        {/* Mobile Suggestions */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 bg-white dark:bg-stone-900 rounded-lg border border-luminous-gold/20 overflow-hidden">
                                {searchResults.map(product => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-stone-800 last:border-0"
                                    >
                                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Home</Link>
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Shop</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">About</Link>
                    {user && !user.isAdmin && (
                        <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Track Order</Link>
                    )}
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Wishlist ({wishlist.length})</Link>
                    <hr className="border-luminous-gold/20" />
                    {!user && (
                        <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Login</Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Signup</Link>
                        </>
                    )}
                    {user && (
                        <>
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">My Profile</Link>
                            {user.isAdmin && (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-luminous-maroon dark:text-stone-300">Admin Dashboard</Link>
                            )}
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-red-600">Logout</button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
