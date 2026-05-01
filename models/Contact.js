const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 200 },
  email:     { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
  phone:     { type: String, default: '', trim: true, maxlength: 40 },
  subject:   { type: String, default: '', trim: true, maxlength: 200 },
  message:   { type: String, required: true, trim: true, maxlength: 5000 },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  read:      { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Contact', contactSchema);
