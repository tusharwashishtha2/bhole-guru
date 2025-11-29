import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Share2, Heart, User } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addReview, getProductReviews, getAverageRating } = useReview();
    const { user } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Try to fetch from API first (for wishlist compatibility)
                const API_URL = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com');
                const response = await fetch(`${API_URL}/api/products/lookup/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setActiveImage(data.images?.[0] || data.image);
                } else {
                    // Fallback to static data if API fails or not found (e.g. during dev before seed)
                    const staticProduct = products.find(p => p.id === parseInt(id));
                    if (staticProduct) {
                        setProduct(staticProduct);
                        setActiveImage(staticProduct.images?.[0] || staticProduct.image);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
                // Fallback
                const staticProduct = products.find(p => p.id === parseInt(id));
                if (staticProduct) {
                    setProduct(staticProduct);
                    setActiveImage(staticProduct.images?.[0] || staticProduct.image);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luminous-maroon"></div></div>;
    }

    // Handle case where product is not found
    if (!product) {
        return <div className="text-center py-20 bg-luminous-maroon text-white">Product not found</div>;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const reviews = getProductReviews(product.id);
    const averageRating = reviews.length > 0 ? getAverageRating(product.id) : product.rating;
    const reviewCount = reviews.length > 0 ? reviews.length : (product.reviews ? product.reviews.length : product.numReviews);

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase') setQuantity(quantity + 1);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to submit a review');
            return;
        }
        const newReview = {
            id: Date.now(),
            user: user.name || 'Anonymous',
            rating,
            comment,
            date: new Date().toLocaleDateString()
        };
        addReview(product.id, newReview);
        setComment('');
        setRating(5);
    };

    const isWishlisted = isInWishlist(product.id);

    return (
        <div className="bg-luminous-maroon min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4">
                <Link to="/shop" className="inline-flex items-center text-white/60 hover:text-luminous-gold mb-6 transition-colors font-medium tracking-wide uppercase text-xs">
                    <ArrowLeft size={16} className="mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-luminous-gold/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-luminous-maroon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=500&auto=format&fit=crop';
                                }}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-luminous-gold mb-4 leading-tight">{product.name}</h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-3 rounded-full border border-luminous-gold/20 transition-all duration-300 ${isWishlisted
                                        ? 'bg-luminous-gold text-luminous-maroon'
                                        : 'bg-luminous-maroon/50 text-luminous-gold hover:bg-luminous-gold hover:text-luminous-maroon'
                                        }`}
                                >
                                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                </button>
                                <button className="p-3 rounded-full bg-luminous-maroon/50 border border-luminous-gold/20 text-luminous-gold hover:bg-luminous-gold hover:text-luminous-maroon transition-all duration-300">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex text-yellow-400">
                                <Star fill="currentColor" size={20} />
                                <span className="ml-2 text-white font-medium">{averageRating}</span>
                            </div>
                            <span className="text-white/20">|</span>
                            <span className="text-white/60">{reviewCount} Reviews</span>
                        </div>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-bold text-luminous-gold">₹{product.price}</span>
                            <span className="text-xl text-white/40 line-through mb-1">₹{product.originalPrice}</span>
                            <span className="text-green-400 font-medium mb-1 bg-green-900/30 border border-green-500/30 px-3 py-1 rounded-full text-sm">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </div>

                        <p className="text-white/80 leading-relaxed mb-8 text-lg font-light">
                            {product.description}
                        </p>

                        <div className="mb-10 p-6 bg-luminous-maroon/30 border border-luminous-gold/10 rounded-xl">
                            <h3 className="font-bold text-luminous-gold mb-4 font-serif text-lg">Key Features:</h3>
                            <ul className="space-y-3 text-white/70">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-luminous-gold mt-2 flex-shrink-0"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-10">
                            <div className="flex items-center border border-luminous-gold/30 rounded-full w-max bg-luminous-maroon/50">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="p-4 hover:text-luminous-gold transition-colors text-white"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg text-luminous-gold">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="p-4 hover:text-luminous-gold transition-colors text-white"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <Button
                                className="flex-grow gap-2 text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                                onClick={() => addToCart(product, quantity)}
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl p-8 mb-16 shadow-xl">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Customer Reviews</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Review Form */}
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                            {user ? (
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        size={24}
                                                        fill={(hoverRating || rating) >= star ? "#EAB308" : "none"}
                                                        className={(hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                        <textarea
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminous-maroon focus:border-transparent outline-none h-32 resize-none"
                                            placeholder="Share your experience..."
                                        ></textarea>
                                    </div>
                                    <Button type="submit" className="w-full">Submit Review</Button>
                                </form>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-xl text-center">
                                    <p className="text-gray-600 mb-4">Please log in to write a review.</p>
                                    <Link to="/login">
                                        <Button variant="outline" className="w-full">Log In</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="md:col-span-2 space-y-6">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-luminous-maroon/10 rounded-full flex items-center justify-center text-luminous-maroon font-bold">
                                                    {review.user[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.user}</h4>
                                                    <p className="text-xs text-gray-500">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="border-t border-luminous-gold/10 pt-16">
                    <SectionHeading title="You May Also Like" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {relatedProducts.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
