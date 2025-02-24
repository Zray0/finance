const express = require('express'); 
const { getUserInfo, updateUserIncome } = require('../controllers/userController');
const User = require('../models/User'); // Import User model for setting income
const authenticateToken = require('../middleware/auth'); // Ensure authentication middleware is used
const router = express.Router();

router.get('/:userId', getUserInfo);
router.post('/:userId/income', authenticateToken, updateUserIncome);

// Route to set the user's monthly income (if required as an additional route)
router.post('/set-income', authenticateToken, async (req, res) => {
    const { userId, income } = req.body;

    if (!userId || income === undefined) {
        return res.status(400).json({ message: 'User ID and income are required.' });
    }

    try {
        // Update the user's income
        const updatedUser = await User.findByIdAndUpdate(userId, { income }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Income set successfully.', income: updatedUser.income });
    } catch (error) {
        console.error('Error setting income:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
