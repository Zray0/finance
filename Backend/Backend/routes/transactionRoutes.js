// routes/transactionRoutes.js
const express = require('express');
const { addTransaction } = require('../controllers/transactionController');

const { getRecentTransactions } = require('../controllers/transactionController');
const authenticate = require('../middleware/auth'); // Ensure authentication is applied
const router = express.Router();
router.post("/add", addTransaction);
router.get('/:userId', authenticate, getRecentTransactions);

module.exports = router;
