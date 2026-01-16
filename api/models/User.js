const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['pharmacy_owner', 'admin', 'user'],
        default: 'pharmacy_owner',
    },
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
