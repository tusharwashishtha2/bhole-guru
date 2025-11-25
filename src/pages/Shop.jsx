import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Search, SlidersHorizontal, X, Sparkles, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProduct } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const { products } = useProduct();
    const [searchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState(['All']);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured'); // featured, price-low-high, price-high-low, rating, newest

    // Expanded Categories List
    const categories = [
        'All',
        'Thali Sets',
        'Diyas',
        'Incense',
        'Attar',
        'Havan',
        'Idols',
        'Sacred Threads',
        'Vastras',
        'Pooja Essentials',
        'Ganga Jal'
    ];

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setSelectedCategories([categoryParam]);
            // Scroll to products section on mobile if category is selected
            if (window.innerWidth < 1024) {
                const element = document.getElementById('product-grid');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (category === 'All') return ['All'];

            let newCategories;
            if (prev.includes(category)) {
                newCategories = prev.filter(c => c !== category);
            } else {
                newCategories = [...prev.filter(c => c !== 'All'), category];
            }

            return newCategories.length === 0 ? ['All'] : newCategories;
        });
    };

    const handlePriceChange = (range) => {
        setSelectedPriceRanges(prev => {
            if (prev.includes(range)) {
                return prev.filter(r => r !== range);
            } else {
                return [...prev, range];
            }
        });
    };

    const filterProducts = (product) => {
        // Category Filter
        if (!selectedCategories.includes('All') && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Search Filter
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Price Filter
        if (selectedPriceRanges.length > 0) {
            const price = product.price;
            const matchesPrice = selectedPriceRanges.some(range => {
                if (range === 'under-200') return price < 200;
                if (range === '200-500') return price >= 200 && price <= 500;
                if (range === '500-1000') return price > 500 && price <= 1000;
                if (range === 'above-1000') return price > 1000;
                return false;
            });
            if (!matchesPrice) return false;
        }

        return true;
    };

    const sortProducts = (a, b) => {
        switch (sortBy) {
            case 'price-low-high':
                return a.price - b.price;
            case 'price-high-low':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return b.id - a.id; // Assuming higher ID is newer
            default:
                return 0; // Featured/Default order
        }
    };

    const filteredProducts = products.filter(filterProducts).sort(sortProducts);

    const clearAllFilters = () => {
        setSelectedCategories(['All']);
        setSelectedPriceRanges([]);
        setSearchQuery('');
        setSortBy('featured');
    };

    return (
        <div className="bg-luminous-bg dark:bg-stone-950 min-h-screen pt-20 font-sans text-luminous-text dark:text-stone-100 relative overflow-hidden transition-colors duration-300">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 dark:opacity-5 pointer-events-none fixed"></div>

            {/* Decorative Orbs */}
            <div className="fixed top-20 right-0 w-96 h-96 bg-luminous-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-luminous-maroon/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Page Header */}
            <div className="relative py-8 mb-4">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border border-luminous-gold/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
                            <Sparkles className="text-luminous-maroon dark:text-luminous-gold w-4 h-4" />
                            <span className="text-xs font-bold tracking-widest text-luminous-maroon dark:text-luminous-gold uppercase">Divine Collection</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-luminous-maroon dark:text-luminous-gold mb-2 tracking-tight drop-shadow-sm">
                            The Royal Treasury
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-luminous-gold to-transparent mx-auto mb-4"></div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pr-4 border-r border-luminous-gold/20">
                    <div className="py-2 space-y-8">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search artifacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-luminous-gold/30 rounded-xl focus:outline-none focus:border-luminous-gold focus:ring-1 focus:ring-luminous-gold/50 transition-all text-sm shadow-sm dark:text-white"
                            />
                            <Search className="absolute left-3.5 top-3.5 text-luminous-gold" size={18} />
                        </div>

                        {/* Sort Options */}
                        <div>
                            <h3 className="font-display font-bold text-xl text-luminous-maroon dark:text-luminous-gold mb-4 flex items-center gap-2 border-b border-luminous-gold/20 pb-2">
                                <ArrowUpDown size={18} /> Sort By
                            </h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-stone-900 border border-luminous-gold/30 rounded-lg text-sm focus:outline-none focus:border-luminous-gold dark:text-white"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-display font-bold text-xl text-luminous-maroon dark:text-luminous-gold mb-4 flex items-center gap-2 border-b border-luminous-gold/20 pb-2">
                                <SlidersHorizontal size={18} /> Categories
                            </h3>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat}>
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => handleCategoryChange(cat)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border-2 border-luminous-gold/40 rounded bg-white dark:bg-stone-900 peer-checked:bg-luminous-gold peer-checked:border-luminous-gold transition-all shadow-sm"></div>
                                                <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-luminous-maroon dark:text-luminous-gold font-bold' : 'text-luminous-text/80 dark:text-stone-400 group-hover:text-luminous-maroon dark:group-hover:text-luminous-gold'}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-display font-bold text-xl text-luminous-maroon dark:text-luminous-gold mb-4 border-b border-luminous-gold/20 pb-2">Price Range</h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'under-200', label: 'Under ₹200' },
                                    { id: '200-500', label: '₹200 - ₹500' },
                                    { id: '500-1000', label: '₹500 - ₹1000' },
                                    { id: 'above-1000', label: 'Above ₹1000' }
                                ].map((range) => (
                                    <label key={range.id} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-luminous-gold/5 transition-colors">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedPriceRanges.includes(range.id)}
                                                onChange={() => handlePriceChange(range.id)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-luminous-gold/40 rounded bg-white dark:bg-stone-900 peer-checked:bg-luminous-gold peer-checked:border-luminous-gold transition-all shadow-sm"></div>
                                            <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-luminous-text/80 dark:text-stone-400 group-hover:text-luminous-maroon dark:group-hover:text-luminous-gold transition-colors text-sm font-medium">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={clearAllFilters}
                            className="w-full py-2 text-sm text-luminous-maroon dark:text-luminous-gold hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </aside>

                {/* Mobile Filter & Content */}
                <div className="flex-grow w-full">
                    {/* Mobile Controls */}
                    <div className="lg:hidden mb-8 flex flex-col gap-4 sticky top-20 z-30 bg-luminous-bg/95 dark:bg-stone-950/95 backdrop-blur-md p-4 -mx-4 shadow-sm border-b border-luminous-gold/10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-luminous-gold/30 rounded-lg focus:outline-none focus:border-luminous-gold shadow-sm dark:text-white"
                            />
                            <Search className="absolute left-3.5 top-3.5 text-luminous-gold" size={18} />
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="flex-1 flex justify-between items-center bg-white dark:bg-stone-900 border border-luminous-gold/30 text-luminous-maroon dark:text-luminous-gold px-4 py-3 rounded-lg shadow-sm active:scale-95 transition-transform"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <span className="flex items-center gap-2 font-display font-bold"><Filter size={18} /> Filters</span>
                                <ChevronDown size={18} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 bg-white dark:bg-stone-900 border border-luminous-gold/30 text-luminous-maroon dark:text-luminous-gold px-4 py-3 rounded-lg shadow-sm focus:outline-none"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-white dark:bg-stone-900 border border-luminous-gold/20 rounded-lg shadow-lg"
                                >
                                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-luminous-maroon dark:text-luminous-gold font-display">Refine Selection</h4>
                                            <button onClick={() => setIsFilterOpen(false)}><X size={20} className="text-luminous-text/50 dark:text-stone-400" /></button>
                                        </div>

                                        <div className="mb-6">
                                            <h5 className="font-bold mb-2 dark:text-white">Categories</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => handleCategoryChange(cat)}
                                                        className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-all ${selectedCategories.includes(cat)
                                                            ? 'bg-luminous-maroon text-luminous-gold border-luminous-maroon font-bold'
                                                            : 'bg-transparent text-luminous-text dark:text-stone-400 border-luminous-gold/30'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-bold mb-2 dark:text-white">Price</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { id: 'under-200', label: '< ₹200' },
                                                    { id: '200-500', label: '₹200-500' },
                                                    { id: '500-1000', label: '₹500-1000' },
                                                    { id: 'above-1000', label: '> ₹1000' }
                                                ].map((range) => (
                                                    <button
                                                        key={range.id}
                                                        onClick={() => handlePriceChange(range.id)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedPriceRanges.includes(range.id)
                                                            ? 'bg-luminous-gold text-luminous-maroon border-luminous-gold'
                                                            : 'bg-transparent text-luminous-text dark:text-stone-400 border-luminous-gold/30'
                                                            }`}
                                                    >
                                                        {range.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Results Count & Active Filters */}
                    <div id="product-grid" className="mb-6 flex flex-col md:flex-row justify-between items-end border-b border-luminous-gold/20 pb-4 gap-4">
                        <div>
                            <span className="text-luminous-text/50 dark:text-stone-500 text-sm uppercase tracking-widest font-bold">Showing</span>
                            <h2 className="text-3xl font-display font-bold text-luminous-maroon dark:text-luminous-gold flex items-center gap-3">
                                {selectedCategories.includes('All') && selectedCategories.length === 1 ? 'All Artifacts' : 'Filtered Selection'}
                                {(selectedCategories.length > 1 || !selectedCategories.includes('All') || selectedPriceRanges.length > 0 || searchQuery) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs bg-luminous-maroon/10 dark:bg-luminous-gold/10 hover:bg-luminous-maroon dark:hover:bg-luminous-gold hover:text-white dark:hover:text-luminous-maroon text-luminous-maroon dark:text-luminous-gold px-2 py-1 rounded-full transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </h2>
                        </div>
                        <span className="text-luminous-gold font-bold text-lg bg-white/50 dark:bg-stone-900/50 px-4 py-1 rounded-full border border-luminous-gold/20">
                            {filteredProducts.length} Items Found
                        </span>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
                        >
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        key={product.id}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 border-2 border-dashed border-luminous-gold/20 rounded-3xl bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm"
                        >
                            <div className="inline-block p-6 rounded-full bg-luminous-gold/10 mb-6 animate-pulse">
                                <Search size={48} className="text-luminous-gold" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-luminous-maroon dark:text-luminous-gold mb-2">No treasures found</h3>
                            <p className="text-luminous-text/60 dark:text-stone-400 mb-8 max-w-md mx-auto">
                                We couldn't find any artifacts matching your current selection. Try adjusting your filters or search terms.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="bg-luminous-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-luminous-saffron transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Clear All Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
