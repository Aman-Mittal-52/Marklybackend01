// controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');

const createBookmark = async (req, res) => {
  try {
    const { title, description, url, category, tags, isPrivate } = req.body;

    const bookmark = new Bookmark({
      title,
      description,
      url,
      category,
      tags: tags || [],
      isPrivate: isPrivate || false,
      author: req.user.userId
    });

    await bookmark.save();
    await bookmark.populate('author', 'username displayName avatar isVerified');

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.bookmarks': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort = 'newest' } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, isPrivate: false };
    if (category) query.category = category;

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { 'stats.likes': -1 };
        break;
      case 'trending':
        sortOption = { 'stats.views': -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const bookmarks = await Bookmark.find(query)
      .populate('author', 'username displayName avatar isVerified stats.followers')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bookmark.countDocuments(query);

    res.json({
      success: true,
      bookmarks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
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

const getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)
      .populate('author', 'username displayName avatar isVerified bio stats');

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await Bookmark.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.views': 1 }
    });

    res.json({
      success: true,
      bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const likeBookmark = async (req, res) => {
  try {
    const bookmarkId = req.params.id;

    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await Bookmark.findByIdAndUpdate(bookmarkId, {
      $inc: { 'stats.likes': 1 }
    });

    res.json({
      success: true,
      message: 'Bookmark liked successfully'
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
  createBookmark,
  getBookmarks,
  getBookmarkById,
  likeBookmark
};