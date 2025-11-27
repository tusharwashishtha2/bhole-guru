require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    // Thali Sets
    {
        name: "Premium Brass Pooja Thali Set",
        price: 1299,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Complete 7-piece brass pooja thali set including diya, bell, and containers. Perfect for daily worship and festivals.",
        images: ["https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Silver Plated Aarti Thali",
        price: 2499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Exquisite silver-plated thali with intricate floral engravings. Ideal for gifting and special occasions.",
        images: ["https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Copper Pooja Thali",
        price: 899,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1632652578600-479963102219?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Traditional copper thali set known for its spiritual significance and durability.",
        images: ["https://images.unsplash.com/photo-1632652578600-479963102219?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Mini Travel Pooja Kit",
        price: 499,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1675808572664-6f17b3955937?q=80&w=800&auto=format&fit=crop",
        category: "Thali Sets",
        description: "Compact pooja kit for devotees on the go. Includes miniature essentials.",
        images: ["https://images.unsplash.com/photo-1675808572664-6f17b3955937?q=80&w=800&auto=format&fit=crop"]
    },

    // Diyas & Lamps
    {
        name: "Pure Brass Akhand Diya",
        price: 450,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1510597323438-5a33083b6487?q=80&w=800&auto=format&fit=crop",
        category: "Diyas",
        description: "Heavy brass Akhand Diya with glass cover for long-lasting flame protection.",
        images: ["https://images.unsplash.com/photo-1510597323438-5a33083b6487?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Clay Diya Set (Pack of 12)",
        price: 199,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1572508589584-94d778209083?q=80&w=800&auto=format&fit=crop",
        category: "Diyas",
        description: "Eco-friendly handmade clay diyas for Diwali and daily pooja.",
        images: ["https://images.unsplash.com/photo-1572508589584-94d778209083?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Lotus Shape Brass Diya",
        price: 699,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542653970-453897b28196?q=80&w=800&auto=format&fit=crop",
        category: "Diyas",
        description: "Beautiful lotus-shaped brass diya that adds elegance to your altar.",
        images: ["https://images.unsplash.com/photo-1542653970-453897b28196?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Hanging Brass Oil Lamp",
        price: 1599,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=800&auto=format&fit=crop",
        category: "Diyas",
        description: "Traditional hanging oil lamp with chain, perfect for temple or home entrance.",
        images: ["https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=800&auto=format&fit=crop"]
    },

    // Incense & Fragrance
    {
        name: "Mysore Sandalwood Incense Sticks",
        price: 250,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=800&auto=format&fit=crop",
        category: "Incense",
        description: "Authentic Mysore Sandalwood agarbatti for a divine and calming fragrance.",
        images: ["https://images.unsplash.com/photo-1602607202643-92236a53285a?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Natural Sambrani Dhoop Cups",
        price: 180,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1615486368197-081e578ee90c?q=80&w=800&auto=format&fit=crop",
        category: "Incense",
        description: "Charcoal-free Sambrani cups for purifying the environment.",
        images: ["https://images.unsplash.com/photo-1615486368197-081e578ee90c?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Rose & Jasmine Cone Pack",
        price: 150,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1598628461950-2a626e987b42?q=80&w=800&auto=format&fit=crop",
        category: "Incense",
        description: "Assorted pack of floral incense cones for a refreshing aroma.",
        images: ["https://images.unsplash.com/photo-1598628461950-2a626e987b42?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Brass Incense Holder",
        price: 399,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1517856497829-3047e3fffae1?q=80&w=800&auto=format&fit=crop",
        category: "Incense",
        description: "Intricately carved brass holder for agarbatti and dhoop.",
        images: ["https://images.unsplash.com/photo-1517856497829-3047e3fffae1?q=80&w=800&auto=format&fit=crop"]
    },

    // Idols & Murtis
    {
        name: "Ganesha Brass Idol (6 inch)",
        price: 2100,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1567591414240-e136591d6140?q=80&w=800&auto=format&fit=crop",
        category: "Idols",
        description: "Solid brass Lord Ganesha idol, the remover of obstacles.",
        images: ["https://images.unsplash.com/photo-1567591414240-e136591d6140?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Marble Dust Laxmi Statue",
        price: 1800,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1604906853020-4118d75443d4?q=80&w=800&auto=format&fit=crop",
        category: "Idols",
        description: "Beautifully hand-painted marble dust Goddess Laxmi idol.",
        images: ["https://images.unsplash.com/photo-1604906853020-4118d75443d4?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Shiva Lingam Stone",
        price: 550,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1623951522536-12735687cc99?q=80&w=800&auto=format&fit=crop",
        category: "Idols",
        description: "Natural Narmadeshwar Shiva Lingam with brass yoni base.",
        images: ["https://images.unsplash.com/photo-1623951522536-12735687cc99?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Hanuman Bajrangbali Idol",
        price: 1200,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?q=80&w=800&auto=format&fit=crop",
        category: "Idols",
        description: "Powerful posture Hanuman idol made of resin.",
        images: ["https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?q=80&w=800&auto=format&fit=crop"]
    },

    // Pooja Essentials
    {
        name: "Pure Cow Ghee (500ml)",
        price: 650,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "100% pure desi cow ghee for lighting lamps and havan.",
        images: ["https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Gangajal (1 Litre)",
        price: 150,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1621831531491-49363c945a44?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "Pure holy water from the Ganges, bottled at Haridwar.",
        images: ["https://images.unsplash.com/photo-1621831531491-49363c945a44?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Kumkum & Turmeric Set",
        price: 120,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "Organic Kumkum and Haldi powder for tilak and rituals.",
        images: ["https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Sacred Mauli Thread (Pack of 5)",
        price: 99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1628846033497-528b59527830?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "Red and yellow sacred thread (Kalava) for wrist protection.",
        images: ["https://images.unsplash.com/photo-1628846033497-528b59527830?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Camphor (Kapoor) Tablets",
        price: 200,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1603296666274-795625974863?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "Pure refined camphor tablets for aarti.",
        images: ["https://images.unsplash.com/photo-1603296666274-795625974863?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Cotton Wicks (Gol Batti)",
        price: 80,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1606293926249-ed22e446d476?q=80&w=800&auto=format&fit=crop",
        category: "Pooja Kits",
        description: "Hand-rolled round cotton wicks for diyas.",
        images: ["https://images.unsplash.com/photo-1606293926249-ed22e446d476?q=80&w=800&auto=format&fit=crop"]
    },

    // Decor
    {
        name: "Toran for Door Entrance",
        price: 450,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1634916804462-4333257050b6?q=80&w=800&auto=format&fit=crop",
        category: "Decor",
        description: "Traditional bead and flower toran to welcome prosperity.",
        images: ["https://images.unsplash.com/photo-1634916804462-4333257050b6?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Red Velvet Pooja Aasan",
        price: 299,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1616693950367-3d02f548828d?q=80&w=800&auto=format&fit=crop",
        category: "Decor",
        description: "Soft velvet cloth with golden border for placing idols.",
        images: ["https://images.unsplash.com/photo-1616693950367-3d02f548828d?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Brass Bell (Ghanti)",
        price: 350,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1623691948758-31086e8d433e?q=80&w=800&auto=format&fit=crop",
        category: "Decor",
        description: "Classic brass hand bell with clear, resonant sound.",
        images: ["https://images.unsplash.com/photo-1623691948758-31086e8d433e?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Rangoli Color Kit",
        price: 250,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1603901028229-262225343735?q=80&w=800&auto=format&fit=crop",
        category: "Decor",
        description: "Vibrant rangoli colors set of 12 bottles.",
        images: ["https://images.unsplash.com/photo-1603901028229-262225343735?q=80&w=800&auto=format&fit=crop"]
    },

    // Havan Samagri
    {
        name: "Complete Havan Samagri Kit",
        price: 599,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1617353977838-e24226462806?q=80&w=800&auto=format&fit=crop",
        category: "Havan Samagri",
        description: "All-in-one kit containing wood, herbs, ghee, and samagri for havan.",
        images: ["https://images.unsplash.com/photo-1617353977838-e24226462806?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Mango Wood (Aam Ki Lakdi)",
        price: 150,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1523990903620-748822734516?q=80&w=800&auto=format&fit=crop",
        category: "Havan Samagri",
        description: "Dried mango wood sticks essential for holy fire rituals.",
        images: ["https://images.unsplash.com/photo-1523990903620-748822734516?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Cow Dung Cakes (Uple)",
        price: 120,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1618422386284-262225343735?q=80&w=800&auto=format&fit=crop",
        category: "Havan Samagri",
        description: "Pure dried cow dung cakes for purification rituals.",
        images: ["https://images.unsplash.com/photo-1618422386284-262225343735?q=80&w=800&auto=format&fit=crop"]
    },
    {
        name: "Navgrah Samidha Sticks",
        price: 180,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=800&auto=format&fit=crop",
        category: "Havan Samagri",
        description: "Set of 9 types of wood sticks for Navgrah Shanti Havan.",
        images: ["https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=800&auto=format&fit=crop"]
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            await Product.deleteMany();
            console.log('Products cleared');
            await Product.insertMany(products);
            console.log('Products imported!');
            process.exit();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
