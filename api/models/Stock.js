const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true,
    },
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there might be a User model later, or just store ID
    },
}, { timestamps: { createdAt: true, updatedAt: 'lastUpdated' } });

// Compound index to ensure one stock entry per medicine per pharmacy
stockSchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
