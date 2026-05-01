// ===================================
// pSEO Engine - Page Validator
// ===================================

const config = require('../config');

class Validator {
  constructor(options = {}) {
    this.errors = [];
    this.warnings = [];
    this.usedKeywords = new Map(); // primary_keyword -> url
    this.usedSlugs = new Set();
    this.knownUrls = options.knownUrls || new Set();
  }

  /**
   * Validate a single page object
   * Returns { valid: boolean, errors: string[], warnings: string[] }
   */
  validate(page) {
    const errors = [];
    const warnings = [];

    // 1. URL slug uniqueness
    if (!page.url || page.url.trim() === '') {
      errors.push('Missing URL');
    } else if (this.usedSlugs.has(page.url)) {
      errors.push(`Duplicate URL slug: ${page.url}`);
    } else {
      this.usedSlugs.add(page.url);
    }

    // 2. SEO fields
    if (!page.seo || !page.seo.title) errors.push('Missing SEO title');
    if (!page.seo || !page.seo.meta_description) errors.push('Missing meta description');
    if (!page.seo || !page.seo.primary_keyword) errors.push('Missing primary keyword');

    // 3. Primary keyword cannibalization check
    if (page.seo && page.seo.primary_keyword) {
      const kw = page.seo.primary_keyword.toLowerCase();
      if (this.usedKeywords.has(kw)) {
        errors.push(`Keyword cannibalization: "${kw}" already used by ${this.usedKeywords.get(kw)}`);
      } else {
        this.usedKeywords.set(kw, page.url);
      }
    }

    // 4. Content existence
    if (!page.content || !page.content.h1) errors.push('Missing H1');
    if (!page.content || !page.content.introduction) errors.push('Missing introduction');

    // 5. Content length
    const contentType = config.PLAYBOOK_TYPES[page.playbook_type] || 'informational';
    const minWords = contentType === 'utility' ? config.MIN_WORDS_UTILITY : config.MIN_WORDS_INFORMATIONAL;
    const wordCount = this._countWords(page);
    if (wordCount < minWords) {
      errors.push(`Content too short: ${wordCount} words (min: ${minWords})`);
    }

    // 6. FAQs
    const faqCount = (page.content && page.content.faq) ? page.content.faq.length : 0;
    if (faqCount < config.MIN_FAQS) {
      errors.push(`Insufficient FAQs: ${faqCount} (min: ${config.MIN_FAQS})`);
    }

    // 7. Internal links
    const internalLinks = this._normalizeLinks(page.internal_links);
    const linkCount = internalLinks.length;
    if (linkCount < config.MIN_INTERNAL_LINKS) {
      errors.push(`Insufficient internal links: ${linkCount} (min: ${config.MIN_INTERNAL_LINKS})`);
    }

    // 7b. Broken internal links
    const brokenInternal = internalLinks.filter(url => this._isBrokenInternalUrl(url));
    if (brokenInternal.length > 0) {
      errors.push(`Broken internal links: ${brokenInternal.join(', ')}`);
    }

    // 8. Related pages
    const relatedPages = this._normalizeLinks(page.related_pages);
    const relatedCount = relatedPages.length;
    if (relatedCount < config.MIN_RELATED_PAGES) {
      errors.push(`Insufficient related pages: ${relatedCount} (min: ${config.MIN_RELATED_PAGES})`);
    }

    // 8b. Broken related links
    const brokenRelated = relatedPages.filter(url => this._isBrokenInternalUrl(url));
    if (brokenRelated.length > 0) {
      errors.push(`Broken related page links: ${brokenRelated.join(', ')}`);
    }

    // 9. Schema
    if (!page.schema || !page.schema.type) {
      warnings.push('Missing schema type');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      wordCount,
      faqCount,
      linkCount
    };
  }

  /**
   * Count total words in a page
   */
  _countWords(page) {
    let text = '';
    if (page.content) {
      if (page.content.introduction) text += page.content.introduction + ' ';
      if (page.content.sections) {
        page.content.sections.forEach(s => {
          text += (s.heading || '') + ' ' + (s.body || '') + ' ';
        });
      }
      if (page.content.faq) {
        page.content.faq.forEach(f => {
          text += (f.question || '') + ' ' + (f.answer || '') + ' ';
        });
      }
      if (page.content.call_to_action) text += page.content.call_to_action;
    }
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

  /**
   * Normalize a link list into string URLs.
   */
  _normalizeLinks(links) {
    if (!Array.isArray(links)) return [];
    return links
      .map(link => {
        if (typeof link === 'string') return link;
        if (link && typeof link.url === 'string') return link.url;
        return null;
      })
      .filter(Boolean);
  }

  /**
   * Check whether an internal absolute URL points to a known page.
   */
  _isBrokenInternalUrl(url) {
    if (!url || typeof url !== 'string') return true;
    if (!url.startsWith('/')) return false;
    return !this.knownUrls.has(url);
  }

  /**
   * Get validation summary
   */
  getSummary() {
    return {
      totalValidated: this.usedSlugs.size,
      uniqueKeywords: this.usedKeywords.size,
      knownUrls: this.knownUrls.size
    };
  }
}

module.exports = Validator;
