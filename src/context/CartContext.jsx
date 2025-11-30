import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const { addToast } = useToast();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        // Normalize product data to ensure consistent ID and Image
        const cartItem = {
            ...product,
            id: product.id || product._id,
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
            quantity
        };

        let message = '';
        let type = 'success';

        setCart(prevCart => {
            const existingItem = prevCart.find(item => (item.id || item._id) === cartItem.id);
            if (existingItem) {
                message = `Updated quantity for ${cartItem.name}`;
                type = 'info';
                return prevCart.map(item =>
                    (item.id || item._id) === cartItem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            message = `Added ${cartItem.name} to cart`;
            return [...prevCart, cartItem];
        });

        const isExisting = cart.some(item => (item.id || item._id) === cartItem.id);
        if (isExisting) {
            addToast(`Updated quantity for ${cartItem.name}`, 'info');
        } else {
            addToast(`Added ${cartItem.name} to cart`, 'success');
        }
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => {
            const itemId = item.id || item._id;
            const targetId = productId;
            return String(itemId) !== String(targetId);
        }));
        addToast('Item removed from cart', 'info');
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item => {
                const itemId = item.id || item._id;
                const targetId = productId;
                return String(itemId) === String(targetId) ? { ...item, quantity: newQuantity } : item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
