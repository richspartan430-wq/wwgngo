// Dynamic sitemap.xml + robots.txt. Generates from DB + static pages + SEO filesystem scan.
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Blog = require('../models/Blog');

const SEO_DIR = path.join(__dirname, '..', 'wwf-website', 'seo');

function listHtml(subdir) {
  try {
    return fs.readdirSync(path.join(SEO_DIR, subdir))
      .filter(f => f.endsWith('.html'))
      .map(f => f.replace(/\.html$/, ''));
  } catch (_e) {
    return [];
  }
}

// Cache filesystem scan at module load — these change only on deploy.
const GLOSSARY_PAGES = listHtml('glossary');
const LOCATION_PAGES = listHtml('locations');
const PERSONA_PAGES  = listHtml('personas');

const STATIC_PAGES = [
  { loc: '/',                    priority: '1.0', changefreq: 'weekly' },
  { loc: '/about.html',          priority: '0.9', changefreq: 'monthly' },
  { loc: '/programs.html',       priority: '0.9', changefreq: 'monthly' },
  { loc: '/gallery.html',        priority: '0.7', changefreq: 'monthly' },
  { loc: '/annual-reports.html', priority: '0.8', changefreq: 'yearly' },
  { loc: '/get-involved.html',   priority: '0.9', changefreq: 'monthly' },
  { loc: '/contact.html',        priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog',                priority: '0.9', changefreq: 'daily' }
];

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  })[c]);
}

function urlTag({ loc, lastmod, priority, changefreq }) {
  const parts = [`<loc>${xmlEscape(loc)}</loc>`];
  if (lastmod)    parts.push(`<lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
  if (priority)   parts.push(`<priority>${priority}</priority>`);
  return `  <url>${parts.join('')}</url>`;
}

function getSite() {
  return (process.env.SITE_URL || 'https://www.wwfngo.org').replace(/\/$/, '');
}

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const site = getSite();
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('slug updatedAt publishedAt tags')
      .lean();

    const tags = [...new Set(blogs.flatMap(b => b.tags || []))];

    const urls = [
      ...STATIC_PAGES.map(p => urlTag({
        loc: `${site}${p.loc}`,
        priority: p.priority,
        changefreq: p.changefreq
      })),
      ...GLOSSARY_PAGES.map(p => urlTag({
        loc: `${site}/seo/glossary/${p}.html`,
        priority: '0.6',
        changefreq: 'monthly'
      })),
      ...LOCATION_PAGES.map(p => urlTag({
        loc: `${site}/seo/locations/${p}.html`,
        priority: '0.6',
        changefreq: 'monthly'
      })),
      ...PERSONA_PAGES.map(p => urlTag({
        loc: `${site}/seo/personas/${p}.html`,
        priority: '0.6',
        changefreq: 'monthly'
      })),
      ...blogs.map(b => urlTag({
        loc: `${site}/blog/${b.slug}`,
        lastmod: (b.updatedAt || b.publishedAt || new Date()).toISOString(),
        priority: '0.7',
        changefreq: 'weekly'
      })),
      ...tags.map(t => urlTag({
        loc: `${site}/blog?tag=${encodeURIComponent(t)}`,
        priority: '0.5',
        changefreq: 'weekly'
      }))
    ];

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.join('\n') +
      '\n</urlset>\n';

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) { next(err); }
});

router.get('/robots.txt', (_req, res) => {
  const site = getSite();
  const body =
    '# Waste Pickers Welfare Foundation\n' +
    'User-agent: *\n' +
    'Allow: /\n' +
    'Allow: /assets/\n' +
    'Disallow: /admin\n' +
    'Disallow: /api\n' +
    `Sitemap: ${site}/sitemap.xml\n`;
  res.type('text/plain').send(body);
});

module.exports = router;
