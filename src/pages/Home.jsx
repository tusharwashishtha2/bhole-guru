import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShoppingBag, Flame, Flower, Bell, Sun, Wind } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';

const Home = () => {
    const { addToCart } = useCart();
    const { products } = useProduct();
    const { sacredOfferings, heroSection, divineFavorites, divineEssentials, shubhAarambh, aromaticBliss, templeCorridor, royalTreasury } = useContent();

    React.useEffect(() => {

    }, []);

    // Get top rated products for Royal Treasury
    const royalTreasuryProducts = products.filter(p => p.rating >= 4.8).slice(0, 5);

    // Helper for Aromatic Bliss Split
    const aromaticBlissDefaultsRow1 = [
        { title: 'Rose', color: '#FFB7B2', icon: Flower },
        { title: 'Jasmine', color: '#FFFFFF', icon: Star },
        { title: 'Lavender', color: '#E6E6FA', icon: Wind },
        { title: 'Mogra', color: '#F0FFF0', icon: Sun },
        { title: 'Lotus', color: '#FFC0CB', icon: Flower },
        { title: 'Marigold', color: '#FFA500', icon: Sun },
        { title: 'Hibiscus', color: '#FF69B4', icon: Flower },
        { title: 'Champa', color: '#FFFACD', icon: Star },
    ];
    const aromaticBlissDefaultsRow2 = [
        { title: 'Sandalwood', color: '#D2B48C', icon: Wind },
        { title: 'Musk', color: '#8B4513', icon: Star },
        { title: 'Patchouli', color: '#DEB887', icon: Flower },
        { title: 'Amber', color: '#FFBF00', icon: Sun },
        { title: 'Frankincense', color: '#F5DEB3', icon: Wind },
        { title: 'Myrrh', color: '#CD853F', icon: Star },
        { title: 'Cedar', color: '#A0522D', icon: Flower },
        { title: 'Oudh', color: '#5D4037', icon: Sun },
    ];

    let aromaticBlissRow1 = aromaticBlissDefaultsRow1;
    let aromaticBlissRow2 = aromaticBlissDefaultsRow2;

    if (aromaticBliss?.items && aromaticBliss.items.length > 0) {
        const mid = Math.ceil(aromaticBliss.items.length / 2);
        aromaticBlissRow1 = aromaticBliss.items.slice(0, mid);
        aromaticBlissRow2 = aromaticBliss.items.slice(mid);
        // If row 2 is empty (e.g. only 1 item), duplicate row 1 to keep animation balanced
        if (aromaticBlissRow2.length === 0) aromaticBlissRow2 = aromaticBlissRow1;
    }

    // Helper for Temple Corridor
    const templeCorridorDefaults = [
        { title: 'Sambrani', img: 'https://images.unsplash.com/photo-1615486368197-081e578ee90c?q=80&w=600&auto=format&fit=crop' },
        { title: 'Guggal', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop' },
        { title: 'Cow Dung', img: 'https://images.unsplash.com/photo-1618422386284-262225343735?q=80&w=600&auto=format&fit=crop' },
        { title: 'Loban', img: 'https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=600&auto=format&fit=crop' },
        { title: 'Chandan', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=600&auto=format&fit=crop' },
    ];
    const templeCorridorItems = (templeCorridor?.items && templeCorridor.items.length > 0) ? templeCorridor.items : templeCorridorDefaults;

    // Helper for Divine Essentials
    const divineEssentialsDefaults = [
        { id: 1, title: 'God Statues', link: '/shop?category=Idols', img: 'https://images.unsplash.com/photo-1567591414240-e136599d7f33?q=80&w=600', desc: 'Murti Sthapana' },
        { id: 2, title: 'Hawan Kund', link: '/shop?category=Havan', img: 'https://images.unsplash.com/photo-1602524206684-fdf6393c7d89?q=80&w=600', desc: 'Sacred Fire' },
        { id: 3, title: 'Jap Mala', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1623935813721-f3f5d0131f35?q=80&w=600', desc: 'Mantra Chanting' },
        { id: 4, title: 'Kalawa', link: '/shop?category=Sacred Threads', img: 'https://images.unsplash.com/photo-1633809616843-0803153a7d27?q=80&w=600', desc: 'Raksha Sutra' },
        { id: 5, title: 'Janeu', link: '/shop?category=Sacred Threads', img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=600', desc: 'Yagnopavit' },
        { id: 6, title: 'Gomti Chakra', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=600', desc: 'Wealth & Prosperity' },
        { id: 7, title: 'Kodi', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1596305589440-2e180399a760?q=80&w=600', desc: 'Laxmi Kripa' },
        { id: 8, title: 'Hawan Samagri', link: '/shop?category=Havan', img: 'https://images.unsplash.com/photo-1602524206684-fdf6393c7d89?q=80&w=600', desc: 'Pure Herbs' },
        { id: 9, title: 'Pooja Cloth', link: '/shop?category=Vastras', img: 'https://images.unsplash.com/photo-1616628188550-808d82f5a32c?q=80&w=600', desc: 'Red, White, Yellow' },
    ];
    const divineEssentialsItems = (divineEssentials?.items && divineEssentials.items.length > 0) ? divineEssentials.items : divineEssentialsDefaults;

    const royalTreasuryItems = (royalTreasury?.items && royalTreasury.items.length > 0)
        ? royalTreasury.items.map(item => ({
            id: item.title,
            image: item.img,
            name: item.title,
            link: item.link,
            price: null,
            isCms: true
        }))
        : royalTreasuryProducts.map(product => ({
            id: product.id,
            image: product.image,
            name: product.name,
            link: `/product/${product.id}`,
            price: product.price,
            isCms: false,
            originalProduct: product
        }));

    return (
        <div className="min-h-screen bg-luminous-bg overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[60vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 overflow-hidden pt-24 md:pt-0 pb-8 md:pb-0">

                {/* Left Content - Split for Mobile */}
                <div className="relative z-10 w-full h-full md:w-1/2 flex flex-col justify-between md:justify-center items-start text-left md:space-y-8 py-4 md:py-0">

                    {/* Top Section: Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative z-20 mt-4 md:mt-0"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-luminous-gold/10 border border-luminous-gold/20 rounded-full px-4 py-1.5 mb-4 md:mb-6 backdrop-blur-sm">
                            <Sparkles className="text-luminous-maroon w-4 h-4" />
                            <span className="text-xs md:text-sm font-bold tracking-widest text-luminous-maroon uppercase">Premium Spiritual Collection</span>
                        </div>

                        {/* Hindi Heading */}
                        <h1 className="flex flex-col font-bold leading-tight">
                            <span className="text-6xl md:text-8xl text-luminous-maroon font-serif mb-2 drop-shadow-md">भोले गुरु</span>
                            <span className="text-5xl md:text-7xl text-luminous-saffron font-serif drop-shadow-md">पूजन सामग्री</span>
                        </h1>
                    </motion.div>

                    {/* Bottom Section: Description & Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative z-20 mb-8 md:mb-0"
                    >
                        {/* Description */}
                        <p className="text-lg md:text-xl text-luminous-text/80 max-w-lg lg:max-w-md mt-6 leading-relaxed drop-shadow-sm font-medium bg-white/30 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 rounded-lg">
                            Experience the divine connection with our authentically crafted spiritual essentials, designed to bring peace, purity, and prosperity to your home.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-6 md:mt-8">
                            <Button to="/shop" variant="primary" className="bg-luminous-saffron hover:bg-luminous-maroon text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                Shop Collection
                            </Button>
                            <Button to="/about" variant="outline" className="border-2 border-luminous-maroon text-luminous-maroon hover:bg-luminous-maroon hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 bg-white/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
                                Our Story
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Content - Blended Image (No Container) */}
                <div className="absolute top-0 right-0 w-full md:w-3/5 h-full z-0 overflow-hidden pointer-events-none">
                    <div className="relative w-full h-full">
                        <img
                            src="/images/hero-shyam-v2.jpg"
                            alt="Khatu Shyam Ji"
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Gradient Blend - Middle to Right (Left side of image fades into bg) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-luminous-bg/40 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-luminous-bg/10 via-transparent to-luminous-bg/10"></div>
                    </div>
                </div>


            </section>

            {/* --- SHUBH AARAMBH (Welcome Banner) --- */}
            <div className="bg-luminous-maroon text-white py-3 overflow-hidden relative z-20 shadow-lg">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
                    {(shubhAarambh && shubhAarambh.length > 0 ? shubhAarambh : [...Array(10)].map((_, i) => ({ title: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' }))).map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-lg font-display tracking-widest">
                            <Star size={16} className="text-luminous-gold fill-current" />
                            {item.img && <img src={item.img} alt="" className="h-8 w-8 rounded-full object-cover border border-white/20" />}
                            <span>{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>



            {/* --- DIVINE FAVORITES (BESTSELLERS) --- */}
            <section
                className={`py-20 relative overflow-hidden ${divineFavorites.bgColor || 'bg-gradient-to-b from-white to-luminous-bg'}`}
                style={divineFavorites.bgImage ? { backgroundImage: `url(${divineFavorites.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {divineFavorites.bgImage && <div className="absolute inset-0 bg-white/80 z-0"></div>}
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luminous-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-16 relative z-10 px-6">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-luminous-maroon mb-4 tracking-tight">
                        {divineFavorites.title || "Divine Favorites"}
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-luminous-gold"></div>
                        <Star size={16} className="text-luminous-gold fill-current" />
                        <div className="h-[1px] w-12 bg-luminous-gold"></div>
                    </div>
                    <p className="text-luminous-text/70 text-lg mt-4 font-medium">
                        {divineFavorites.subtitle || "Exquisite artifacts loved by devotees worldwide."}
                    </p>
                </div>


                {/* --- SACRED OFFERINGS (DIVINE ARCH) --- */}
                <div className="relative w-full py-12">
                    {/* Carousel Container */}
                    <div className="relative w-full flex overflow-hidden group">
                        {/* Gradient Masks for Smooth Edges */}
                        <div className="absolute top-0 left-0 h-full w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 h-full w-16 md:w-32 bg-gradient-to-l from-luminous-bg to-transparent z-20 pointer-events-none"></div>

                        {/* Track 1 */}
                        <div className="flex gap-8 animate-marquee whitespace-nowrap px-4 group-hover:[animation-play-state:paused] min-w-full shrink-0">
                            {sacredOfferings.map((cat, idx) => (
                                <Link to={`/shop?category=${cat.category}`} key={`t1-${idx}`} className="inline-block w-64 md:w-80 flex-shrink-0 group/card mx-4 pointer-events-auto">
                                    <div className="flex flex-col items-center">
                                        {/* The Divine Arch Card */}
                                        <div className="relative w-full aspect-[3/4] rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-luminous-gold/30 group-hover/card:border-luminous-gold transition-all duration-500 shadow-sm md:shadow-md group-hover/card:shadow-[0_0_25px_rgba(212,175,55,0.4)] bg-white transform group-hover/card:-translate-y-2">

                                            {/* Image Container */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <img
                                                    src={cat.img}
                                                    alt={cat.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=' + cat.title }}
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-luminous-maroon/90 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity duration-500"></div>
                                            </div>

                                            {/* Hover Reveal Content */}
                                            <div className="absolute inset-0 flex flex-col justify-end items-center p-6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-20">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 delay-100">
                                                    <ArrowRight className="text-white" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title Outside the Card */}
                                        <div className="mt-6 text-center relative">
                                            <h3 className="text-xl font-display font-bold text-luminous-maroon tracking-wide group-hover/card:text-luminous-saffron transition-colors duration-300">
                                                {cat.title}
                                            </h3>
                                            <div className="w-0 h-[2px] bg-luminous-gold mx-auto mt-2 transition-all duration-500 group-hover/card:w-full"></div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Track 2 (Duplicate) */}
                        <div className="flex gap-8 animate-marquee whitespace-nowrap px-4 group-hover:[animation-play-state:paused] min-w-full shrink-0" aria-hidden="true">
                            {sacredOfferings.map((cat, idx) => (
                                <Link to={`/shop?category=${cat.category}`} key={`t2-${idx}`} className="inline-block w-64 md:w-80 flex-shrink-0 group/card mx-4 pointer-events-auto">
                                    <div className="flex flex-col items-center">
                                        {/* The Divine Arch Card */}
                                        <div className="relative w-full aspect-[3/4] rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-luminous-gold/30 group-hover/card:border-luminous-gold transition-all duration-500 shadow-sm md:shadow-md group-hover/card:shadow-[0_0_25px_rgba(212,175,55,0.4)] bg-white transform group-hover/card:-translate-y-2">

                                            {/* Image Container */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <img
                                                    src={cat.img}
                                                    alt={cat.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=' + cat.title }}
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-luminous-maroon/90 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity duration-500"></div>
                                            </div>

                                            {/* Hover Reveal Content */}
                                            <div className="absolute inset-0 flex flex-col justify-end items-center p-6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-20">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 delay-100">
                                                    <ArrowRight className="text-white" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title Outside the Card */}
                                        <div className="mt-6 text-center relative">
                                            <h3 className="text-xl font-display font-bold text-luminous-maroon tracking-wide group-hover/card:text-luminous-saffron transition-colors duration-300">
                                                {cat.title}
                                            </h3>
                                            <div className="w-0 h-[2px] bg-luminous-gold mx-auto mt-2 transition-all duration-500 group-hover/card:w-full"></div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Full Width Carousel Container */}
                <div className="relative w-full flex overflow-hidden group py-8">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 h-full w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-16 md:w-32 bg-gradient-to-l from-luminous-bg to-transparent z-20 pointer-events-none"></div>

                    {/* Track 1 (Reverse Scrolling) */}
                    <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap px-4 group-hover:[animation-play-state:paused] min-w-full shrink-0">
                        {[...royalTreasuryItems, ...royalTreasuryItems, ...royalTreasuryItems].map((product, idx) => (
                            <div key={`rt1-${idx}`} className="inline-block w-72 md:w-80 flex-shrink-0 group/card mx-4 relative">
                                {/* Floating Glass Card */}
                                <Link to={product.link} className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-white border border-luminous-gold/20 shadow-lg group-hover/card:shadow-2xl transition-all duration-500 transform group-hover/card:-translate-y-3 group-hover/card:rotate-1">

                                    {/* Image */}
                                    <div className="absolute inset-0 p-3">
                                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=' + product.name }}
                                            />
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/0 transition-colors duration-300"></div>
                                        </div>
                                    </div>

                                    {/* Price Badge (Gold Tag) */}
                                    {product.price && (
                                        <div className="absolute top-6 right-6 bg-luminous-gold text-white font-bold py-1 px-3 rounded-full shadow-md z-20 transform rotate-3 group-hover/card:rotate-0 transition-transform duration-300 border border-white/30 backdrop-blur-sm">
                                            ₹{product.price}
                                        </div>
                                    )}
                                </Link>

                                {/* Add to Cart Button (Floating) - Only for products */}
                                {!product.isCms && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product.originalProduct);
                                        }}
                                        className="absolute bottom-24 right-6 w-12 h-12 bg-luminous-maroon text-white rounded-full flex items-center justify-center shadow-lg translate-y-20 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 hover:bg-luminous-saffron z-20"
                                    >
                                        <ShoppingBag size={20} />
                                    </button>
                                )}

                                {/* Product Info (Below Card) */}
                                <div className="mt-6 text-center whitespace-normal px-2">
                                    <Link to={product.link}>
                                        <h3 className="text-xl font-display font-bold text-luminous-maroon mb-1 group-hover/card:text-luminous-gold transition-colors duration-300 leading-tight">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex justify-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={12} className="text-luminous-gold fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Track 2 (Duplicate for Seamless Loop) */}
                    <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap px-4 group-hover:[animation-play-state:paused] min-w-full shrink-0" aria-hidden="true">
                        {[...royalTreasuryItems, ...royalTreasuryItems, ...royalTreasuryItems].map((product, idx) => (
                            <div key={`rt2-${idx}`} className="inline-block w-72 md:w-80 flex-shrink-0 group/card mx-4 relative">
                                {/* Floating Glass Card */}
                                <Link to={product.link} className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-white border border-luminous-gold/20 shadow-lg group-hover/card:shadow-2xl transition-all duration-500 transform group-hover/card:-translate-y-3 group-hover/card:rotate-1">

                                    {/* Image */}
                                    <div className="absolute inset-0 p-3">
                                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=' + product.name }}
                                            />
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/0 transition-colors duration-300"></div>
                                        </div>
                                    </div>

                                    {/* Price Badge (Gold Tag) */}
                                    {product.price && (
                                        <div className="absolute top-6 right-6 bg-luminous-gold text-white font-bold py-1 px-3 rounded-full shadow-md z-20 transform rotate-3 group-hover/card:rotate-0 transition-transform duration-300 border border-white/30 backdrop-blur-sm">
                                            ₹{product.price}
                                        </div>
                                    )}
                                </Link>

                                {/* Add to Cart Button (Floating) - Only for products */}
                                {!product.isCms && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product.originalProduct);
                                        }}
                                        className="absolute bottom-24 right-6 w-12 h-12 bg-luminous-maroon text-white rounded-full flex items-center justify-center shadow-lg translate-y-20 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 hover:bg-luminous-saffron z-20"
                                    >
                                        <ShoppingBag size={20} />
                                    </button>
                                )}

                                {/* Product Info (Below Card) */}
                                <div className="mt-6 text-center whitespace-normal px-2">
                                    <Link to={product.link}>
                                        <h3 className="text-xl font-display font-bold text-luminous-maroon mb-1 group-hover/card:text-luminous-gold transition-colors duration-300 leading-tight">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex justify-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={12} className="text-luminous-gold fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Button to="/shop" variant="primary" className="px-12 py-4 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        View All Treasures
                    </Button>
                </div>
            </section>

            {/* --- AROMATIC BLISS (INCENSE STICKS) --- */}
            <section className="py-20 relative overflow-hidden bg-luminous-bg" style={aromaticBliss?.bgImage ? { backgroundImage: `url(${aromaticBliss.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {aromaticBliss?.bgImage && <div className="absolute inset-0 bg-white/90 z-0"></div>}
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>

                <div className="text-center mb-12 relative z-10 px-6">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-luminous-maroon mb-4">
                        {aromaticBliss?.title || "Aromatic Bliss"}
                    </h2>
                    <p className="text-luminous-text/70 text-lg mt-4 max-w-2xl mx-auto font-medium">
                        {aromaticBliss?.subtitle || "Immerse yourself in a symphony of divine fragrances."}
                    </p>
                </div>

                {/* Dual Marquee Container */}
                <div className="relative w-full flex flex-col gap-8 overflow-hidden py-8 z-10">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 h-full w-16 md:w-32 bg-gradient-to-r from-luminous-bg to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-16 md:w-32 bg-gradient-to-l from-luminous-bg to-transparent z-20 pointer-events-none"></div>

                    {/* Row 1: Floral Scents (Left to Right) */}
                    <div className="flex gap-6 animate-marquee whitespace-nowrap px-4 min-w-full shrink-0">
                        {[...aromaticBlissRow1, ...aromaticBlissRow1, ...aromaticBlissRow1].map((scent, idx) => (
                            <Link to="/shop?category=Incense" key={`s1-${idx}`} className="inline-block w-64 flex-shrink-0 group/scent">
                                <div className="relative h-32 rounded-full flex items-center justify-center border-2 border-luminous-gold/20 bg-white shadow-sm group-hover/scent:scale-105 transition-transform duration-300 overflow-hidden">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: scent.color || '#fff' }}></div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        {scent.icon ? <scent.icon className="text-luminous-maroon" size={24} /> : <Flower className="text-luminous-maroon" size={24} />}
                                        <span className="text-xl font-display font-bold text-luminous-maroon">{scent.title}</span>
                                    </div>
                                    {/* Smoke Effect on Hover */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-200 blur-2xl opacity-0 group-hover/scent:opacity-40 transition-opacity duration-700 animate-pulse"></div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Row 2: Woody & Earthy Scents (Right to Left) */}
                    <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap px-4 min-w-full shrink-0">
                        {[...aromaticBlissRow2, ...aromaticBlissRow2, ...aromaticBlissRow2].map((scent, idx) => (
                            <Link to="/shop?category=Incense" key={`s2-${idx}`} className="inline-block w-64 flex-shrink-0 group/scent">
                                <div className="relative h-32 rounded-full flex items-center justify-center border-2 border-luminous-gold/20 bg-white shadow-sm group-hover/scent:scale-105 transition-transform duration-300 overflow-hidden">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: scent.color || '#fff' }}></div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        {scent.icon ? <scent.icon className="text-luminous-maroon" size={24} /> : <Flower className="text-luminous-maroon" size={24} />}
                                        <span className="text-xl font-display font-bold text-luminous-maroon">{scent.title}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PURE ESSENCE (TEMPLE CORRIDOR DHOOP) --- */}
            <section className="py-24 relative overflow-hidden bg-[#FFF8E7] text-luminous-maroon" style={templeCorridor?.bgImage ? { backgroundImage: `url(${templeCorridor.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {templeCorridor?.bgImage && <div className="absolute inset-0 bg-white/80 z-0"></div>}
                {/* Deep Stone Texture Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

                {/* Floating Smoke Layers */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20 mb-12 text-center">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-luminous-maroon mb-4 tracking-widest uppercase drop-shadow-sm">
                        {templeCorridor?.title || "The Temple Corridor"}
                    </h2>
                    <p className="text-luminous-maroon/80 text-lg max-w-2xl mx-auto font-display tracking-wide">
                        {templeCorridor?.subtitle || "Walk through the path of purity. Ancient dhoop recipes for your sacred space."}
                    </p>
                </div>

                {/* The Corridor (Infinite Scroll) */}
                <div className="relative w-full flex overflow-hidden z-20 py-12">
                    {/* Track 1 */}
                    <div className="flex items-end animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] will-change-transform">
                        {templeCorridorItems.map((item, idx) => (
                            <Link to="/shop?category=Incense" key={`c1-${idx}`} className="flex items-end mx-4">
                                {/* The Pillar */}
                                <div className="w-16 md:w-24 h-96 bg-gradient-to-b from-[#4A0404] via-[#2D1810] to-black border-x-2 border-luminous-gold/30 relative flex flex-col items-center justify-start pt-4 shadow-2xl">
                                    <div className="w-12 h-12 border-2 border-luminous-gold/50 rounded-full flex items-center justify-center mb-4">
                                        <Sun className="text-luminous-gold animate-spin-slow" size={20} />
                                    </div>
                                    <div className="w-[1px] h-full bg-luminous-gold/20"></div>
                                </div>

                                {/* The Pedestal & Product */}
                                <div className="w-64 md:w-80 mx-4 relative group/item cursor-pointer">
                                    {/* Product Image on Pedestal */}
                                    <div className="relative h-72 w-full rounded-t-full overflow-hidden border-4 border-luminous-gold/20 group-hover/item:border-luminous-gold transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)] group-hover/item:shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-black">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity duration-500 group-hover/item:scale-110"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                                        {/* Title Overlay */}
                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                            <h3 className="text-2xl font-display font-bold text-luminous-gold tracking-wider">{item.title}</h3>
                                        </div>
                                    </div>

                                    {/* The Stone Pedestal Base */}
                                    <div className="h-12 w-full bg-gradient-to-b from-luminous-gold to-luminous-maroon border-t-4 border-luminous-gold/40 transform perspective-[500px] rotateX(10deg) shadow-lg"></div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Track 2 (Duplicate for Seamless Loop) */}
                    <div className="flex items-end animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] will-change-transform" aria-hidden="true">
                        {templeCorridorItems.map((item, idx) => (
                            <Link to="/shop?category=Incense" key={`c2-${idx}`} className="flex items-end mx-4">
                                {/* The Pillar */}
                                <div className="w-16 md:w-24 h-96 bg-gradient-to-b from-[#4A0404] via-[#2D1810] to-black border-x-2 border-luminous-gold/30 relative flex flex-col items-center justify-start pt-4 shadow-2xl">
                                    <div className="w-12 h-12 border-2 border-luminous-gold/50 rounded-full flex items-center justify-center mb-4">
                                        <Sun className="text-luminous-gold animate-spin-slow" size={20} />
                                    </div>
                                    <div className="w-[1px] h-full bg-luminous-gold/20"></div>
                                </div>

                                {/* The Pedestal & Product */}
                                <div className="w-64 md:w-80 mx-4 relative group/item cursor-pointer">
                                    {/* Product Image on Pedestal */}
                                    <div className="relative h-72 w-full rounded-t-full overflow-hidden border-4 border-luminous-gold/20 group-hover/item:border-luminous-gold transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)] group-hover/item:shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-black">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity duration-500 group-hover/item:scale-110"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                                        {/* Title Overlay */}
                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                            <h3 className="text-2xl font-display font-bold text-luminous-gold tracking-wider">{item.title}</h3>
                                        </div>
                                    </div>

                                    {/* The Stone Pedestal Base */}
                                    <div className="h-12 w-full bg-gradient-to-b from-luminous-gold to-luminous-maroon border-t-4 border-luminous-gold/40 transform perspective-[500px] rotateX(10deg) shadow-lg"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12 relative z-20">
                    <Button to="/shop" variant="primary" className="bg-transparent border border-luminous-gold text-luminous-gold hover:bg-luminous-gold hover:text-luminous-maroon px-8 py-3 rounded-full transition-all duration-300">
                        Enter the Sanctum
                    </Button>
                </div>
            </section>

            {/* --- DIVINE ESSENTIALS --- */}
            <section
                className={`py-20 relative overflow-hidden ${divineEssentials.bgColor || 'bg-stone-900'} text-white`}
                style={divineEssentials.bgImage ? { backgroundImage: `url(${divineEssentials.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {divineEssentials.bgImage && <div className="absolute inset-0 bg-black/60 z-0"></div>}
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-luminous-gold mb-4">{divineEssentials.title || "Divine Essentials"}</h2>
                        <div className="w-24 h-1 bg-luminous-gold mx-auto"></div>
                        {divineEssentials.subtitle && <p className="text-gray-300 mt-4 text-lg">{divineEssentials.subtitle}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {
                            divineEssentialsItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-20px" }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <div className="h-full">
                                        <Link to={item.link} className="group block relative h-80 rounded-[2rem] overflow-hidden border border-luminous-gold/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-luminous-gold transition-all duration-500">
                                            {/* Image Container */}
                                            <div className="absolute inset-0">
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="w-12 h-1 bg-luminous-gold mb-4 w-0 group-hover:w-12 transition-all duration-500"></div>
                                                <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-luminous-gold transition-colors">{item.title}</h3>
                                                <p className="text-luminous-gold/80 text-sm font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div >

                    <div className="text-center mt-20">
                        <Button to="/shop" variant="primary" className="px-12 py-4 text-lg bg-luminous-gold text-luminous-maroon hover:bg-white hover:text-luminous-maroon shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-300 rounded-full font-bold tracking-wider">
                            Explore The Treasury
                        </Button>
                    </div>
                </div >
            </section >
        </div >
    );
};

export default Home;
