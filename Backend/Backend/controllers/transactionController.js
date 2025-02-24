// controllers/transactionController.js
const axios = require("axios");
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const User = require('../models/User');

exports.getRecentTransactions = async (req, res) => {
    try {
        // Validate user ID
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const limit = parseInt(req.query.limit) || 5; // Default to 5 transactions
        const transactions = await Expense.find({ userId }).sort({ date: -1 }).limit(limit);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addTransaction = async (req, res) => {
    try {
        const { userId, amount, category, description, date } = req.body;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Fetch user's budget
        const userBudget = await Budget.findOne({ userId });
        if (!userBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // Create a new transaction
        const newTransaction = new Expense({
            userId,
            amount,
            category,
            description,
            date,
        });

        await newTransaction.save();

        // Calculate total spent
        const totalSpent = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const total = totalSpent.length > 0 ? totalSpent[0].total : 0;

        // If the budget is exceeded, send an alert via Zapier
        /*if (total > userBudget.limit) {
            await axios.post("YOUR_ZAPIER_WEBHOOK_URL", {
                email: userId, // Ensure user email is stored in Budget model
                message: `Alert! Your budget limit of $${userBudget.limit} has been exceeded. Total spent: $${total}.`,
            });
        }*/

        res.status(201).json({ message: "Transaction added successfully!", transaction: newTransaction });

    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


