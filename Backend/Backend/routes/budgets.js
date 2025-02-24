const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Budget = require('../models/Budget'); // Importing the Budget model
const { saveBudgets } = require('../controllers/budgetController');

// Middleware to authenticate user
const authenticateToken = require('../middleware/auth');

// Route to save budgets for a specific user
router.post('/:userId', authenticateToken, saveBudgets);

// Route to get budgets for a specific user
router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Fetch budgets from the database
        const budgets = await Budget.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!budgets) {
            return res.status(404).json({ message: 'Budgets not found for this user.' });
        }

        // Respond with the retrieved budgets
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
