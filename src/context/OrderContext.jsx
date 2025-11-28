import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders';

    const getToken = () => localStorage.getItem('bhole_guru_token');

    const fetchMyOrders = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/myorders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all orders for Admin
    const fetchAllOrders = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch all orders", error);
        }
    };

    useEffect(() => {
        // Initial fetch handled by components or explicit calls
        setLoading(false);
    }, []);

    const addOrder = async (orderData) => {
        const token = getToken();
        if (!token) {
            addToast('Please login to place an order', 'error');
            return null;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });
            const data = await response.json();

            if (response.ok) {
                setOrders(prev => [data.order || data, ...prev]);
                setCurrentOrderId(data.order?._id || data._id);
                // Don't show success toast yet for Razorpay, let the component handle it
                // addToast('Order placed successfully!', 'success'); 
                return data;
            } else {
                addToast(data.message || 'Failed to place order', 'error');
                return null;
            }
        } catch (error) {
            console.error("Error placing order:", error);
            addToast('Error placing order', 'error');
            return null;
        }
    };

    const updateOrderStatus = async (orderId, newStatus, trackingData = {}) => {
        const token = getToken();
        try {
            const response = await fetch(`${API_URL}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, ...trackingData }),
            });
            const data = await response.json();

            if (response.ok) {
                setOrders(prev => prev.map(order =>
                    order._id === orderId ? data : order
                ));
                addToast('Order status updated', 'success');
            } else {
                addToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            addToast('Error updating status', 'error');
        }
    };

    const getOrder = (orderId) => {
        return orders.find(o => o._id === orderId || o.id === orderId);
    };

    return (
        <OrderContext.Provider value={{
            orders,
            addOrder,
            updateOrderStatus,
            cancelOrder,
            getOrder,
            fetchMyOrders,
            fetchAllOrders,
            currentOrderId,
            setCurrentOrderId,
            loading
        }}>
            {children}
        </OrderContext.Provider>
    );
};
