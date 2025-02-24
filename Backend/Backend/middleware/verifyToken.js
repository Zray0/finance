// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure User model exists and can be imported

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your actual secret key
        req.user = decoded; // Attach decoded user data to request object
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
