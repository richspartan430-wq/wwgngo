// ===================================
// pSEO Engine - Main Generator
// ===================================
// Usage: node generate.js [--playbook <name>] [--validate-only]

const fs = require('fs');
const path = require('path');
const config = require('./config');
const Validator = require('./engine/validator');
const InternalLinker = require('./engine/internal-linker');
const HTMLRenderer = require('./renderer/html-renderer');

// Playbooks
const glossaryPlaybook = require('./playbooks/glossary');
const locationsPlaybook = require('./playbooks/locations');
const personasPlaybook = require('./playbooks/personas');

const STATIC_SITE_URLS = [
  '/index.html',
  '/about.html',
  '/programs.html',
  '/gallery.html',
  '/annual-reports.html',
  '/get-involved.html',
  '/contact.html'
];

// Parse CLI args
const args = process.argv.slice(2);
const targetPlaybook = args.includes('--playbook') ? args[args.indexOf('--playbook') + 1] : null;
const validateOnly = args.includes('--validate-only');

// ========================
// Load Seed Data
// ========================
function loadSeedData() {
  const dataDir = path.join(__dirname, 'data');
  const data = {};

  try {
    data.glossaryTerms = JSON.parse(fs.readFileSync(path.join(dataDir, 'glossary-terms.json'), 'utf-8')).terms;
    console.log(`Loaded ${data.glossaryTerms.length} glossary terms`);
  } catch (e) {
    console.warn(`Could not load glossary terms: ${e.message}`);
    data.glossaryTerms = [];
  }

  try {
    data.locations = JSON.parse(fs.readFileSync(path.join(dataDir, 'locations.json'), 'utf-8')).locations;
    console.log(`Loaded ${data.locations.length} locations`);
  } catch (e) {
    console.warn(`Could not load locations: ${e.message}`);
    data.locations = [];
  }

  try {
    data.personas = JSON.parse(fs.readFileSync(path.join(dataDir, 'personas.json'), 'utf-8')).personas;
    console.log(`Loaded ${data.personas.length} personas`);
  } catch (e) {
    console.warn(`Could not load personas: ${e.message}`);
    data.personas = [];
  }

  try {
    data.categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8'));
    console.log('Loaded categories');
  } catch (e) {
    console.warn(`Could not load categories: ${e.message}`);
    data.categories = { categories: [], topics: [] };
  }

  return data;
}

// ========================
// Generate Pages
// ========================
function generatePages(seedData) {
  let allPages = [];

  const playbooks = {
    glossary: () => glossaryPlaybook.generate(seedData),
    locations: () => locationsPlaybook.generate(seedData),
    personas: () => personasPlaybook.generate(seedData)
  };

  if (targetPlaybook) {
    if (playbooks[targetPlaybook]) {
      console.log(`\nRunning playbook: ${targetPlaybook}`);
      allPages = playbooks[targetPlaybook]();
    } else {
      console.error(`Unknown playbook: ${targetPlaybook}. Available: ${Object.keys(playbooks).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('\nRunning ALL playbooks...');
    for (const [name, fn] of Object.entries(playbooks)) {
      console.log(`  -> ${name}...`);
      const pages = fn();
      allPages.push(...pages);
      console.log(`     Generated ${pages.length} pages`);
    }
  }

  return allPages;
}

// ========================
// Validate
// ========================
function validatePages(pages) {
  const knownUrls = new Set([...pages.map(p => p.url), ...STATIC_SITE_URLS]);
  const validator = new Validator({ knownUrls });
  const results = {
    valid: 0,
    invalid: 0,
    errors: [],
    warnings: [],
    validPages: [],
    invalidPages: []
  };

  for (const page of pages) {
    const result = validator.validate(page);
    if (result.valid) {
      results.valid++;
      results.validPages.push(page);
    } else {
      results.invalid++;
      results.invalidPages.push(page);
      results.errors.push({ url: page.url, errors: result.errors });
    }
    if (result.warnings.length > 0) {
      results.warnings.push({ url: page.url, warnings: result.warnings });
    }
  }

  return results;
}

// ========================
// Enrich Internal Links
// ========================
function enrichLinks(pages) {
  const linker = new InternalLinker();
  linker.indexPages(pages);
  return linker.enrichLinks(pages);
}

// ========================
// Write Output
// ========================
function writeOutput(pages) {
  // Ensure output directories
  const jsonDir = path.join(__dirname, config.OUTPUT_JSON);
  const htmlDir = path.join(__dirname, config.OUTPUT_HTML);
  const reportPath = path.join(__dirname, config.OUTPUT_REPORT);
  const sitemapPath = path.join(__dirname, config.OUTPUT_SITEMAP);
  const linkIndexPath = path.join(__dirname, config.OUTPUT_LINKS);

  ensureDir(jsonDir);
  ensureDir(htmlDir);
  ensureDir(path.dirname(reportPath));
  ensureDir(path.dirname(sitemapPath));
  ensureDir(path.dirname(linkIndexPath));

  let jsonCount = 0;
  let htmlCount = 0;

  for (const page of pages) {
    // Write JSON
    const jsonPath = path.join(jsonDir, page.url.replace(/\.html$/, '.json').replace(/^\/seo\//, ''));
    ensureDir(path.dirname(jsonPath));
    fs.writeFileSync(jsonPath, JSON.stringify(page, null, 2), 'utf-8');
    jsonCount++;

    // Write HTML
    const htmlPath = path.join(htmlDir, page.url.replace(/^\/seo\//, ''));
    ensureDir(path.dirname(htmlPath));
    const html = HTMLRenderer.render(page);
    fs.writeFileSync(htmlPath, html, 'utf-8');
    htmlCount++;
  }

  // Write sitemap for pSEO pages
  writeSitemap(pages);

  // Write link index
  const linkIndex = {};
  for (const page of pages) {
    linkIndex[page.url] = {
      playbook_type: page.playbook_type,
      links_to: page.internal_links || [],
      related_pages: page.related_pages || []
    };
  }
  fs.writeFileSync(linkIndexPath, JSON.stringify(linkIndex, null, 2), 'utf-8');

  // Write generation report
  const report = {
    generated_at: new Date().toISOString(),
    total_pages: pages.length,
    playbooks: {},
    urls: pages.map(p => p.url)
  };
  for (const page of pages) {
    report.playbooks[page.playbook_type] = (report.playbooks[page.playbook_type] || 0) + 1;
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  return { jsonCount, htmlCount };
}

function writeSitemap(pages) {
  const lastmod = new Date().toISOString().split('T')[0];

  // pSEO-only sitemap
  const pseoEntries = pages.map(page => ({
    loc: `${config.BASE_URL}${page.url}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod
  }));
  const pseoXml = buildSitemapXml(pseoEntries);
  fs.writeFileSync(path.join(__dirname, config.OUTPUT_SITEMAP), pseoXml, 'utf-8');

  // Root sitemap that includes core site URLs + generated pSEO URLs
  const staticEntries = [
    { loc: `${config.BASE_URL}/`, changefreq: 'weekly', priority: '1.0', lastmod },
    { loc: `${config.BASE_URL}/about.html`, changefreq: 'monthly', priority: '0.9', lastmod },
    { loc: `${config.BASE_URL}/programs.html`, changefreq: 'monthly', priority: '0.9', lastmod },
    { loc: `${config.BASE_URL}/gallery.html`, changefreq: 'monthly', priority: '0.7', lastmod },
    { loc: `${config.BASE_URL}/annual-reports.html`, changefreq: 'yearly', priority: '0.6', lastmod },
    { loc: `${config.BASE_URL}/get-involved.html`, changefreq: 'monthly', priority: '0.8', lastmod },
    { loc: `${config.BASE_URL}/contact.html`, changefreq: 'monthly', priority: '0.7', lastmod }
  ];

  const rootXml = buildSitemapXml([...staticEntries, ...pseoEntries]);
  fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), rootXml, 'utf-8');
}

