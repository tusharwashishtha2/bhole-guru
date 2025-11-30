import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, forgotPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState({ type: '', message: '' });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetStatus({ type: 'error', message: 'Please enter your email address.' });
            return;
        }

        setIsLoading(true);
        setResetStatus({ type: '', message: '' });

        try {
            const message = await forgotPassword(resetEmail);
            setResetStatus({ type: 'success', message });
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetStatus({ type: '', message: '' });
                setResetEmail('');
            }, 3000);
        } catch (err) {
            setResetStatus({ type: 'error', message: err });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luminous-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-luminous-gold/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-luminous-saffron/5 rounded-full mix-blend-multiply filter blur-[80px] opacity-50"></div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => setShowForgotPassword(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-2 text-center text-gray-900 font-serif">Reset Password</h3>
                        <p className="text-gray-500 text-center mb-6 text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {resetStatus.message && (
                            <div className={`mb-4 px-4 py-2 rounded-lg text-sm text-center ${resetStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {resetStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <Button className="w-full mb-3" disabled={isLoading}>
                                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(false)}
                                className="w-full text-gray-500 text-sm hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-luminous-gold/20 relative z-10">
                <div className="text-center">
                    <div className="w-16 h-16 bg-luminous-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-luminous-gold/30">
                        <User className="text-luminous-maroon" size={28} />
                    </div>
                    <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to access your account
                    </p>

                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                    placeholder="Enter your email or phone"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm font-medium text-luminous-maroon hover:text-luminous-saffron transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-luminous-maroon focus:ring-luminous-maroon border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg shadow-lg shadow-luminous-saffron/20 hover:shadow-xl hover:shadow-luminous-saffron/30 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={20} className="ml-2" />}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-luminous-maroon hover:text-luminous-saffron transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
