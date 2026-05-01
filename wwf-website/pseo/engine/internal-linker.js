// ===================================
// pSEO Engine - Internal Linker
// ===================================

class InternalLinker {
  constructor() {
    this.pageIndex = new Map(); // url -> page metadata
    this.coreSiteLinks = [
      '/index.html',
      '/about.html',
      '/programs.html',
      '/gallery.html',
      '/annual-reports.html',
      '/get-involved.html',
      '/contact.html'
    ];
  }

  /**
   * Register all pages for linking
   */
  indexPages(pages) {
    for (const page of pages) {
      this.pageIndex.set(page.url, {
        url: page.url,
        title: page.seo.title,
        playbook_type: page.playbook_type,
        primary_keyword: page.seo.primary_keyword,
        h1: page.content.h1
      });
    }
  }

  /**
   * Ensure each page has valid internal links and related pages
   */
  enrichLinks(pages) {
    const byPlaybook = new Map();
    const generatedUrls = new Set(pages.map(p => p.url));
    const knownUrls = new Set([...generatedUrls, ...this.coreSiteLinks]);

    // Group pages by playbook type
    for (const page of pages) {
      if (!byPlaybook.has(page.playbook_type)) {
        byPlaybook.set(page.playbook_type, []);
      }
      byPlaybook.get(page.playbook_type).push(page.url);
    }

    for (const page of pages) {
      const existingLinks = new Set((page.internal_links || []).filter(Boolean));

      // Always include core site links
      this.coreSiteLinks.forEach(url => existingLinks.add(url));

      // Add sibling links (same playbook, exclude self)
      const siblings = (byPlaybook.get(page.playbook_type) || [])
        .filter(url => url !== page.url);

      for (let i = 0; i < Math.min(3, siblings.length); i++) {
        existingLinks.add(siblings[i]);
      }

      // Add cross-playbook links (at least 2 when available)
      const crossPlaybook = [];
      for (const [playbook, urls] of byPlaybook.entries()) {
        if (playbook !== page.playbook_type && urls.length > 0) {
          crossPlaybook.push(urls[0]);
        }
      }
      crossPlaybook.slice(0, 3).forEach(url => existingLinks.add(url));

      // Filter to valid known URLs and remove self
      const filteredLinks = [...existingLinks]
        .filter(url => knownUrls.has(url))
        .filter(url => url !== page.url);

      // Ensure minimum link count by topping up from core links
      if (filteredLinks.length < 5) {
        for (const url of this.coreSiteLinks) {
          if (!filteredLinks.includes(url)) {
            filteredLinks.push(url);
          }
          if (filteredLinks.length >= 5) break;
        }
      }

      page.internal_links = filteredLinks;

      // Build related pages: siblings + cross-playbook + existing related pages
      const relatedSeed = [
        ...(page.related_pages || []),
        ...siblings,
        ...crossPlaybook
      ];

      const relatedPages = [];
      for (const url of relatedSeed) {
        if (!url || url === page.url) continue;
        if (!knownUrls.has(url)) continue;
        if (relatedPages.includes(url)) continue;
        relatedPages.push(url);
      }

      // Guarantee at least 2 related links
      if (relatedPages.length < 2) {
        for (const url of filteredLinks) {
          if (url === page.url) continue;
          if (relatedPages.includes(url)) continue;
          relatedPages.push(url);
          if (relatedPages.length >= 2) break;
        }
      }

      page.related_pages = relatedPages.slice(0, 6);
    }

    return pages;
  }

  /**
   * Generate a link index JSON for the entire site
   */
  generateLinkIndex(pages) {
    const index = {};
    for (const page of pages) {
      index[page.url] = {
        title: page.seo.title,
        playbook: page.playbook_type,
        links_to: page.internal_links,
        linked_from: []
      };
    }

    // Compute backlinks
    for (const page of pages) {
      for (const link of (page.internal_links || [])) {
        if (index[link]) {
          index[link].linked_from.push(page.url);
        }
      }
    }

    return index;
  }
}

module.exports = InternalLinker;
