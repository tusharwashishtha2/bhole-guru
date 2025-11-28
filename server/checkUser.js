const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'tusharwashishtha2@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User Found:`);
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`ID: ${user._id}`);

            if (user.role !== 'admin') {
                console.log('Role is NOT admin. Fixing...');
                user.role = 'admin';
                await user.save();
                console.log('User role updated to admin.');
            } else {
                console.log('User is already admin.');
            }
        } else {
            console.log(`User with email ${email} not found.`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
