import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, KeyRound, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, sendOtp, verifyOtp } = useAuth();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('details'); // 'details' or 'otp'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        otp: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await sendOtp(formData.phone);
            setStep('otp');
            addToast(`OTP sent to ${formData.phone}`, 'success');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const [loadingMessage, setLoadingMessage] = useState('');

    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            setLoadingMessage('Verifying OTP...');
            await verifyOtp(formData.otp);

            setLoadingMessage('Creating Account...');
            await signup({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            addToast('Account created successfully!', 'success');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-luminous-bg flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-luminous-gold/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-luminous-saffron/5 rounded-full mix-blend-multiply filter blur-[80px] opacity-50"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-luminous-gold/20 relative z-10">
                <div className="text-center">
                    <div className="w-16 h-16 bg-luminous-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-luminous-gold/30">
                        <Sparkles className="text-luminous-gold" size={28} />
                    </div>
                    <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === 'details' ? 'Join Bhole Guru for exclusive access' : 'Verify your email address'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={step === 'details' ? handleSendOtp : handleVerifyAndSignup}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 'details' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={20} />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-600">We've sent a verification code to <span className="font-bold">{formData.phone}</span></p>
                                <button type="button" onClick={() => setStep('details')} className="text-xs text-luminous-maroon hover:underline mt-1">Change Phone</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <KeyRound size={20} />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        value={formData.otp}
                                        onChange={handleChange}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luminous-gold/50 focus:border-luminous-gold transition-all bg-gray-50 text-gray-900 tracking-widest text-center font-bold text-lg"
                                        placeholder="• • • • • •"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg shadow-lg shadow-luminous-saffron/20 hover:shadow-xl hover:shadow-luminous-saffron/30 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (loadingMessage || 'Processing...') : (step === 'details' ? 'Send OTP' : 'Verify & Sign Up')}
                            {!isLoading && <ArrowRight size={20} className="ml-2" />}
                        </Button>
                    </div>
                </form>
                <div id="recaptcha-container"></div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-luminous-maroon hover:text-luminous-saffron transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
