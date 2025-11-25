import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState(() => {
        const savedReviews = localStorage.getItem('reviews');
        return savedReviews ? JSON.parse(savedReviews) : {};
    });

    useEffect(() => {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }, [reviews]);

    const addReview = (productId, review) => {
        setReviews(prev => {
            const productReviews = prev[productId] || [];
            return {
                ...prev,
                [productId]: [review, ...productReviews]
            };
        });
    };

    const getProductReviews = (productId) => {
        return reviews[productId] || [];
    };

    const getAverageRating = (productId) => {
        const productReviews = reviews[productId] || [];
        if (productReviews.length === 0) return 0;
        const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / productReviews.length).toFixed(1);
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
            {children}
        </ReviewContext.Provider>
    );
};
