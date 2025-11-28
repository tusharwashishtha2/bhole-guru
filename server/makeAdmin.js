const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Update ALL users to be admin (since there is only 1, the owner)
        // Or specifically Tushar
        const result = await User.updateMany(
            {}, // Filter: all users
            { $set: { role: 'admin' } }
        );

        console.log(`Updated ${result.modifiedCount} users to admin role.`);

        const users = await User.find({});
        users.forEach(user => {
            console.log(`User: ${user.name}, Role: ${user.role}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
