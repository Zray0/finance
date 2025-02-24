const express = require('express');
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/auth');
const { getAllExpensesForUser } = require('../controllers/expenseController');
const router = express.Router();

// Route to add a new expense
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing or invalid" });
        }

        const { date, amount, category, description, isRecurring } = req.body;

        // Validate required fields
        if (!date || !amount || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create and save the expense
        const expense = new Expense({
            userId: userId,
            date,
            amount,
            category,
            description,
            isRecurring,
        });

        await expense.save();

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).json({ message: 'Error adding expense', error: err.message });
    }
});

// Route to fetch all expenses for a user
router.get('/:userId', authenticateToken, getAllExpensesForUser);

// Route to update an existing expense
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, amount, category, description, isRecurring } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({ message: 'Expense ID is required' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { date, amount, category, description, isRecurring },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ message: 'Error updating expense', error: err.message });
    }
});

// Route to delete an expense by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully', deletedExpense });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ message: 'Error deleting expense', error: err.message });
    }
});

module.exports = router;
