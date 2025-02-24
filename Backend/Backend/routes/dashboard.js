const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth'); 
const router = express.Router();

router.get('/:userId', authenticateToken, getDashboardData);

module.exports = router;
