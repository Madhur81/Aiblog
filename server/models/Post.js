const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: String,
  body: String, // HTML or Markdown
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [String],
  tags: [String],
  featureImageUrl: String,
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  },
  publishedAt: Date,
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
