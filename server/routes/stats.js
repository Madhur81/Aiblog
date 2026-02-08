const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

// Admin only - dashboard stats
router.get('/dashboard', authMiddleware, statsController.getDashboardStats);

module.exports = router;
