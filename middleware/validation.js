// middleware/validation.js
const { validationResult, body } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Google OAuth validation rules
const validateGoogleAuth = [
  body('idToken')
    .notEmpty()
    .withMessage('Google ID token is required')
    .isString()
    .withMessage('Google ID token must be a string'),
  validate
];

module.exports = {
  validate,
  validateGoogleAuth
};