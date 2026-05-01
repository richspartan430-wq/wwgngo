const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET /blog — listing
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const perPage = 9;
    const tag = (req.query.tag || '').trim().toLowerCase();

    const query = { status: 'published' };
    if (tag) query.tags = tag;

    const [posts, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean(),
      Blog.countDocuments(query)
    ]);

    res.render('blog/index', {
      title: 'Blog | Waste Pickers Welfare Foundation',
      description: 'Stories, impact reports, and news from Waste Pickers Welfare Foundation — India.',
      posts,
      page,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      activeTag: tag
    });
  } catch (err) { next(err); }
});

// GET /blog/:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, status: 'published' }).lean();
    if (!post) return res.status(404).render('blog/not-found', { title: 'Post not found' });

    const related = await Blog.find({
      status: 'published',
      _id: { $ne: post._id },
      tags: { $in: post.tags || [] }
    }).sort({ publishedAt: -1 }).limit(3).lean();

    res.render('blog/post', {
      title: `${post.title} | Waste Pickers Welfare Foundation`,
      description: post.excerpt || post.title,
      post,
      related
    });
  } catch (err) { next(err); }
});

module.exports = router;
