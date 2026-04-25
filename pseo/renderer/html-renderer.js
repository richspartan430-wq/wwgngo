// ===================================
// pSEO Engine - HTML Renderer
// ===================================

const config = require('../config');
const SchemaGenerator = require('../engine/schema-generator');

class HTMLRenderer {
  /**
   * Render a page JSON object into a full HTML string
   */
  static render(page) {
    const breadcrumbs = HTMLRenderer._buildBreadcrumbs(page);
    const faqHTML = HTMLRenderer._renderFAQs(page.content.faq || []);
    const sectionsHTML = HTMLRenderer._renderSections(page.content.sections || []);
    const schemaJSON = JSON.stringify(page.schema.structured_data, null, 2);
    const faqSchemaJSON = JSON.stringify(SchemaGenerator.faqSchema(page.content.faq || []), null, 2);
    const relatedLinksHTML = HTMLRenderer._renderRelatedPages(page);
    const internalLinksHTML = HTMLRenderer._renderInternalLinks(page);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.GA_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.GA_ID}');
    </script>
    <title>${HTMLRenderer._escapeHTML(page.seo.title)}</title>
    <meta name="description" content="${HTMLRenderer._escapeHTML(page.seo.meta_description)}">
    <meta name="keywords" content="${HTMLRenderer._escapeHTML(page.seo.secondary_keywords.join(', '))}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${HTMLRenderer._escapeHTML(page.seo.title)}">
    <meta property="og:description" content="${HTMLRenderer._escapeHTML(page.seo.meta_description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${config.BASE_URL}${page.url}">
    <meta property="og:site_name" content="${config.SITE_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${config.BASE_URL}${page.url}">
    <link rel="icon" href="/assets/founder.png">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/pseo.css">
    <script type="application/ld+json">
    ${schemaJSON}
    </script>
    <script type="application/ld+json">
    ${faqSchemaJSON}
    </script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/index.html" class="logo">Waste Pickers <span>Welfare Foundation</span></a>
            <ul class="nav-links">
                <li><a href="/index.html">HOME</a></li>
                <li><a href="/about.html">ABOUT US</a></li>
                <li><a href="/programs.html">OUR WORK</a></li>
                <li><a href="/gallery.html">GALLERY</a></li>
                <li><a href="/annual-reports.html">ANNUAL REPORTS</a></li>
                <li><a href="/get-involved.html">GET INVOLVED</a></li>
                <li><a href="/contact.html">CONTACT</a></li>
                <li><a href="/get-involved.html" class="btn-donate">Donate Now</a></li>
            </ul>
            <div class="menu-toggle" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="pseo-breadcrumb">
        <div class="container">
            ${breadcrumbs}
        </div>
    </div>

    <!-- Main Content -->
    <article class="pseo-page">
        <div class="container">
            <div class="pseo-layout">
                <main class="pseo-content">
                    <h1>${HTMLRenderer._escapeHTML(page.content.h1)}</h1>

                    <div class="pseo-intro">
                        <p>${HTMLRenderer._escapeHTML(page.content.introduction)}</p>
                    </div>

                    ${sectionsHTML}

                    <!-- FAQ Section -->
                    <section class="pseo-faq">
                        <h2>Frequently Asked Questions</h2>
                        ${faqHTML}
                    </section>

                    <!-- CTA -->
                    <div class="pseo-cta">
                        <h3>Support Waste Picker Communities</h3>
                        <p>${HTMLRenderer._escapeHTML(page.content.call_to_action)}</p>
                        <a href="/get-involved.html" class="btn btn-primary">Donate Now (80G Tax Exempt)</a>
                        <a href="/contact.html" class="btn btn-outline" style="border-color: var(--primary-blue); color: var(--primary-blue);">Contact Us</a>
                    </div>
                </main>

