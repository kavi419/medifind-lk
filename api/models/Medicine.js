const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Drops', 'Inhaler', 'Cream', 'Ointment', 'Other'],
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
