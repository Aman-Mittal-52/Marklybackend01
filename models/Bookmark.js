// models/Bookmark.js
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Design', 'Business', 'Education', 'Entertainment', 'Health', 'Science', 'Sports', 'Travel', 'Food', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  metadata: {
    domain: String,
    favicon: String,
    ogImage: String,
    ogTitle: String,
    ogDescription: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
bookmarkSchema.index({ author: 1, createdAt: -1 });
bookmarkSchema.index({ category: 1, createdAt: -1 });
bookmarkSchema.index({ tags: 1 });
bookmarkSchema.index({ 'stats.likes': -1 });
bookmarkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema);