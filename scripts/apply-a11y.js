// One-time script to add skip-link and <main> landmark across public pages.
// Run: node scripts/apply-a11y.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'wwf-website');
const PAGES = [
  'index.html', 'about.html', 'programs.html', 'gallery.html',
  'annual-reports.html', 'get-involved.html', 'contact.html'
];

const SKIP_LINK = '    <a class="skip-link" href="#main-content">Skip to main content</a>\n';

function transform(html) {
  let out = html;
  // 1) Insert skip link after <body>
  if (!out.includes('class="skip-link"')) {
    out = out.replace(/<body>\s*\n/, m => m + SKIP_LINK);
  }
  // 2) Open <main id="main-content"> AFTER closing </nav> (first occurrence)
  if (!out.includes('id="main-content"')) {
    out = out.replace(/<\/nav>\s*\n/, m => m + '\n    <main id="main-content">\n');
  }
  // 3) Close </main> BEFORE <footer>
  if (!out.includes('</main>')) {
    out = out.replace(/(\s*)<footer>/, '$1</main>\n$1<footer>');
  }
  return out;
}

let changed = 0;
for (const name of PAGES) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) { console.log('skip (missing):', name); continue; }
  const before = fs.readFileSync(p, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8');
    changed++;
    console.log('updated:', name);
  } else {
    console.log('unchanged:', name);
  }
}
console.log(`\nDone. ${changed} files updated.`);
