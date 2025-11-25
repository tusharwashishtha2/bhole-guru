import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="bg-royal-maroon min-h-screen pb-20 pt-24">
            {/* Header */}
            <div className="relative py-16 mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-royal-gold/5 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-royal-gold via-yellow-200 to-royal-gold drop-shadow-lg"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-royal-ivory/80 text-lg font-light tracking-wide max-w-2xl mx-auto"
                    >
                        We'd love to hear from you. Whether you have a question about our products, need help with an order, or just want to say hello.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-royal-gold mb-2">Get in Touch</h2>
                        <p className="text-royal-ivory/60 mb-8">We are here for you</p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="bg-royal-gold/10 p-3 rounded-full text-royal-gold group-hover:bg-royal-gold group-hover:text-royal-maroon transition-all duration-300">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-royal-ivory">Phone</h3>
                                    <p className="text-royal-ivory/60 mb-1">Call us for any queries</p>
                                    <a href="tel:7000308463" className="text-lg font-bold text-royal-gold hover:text-white transition-colors">
                                        +91 70003 08463
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-royal-gold/10 p-3 rounded-full text-royal-gold group-hover:bg-royal-gold group-hover:text-royal-maroon transition-all duration-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-royal-ivory">Email</h3>
                                    <p className="text-royal-ivory/60 mb-1">Send us your feedback</p>
                                    <a href="mailto:tusharwashishtha2@gmail.com" className="text-lg font-bold text-royal-gold hover:text-white transition-colors">
                                        tusharwashishtha2@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-royal-gold/10 p-3 rounded-full text-royal-gold group-hover:bg-royal-gold group-hover:text-royal-maroon transition-all duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-royal-ivory">Visit Us</h3>
                                    <p className="text-royal-ivory/60">
                                        Indore, Madhya Pradesh<br />
                                        India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-royal-gold/10 p-3 rounded-full text-royal-gold group-hover:bg-royal-gold group-hover:text-royal-maroon transition-all duration-300">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-royal-ivory">Business Hours</h3>
                                    <p className="text-royal-ivory/60">
                                        Mon - Sat: 9:00 AM - 9:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-royal-maroon/50 border border-royal-gold/10 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
                        <h3 className="text-2xl font-serif font-bold mb-6 text-royal-gold">Send Message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-royal-ivory/80 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-royal-maroon/30 border border-royal-gold/20 text-royal-ivory focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all placeholder-royal-ivory/30" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-royal-ivory/80 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-royal-maroon/30 border border-royal-gold/20 text-royal-ivory focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all placeholder-royal-ivory/30" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-royal-ivory/80 mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg bg-royal-maroon/30 border border-royal-gold/20 text-royal-ivory focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all placeholder-royal-ivory/30" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-royal-ivory/80 mb-2">Message</label>
                                <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-royal-maroon/30 border border-royal-gold/20 text-royal-ivory focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all placeholder-royal-ivory/30" placeholder="How can we help you?"></textarea>
                            </div>

                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
