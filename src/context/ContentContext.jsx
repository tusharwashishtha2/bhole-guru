import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    // Initial State for Sacred Offerings (Carousel)
    // Initial State for Sacred Offerings (Carousel)
    const initialSacredOfferings = [
        { id: 1, title: 'Pooja Thali', category: 'Thali Sets', img: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=400&auto=format&fit=crop' },
        { id: 2, title: 'Divine Idols', category: 'Idols', img: 'https://images.unsplash.com/photo-1604916479528-725f30243744?q=80&w=400&auto=format&fit=crop' },
        { id: 3, title: 'Incense', category: 'Incense', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=400&auto=format&fit=crop' },
        { id: 4, title: 'Dhoop', category: 'Incense', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop' },
        { id: 5, title: 'Havan', category: 'Havan', img: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?q=80&w=400&auto=format&fit=crop' },
        { id: 6, title: 'Ganga Jal', category: 'Ganga Jal', img: 'https://images.unsplash.com/photo-1621831531491-49363c945a44?q=80&w=400&auto=format&fit=crop' },
        { id: 7, title: 'Bells', category: 'Pooja Essentials', img: 'https://images.unsplash.com/photo-1562619425-c307bb83bc42?q=80&w=400&auto=format&fit=crop' },
        { id: 8, title: 'Oils', category: 'Essentials', img: 'https://images.unsplash.com/photo-1615915468538-0fbd857888ca?q=80&w=400&auto=format&fit=crop' }
    ];

    const initialHeroSection = {
        title: "Embrace the Divine Energy",
        subtitle: "Premium Pooja Essentials for Your Spiritual Journey",
        ctaText: "Shop Sacred Collection",
        bgImage: "https://images.unsplash.com/photo-1609818698346-8cb3be6e0826?q=80&w=2000&auto=format&fit=crop"
    };

    const initialDivineFavorites = {
        title: "Divine Favorites",
        subtitle: "Most loved by our devotees"
    };

    const [sacredOfferings, setSacredOfferings] = useState(() => {
        try {
            const saved = localStorage.getItem('sacredOfferings');
            return saved ? JSON.parse(saved) : initialSacredOfferings;
        } catch (e) {
            console.error("Failed to parse sacredOfferings", e);
            return initialSacredOfferings;
        }
    });

    const [heroSection, setHeroSection] = useState(() => {
        try {
            const saved = localStorage.getItem('heroSection');
            return saved ? JSON.parse(saved) : initialHeroSection;
        } catch (e) {
            console.error("Failed to parse heroSection", e);
            return initialHeroSection;
        }
    });

    const [divineFavorites, setDivineFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('divineFavorites');
            return saved ? JSON.parse(saved) : initialDivineFavorites;
        } catch (e) {
            console.error("Failed to parse divineFavorites", e);
            return initialDivineFavorites;
        }
    });

    useEffect(() => {
        localStorage.setItem('sacredOfferings', JSON.stringify(sacredOfferings));
    }, [sacredOfferings]);

    useEffect(() => {
        localStorage.setItem('heroSection', JSON.stringify(heroSection));
    }, [heroSection]);

    useEffect(() => {
        localStorage.setItem('divineFavorites', JSON.stringify(divineFavorites));
    }, [divineFavorites]);

    const updateSacredOffering = (id, updatedFields) => {
        setSacredOfferings(prev => prev.map(item =>
            item.id === id ? { ...item, ...updatedFields } : item
        ));
    };

    const updateHeroSection = (updatedFields) => {
        setHeroSection(prev => ({ ...prev, ...updatedFields }));
    };

    const updateDivineFavorites = (updatedFields) => {
        setDivineFavorites(prev => ({ ...prev, ...updatedFields }));
    };

    const initialDivineEssentials = [
        { id: 1, title: 'God Statues', link: '/shop?category=Idols', img: 'https://images.unsplash.com/photo-1567591414240-e136599d7f33?q=80&w=600', desc: 'Murti Sthapana' },
        { id: 2, title: 'Hawan Kund', link: '/shop?category=Havan', img: 'https://images.unsplash.com/photo-1602524206684-fdf6393c7d89?q=80&w=600', desc: 'Sacred Fire' },
        { id: 3, title: 'Jap Mala', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1623935813721-f3f5d0131f35?q=80&w=600', desc: 'Mantra Chanting' },
        { id: 4, title: 'Kalawa', link: '/shop?category=Sacred Threads', img: 'https://images.unsplash.com/photo-1633809616843-0803153a7d27?q=80&w=600', desc: 'Raksha Sutra' },
        { id: 5, title: 'Janeu', link: '/shop?category=Sacred Threads', img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=600', desc: 'Yagnopavit' },
        { id: 6, title: 'Gomti Chakra', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=600', desc: 'Wealth & Prosperity' },
        { id: 7, title: 'Kodi', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1596305589440-2e180399a760?q=80&w=600', desc: 'Laxmi Kripa' },
        { id: 8, title: 'Hawan Samagri', link: '/shop?category=Havan', img: 'https://images.unsplash.com/photo-1602524206684-fdf6393c7d89?q=80&w=600', desc: 'Pure Herbs' },
        { id: 9, title: 'Pooja Cloth', link: '/shop?category=Vastras', img: 'https://images.unsplash.com/photo-1616628188550-808d82f5a32c?q=80&w=600', desc: 'Red, White, Yellow' },
        { id: 10, title: 'Attar', link: '/shop?category=Attar', img: 'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?q=80&w=600', desc: 'Natural Fragrance' },
        { id: 11, title: 'Gangajal', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1544123582-c6c747514309?q=80&w=600', desc: 'Holy Water' },
        { id: 12, title: 'Gau Mutra', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600', desc: 'Purification' },
        { id: 13, title: 'Chandan', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=600', desc: 'Tilak & Paste' },
        { id: 14, title: 'Kumkum & Haldi', link: '/shop?category=Pooja Essentials', img: 'https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=600', desc: 'Auspicious Colors' },
        { id: 15, title: 'Pure Ghee', link: '/shop?category=Havan', img: 'https://plus.unsplash.com/premium_photo-1664302152996-347e3667ef95?q=80&w=600', desc: 'Cow Ghee' },
        { id: 16, title: 'Loban & Guggal', link: '/shop?category=Incense', img: 'https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=600', desc: 'Energy Cleansing' },
    ];

    const [divineEssentials, setDivineEssentials] = useState(() => {
        try {
            const saved = localStorage.getItem('divineEssentials');
            return saved ? JSON.parse(saved) : initialDivineEssentials;
        } catch (e) {
            console.error("Failed to parse divineEssentials", e);
            return initialDivineEssentials;
        }
    });

    useEffect(() => {
        localStorage.setItem('divineEssentials', JSON.stringify(divineEssentials));
    }, [divineEssentials]);

    const updateDivineEssential = (id, updatedFields) => {
        setDivineEssentials(prev => prev.map(item =>
            item.id === id ? { ...item, ...updatedFields } : item
        ));
    };

    return (
        <ContentContext.Provider value={{
            sacredOfferings, updateSacredOffering,
            heroSection, updateHeroSection,
            divineFavorites, updateDivineFavorites,
            divineEssentials, updateDivineEssential
        }}>
            {children}
        </ContentContext.Provider>
    );
};
