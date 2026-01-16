const mongoose = require('mongoose');

const connectToDB = async () => {
    // Check if we have a connection to the database or if it's currently connecting or disconnecting
    if (mongoose.connections[0].readyState) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

module.exports = connectToDB;
