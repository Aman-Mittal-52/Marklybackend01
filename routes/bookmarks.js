// routes/bookmarks.js
const express = require('express');
const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  likeBookmark
} = require('../controllers/bookmarkController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBookmarks);
router.get('/:id', getBookmarkById);
router.post('/', authenticate, createBookmark);
router.post('/:id/like', authenticate, likeBookmark);

module.exports = router;