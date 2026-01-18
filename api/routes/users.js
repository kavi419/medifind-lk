const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/leaderboard
// @desc    Get top 10 contributors
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .sort({ points: -1 })
            .limit(10)
            .select('name points');

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
