import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Users, Sparkles, Sun, Moon, Flower, ChevronDown } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-luminous-bg min-h-screen overflow-hidden">

            {/* --- HERO SECTION: IMMERSIVE & MYSTICAL --- */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-40 pb-20">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1604916479528-725f30243744?q=80&w=1920&auto=format&fit=crop"
                        alt="Divine Atmosphere"
                        className="w-full h-full object-cover opacity-40 scale-110 animate-float-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-luminous-maroon/95 via-luminous-maroon/70 to-luminous-bg"></div>
                </div>

                {/* Floating Particles (CSS Animation) */}
                <div className="absolute inset-0 z-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-luminous-gold rounded-full animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-luminous-saffron rounded-full animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 tracking-wide drop-shadow-2xl">
                                Where Faith <br /> <span className="text-luminous-gold italic font-serif">Finds a Home</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-luminous-goldLight max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                                Bhole Guru is not just a store; it is a sanctuary for the soul. We bridge the gap between ancient vedic traditions and the modern spiritual seeker.
                            </p>

                            {/* Scroll Down Indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 1 }}
                                className="mt-12 flex flex-col items-center gap-2"
                            >
                                <span className="text-xs font-bold tracking-[0.2em] text-black uppercase opacity-80 drop-shadow-sm">Scroll to Explore</span>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
                                >
                                    <ChevronDown className="text-black w-6 h-6" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </section >



            {/* --- STORYTELLING SECTION --- */}
            < section className="py-24 relative" >
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-luminous-gold/10 rounded-full blur-3xl"></div>
                                <h2 className="text-4xl md:text-5xl font-display text-luminous-maroon mb-8 leading-tight">
                                    A Legacy of <span className="text-luminous-saffron">Faith</span> & <span className="text-luminous-saffron">Purity</span>
                                </h2>
                                <p className="text-lg text-luminous-text/70 mb-6 leading-relaxed">
                                    In the rush of modern life, the soul yearns for a moment of stillness—a connection to something greater. Bhole Guru was born from this timeless need: to bring the sanctity of the temple into the heart of your home.
                                </p>
                                <p className="text-lg text-luminous-text/70 mb-8 leading-relaxed">
                                    Our journey is rooted in the ancient wisdom of the Vedas, where every ritual is a bridge to the divine. We curate sacred essentials that are not merely products, but carriers of positive energy, crafted with devotion to elevate your spiritual practice.
                                </p>
                                <div className="flex gap-8">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-4xl font-display text-luminous-gold font-bold">10k+</span>
                                        <span className="text-sm uppercase tracking-widest text-luminous-text/60">Happy Devotees</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-4xl font-display text-luminous-gold font-bold">500+</span>
                                        <span className="text-sm uppercase tracking-widest text-luminous-text/60">Sacred Artifacts</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://images.unsplash.com/photo-1621847466078-25d38b30255b?q=80&w=400&auto=format&fit=crop" className="rounded-2xl shadow-lg mt-12" alt="Ritual" />
                                <img src="https://images.unsplash.com/photo-1567591414240-e136309583e8?q=80&w=400&auto=format&fit=crop" className="rounded-2xl shadow-lg" alt="Flowers" />
                            </div>
                            <div className="absolute inset-0 bg-luminous-gold/5 rounded-2xl -z-10 transform rotate-3 scale-105"></div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* --- QUOTE PARALLAX SECTION --- */}
            < section className="relative py-32 bg-fixed bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518154334286-2b7f94f6b71b?q=80&w=1920&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Sun className="text-luminous-gold mx-auto mb-8 animate-spin-slow opacity-80" size={64} />
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white leading-tight drop-shadow-2xl max-w-5xl mx-auto">
                            "True devotion is not just an act of offering, but a state of being where the soul meets the infinite."
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-luminous-gold to-transparent mx-auto mt-10"></div>
                    </motion.div>
                </div>
            </section >

            {/* --- VALUES GRID --- */}
            < section className="py-24 bg-white relative" >
                <div className="absolute top-0 right-0 w-64 h-64 bg-luminous-gold/5 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-luminous-saffron font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-display text-luminous-maroon mt-2">The Pillars of Bhole Guru</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Star size={32} />, title: "Authenticity", desc: "Sourced directly from skilled artisans who have preserved these crafts for generations." },
                            { icon: <Heart size={32} />, title: "Devotion", desc: "Every item is handled with care and respect, ensuring it carries positive vibrations." },
                            { icon: <Flower size={32} />, title: "Purity", desc: "As pure as your devotion. We ensure every element is natural and sacred." },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-luminous-bg p-10 rounded-[2rem] border border-luminous-gold/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-luminous-maroon mb-6 shadow-md group-hover:bg-luminous-maroon group-hover:text-white transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-luminous-maroon mb-4">{item.title}</h3>
                                <p className="text-luminous-text/70 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

        </div >
    );
};

export default About;
