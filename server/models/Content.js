const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
    heroSection: {
        title: { type: String, default: "Embrace the Divine Energy" },
        subtitle: { type: String, default: "Premium Pooja Essentials for Your Spiritual Journey" },
        ctaText: { type: String, default: "Shop Sacred Collection" },
        bgImage: { type: String, default: "https://images.unsplash.com/photo-1609818698346-8cb3be6e0826?q=80&w=2000&auto=format&fit=crop" }
    },
    sacredOfferings: [{
        id: { type: Number },
        title: { type: String },
        category: { type: String },
        img: { type: String }
    }],
    divineFavorites: {
        title: { type: String, default: "Divine Favorites" },
        subtitle: { type: String, default: "Most loved by our devotees" },
        bgImage: { type: String, default: "" },
        bgColor: { type: String, default: "" }
    },
    divineEssentials: {
        title: { type: String, default: "Divine Essentials" },
        subtitle: { type: String, default: "Curated for your daily worship" },
        bgImage: { type: String, default: "" },
        bgColor: { type: String, default: "" },
        items: [{
            id: { type: Number },
            title: { type: String },
            link: { type: String },
            img: { type: String },
            desc: { type: String }
        }]
    },
    categories: [{
        type: String
    }],
    aboutSection: {
        title: { type: String, default: "About Bhole Guru" },
        description: { type: String, default: "Your trusted source for authentic spiritual essentials." },
        image: { type: String, default: "" }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
