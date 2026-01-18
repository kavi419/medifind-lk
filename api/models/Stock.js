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
        ref: 'User', // Maintained by Pharmacy Owner
    },
    // Community Verification Fields "Waze for Medicines"
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    verificationCount: {
        type: Number,
        default: 0
    }
}, { timestamps: { createdAt: true, updatedAt: 'lastUpdated' } });

// Compound index to ensure one stock entry per medicine per pharmacy
stockSchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
