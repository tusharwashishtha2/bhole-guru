import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth';

    useEffect(() => {
        // Check for saved user and token in localStorage on mount
        const savedUser = localStorage.getItem('bhole_guru_user');
        const token = localStorage.getItem('bhole_guru_token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Try actual API first
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save to local storage
            localStorage.setItem('bhole_guru_user', JSON.stringify(data));
            localStorage.setItem('bhole_guru_token', data.token);

            setUser(data);
            return data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Save to local storage
            localStorage.setItem('bhole_guru_user', JSON.stringify(data));
            localStorage.setItem('bhole_guru_token', data.token);

            setUser(data);
            return data;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bhole_guru_user');
        localStorage.removeItem('bhole_guru_token');
    };

    const forgotPassword = (email) => {
        // Placeholder for future backend implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`Password reset link sent to ${email}`);
            }, 1000);
        });
    };

    const sendOtp = async (email) => {
        // Simulate sending OTP
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const verifyOtp = async (email, otp) => {
        // Simulate verifying OTP
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '123456') {
                    resolve(true);
                } else {
                    reject(new Error('Invalid OTP. Please enter 123456'));
                }
            }, 1000);
        });
    };

    const updateUserProfile = async (updatedData) => {
        // Placeholder: In a real app, you would call a PUT /api/users/profile endpoint
        // For now, we'll just update the local state to keep the UI responsive
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('bhole_guru_user', JSON.stringify(updatedUser));
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, forgotPassword, sendOtp, verifyOtp, loading, updateUserProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
