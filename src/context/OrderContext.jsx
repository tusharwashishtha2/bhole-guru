import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    // Load orders from localStorage or start empty
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    const [currentOrderId, setCurrentOrderId] = useState(() => {
        return localStorage.getItem('currentOrderId') || null;
    });

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        if (currentOrderId) {
            localStorage.setItem('currentOrderId', currentOrderId);
        }
    }, [currentOrderId]);

    // Add a new order
    const addOrder = (orderData, userEmail) => {
        const newOrder = {
            id: `BG-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString(),
            status: 'Order Placed', // Initial status
            userEmail: userEmail || 'guest', // Associate with user
            timeline: [
                { status: 'Order Placed', time: new Date().toISOString() }
            ],
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        setCurrentOrderId(newOrder.id);
        return newOrder.id;
    };

    // Get orders for specific user
    const getUserOrders = (userEmail) => {
        if (!userEmail) return [];
        return orders.filter(o => o.userEmail === userEmail);
    };

    // Update order status
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                // Don't add if status is same
                if (order.status === newStatus) return order;

                return {
                    ...order,
                    status: newStatus,
                    timeline: [...(order.timeline || []), { status: newStatus, time: new Date().toISOString() }]
                };
            }
            return order;
        }));
    };

    // Delete order
    const deleteOrder = (orderId) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (currentOrderId === orderId) {
            setCurrentOrderId(null);
            localStorage.removeItem('currentOrderId');
        }
    };

    // Get specific order
    const getOrder = (orderId) => {
        return orders.find(o => o.id === orderId);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, getOrder, getUserOrders, currentOrderId, setCurrentOrderId }}>
            {children}
        </OrderContext.Provider>
    );
};
