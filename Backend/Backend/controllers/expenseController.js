const Expense = require('../models/Expense');

// Controller function to fetch all expenses for a specific user
exports.getAllExpensesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch all expenses for the given userId
        const expenses = await Expense.find({ userId });

        // Respond with the fetched expenses
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
