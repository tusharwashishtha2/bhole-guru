require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Content = require('./models/Content');

const seedContent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const aromaticBlissItems = [
            { title: 'Rose', color: '#FFB7B2' },
            { title: 'Jasmine', color: '#FFFFFF' },
            { title: 'Lavender', color: '#E6E6FA' },
            { title: 'Mogra', color: '#F0FFF0' },
            { title: 'Lotus', color: '#FFC0CB' },
            { title: 'Marigold', color: '#FFA500' },
            { title: 'Hibiscus', color: '#FF69B4' },
            { title: 'Champa', color: '#FFFACD' },
            { title: 'Sandalwood', color: '#D2B48C' },
            { title: 'Musk', color: '#8B4513' },
            { title: 'Patchouli', color: '#DEB887' },
            { title: 'Amber', color: '#FFBF00' },
            { title: 'Frankincense', color: '#F5DEB3' },
            { title: 'Myrrh', color: '#CD853F' },
            { title: 'Cedar', color: '#A0522D' },
            { title: 'Oudh', color: '#5D4037' }
        ];

        const templeCorridorItems = [
            { title: 'Sambrani', img: 'https://images.unsplash.com/photo-1615486368197-081e578ee90c?q=80&w=600&auto=format&fit=crop' },
            { title: 'Guggal', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop' },
            { title: 'Cow Dung', img: 'https://images.unsplash.com/photo-1618422386284-262225343735?q=80&w=600&auto=format&fit=crop' },
            { title: 'Loban', img: 'https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=600&auto=format&fit=crop' },
            { title: 'Chandan', img: 'https://images.unsplash.com/photo-1602526430780-782d6b17d382?q=80&w=600&auto=format&fit=crop' }
        ];

        let content = await Content.findOne();

        if (!content) {
            content = new Content({});
            console.log('Created new Content document');
        } else {
            console.log('Found existing Content document');
        }

        // Update Aromatic Bliss
        if (!content.aromaticBliss) content.aromaticBliss = {};
        content.aromaticBliss.items = aromaticBlissItems;
        console.log('Updated Aromatic Bliss items');

        // Update Temple Corridor
        if (!content.templeCorridor) content.templeCorridor = {};
        content.templeCorridor.items = templeCorridorItems;
        console.log('Updated Temple Corridor items');

        await content.save();
        console.log('Content saved successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding content:', error);
        process.exit(1);
    }
};

seedContent();
