const mongoose = require('mongoose');
const Budget = require('../models/Budget'); // Budget model
// Controller to save budgets for a user
exports.saveBudgets = async (req, res) => {
    const { userId } = req.params;
    const { budgets } = req.body;

    console.log('Received userId:', userId);
    console.log('Received budgets:', budgets);

    try {
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Validate input
        if (!budgets || typeof budgets !== 'object') {
            return res.status(400).json({ message: 'Invalid budgets data' });
        }

        // Upsert budgets (create or update)
        const updatedBudgets = await Budget.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) }, // Corrected usage
            { userId: new mongoose.Types.ObjectId(userId), budgets }, // Corrected usage
            { new: true, upsert: true }            
        );

        console.log('Updated Budgets:', updatedBudgets);
        res.status(200).json(updatedBudgets);
    } catch (error) {
        console.error('Error saving budgets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to fetch budgets for a user (if needed separately)
exports.getBudgets = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        const budgets = await Budget.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!budgets) {
            return res.status(404).json({ message: 'No budgets found for this user' });
        }
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
