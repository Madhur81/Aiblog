const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { authMiddleware, adminMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuthMiddleware, getPosts);
router.get('/:id', getPost);

// Protected routes (Admin only)
router.post('/', authMiddleware, adminMiddleware, createPost);
router.put('/:id', authMiddleware, adminMiddleware, updatePost);
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);

module.exports = router;
