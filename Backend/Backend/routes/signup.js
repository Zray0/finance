// routes/signup.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

const ZAPIER_WEBHOOK_URL ="https://hooks.zapier.com/hooks/catch/21783250/2gh9wft/"

router.post('/', async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ username, name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
        await axios.post(ZAPIER_WEBHOOK_URL, {
            useremail: email, // Ensure user.email exists
            subject: "WELCOME TO BUDGET TRACKER!!!",
            message: `THANK YOU FOR REGISTERING ON BUDGET TRACKER WEB APPLICATION`,
        }).then(() => {
            console.log("🚀 Webhook triggered successfully!");
        }).catch((err) => {
            console.error("❌ Error triggering Zapier webhook:", err);
        });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
