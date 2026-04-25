// ===================================
// pSEO Engine — Global Configuration
// ===================================

module.exports = {
  // Site details
  BASE_URL: 'https://wwfngo.org',
  SITE_NAME: 'Waste Pickers Welfare Foundation',
  SITE_SHORT: 'WWF NGO',

  // Content thresholds
  MIN_WORDS_INFORMATIONAL: 900,
  MIN_WORDS_UTILITY: 600,
  MIN_FAQS: 3,
  MIN_INTERNAL_LINKS: 5,
  MIN_RELATED_PAGES: 2,

  // Batch settings
  BATCH_SIZE: 100,

  // Output paths (relative to pseo/)
  OUTPUT_JSON: './output/pages',
  OUTPUT_HTML: './output/html',
  OUTPUT_SITEMAP: './output/sitemap.xml',
  OUTPUT_REPORT: './output/generation-report.json',
  OUTPUT_LINKS: './output/link-index.json',

  // Deployed path (relative to wwf-website/)
  DEPLOY_PATH: '../seo',

  // Playbook types and their content type (informational vs utility)
  PLAYBOOK_TYPES: {
    templates: 'utility',
    curation: 'informational',
    conversions: 'utility',
    comparisons: 'informational',
    examples: 'informational',
    locations: 'informational',
    personas: 'informational',
    integrations: 'informational',
    glossary: 'informational',
    translations: 'informational',
    directory: 'utility',
    profiles: 'informational'
  },

  // Google Analytics
  GA_ID: 'G-E1FCS1R13P'
};