                <aside class="pseo-sidebar">
                    <div class="pseo-sidebar-card">
                        <h3>Related Topics</h3>
                        ${relatedLinksHTML}
                    </div>
                    <div class="pseo-sidebar-card">
                        <h3>Quick Links</h3>
                        ${internalLinksHTML}
                    </div>
                    <div class="pseo-sidebar-card pseo-donate-card">
                        <h3>Support Our Work</h3>
                        <p>Your donation helps waste picker families access education, healthcare, and dignity.</p>
                        <a href="/get-involved.html" class="btn btn-primary" style="width:100%;text-align:center;">Donate Now</a>
                        <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-light);">80G Tax Exemption Available</p>
                    </div>
                </aside>
            </div>
        </div>
    </article>

    <!-- Footer -->
    <footer>
        <div class="footer-grid">
            <div class="footer-section">
                <h4>Waste Pickers Welfare Foundation</h4>
                <p>Working for the rights, education, and empowerment of waste pickers and their families since 2014.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <a href="/index.html">Home</a>
                <a href="/about.html">About Us</a>
                <a href="/programs.html">Our Programs</a>
                <a href="/gallery.html">Gallery</a>
                <a href="/annual-reports.html">Annual Reports</a>
                <a href="/get-involved.html">Get Involved</a>
            </div>
            <div class="footer-section">
                <h4>Contact Us</h4>
                <p>B-12A Gali No 2 East Nathu Colony</p>
                <p>Shahdara, Delhi - 110093</p>
                <p><a href="tel:+919968125328" style="color:#aaa;">+91-9968125328</a></p>
                <p><a href="mailto:Bali.charan@gmail.com" style="color:#aaa;">Bali.charan@gmail.com</a></p>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <p>PAN: AAATW4653R</p>
                <p>80G: AAATW4653R24DL02</p>
                <p>DARPAN: DL/20190246760</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Waste Pickers Welfare Foundation. All Rights Reserved.</p>
        </div>
    </footer>

    <div class="floating-buttons">
        <a href="https://wa.me/919968125328" target="_blank" class="floating-btn whatsapp" aria-label="Chat on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <button id="scrollTopBtn" class="floating-btn scroll-top" aria-label="Scroll to top">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
    </div>

    <script src="/js/script.js"></script>
</body>
</html>`;
  }

  static _buildBreadcrumbs(page) {
    const playbookLabels = {
      glossary: 'Glossary',
      locations: 'Locations',
      personas: 'Personas'
    };

    const crumbs = [
      { name: 'Home', url: '/index.html' },
      { name: playbookLabels[page.playbook_type] || 'Resources', url: null },
      { name: page.content.h1, url: page.url }
    ];

    return crumbs.map((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      if (isLast) {
        return `<span class="breadcrumb-current">${HTMLRenderer._escapeHTML(crumb.name)}</span>`;
      }
      if (!crumb.url) {
        return `<span>${HTMLRenderer._escapeHTML(crumb.name)}</span>`;
      }
      return `<a href="${crumb.url}">${HTMLRenderer._escapeHTML(crumb.name)}</a>`;
    }).join(' <span class="breadcrumb-sep">&rsaquo;</span> ');
  }

  static _renderSections(sections) {
    return sections.map(section => `
                    <section class="pseo-section">
                        <h2>${HTMLRenderer._escapeHTML(section.heading)}</h2>
                        ${section.body.split('\n\n').map(p => `<p>${HTMLRenderer._escapeHTML(p)}</p>`).join('\n')}
                    </section>`
    ).join('\n');
  }

  static _renderFAQs(faqs) {
    return faqs.map(faq => `
                        <div class="faq-item">
                            <button class="faq-question">${HTMLRenderer._escapeHTML(faq.question)}</button>
                            <div class="faq-answer">
                                <p>${HTMLRenderer._escapeHTML(faq.answer)}</p>
                            </div>
                        </div>`
    ).join('\n');
  }

  static _renderRelatedPages(page) {
    const related = page.related_pages || [];
    if (related.length === 0) return '<p>No related pages</p>';

    return '<ul>' + related.map(url => {
      const cleaned = url.endsWith('/') ? url.slice(0, -1) : url;
      const segment = cleaned.split('/').pop() || 'resource';
      const label = segment.replace('.html', '').replace(/-/g, ' ');
      return `<li><a href="${url}">${HTMLRenderer._escapeHTML(label)}</a></li>`;
    }).join('\n') + '</ul>';
  }

  static _renderInternalLinks(page) {
    const links = (page.internal_links || []).slice(0, 10);
    return '<ul>' + links.map(url => {
      const cleaned = url.endsWith('/') ? url.slice(0, -1) : url;
      let label = cleaned.split('/').pop().replace('.html', '').replace(/-/g, ' ');
      if (label === '' || label === 'index') label = 'Home';
      return `<li><a href="${url}">${HTMLRenderer._escapeHTML(label)}</a></li>`;
    }).join('\n') + '</ul>';
  }

  static _escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

module.exports = HTMLRenderer;
