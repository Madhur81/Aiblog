const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// All AI routes require authentication
router.post('/generate-title', authMiddleware, aiController.generateTitle);
router.post('/generate-content', authMiddleware, aiController.generateContent);
router.post('/improve-content', authMiddleware, aiController.improveContent);
router.post('/suggest-category', authMiddleware, aiController.suggestCategory);

module.exports = router;
