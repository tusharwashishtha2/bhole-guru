const Content = require('../models/Content');

// Default Data (Fallback if DB is empty)
const defaultContent = {
    categories: [
        'Thali Sets', 'Diyas', 'Incense', 'Attar', 'Havan', 'Idols',
        'Sacred Threads', 'Vastras', 'Pooja Essentials', 'Ganga Jal'
    ],
    sacredOfferings: [
        { id: 1, title: 'Pooja Thali', category: 'Thali Sets', img: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=400&auto=format&fit=crop' },
        { id: 2, title: 'Divine Idols', category: 'Idols', img: 'https://images.unsplash.com/photo-1604916479528-725f30243744?q=80&w=400&auto=format&fit=crop' },
        { id: 3, title: 'Incense', category: 'Incense', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=400&auto=format&fit=crop' },
        { id: 4, title: 'Dhoop', category: 'Incense', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop' },
        { id: 5, title: 'Havan', category: 'Havan', img: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?q=80&w=400&auto=format&fit=crop' },
        { id: 6, title: 'Ganga Jal', category: 'Ganga Jal', img: 'https://images.unsplash.com/photo-1621831531491-49363c945a44?q=80&w=400&auto=format&fit=crop' },
        { id: 7, title: 'Bells', category: 'Pooja Essentials', img: 'https://images.unsplash.com/photo-1562619425-c307bb83bc42?q=80&w=400&auto=format&fit=crop' },
        { id: 8, title: 'Oils', category: 'Essentials', img: 'https://images.unsplash.com/photo-1615915468538-0fbd857888ca?q=80&w=400&auto=format&fit=crop' }
    ],
    divineEssentials: {
        title: "Divine Essentials",
        subtitle: "Curated for your daily worship",
        items: [
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
        ]
    },
    shubhAarambh: [
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' },
        { text: 'SHUBH AARAMBH • PURE & DIVINE • BHOLE GURU' }
    ],
    aromaticBliss: {
        title: "Aromatic Bliss",
        subtitle: "Immerse yourself in a symphony of divine fragrances.",
        items: [
            { name: 'Rose', color: '#FFB7B2', img: '' },
            { name: 'Jasmine', color: '#FFFFFF', img: '' },
            { name: 'Lavender', color: '#E6E6FA', img: '' },
            { name: 'Mogra', color: '#F0FFF0', img: '' },
            { name: 'Lotus', color: '#FFC0CB', img: '' },
            { name: 'Marigold', color: '#FFA500', img: '' },
            { name: 'Hibiscus', color: '#FF69B4', img: '' },
            { name: 'Champa', color: '#FFFACD', img: '' }
        ]
    },
    templeCorridor: {
        title: "The Temple Corridor",
        subtitle: "Walk through the path of purity. Ancient dhoop recipes for your sacred space.",
        items: [
            { title: 'Sambrani', img: 'https://images.unsplash.com/photo-1615486368197-081e578ee90c?q=80&w=600&auto=format&fit=crop' },
            { title: 'Guggal', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop' },
            { title: 'Cow Dung', img: 'https://images.unsplash.com/photo-1618422386284-262225343735?q=80&w=600&auto=format&fit=crop' },
            { title: 'Loban', img: 'https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=600&auto=format&fit=crop' },
            { title: 'Chandan', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=600&auto=format&fit=crop' }
        ]
    },
    royalTreasury: {
        title: "Royal Treasury",
        subtitle: "Premium selections for your home temple."
    }
};

// @desc    Get content (create if not exists)
// @route   GET /api/content
// @access  Public
exports.getContent = async (req, res) => {
    try {
        let content = await Content.findOne();
        if (!content) {
            content = await Content.create(defaultContent);
        } else {
            // Ensure categories exist
            if (!content.categories || content.categories.length === 0) {
                content.categories = defaultContent.categories;
                await content.save();
            }
            // Ensure other sections exist (optional robustness)
            if (!content.heroSection) content.heroSection = defaultContent.heroSection;
            if (!content.sacredOfferings || content.sacredOfferings.length === 0) content.sacredOfferings = defaultContent.sacredOfferings;
            if (!content.divineEssentials || content.divineEssentials.length === 0) content.divineEssentials = defaultContent.divineEssentials;

            if (content.isModified()) {
                await content.save();
            }
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update content
// @route   PUT /api/content
// @access  Private/Admin
exports.updateContent = async (req, res) => {
    try {
        let content = await Content.findOne();
        if (!content) {
            content = await Content.create(req.body);
        } else {
            // Update fields
            if (req.body.heroSection) content.heroSection = { ...content.heroSection, ...req.body.heroSection };
            if (req.body.sacredOfferings) content.sacredOfferings = req.body.sacredOfferings;
            if (req.body.divineFavorites) content.divineFavorites = { ...content.divineFavorites, ...req.body.divineFavorites };
            if (req.body.divineEssentials) content.divineEssentials = req.body.divineEssentials;
            if (req.body.categories) content.categories = req.body.categories;
            if (req.body.aboutSection) content.aboutSection = { ...content.aboutSection, ...req.body.aboutSection };
            if (req.body.shubhAarambh) content.shubhAarambh = req.body.shubhAarambh;
            if (req.body.aromaticBliss) content.aromaticBliss = req.body.aromaticBliss;
            if (req.body.templeCorridor) content.templeCorridor = req.body.templeCorridor;
            if (req.body.royalTreasury) content.royalTreasury = { ...content.royalTreasury, ...req.body.royalTreasury };

            await content.save();
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
