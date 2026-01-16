const express = require('express');
const app = express();
const cors = require('cors');
// Load env vars from root if running locally from api folder, or default
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectToDB = require('./utils/db');

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MediFind LK API is running');
});

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

console.log('Registering /api/search routes...');
app.use('/api/search', require('./routes/search'));
console.log('Registering /api/auth routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Registering /api/pharmacy routes...');
app.use('/api/pharmacy', require('./routes/pharmacy'));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
    next();
});

// For Vercel, we need to export the app
// Local development support
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));
}

module.exports = app;
