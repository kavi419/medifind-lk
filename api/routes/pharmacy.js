const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Stock = require('../models/Stock');

// @route   POST /api/pharmacy
// @desc    Register a new pharmacy
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, address, contactNumber, city, latitude, longitude } = req.body;

        if (!name || !address || !contactNumber || !latitude || !longitude) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        const newPharmacy = new Pharmacy({
            name,
            location: { address: `${address}, ${city || ''}` }, // Keep legacy structure minimal
            latitude,
            longitude,
            contactNumber
        });

        const pharmacy = await newPharmacy.save();

        // Link pharmacy to user
        await User.findByIdAndUpdate(req.user.id, { pharmacyId: pharmacy._id });

        res.json(pharmacy);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/pharmacy/update
// @desc    Update pharmacy details
// @access  Private
router.put('/update', auth, async (req, res) => {
    try {
        const { name, address, contactNumber, latitude, longitude } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.pharmacyId) {
            return res.status(404).json({ msg: 'No pharmacy linked' });
        }

        let pharmacy = await Pharmacy.findById(user.pharmacyId);

        if (!pharmacy) {
            return res.status(404).json({ msg: 'Pharmacy not found' });
        }

        // Update fields
        if (name) pharmacy.name = name;
        if (contactNumber) pharmacy.contactNumber = contactNumber;
        if (latitude) pharmacy.latitude = latitude;
        if (longitude) pharmacy.longitude = longitude;

        // Update address in legacy location object if provided
        if (address) {
            pharmacy.location.address = address;
        }

        await pharmacy.save();
        res.json(pharmacy);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/pharmacy/all
// @desc    Get all registered pharmacies
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find()
            .select('name contactNumber location latitude longitude isVerified')
            .sort({ name: 1 });
        res.json(pharmacies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/pharmacy/mine
// @desc    Get current user's pharmacy
// @access  Private
router.get('/mine', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.pharmacyId) {
            return res.status(404).json({ msg: 'No pharmacy found for this user' });
        }

        const pharmacy = await Pharmacy.findById(user.pharmacyId);
        res.json(pharmacy);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/pharmacy/medicines/all
// @desc    Get all available medicines
// @access  Private
router.get('/medicines/all', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });
        res.json(medicines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/pharmacy/stock
// @desc    Get current user's pharmacy stock
// @access  Private
router.get('/stock', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.pharmacyId) {
            return res.status(404).json({ msg: 'No pharmacy linked' });
        }

        const stock = await Stock.find({ pharmacyId: user.pharmacyId })
            .populate('medicineId', 'name brand category')
            .sort({ updatedAt: -1 });

        res.json(stock);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/pharmacy/stock
// @desc    Add or update stock
// @access  Private
router.post('/stock', auth, async (req, res) => {
    try {
        const { medicineId, price, quantity, inStock } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.pharmacyId) {
            return res.status(400).json({ msg: 'No pharmacy linked to user' });
        }

        let stock = await Stock.findOne({
            pharmacyId: user.pharmacyId,
            medicineId
        });

        if (stock) {
            stock.price = price !== undefined ? price : stock.price;
            stock.quantity = quantity !== undefined ? quantity : stock.quantity;
            stock.inStock = inStock !== undefined ? inStock : stock.inStock;
            await stock.save();
        } else {
            stock = new Stock({
                pharmacyId: user.pharmacyId,
                medicineId,
                price,
                quantity,
                inStock: inStock !== undefined ? inStock : true
            });
            await stock.save();
        }

        const populatedStock = await Stock.findById(stock._id)
            .populate('medicineId', 'name brand category');

        res.json(populatedStock);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/pharmacy/stock/:id
// @desc    Update stock item
// @access  Private
router.put('/stock/:id', auth, async (req, res) => {
    try {
        const { price, quantity, inStock } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.pharmacyId) {
            return res.status(404).json({ msg: 'No pharmacy linked' });
        }

        let stock = await Stock.findOne({ _id: req.params.id, pharmacyId: user.pharmacyId });

        if (!stock) {
            return res.status(404).json({ msg: 'Stock item not found' });
        }

        stock.price = price !== undefined ? price : stock.price;
        stock.quantity = quantity !== undefined ? quantity : stock.quantity;
        stock.inStock = inStock !== undefined ? inStock : stock.inStock;

        await stock.save();

        const populatedStock = await Stock.findById(stock._id)
            .populate('medicineId', 'name brand category');

        res.json(populatedStock);

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Stock item not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE /api/pharmacy/stock/:id
// @desc    Delete stock item
// @access  Private
router.delete('/stock/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.pharmacyId) {
            return res.status(404).json({ msg: 'No pharmacy linked' });
        }

        const stock = await Stock.findOneAndDelete({
            _id: req.params.id,
            pharmacyId: user.pharmacyId
        });

        if (!stock) {
            return res.status(404).json({ msg: 'Stock item not found' });
        }

        res.json({ msg: 'Stock item removed' });

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Stock item not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/pharmacy/verify-stock
// @desc    Community verify stock (Waze for Medicines)
// @access  Private (User only)
router.post('/verify-stock', auth, async (req, res) => {
    try {
        const { pharmacyId, medicineId, status } = req.body;
        const userId = req.user.id;

        // Find the stock item
        let stock = await Stock.findOne({ pharmacyId, medicineId });

        if (!stock) {
            return res.status(404).json({ msg: 'Stock info not found' });
        }

        // Update Stock Logic
        stock.status = status; // 'In Stock' or 'Out of Stock'
        stock.lastUpdatedBy = userId;
        stock.lastUpdatedAt = new Date();
        stock.verificationCount += 1;

        // Also sync the main inStock boolean for compatibility
        stock.inStock = status === 'In Stock';
        if (status === 'Out of Stock') {
            // Optional: maybe create an alert or not affect qty? 
            // Letting quantity stay is safer, but owner should zero it. 
            // We just mark the reported status.
        }

        await stock.save();

        // Increment User Points
        const user = await User.findById(userId);
        if (user) {
            user.points += 10;
            await user.save();
        }

        res.json({
            msg: 'Verification successful',
            points: user.points,
            stock: stock
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
