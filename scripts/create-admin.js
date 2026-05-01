// Create or update the admin user. Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from env.
// Run locally: npm run create-admin
// Run on Heroku: heroku run npm run create-admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!MONGODB_URI) { console.error('Missing MONGODB_URI'); process.exit(1); }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing ADMIN_EMAIL / ADMIN_PASSWORD in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const passwordHash = await User.hashPassword(ADMIN_PASSWORD);
    const existing = await User.findOne({ email });
    if (existing) {
      existing.passwordHash = passwordHash;
      existing.name = ADMIN_NAME || existing.name;
      existing.role = 'admin';
      await existing.save();
      console.log(`[ok] Updated admin: ${email}`);
    } else {
      await User.create({ email, passwordHash, name: ADMIN_NAME || 'Admin', role: 'admin' });
      console.log(`[ok] Created admin: ${email}`);
    }
  } catch (err) {
    console.error('[error]', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
