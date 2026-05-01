const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 200 },
  source:    { type: String, default: 'footer' },
  ipAddress: { type: String, default: '' },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
