// models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookmarks: [{
    bookmark: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmark'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    bookmarkCount: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

collectionSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Collection', collectionSchema);