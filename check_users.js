const mongoose = require('mongoose');
const User = require('./api/models/User');
require('dotenv').config({ path: './api/.env' });

// Standalone connection since we can't easily import the db config
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medifind');
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`);
        });
        console.log('------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
