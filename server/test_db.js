require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log('Testing MongoDB Connection...');
console.log('URI:', MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:');
        console.error(err);
        process.exit(1);
    });
