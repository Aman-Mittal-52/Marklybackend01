// services/searchService.js
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');

const searchBookmarksAndUsers = async (query, options = {}) => {
  const { page = 1, limit = 20, type = 'all' } = options;
  const skip = (page - 1) * limit;

  const results = {};

  if (type === 'all' || type === 'bookmarks') {
    results.bookmarks = await Bookmark.find({
      $text: { $search: query },
      isActive: true,
      isPrivate: false
    })
      .populate('author', 'username displayName avatar isVerified')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ score: { $meta: 'textScore' } });
  }

  if (type === 'all' || type === 'users') {
    results.users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
      .select('username displayName avatar isVerified stats')
      .skip(skip)
      .limit(parseInt(limit));
  }

  return results;
};

module.exports = {
  searchBookmarksAndUsers
};