const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

// Hardcoded data from src/data/products.js (simplified for import)
const products = [
    {
        name: "Premium Brass Pooja Thali Set",
        price: 1299,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Complete 7-piece brass pooja thali set including diya, bell, and containers. Perfect for daily worship and festivals.",
        countInStock: 10,
        isBestSeller: true
    },
    {
        name: "Silver Plated Aarti Thali",
        price: 2499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Exquisite silver-plated thali with intricate floral engravings. Ideal for gifting and special occasions.",
        countInStock: 5,
        isBestSeller: true
    },
    {
        name: "Copper Pooja Thali",
        price: 899,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1632652578600-479963102219?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Traditional copper thali set known for its spiritual significance and durability.",
        countInStock: 15
    },
    {
        name: "Pure Brass Akhand Diya",
        price: 450,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1510597323438-5a33083b6487?q=80&w=800&auto=format&fit=crop",
        category: "Diyas",
        description: "Heavy brass Akhand Diya with glass cover for long-lasting flame protection.",
        countInStock: 20,
        isBestSeller: true
    },
    {
        name: "Mysore Sandalwood Incense Sticks",
        price: 250,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=800&auto=format&fit=crop",
        category: "Incense",
        description: "Authentic Mysore Sandalwood agarbatti for a divine and calming fragrance.",
        countInStock: 50,
        isBestSeller: true
    },
    {
        name: "Ganesha Brass Idol (6 inch)",
        price: 2100,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1567591414240-e136591d6140?q=80&w=800&auto=format&fit=crop",
        category: "Idols",
        description: "Solid brass Lord Ganesha idol, the remover of obstacles.",
        countInStock: 3,
        isBestSeller: true
    },
    {
        name: "Pure Cow Ghee (500ml)",
        price: 650,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop",
        category: "Essentials",
        description: "100% pure desi cow ghee for lighting lamps and havan.",
        countInStock: 25
    },
    {
        name: "Complete Havan Samagri Kit",
        price: 599,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1617353977838-e24226462806?q=80&w=800&auto=format&fit=crop",
        category: "Havan",
        description: "All-in-one kit containing wood, herbs, ghee, and samagri for havan.",
        countInStock: 10
    }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // Create Admin User
        const createdUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        const adminUser = createdUser._id;

        // Add admin user to each product
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
