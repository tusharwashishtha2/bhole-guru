import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/wishlist';

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
                body: JSON.stringify({ productId: product.id || product._id })
            });

            if (response.ok) {
                // Optimistic update or refetch
                // For simplicity, we'll refetch or manually update state if backend returns full list
                const updatedList = await response.json();
                setWishlist(updatedList); // Assuming backend returns populated list
                addToast(`Added ${product.name} to wishlist`, 'success');
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

    const toggleWishlist = (product) => {
        const pId = product.id || product._id;
        if (isInWishlist(pId)) {
            removeFromWishlist(pId);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => (item.id || item._id) === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
