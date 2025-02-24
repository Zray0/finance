//models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    isRecurring: { type: Boolean, default: false },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
