const express = require('express'); 
const router = express.Router();
const User = require('../models/User'); // Assuming User model stores user data

// Route to fetch monthly income
router.get('/users/:userId/income', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return income if available
        if (user.income) {
            res.status(200).json({ income: user.income });
        } else {
            res.status(404).json({ message: 'Income not set for this user' });
        }
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
