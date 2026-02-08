const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/posts/:postId', commentController.getPostComments);
router.post('/posts/:postId', commentController.createComment);

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, commentController.getAllComments);
router.put('/admin/:id/approve', authMiddleware, adminMiddleware, commentController.approveComment);
router.put('/admin/:id/reject', authMiddleware, adminMiddleware, commentController.rejectComment);
router.delete('/admin/:id', authMiddleware, adminMiddleware, commentController.deleteComment);

module.exports = router;
