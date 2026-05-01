// Rewires contact + newsletter forms to local API, adds BLOG nav link,
// includes forms.js on contact.html and index.html.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'wwf-website');
const PAGES = [
  'index.html', 'about.html', 'programs.html', 'gallery.html',
  'annual-reports.html', 'get-involved.html', 'contact.html'
];

function addBlogNavLink(html) {
  // Insert BLOG link right before the CONTACT nav item, only if not already present.
  if (/href="\/blog"/.test(html)) return html;
  return html.replace(
    /(<li><a href="contact\.html">CONTACT<\/a><\/li>)/,
    '<li><a href="/blog">BLOG</a></li>\n                $1'
  );
}

function addBlogFooterLink(html) {
  if (/<a href="\/blog">Blog<\/a>/.test(html)) return html;
  return html.replace(
    /(<a href="annual-reports\.html">Annual Reports<\/a>)/,
    '<a href="/blog">Blog</a>\n                $1'
  );
}

function wireContactForm(html) {
  // contact.html has a form that previously had action=formspree. Add data-form="contact" and change action.
  html = html.replace(
    /<form([^>]*?)action="https:\/\/formspree\.io\/f\/[^"]*"([^>]*)>/gi,
    (m, a, b) => `<form${a}action="/api/contact"${b} data-form="contact">`
  );
  html = html.replace(
    /<form([^>]*?)action="\/api\/contact"([^>]*?)(?!data-form)>/gi,
    (m, a, b) => m.includes('data-form') ? m : `<form${a}action="/api/contact"${b} data-form="contact">`
  );
  return html;
}

function wireNewsletterForm(html) {
  // newsletter form typically lives in footer area; wire anything pointing to formspree as newsletter if it's a newsletter form.
  // Since contact has already been converted, remaining formspree form in index.html = newsletter.
  html = html.replace(
    /<form([^>]*?)action="https:\/\/formspree\.io\/f\/[^"]*"([^>]*)>/gi,
    (m, a, b) => `<form${a}action="/api/newsletter"${b} data-form="newsletter">`
  );
  return html;
}

function addFormsJs(html) {
  if (/forms\.js/.test(html)) return html;
  return html.replace(
    /<script src="js\/script\.js"><\/script>/,
    '<script src="js/script.js"></script>\n    <script src="js/forms.js"></script>'
  );
}

let changed = 0;
for (const name of PAGES) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, 'utf8');
  let out = before;
  out = addBlogNavLink(out);
  out = addBlogFooterLink(out);
  if (name === 'contact.html') out = wireContactForm(out);
  if (name === 'index.html')   out = wireNewsletterForm(out);
  if (name === 'contact.html' || name === 'index.html') out = addFormsJs(out);
  if (out !== before) {
    fs.writeFileSync(p, out, 'utf8');
    console.log('updated:', name);
    changed++;
  } else {
    console.log('unchanged:', name);
  }
}
console.log(`\n${changed} files updated.`);
