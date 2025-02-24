const axios = require("axios");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21783250/2g2lf2o/"; // Your Zapier Webhook URL

exports.getDashboardData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if userId is provided and a valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid user ID is required" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get total expenses for the user
        const totalExpensesResult = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" },
                },
            },
        ]);

        const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].totalExpenses : 0;
        /*const totalIncome = 50000; // Example income (replace with actual user income data)

        // Send webhook if total expenses exceed income
        if (totalExpenses >= totalIncome) {
            await axios.post(ZAPIER_WEBHOOK_URL, {
                email: userId, // Replace with actual user email
                subject: "🚨 Budget Alert: Expenses Reached Income!",
                message: "Your total expenses (₹${totalExpenses}) have reached or exceeded your income (₹${totalIncome}). Please review your budget.",
            });
        }*/

        // Send response with total expenses
        res.status(200).json({ totalExpenses, totalIncome });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error" });
    }
};
