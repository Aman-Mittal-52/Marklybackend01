// routes/auth.js
const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  googleAuth, 
  linkGoogleAccount, 
  unlinkGoogleAccount 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateGoogleAuth } = require('../middleware/validation');

const router = express.Router();

// Local authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

// Google OAuth routes
router.post('/google', validateGoogleAuth, googleAuth);
router.post('/google/link', authenticate, validateGoogleAuth, linkGoogleAccount);
router.delete('/google/unlink', authenticate, unlinkGoogleAccount);

module.exports = router;