// Seed 25 SEO blog posts into MongoDB. Idempotent — upserts by slug.
// Run locally: npm run seed-blogs
// Run on Heroku: heroku run -a wwf-ngo node scripts/seed-blogs.js
require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const posts = require('./blog-data');

(async () => {
  const { MONGODB_URI, ADMIN_EMAIL } = process.env;
  if (!MONGODB_URI) { console.error('Missing MONGODB_URI'); process.exit(1); }
  if (!ADMIN_EMAIL) { console.error('Missing ADMIN_EMAIL'); process.exit(1); }

  try {
    await mongoose.connect(MONGODB_URI);
    const author = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
    if (!author) {
      console.error(`Admin user not found for ${ADMIN_EMAIL}. Run "npm run create-admin" first.`);
      process.exit(1);
    }

    let created = 0, updated = 0;
    for (const p of posts) {
      const existing = await Blog.findOne({ slug: p.slug });
      if (existing) {
        Object.assign(existing, p, { author: author._id });
        if (p.status === 'published' && !existing.publishedAt) {
          existing.publishedAt = p.publishedAt || new Date();
        }
        await existing.save();
        updated++;
        console.log(`[updated] ${p.slug}`);
      } else {
        await Blog.create({
          ...p,
          author: author._id,
          publishedAt: p.status === 'published' ? (p.publishedAt || new Date()) : undefined
        });
        created++;
        console.log(`[created] ${p.slug}`);
      }
    }

    console.log(`\n[seed] created=${created} updated=${updated} total=${posts.length}`);
  } catch (err) {
    console.error('[error]', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
