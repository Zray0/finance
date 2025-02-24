const mongoose = require('mongoose');
const axios = require('axios');
const Expense = require('../models/Expense');
const User = require('../models/User');

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21783250/2g2lf2o/";

exports.getOverviewData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch total expenses for the user
        const expenses = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: '$userId',
                    totalExpenses: { $sum: '$amount' }
                }
            }
        ]);

        const totalExpenses = expenses[0]?.totalExpenses || 0;

        // Fetch user's income and email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalIncome = user.income || 0;
        const userEmail = user.email || null;
        const balance = totalIncome - totalExpenses;

        // Send JSON response
        res.json({ totalExpenses, totalIncome, balance });

        // Trigger Zapier webhook if expenses exceed or equal income
        if (totalIncome > 0 && totalExpenses >= totalIncome && userEmail) {
            await axios.post(ZAPIER_WEBHOOK_URL, {
                email: user.email, // Ensure user.email exists
                subject: "🚨 Budget Alert!",
                message: `Your total expenses (₹${totalExpenses}) have reached or exceeded your income (₹${totalIncome}).`,
            }).then(() => {
                console.log("🚀 Webhook triggered successfully!");
            }).catch((err) => {
                console.error("❌ Error triggering Zapier webhook:", err);
            });
        }

    } catch (error) {
        console.error('❌ Error fetching overview data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
