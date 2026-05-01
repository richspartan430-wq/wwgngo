const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, default: 'Admin' },
  role:         { type: String, enum: ['admin', 'editor'], default: 'admin' },
  createdAt:    { type: Date, default: Date.now }
});

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

module.exports = mongoose.model('User', userSchema);
