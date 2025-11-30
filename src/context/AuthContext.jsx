import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/auth';

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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for Render cold start

            // Try actual API first
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

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
            if (error.name === 'AbortError') {
                throw new Error("Server took too long to respond. Please try again.");
            }
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

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
            if (error.name === 'AbortError') {
                throw new Error("Server took too long to respond. Please try again.");
            }
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bhole_guru_user');
        localStorage.removeItem('bhole_guru_token');
    };

    const forgotPassword = async (email) => {
        try {
            const response = await fetch(`${API_URL}/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            return data.data || 'Password reset link sent';
        } catch (error) {
            console.error("Forgot password failed:", error);
            throw error.message;
        }
    };



    const updateUserProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) throw new Error("Not authenticated");

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            setUser(data);
            localStorage.setItem('bhole_guru_user', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Update profile failed:", error);
            throw error;
        }
    };

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) return;

            const response = await fetch(`${API_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Preserve the token, just update user data
                const currentUser = JSON.parse(localStorage.getItem('bhole_guru_user') || '{}');
                const updatedUser = { ...currentUser, ...data };
                setUser(updatedUser);
                localStorage.setItem('bhole_guru_user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Failed to refresh user", error);
        }
    };

    const getAllUsers = async () => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) throw new Error("Not authenticated");

            const response = await fetch(`${API_URL.replace('/auth', '/users')}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
            return data;
        } catch (error) {
            console.error("Get users failed:", error);
            throw error;
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) throw new Error("Not authenticated");

            const response = await fetch(`${API_URL.replace('/auth', '/users')}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update user');
            return data;
        } catch (error) {
            console.error("Update user failed:", error);
            throw error;
        }
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            if (!token) throw new Error("Not authenticated");

            const response = await fetch(`${API_URL.replace('/auth', '/users')}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete user');
            return data;
        } catch (error) {
            console.error("Delete user failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, forgotPassword, loading, updateUserProfile, refreshUser, getAllUsers, updateUser, deleteUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
