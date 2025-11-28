import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com') + '/api/auth';

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



    const [confirmationResult, setConfirmationResult] = useState(null);

    const setupRecaptcha = (elementId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    };

    const sendOtp = async (phoneNumber) => {
        try {
            // Ensure phone number has country code if not present
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

            // We need a DOM element for Recaptcha. 
            // Ideally, this should be passed or we assume a specific ID exists.
            // Let's assume the calling component sets up a div with id 'recaptcha-container'
            setupRecaptcha('recaptcha-container');

            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            return confirmation;
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw error;
        }
    };

    const verifyOtp = async (otp) => {
        if (!confirmationResult) {
            throw new Error("No OTP request found. Please request OTP first.");
        }
        try {
            const result = await confirmationResult.confirm(otp);
            return result.user;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error;
        }
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
