const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authMiddleware } = require('../middleware/auth');

// Public route - anyone can subscribe
router.post('/subscribe', subscriptionController.subscribe);
router.post('/unsubscribe', subscriptionController.unsubscribe);

// Admin only - view all subscriptions
router.get('/all', authMiddleware, subscriptionController.getAll);

module.exports = router;
