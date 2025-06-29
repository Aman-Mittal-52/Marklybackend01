// controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { verifyGoogleToken } = require('../config/googleAuth');

const register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      displayName
    });

    await user.save();

    const token = generateToken({ userId: user._id });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({ userId: user._id });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google token
    const googleResult = await verifyGoogleToken(idToken);
    
    if (!googleResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token',
        error: googleResult.error
      });
    }

    const { googleId, email, name, picture, givenName, familyName, emailVerified } = googleResult.data;

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { googleId },
        { email }
      ]
    });

    if (user) {
      // Update Google ID if user exists but doesn't have it
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) {
          user.avatar = picture;
        }
        await user.save();
      }

      // Generate token
      const token = generateToken({ userId: user._id });

      return res.json({
        success: true,
        message: 'Google login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          isVerified: user.isVerified,
          authProvider: user.authProvider
        }
      });
    }

    // Create new user
    const displayName = name || `${givenName || ''} ${familyName || ''}`.trim();
    
    user = new User({
      email,
      googleId,
      displayName,
      avatar: picture || '',
      isVerified: emailVerified || false,
      authProvider: 'google'
    });

    await user.save();

    const token = generateToken({ userId: user._id });

    res.status(201).json({
      success: true,
      message: 'Google registration successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const linkGoogleAccount = async (req, res) => {
  try {
    const { idToken } = req.body;
    const userId = req.user.userId;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google token
    const googleResult = await verifyGoogleToken(idToken);
    
    if (!googleResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token',
        error: googleResult.error
      });
    }

    const { googleId, email, picture } = googleResult.data;

    // Check if Google account is already linked to another user
    const existingGoogleUser = await User.findOne({ googleId });
    if (existingGoogleUser && existingGoogleUser._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: 'This Google account is already linked to another user'
      });
    }

    // Check if email matches current user
    const currentUser = await User.findById(userId);
    if (currentUser.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Google account email must match your current email'
      });
    }

    // Link Google account
    currentUser.googleId = googleId;
    currentUser.authProvider = 'google';
    if (picture && !currentUser.avatar) {
      currentUser.avatar = picture;
    }
    
    await currentUser.save();

    res.json({
      success: true,
      message: 'Google account linked successfully',
      user: {
        id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        authProvider: currentUser.authProvider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const unlinkGoogleAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'No Google account linked'
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot unlink Google account. Please set a password first.'
      });
    }

    // Unlink Google account
    user.googleId = undefined;
    user.authProvider = 'local';
    
    await user.save();

    res.json({
      success: true,
      message: 'Google account unlinked successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  googleAuth,
  linkGoogleAccount,
  unlinkGoogleAccount
};