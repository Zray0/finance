const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('name income');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Updated response to include income
        res.json({ name: user.name, income: user.income });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// New function to update user income
exports.updateUserIncome = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { income } = req.body;

        if (income === undefined) {
            return res.status(400).json({ message: 'Income is required.' });
        }

        // Update income in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { income }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Income updated successfully.', income: updatedUser.income });
    } catch (error) {
        console.error('Error updating user income:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
