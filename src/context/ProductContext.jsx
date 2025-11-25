import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { useToast } from './ToastContext';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });
    const { addToast } = useToast();

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (newProduct) => {
        const productWithId = { ...newProduct, id: Date.now(), rating: 0, reviews: 0 };
        setProducts(prev => [productWithId, ...prev]);
        addToast(`Product "${newProduct.name}" added successfully`, 'success');
    };

    const updateProduct = (id, updatedFields) => {
        setProducts(prev => prev.map(prod =>
            prod.id === id ? { ...prod, ...updatedFields } : prod
        ));
        addToast('Product updated successfully', 'success');
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(prod => prod.id !== id));
        addToast('Product deleted successfully', 'info');
    };

    const getProductById = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
            {children}
        </ProductContext.Provider>
    );
};
