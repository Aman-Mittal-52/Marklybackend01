// routes/upload.js
const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/image', authenticate, upload.single('file'), uploadImage);

module.exports = router;