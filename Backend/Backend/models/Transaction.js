// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    amount: Number,
    category: String,
    description: String,
    isRecurring: Boolean,
});

module.exports = mongoose.model('Transaction', transactionSchema);
