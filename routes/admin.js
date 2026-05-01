const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const { requireAuth, redirectIfAuthed } = require('../middleware/auth');
const slugify = require('slugify');

// ---------- Login / Logout ----------
router.get('/login', redirectIfAuthed, (req, res) => {
  res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', redirectIfAuthed, async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!email || !password) {
      return res.status(400).render('admin/login', { title: 'Admin Login', error: 'Email and password required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render('admin/login', { title: 'Admin Login', error: 'Invalid credentials.' });
    }
    const ok = await user.verifyPassword(password);
    if (!ok) {
      return res.status(401).render('admin/login', { title: 'Admin Login', error: 'Invalid credentials.' });
    }
    req.session.user = { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
    res.redirect('/admin');
  } catch (err) {
    console.error('[admin/login]', err);
    res.status(500).render('admin/login', { title: 'Admin Login', error: 'Server error. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// All routes below require authentication
router.use(requireAuth);

// ---------- Dashboard ----------
router.get('/', async (_req, res, next) => {
  try {
    const [blogCount, publishedCount, draftCount, contactCount, unreadCount, subsCount, recentContacts, recentBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
      Newsletter.countDocuments({ active: true }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Blog.find().sort({ updatedAt: -1 }).limit(5).lean()
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { blogCount, publishedCount, draftCount, contactCount, unreadCount, subsCount },
      recentContacts, recentBlogs, active: 'dashboard'
    });
  } catch (err) { next(err); }
});

// ---------- Blogs CRUD ----------
router.get('/blogs', async (_req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 }).lean();
    res.render('admin/blogs', { title: 'Manage Blogs', blogs, active: 'blogs' });
  } catch (err) { next(err); }
});

router.get('/blogs/new', (_req, res) => {
  res.render('admin/blog-editor', { title: 'New Blog Post', blog: null, active: 'blogs', error: null });
});

router.post('/blogs/new', async (req, res, next) => {
  try {
    const data = normalizeBlogInput(req.body);
    if (!data.title || !data.content) {
      return res.status(400).render('admin/blog-editor', { title: 'New Blog Post', blog: data, active: 'blogs', error: 'Title and content are required.' });
    }
    if (!data.slug) data.slug = slugify(data.title, { lower: true, strict: true });
    const exists = await Blog.findOne({ slug: data.slug });
    if (exists) data.slug = `${data.slug}-${Date.now().toString(36)}`;
    data.author = req.session.user.id;
    const blog = await Blog.create(data);
    res.redirect(`/admin/blogs/${blog._id}/edit`);
  } catch (err) { next(err); }
});

router.get('/blogs/:id/edit', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.status(404).send('Not found');
    res.render('admin/blog-editor', { title: `Edit: ${blog.title}`, blog, active: 'blogs', error: null });
  } catch (err) { next(err); }
});

router.post('/blogs/:id/edit', async (req, res, next) => {
  try {
    const data = normalizeBlogInput(req.body);
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Not found');
    blog.title      = data.title || blog.title;
    blog.slug       = data.slug || blog.slug;
    blog.excerpt    = data.excerpt;
    blog.coverImage = data.coverImage;
    blog.content    = data.content || blog.content;
    blog.tags       = data.tags;
    blog.status     = data.status;
    if (data.status === 'published' && !blog.publishedAt) blog.publishedAt = new Date();
    await blog.save();
    res.redirect(`/admin/blogs/${blog._id}/edit`);
  } catch (err) { next(err); }
});

router.post('/blogs/:id/delete', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/blogs');
  } catch (err) { next(err); }
});

function normalizeBlogInput(body) {
  const tags = (body.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  return {
    title:      (body.title || '').trim(),
    slug:       (body.slug || '').trim().toLowerCase(),
    excerpt:    (body.excerpt || '').trim(),
    coverImage: (body.coverImage || '').trim(),
    content:    body.content || '',
    tags,
    status:     body.status === 'published' ? 'published' : 'draft'
  };
}

// ---------- Contact submissions ----------
router.get('/submissions', async (_req, res, next) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 }).lean();
    res.render('admin/submissions', { title: 'Contact Submissions', items, active: 'submissions' });
  } catch (err) { next(err); }
});

router.post('/submissions/:id/read', async (req, res, next) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.redirect('/admin/submissions');
  } catch (err) { next(err); }
});

router.post('/submissions/:id/delete', async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/submissions');
  } catch (err) { next(err); }
});

// ---------- Newsletter subscribers ----------
router.get('/subscribers', async (_req, res, next) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 }).lean();
    res.render('admin/subscribers', { title: 'Newsletter Subscribers', subs, active: 'subscribers' });
  } catch (err) { next(err); }
});

router.get('/subscribers.csv', async (_req, res, next) => {
  try {
    const subs = await Newsletter.find({ active: true }).sort({ createdAt: -1 }).lean();
    const rows = [['email', 'source', 'createdAt'], ...subs.map(s => [s.email, s.source, s.createdAt.toISOString()])];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
  } catch (err) { next(err); }
});

router.post('/subscribers/:id/delete', async (req, res, next) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.redirect('/admin/subscribers');
  } catch (err) { next(err); }
});

module.exports = router;
