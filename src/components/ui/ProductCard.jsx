import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuickView } from '../../context/QuickViewContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { openQuickView } = useQuickView();

    const isWishlisted = isInWishlist(product.id || product._id);
    const productId = product.id || product._id;

    return (
        <div className="group relative bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-stone-800">
            {/* Image Container */}
            <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-stone-800">
                <Link to={`/product/${productId}`}>
                    <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=500&auto=format&fit=crop';
                        }}
                    />
                </Link>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                        onClick={() => addToCart(product)}
                        className="p-3 bg-white dark:bg-stone-800 rounded-full text-luminous-maroon dark:text-luminous-gold hover:bg-luminous-maroon hover:text-white transition-all transform hover:scale-110 shadow-lg"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={() => openQuickView(product)}
                        className="p-3 bg-white dark:bg-stone-800 rounded-full text-luminous-maroon dark:text-luminous-gold hover:bg-luminous-maroon hover:text-white transition-all transform hover:scale-110 shadow-lg"
                        title="Quick View"
                    >
                        <Eye size={20} />
                    </button>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-md ${isWishlisted
                        ? 'bg-luminous-maroon text-white'
                        : 'bg-white/80 dark:bg-black/50 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-luminous-maroon hover:text-white'
                        }`}
                >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Badges */}
                {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="text-xs font-bold text-luminous-gold uppercase tracking-wider mb-1">
                    {product.category}
                </div>
                <Link to={`/product/${productId}`}>
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-luminous-maroon dark:group-hover:text-luminous-gold transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-luminous-maroon dark:text-luminous-saffron">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                        <span>★</span> {product.rating}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
