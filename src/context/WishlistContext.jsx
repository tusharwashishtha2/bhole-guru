import React, { createContext, useContext, useState, useEffect } from 'react';
// Context for managing user wishlist
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com') + '/api/users/wishlist';

    const getToken = () => localStorage.getItem('bhole_guru_token');

    const fetchWishlist = async () => {
        const token = getToken();
        if (!token) {
            // Fallback to local storage for guests
            const saved = localStorage.getItem('wishlist');
            if (saved) setWishlist(JSON.parse(saved));
            return;
        }

        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setWishlist(data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const addToWishlist = async (product) => {
        const token = getToken();
        if (!token) {
            // Guest logic
            const updated = [...wishlist, product];
            setWishlist(updated);
            localStorage.setItem('wishlist', JSON.stringify(updated));
            addToast(`Added ${product.name} to wishlist`, 'success');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id || product.id })
            });

            if (response.ok) {
                const updatedList = await response.json();
                setWishlist(updatedList);
                addToast(`Added ${product.name} to wishlist`, 'success');
            } else {
                addToast('Failed to add to wishlist', 'error');
            }
        } catch (error) {
            console.error("Error adding to wishlist", error);
            addToast('Failed to add to wishlist', 'error');
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = getToken();
        if (!token) {
            // Guest logic
            const updated = wishlist.filter(item => (item.id || item._id) !== productId);
            setWishlist(updated);
            localStorage.setItem('wishlist', JSON.stringify(updated));
            addToast('Removed from wishlist', 'info');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const updatedList = await response.json();
                setWishlist(updatedList);
                addToast('Removed from wishlist', 'info');
            }
        } catch (error) {
            console.error("Error removing from wishlist", error);
            addToast('Failed to remove from wishlist', 'error');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => (item._id || item.id) === productId);
    };

    const toggleWishlist = (product) => {
        const pId = product.id || product._id;
        if (isInWishlist(pId)) {
            removeFromWishlist(pId);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
