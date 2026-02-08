const express = require('express');
const router = express.Router();
const { login, registerAdmin, updateProfile, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', registerAdmin); // Ideally protect this or remove in prod
router.put('/profile', authMiddleware, updateProfile);
router.get('/me', authMiddleware, getMe);

module.exports = router;
