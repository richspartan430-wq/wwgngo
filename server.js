// Waste Pickers Welfare Foundation — Express server
// Serves the static site, public blog, admin dashboard, and form-submission API.
require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not set. See .env.example');
  process.exit(1);
}

// ------------- Middleware -------------
app.set('trust proxy', 1); // Heroku
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
  contentSecurityPolicy: false, // Google Analytics + Fonts + inline svg break it; relax for now
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI, ttl: 60 * 60 * 24 * 14 }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 14
  }
}));

// Rate limit for form + login endpoints
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : null;
  res.locals.siteUrl = process.env.SITE_URL || '';
  next();
});

// ------------- Routes -------------
const apiRoutes = require('./routes/api');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

app.use('/api', formLimiter, apiRoutes);
app.use('/blog', blogRoutes);
app.use('/admin/login', loginLimiter);
app.use('/admin', adminRoutes);

// ------------- Static site -------------
// Serve the existing static HTML site from /wwf-website.
// This MUST come after dynamic routes so /blog and /admin win.
app.use(express.static(path.join(__dirname, 'wwf-website'), {
  extensions: ['html']
}));

// Root → index.html is already handled by express.static, but just in case:
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'wwf-website', 'index.html'));
});

// 404
app.use((req, res) => {
  res.status(404).send('<h1>404 — Page not found</h1><p><a href="/">Return home</a></p>');
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).send('<h1>Something went wrong</h1>');
});

// ------------- Bootstrap -------------
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('[db] connected');
    app.listen(PORT, () => console.log(`[server] running on port ${PORT}`));
  })
  .catch(err => {
    console.error('[db] connection error:', err.message);
    process.exit(1);
  });
