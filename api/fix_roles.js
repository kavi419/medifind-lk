const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medifind');
        console.log('MongoDB Connected');

        // Find users with 'pharmacy_owner' role and update to 'owner'
        const ownerUpdate = await User.updateMany({ role: 'pharmacy_owner' }, { role: 'owner' });
        console.log(`Updated ${ownerUpdate.modifiedCount} users from pharmacy_owner to owner`);

        // Find Kasun (assuming name 'Kasun' or email from screenshot) and ensure he is 'user'
        // Screenshot shows email: kasun@gmail.com (implied from placeholder or context)
        // Let's list users first to be sure
        const users = await User.find({});
        console.log('Current Users:');
        users.forEach(u => console.log(`${u.name} (${u.email}) - ${u.role}`));

        // Heuristic: If name contains 'Kasun', set to 'user'
        const kasunUpdate = await User.updateMany({ name: { $regex: 'Kasun', $options: 'i' } }, { role: 'user' });
        console.log(`Updated ${kasunUpdate.modifiedCount} users named Kasun to role 'user'`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
