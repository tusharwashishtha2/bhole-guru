import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Users, Sparkles, Sun, Moon, Flower, ChevronDown } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-luminous-bg min-h-screen overflow-hidden">

            {/* --- HERO SECTION: THE VERTICAL SANCTUARY (Premium & Safe) --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-start pt-40 pb-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-luminous-gold/10 rounded-full blur-[120px] -z-10"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">

                    {/* 1. Typography (Safe Zone) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-16"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-luminous-gold/10 border border-luminous-gold/30 mb-8 backdrop-blur-sm">
                            <Sparkles size={14} className="text-luminous-gold" />
                            <span className="text-xs font-bold tracking-[0.2em] text-luminous-gold uppercase">Est. 2024 • Vedic Heritage</span>
                            <Sparkles size={14} className="text-luminous-gold" />
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                            Where Faith <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luminous-gold via-luminous-saffron to-luminous-gold italic font-serif">Finds a Home</span>
                        </h1>

                        <p className="text-lg md:text-xl text-luminous-text/80 max-w-2xl mx-auto leading-relaxed font-medium">
                            A sanctuary for the soul, bridging the gap between ancient vedic traditions and the modern spiritual seeker.
                        </p>
                    </motion.div>

                    {/* 2. Visuals: The Three Arches */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {[
                            { img: "https://images.unsplash.com/photo-1604916479528-725f30243744?q=80&w=600&auto=format&fit=crop", title: "Sacred Rituals", delay: 0 },
                            { img: "https://images.unsplash.com/photo-1582560475093-6f09a302501d?q=80&w=600&auto=format&fit=crop", title: "Divine Idols", delay: 0.1 },
                            { img: "https://images.unsplash.com/photo-1605634289890-50b38d72ac58?q=80&w=600&auto=format&fit=crop", title: "Pure Essence", delay: 0.2 }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + item.delay, duration: 0.6 }}
                                whileHover={{ y: -10 }}
                                className="group relative h-[400px] rounded-t-[10rem] rounded-b-3xl overflow-hidden border border-luminous-gold/20 shadow-2xl"
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-0 w-full text-center">
                                    <h3 className="text-2xl font-display font-bold text-luminous-gold mb-1">{item.title}</h3>
                                    <div className="w-12 h-0.5 bg-luminous-gold mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-16 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs font-bold tracking-[0.2em] text-luminous-text/60 uppercase">Explore Our Legacy</span>
                        <ChevronDown className="text-luminous-gold w-6 h-6 animate-bounce" />
                    </motion.div>

                </div>
            </section>

            {/* --- STORYTELLING SECTION --- */}
            <section className="py-24 relative">
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
            </section>

            {/* --- QUOTE PARALLAX SECTION --- */}
            <section className="relative py-32 bg-fixed bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518154334286-2b7f94f6b71b?q=80&w=1920&auto=format&fit=crop')" }}>
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
            </section>

            {/* --- VALUES GRID --- */}
            <section className="py-24 bg-white relative">
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
            </section>

        </div>
    );
};

export default About;
