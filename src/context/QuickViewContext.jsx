import React, { createContext, useContext, useState } from 'react';

const QuickViewContext = createContext();

export const useQuickView = () => useContext(QuickViewContext);

export const QuickViewProvider = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openQuickView = (product) => {
        setSelectedProduct(product);
        setIsOpen(true);
    };

    const closeQuickView = () => {
        setIsOpen(false);
        setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
    };

    return (
        <QuickViewContext.Provider value={{ selectedProduct, isOpen, openQuickView, closeQuickView }}>
            {children}
        </QuickViewContext.Provider>
    );
};
