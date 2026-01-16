const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Simple validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create JWT Token
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET || 'secret_key_123', // Fallback for dev
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (err) {
        console.error('Register Route Error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message, stack: err.stack });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simple validation
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login Route Error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   GET /api/auth/user
// @desc    Get user data (from token)
// @access  Private (Needs middleware, but implementing basic check here for context restore)
router.get('/user', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
});

module.exports = router;
