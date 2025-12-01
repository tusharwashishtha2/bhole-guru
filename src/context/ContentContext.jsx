import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://bhole-guru.onrender.com')) + '/api/content';

    // Default States (Placeholders while loading)
    const [heroSection, setHeroSection] = useState({
        title: "Embrace the Divine Energy",
        subtitle: "Premium Pooja Essentials for Your Spiritual Journey",
        ctaText: "Shop Sacred Collection",
        bgImage: "https://images.unsplash.com/photo-1609818698346-8cb3be6e0826?q=80&w=2000&auto=format&fit=crop"
    });

    const [sacredOfferings, setSacredOfferings] = useState([
        { title: 'Puja Thali', category: 'Puja Thali', img: 'https://images.unsplash.com/photo-1604663395726-027582522789?q=80&w=600&auto=format&fit=crop' },
        { title: 'Incense', category: 'Incense', img: 'https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=600&auto=format&fit=crop' },
        { title: 'Idols', category: 'Idols', img: 'https://images.unsplash.com/photo-1567591414240-e1363061199d?q=80&w=600&auto=format&fit=crop' },
        { title: 'Lamps', category: 'Lamps', img: 'https://images.unsplash.com/photo-1513628253939-010e64ac66cd?q=80&w=600&auto=format&fit=crop' }
    ]);
    const [divineFavorites, setDivineFavorites] = useState({
        title: "Divine Favorites",
        subtitle: "Most loved by our devotees"
    });
    const [divineEssentials, setDivineEssentials] = useState([
        { id: 1, title: 'Rudraksha Beads', desc: 'Sacred Energy', img: 'https://images.unsplash.com/photo-1610450949247-91f862a9b34f?q=80&w=600&auto=format&fit=crop', link: '/shop' },
        { id: 2, title: 'Copper Kalash', desc: 'Pure Water', img: 'https://images.unsplash.com/photo-1628842095268-33340052e540?q=80&w=600&auto=format&fit=crop', link: '/shop' },
        { id: 3, title: 'Conch Shell', desc: 'Divine Sound', img: 'https://images.unsplash.com/photo-1596558284897-6a42a0438128?q=80&w=600&auto=format&fit=crop', link: '/shop' }
    ]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data) {
                if (data.heroSection) setHeroSection(data.heroSection);
                if (Array.isArray(data.sacredOfferings)) setSacredOfferings(data.sacredOfferings);
                if (data.divineFavorites) setDivineFavorites(data.divineFavorites);
                if (Array.isArray(data.divineEssentials)) setDivineEssentials(data.divineEssentials);
                if (Array.isArray(data.categories)) setCategories(data.categories);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch content", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const updateContent = async (updatedSection) => {
        try {
            const token = localStorage.getItem('bhole_guru_token');
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedSection),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.heroSection) setHeroSection(data.heroSection);
                if (data.sacredOfferings) setSacredOfferings(data.sacredOfferings);
                if (data.divineFavorites) setDivineFavorites(data.divineFavorites);
                if (data.divineEssentials) setDivineEssentials(data.divineEssentials);
                if (data.categories) setCategories(data.categories);

                addToast('Content updated successfully', 'success');
            } else {
                addToast('Failed to update content', 'error');
            }
        } catch (error) {
            console.error("Error updating content:", error);
            addToast('Error updating content', 'error');
        }
    };

    const updateSacredOffering = (id, updatedFields) => {
        const updatedList = sacredOfferings.map(item =>
            item.id === id ? { ...item, ...updatedFields } : item
        );
        setSacredOfferings(updatedList); // Optimistic update
        updateContent({ sacredOfferings: updatedList });
    };

    const updateHeroSection = (updatedFields) => {
        const updatedHero = { ...heroSection, ...updatedFields };
        setHeroSection(updatedHero); // Optimistic update
        updateContent({ heroSection: updatedHero });
    };

    const updateDivineFavorites = (updatedFields) => {
        const updatedFavs = { ...divineFavorites, ...updatedFields };
        setDivineFavorites(updatedFavs); // Optimistic update
        updateContent({ divineFavorites: updatedFavs });
    };

    const updateDivineEssential = (id, updatedFields) => {
        const updatedList = divineEssentials.map(item =>
            item.id === id ? { ...item, ...updatedFields } : item
        );
        setDivineEssentials(updatedList); // Optimistic update
        updateContent({ divineEssentials: updatedList });
    };

    const addCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            const updatedList = [...categories, newCategory];
            setCategories(updatedList);
            updateContent({ categories: updatedList });
        }
    };

    const removeCategory = (categoryToRemove) => {
        const updatedList = categories.filter(c => c !== categoryToRemove);
        setCategories(updatedList);
        updateContent({ categories: updatedList });
    };

    return (
        <ContentContext.Provider value={{
            sacredOfferings, updateSacredOffering,
            heroSection, updateHeroSection,
            divineFavorites, updateDivineFavorites,
            divineEssentials, updateDivineEssential,
            categories, addCategory, removeCategory,
            loading
        }}>
            {children}
        </ContentContext.Provider>
    );
};
