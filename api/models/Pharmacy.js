const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        address: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        }
    },
    contactNumber: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
