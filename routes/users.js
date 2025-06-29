// routes/users.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getPublicProfile, updateProfile } = require('../controllers/userController');

const router = express.Router();

// Public profile by username
router.get('/:username', getPublicProfile);

// Update own profile
router.put('/update', authenticate, updateProfile);

module.exports = router;