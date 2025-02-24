// routes/overviewRoutes.js
const express = require('express');
const { getOverviewData } = require('../controllers/overviewController');
const router = express.Router();

router.get('/:userId', getOverviewData);

module.exports = router;
