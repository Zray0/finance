const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = decoded;  // Make sure the decoded token contains userId
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'Invalid token payload. Missing userId.' });
        }
        next();
    });
};

module.exports = authenticate;
