function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  // HTML requests → redirect; JSON requests → 401
  if (req.accepts('html') && !req.xhr) {
    return res.redirect('/admin/login');
  }
  return res.status(401).json({ error: 'Authentication required' });
}

function redirectIfAuthed(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/admin');
  next();
}

module.exports = { requireAuth, redirectIfAuthed };
