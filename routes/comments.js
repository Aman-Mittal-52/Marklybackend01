// routes/comments.js
const express = require('express');
const { addComment, getCommentsForBookmark } = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, addComment);
router.get('/:bookmarkId', getCommentsForBookmark);

module.exports = router;