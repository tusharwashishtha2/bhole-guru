import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/products';

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            // Map _id to id for frontend compatibility
            const mappedProducts = Array.isArray(data) ? data.map(product => ({
                ...product,
                id: product._id
            })) : [];
            setProducts(mappedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (newProduct) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct),
            });
            const data = await response.json();

            if (response.ok) {
                const newProduct = { ...data, id: data._id };
                setProducts(prev => [newProduct, ...prev]);
                addToast(`Product "${data.name}" added successfully`, 'success');
            } else {
                addToast(data.message || 'Failed to add product', 'error');
            }
        } catch (error) {
            console.error("Error adding product:", error);
            addToast('Error adding product', 'error');
        }
    };

    const updateProduct = async (id, updatedFields) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedFields),
            });
            const data = await response.json();

            if (response.ok) {
                const updatedProduct = { ...data, id: data._id };
                setProducts(prev => prev.map(prod =>
                    prod._id === id ? updatedProduct : prod
                ));
                addToast('Product updated successfully', 'success');
            } else {
                addToast(data.message || 'Failed to update product', 'error');
            }
        } catch (error) {
            console.error("Error updating product:", error);
            addToast('Error updating product', 'error');
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setProducts(prev => prev.filter(prod => prod._id !== id));
                addToast('Product deleted successfully', 'info');
            } else {
                addToast('Failed to delete product', 'error');
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            addToast('Error deleting product', 'error');
        }
    };

    const getProductById = (id) => {
        return products.find(p => p._id === id || p.id === id);
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById, loading }}>
            {children}
        </ProductContext.Provider>
    );
};
