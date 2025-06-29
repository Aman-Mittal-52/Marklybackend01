// controllers/commentController.js
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');

const addComment = async (req, res) => {
  try {
    const { content, bookmarkId, parentComment } = req.body;

    const comment = new Comment({
      content,
      bookmark: bookmarkId,
      author: req.user.userId,
      parentComment: parentComment || null
    });

    await comment.save();

    // Increment comment count on bookmark
    await Bookmark.findByIdAndUpdate(bookmarkId, {
      $inc: { 'stats.comments': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getCommentsForBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;

    const comments = await Comment.find({ bookmark: bookmarkId, isActive: true })
      .populate('author', 'username displayName avatar isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
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
  addComment,
  getCommentsForBookmark
};