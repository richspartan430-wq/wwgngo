const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');

function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function clean(s, max = 500) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

// POST /api/contact — contact form submission
router.post('/contact', async (req, res) => {
  try {
    const name    = clean(req.body.name, 200);
    const email   = clean(req.body.email, 200).toLowerCase();
    const phone   = clean(req.body.phone, 40);
    const subject = clean(req.body.subject, 200);
    const message = clean(req.body.message, 5000);
    // simple honeypot
    if (req.body.website) return res.json({ ok: true });
    if (!name || !isEmail(email) || !message) {
      return res.status(400).json({ error: 'Please provide a valid name, email and message.' });
    }
    await Contact.create({
      name, email, phone, subject, message,
      ipAddress: req.ip,
      userAgent: (req.get('user-agent') || '').slice(0, 400)
    });
    return res.json({ ok: true, message: 'Thanks — we have received your message and will reply soon.' });
  } catch (err) {
    console.error('[/api/contact]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// POST /api/newsletter — newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const email = clean(req.body.email, 200).toLowerCase();
    if (req.body.website) return res.json({ ok: true });
    if (!isEmail(email)) return res.status(400).json({ error: 'Please provide a valid email.' });
    try {
      await Newsletter.create({
        email,
        source: clean(req.body.source, 50) || 'footer',
        ipAddress: req.ip
      });
    } catch (e) {
      if (e && e.code === 11000) {
        return res.json({ ok: true, message: 'You are already subscribed — thank you!' });
      }
      throw e;
    }
    return res.json({ ok: true, message: 'Subscribed! Thanks for joining our mailing list.' });
  } catch (err) {
    console.error('[/api/newsletter]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
