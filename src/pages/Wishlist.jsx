import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ui/ProductCard';
import SectionHeading from '../components/ui/SectionHeading';
import EmptyState from '../components/ui/EmptyState';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-luminous-bg dark:bg-stone-950 transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <EmptyState
                        icon={Heart}
                        title="Your Wishlist is Empty"
                        description="Save your favorite divine items here to purchase them later."
                        actionLabel="Explore Collection"
                        actionLink="/shop"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-luminous-bg dark:bg-stone-950 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <SectionHeading title="My Wishlist" subtitle="Your saved divine treasures" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {Array.isArray(wishlist) && wishlist.map(product => (
                        <ProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
