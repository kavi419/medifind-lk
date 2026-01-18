const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Stock = require('../models/Stock');
const Pharmacy = require('../models/Pharmacy');

// @route   GET /api/search
// @desc    Search for medicines and find availability in pharmacies is Sri Lanka
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ msg: 'Please provide a search query' });
        }

        console.log(`Searching for medicine: ${q}`);

        // 1. Find Medicines matching the query (case-insensitive partial match)
        // Use a secure regex
        const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regex = new RegExp(escapeRegex(q), 'gi');

        const medicines = await Medicine.find({ name: regex });

        if (medicines.length === 0) {
            return res.json({ msg: 'No medicines found', results: [] });
        }

        const medicineIds = medicines.map(med => med._id);

        // 2. Find Stocks for these medicines that are IN STOCK
        // We want to populate the pharmacy details
        const stocks = await Stock.find({
            medicineId: { $in: medicineIds },
            inStock: true
        })
            .populate('pharmacyId')
            .populate('medicineId')
            .populate('lastUpdatedBy', 'name');

        // 3. Format the response
        // Group by Pharmacy or just return list?
        // Let's return a list where each item is { medicine, pharmacy, stock }
        // Filter out any stocks where pharmacyId might be null (integrity check)
        const results = stocks
            .filter(stock => stock.pharmacyId)
            .map(stock => ({
                id: stock._id,
                pharmacy: {
                    id: stock.pharmacyId._id,
                    name: stock.pharmacyId.name,
                    location: stock.pharmacyId.location,
                    latitude: stock.pharmacyId.latitude,
                    longitude: stock.pharmacyId.longitude,
                    contact: stock.pharmacyId.contactNumber,
                    verified: stock.pharmacyId.isVerified
                },
                medicine: {
                    id: stock.medicineId._id,
                    name: stock.medicineId.name,
                    brand: stock.medicineId.brand,
                    category: stock.medicineId.category,
                    description: stock.medicineId.description
                },
                price: stock.price,
                quantity: stock.quantity,
                inStock: stock.inStock,
                updatedAt: stock.updatedAt,
                // Waze for Medicines Fields
                lastUpdatedBy: stock.lastUpdatedBy, // now populated with name
                lastUpdatedAt: stock.lastUpdatedAt,
                status: stock.status,
                verificationCount: stock.verificationCount
            }));

        res.json({
            count: results.length,
            results
        });

    } catch (err) {
        console.error('Search API Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
