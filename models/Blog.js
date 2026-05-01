const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  excerpt:     { type: String, default: '', trim: true },
  coverImage:  { type: String, default: '' },   // URL or /assets/... path
  content:     { type: String, required: true },
  tags:        [{ type: String, lowercase: true, trim: true }],
  status:      { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

// Generate slug on save if missing, and auto-touch updatedAt.
blogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
blogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
