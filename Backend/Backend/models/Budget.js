const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    budgets: { type: Map, of: Number, default: {} },
});

module.exports = mongoose.model('Budget', BudgetSchema);
