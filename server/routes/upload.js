const express = require('express');
const router = express.Router();
const { getAuth, uploadImage } = require('../controllers/uploadController');

router.get('/auth', getAuth);
router.post('/image', uploadImage);

module.exports = router;
