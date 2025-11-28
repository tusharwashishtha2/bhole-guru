import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const { addToast } = useToast();
    const API_URL = (import.meta.env.VITE_API_URL || 'https://bhole-guru.onrender.com') + '/api/content';

    // Default States (Placeholders while loading)
    const [heroSection, setHeroSection] = useState({
        title: "Embrace the Divine Energy",
        subtitle: "Premium Pooja Essentials for Your Spiritual Journey",
        ctaText: "Shop Sacred Collection",
        bgImage: "https://images.unsplash.com/photo-1609818698346-8cb3be6e0826?q=80&w=2000&auto=format&fit=crop"
    });

    const [sacredOfferings, setSacredOfferings] = useState([]);
    const [divineFavorites, setDivineFavorites] = useState({
        title: "Divine Favorites",
        subtitle: "Most loved by our devotees"
    });
    const [divineEssentials, setDivineEssentials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data) {
                if (data.heroSection) setHeroSection(data.heroSection);
                if (data.sacredOfferings) setSacredOfferings(data.sacredOfferings);
                if (data.divineFavorites) setDivineFavorites(data.divineFavorites);
                if (data.divineEssentials) setDivineEssentials(data.divineEssentials);
                if (data.categories) setCategories(data.categories);
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