function buildSitemapXml(entries) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${entry.loc}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ========================
// Deploy (copy to site)
// ========================
function deploy(pages) {
  const deployDir = path.join(__dirname, config.DEPLOY_PATH);
  const htmlDir = path.join(__dirname, config.OUTPUT_HTML);

  ensureDir(deployDir);

  // Copy all HTML files
  copyDirRecursive(htmlDir, deployDir);

  console.log(`Deployed ${pages.length} pages to ${deployDir}`);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ========================
// Main
// ========================
function main() {
  console.log('=======================================');
  console.log('  WWF pSEO Engine - Page Generator');
  console.log('=======================================');
  console.log(`Target: ${config.BASE_URL}`);
  console.log(`Mode: ${validateOnly ? 'VALIDATE ONLY' : 'GENERATE + VALIDATE'}`);
  console.log(`Playbook: ${targetPlaybook || 'ALL'}`);
  console.log('');

  // Step 1: Load seed data
  console.log('Loading seed data...');
  const seedData = loadSeedData();

  // Step 2: Generate pages
  console.log('\nGenerating pages...');
  let pages = generatePages(seedData);
  console.log(`\nGenerated ${pages.length} total pages`);

  // Step 3: Enrich internal links
  console.log('\nEnriching internal links...');
  pages = enrichLinks(pages);

  // Step 4: Validate
  console.log('\nValidating pages...');
  const validation = validatePages(pages);
  console.log(`  Valid: ${validation.valid}`);
  console.log(`  Invalid: ${validation.invalid}`);

  if (validation.errors.length > 0) {
    console.log('\n  Errors:');
    for (const err of validation.errors.slice(0, 15)) {
      console.log(`    ${err.url}: ${err.errors.join(', ')}`);
    }
  }
  if (validation.warnings.length > 0) {
    console.log(`\n  ${validation.warnings.length} pages with warnings`);
  }

  if (validateOnly) {
    console.log('\nValidate-only mode. No files written.');
    process.exit(validation.invalid > 0 ? 1 : 0);
  }

  // Discard invalid pages in generate mode to avoid thin/broken output
  if (validation.invalid > 0) {
    console.log(`\nDiscarding ${validation.invalid} invalid pages before writing output.`);
    pages = validation.validPages;
  }

  if (pages.length === 0) {
    console.error('No valid pages available to write. Aborting generation.');
    process.exit(1);
  }

  // Step 5: Write output
  console.log('\nWriting output files...');
  const output = writeOutput(pages);
  console.log(`  JSON files: ${output.jsonCount}`);
  console.log(`  HTML files: ${output.htmlCount}`);

  // Step 6: Deploy
  console.log('\nDeploying to site...');
  deploy(pages);

  console.log('\n=======================================');
  console.log(`  Done! ${pages.length} valid pages generated & deployed.`);
  console.log('=======================================');
}

main();
