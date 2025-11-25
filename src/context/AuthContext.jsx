import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(() => {
        // Check for saved user in localStorage on mount
        const savedUser = localStorage.getItem('bhole_guru_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Load registered users
        const savedUsers = localStorage.getItem('bhole_guru_registered_users');
        if (savedUsers) {
            setRegisteredUsers(JSON.parse(savedUsers));
        }

        setLoading(false);
    }, []);

    const login = (identifier, password) => {
        return new Promise((resolve, reject) => {
            // Check for Admin (Email only for admin for now, or could be phone too)
            if ((identifier === 'tusharwashishtha2@gmail.com' || identifier === '7000308463') && password === 'bholeguru@7000') {
                const adminUser = {
                    id: 'admin-001',
                    name: 'Tushar Washishtha',
                    email: 'tusharwashishtha2@gmail.com',
                    phone: '7000308463',
                    isAdmin: true
                };
                setUser(adminUser);
                localStorage.setItem('bhole_guru_user', JSON.stringify(adminUser));
                resolve(adminUser);
                return;
            }

            // Find user by Email OR Phone
            const foundUser = registeredUsers.find(u =>
                (u.email === identifier || u.phone === identifier) && u.password === password
            );

            if (foundUser) {
                setUser(foundUser);
                localStorage.setItem('bhole_guru_user', JSON.stringify(foundUser));
                resolve(foundUser);
            } else {
                // Check if user exists but wrong password
                const userExists = registeredUsers.find(u => u.email === identifier || u.phone === identifier);
                if (userExists) {
                    reject("Invalid password");
                } else {
                    reject("User not found. Please sign up.");
                }
            }
        });
    };

    const forgotPassword = (identifier) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = registeredUsers.find(u => u.email === identifier || u.phone === identifier) ||
                    (identifier === 'tusharwashishtha2@gmail.com' ? { email: identifier } : null);

                if (user) {
                    resolve(`Password reset link sent to ${user.email || identifier}`);
                } else {
                    reject("User not registered.");
                }
            }, 1500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bhole_guru_user');
    };

    const signup = (userData) => {
        return new Promise((resolve, reject) => {
            // Check for duplicate Email
            if (registeredUsers.find(u => u.email === userData.email)) {
                reject("User with this email already exists. Please login.");
                return;
            }
            // Check for duplicate Phone
            if (registeredUsers.find(u => u.phone === userData.phone)) {
                reject("User with this phone number already exists. Please login.");
                return;
            }

            const newUser = { ...userData, id: Date.now(), addresses: [] }; // Initialize with empty addresses
            const updatedUsers = [...registeredUsers, newUser];

            setRegisteredUsers(updatedUsers);
            localStorage.setItem('bhole_guru_registered_users', JSON.stringify(updatedUsers));

            // Auto login after signup
            setUser(newUser);
            localStorage.setItem('bhole_guru_user', JSON.stringify(newUser));
            resolve(newUser);
        });
    };

    const updateUserProfile = (updatedData) => {
        return new Promise((resolve, reject) => {
            // If email or phone is being changed, check for duplicates (excluding current user)
            if (updatedData.email && updatedData.email !== user.email) {
                if (registeredUsers.find(u => u.email === updatedData.email && u.id !== user.id)) {
                    reject("Email already in use by another account.");
                    return;
                }
            }
            if (updatedData.phone && updatedData.phone !== user.phone) {
                if (registeredUsers.find(u => u.phone === updatedData.phone && u.id !== user.id)) {
                    reject("Phone number already in use by another account.");
                    return;
                }
            }

            const updatedUser = { ...user, ...updatedData };

            // Update in registered users list
            const updatedRegisteredUsers = registeredUsers.map(u =>
                u.id === user.id ? updatedUser : u
            );

            setRegisteredUsers(updatedRegisteredUsers);
            localStorage.setItem('bhole_guru_registered_users', JSON.stringify(updatedRegisteredUsers));

            // Update current session
            setUser(updatedUser);
            localStorage.setItem('bhole_guru_user', JSON.stringify(updatedUser));

            resolve(updatedUser);
        });
    };

    const sendOtp = (email) => {
        return new Promise((resolve) => {
            // Simulate sending OTP
            console.log(`Sending OTP to ${email}`);
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    };

    const verifyOtp = (email, otp) => {
        return new Promise((resolve, reject) => {
            // Simulate verification (accept '123456' for testing)
            setTimeout(() => {
                if (otp === '123456') {
                    resolve(true);
                } else {
                    reject("Invalid OTP");
                }
            }, 1000);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, forgotPassword, loading, sendOtp, verifyOtp, updateUserProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
