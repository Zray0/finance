// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    income: { type: Number, default: 0 },
    budgets: {
        type: Map,
        of: Number,
        default: {},
    },
});

// Ensure the password is hashed before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
