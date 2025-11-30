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
        let message = '';
        let type = 'success';

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                message = `Updated quantity for ${product.name}`;
                type = 'info';
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            message = `Added ${product.name} to cart`;
            return [...prevCart, { ...product, quantity }];
        });

        // We need to use a timeout or effect to show toast after render, 
        // but since we can't easily get the result of the state update here synchronously to know if it was an add or update 
        // without duplicating logic, we can just calculate the intention first.

        // Actually, better approach:
        // Check existence first using current state (which might be slightly stale in high freq updates but fine here)
        // OR just duplicate the check logic outside.

        // Let's do this:
        const isExisting = cart.some(item => item.id === product.id);
        if (isExisting) {
            addToast(`Updated quantity for ${product.name}`, 'info');
        } else {
            addToast(`Added ${product.name} to cart`, 'success');
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
