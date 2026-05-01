// ===================================
// pSEO Engine — URL Slug Generator
// ===================================

class SlugGenerator {
  constructor() {
    this.usedSlugs = new Set();
  }

  /**
   * Generate a URL-safe slug from text
   */
  generate(text) {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);

    if (this.usedSlugs.has(slug)) {
      // Append a numeric suffix for uniqueness
      let counter = 2;
      while (this.usedSlugs.has(`${slug}-${counter}`)) {
        counter++;
      }
      const uniqueSlug = `${slug}-${counter}`;
      this.usedSlugs.add(uniqueSlug);
      return uniqueSlug;
    }

    this.usedSlugs.add(slug);
    return slug;
  }

  /**
   * Check if a slug has already been used
   */
  isUsed(slug) {
    return this.usedSlugs.has(slug);
  }

  /**
   * Register a slug without generating it
   */
  register(slug) {
    this.usedSlugs.add(slug);
  }

  /**
   * Get count of used slugs
   */
  get count() {
    return this.usedSlugs.size;
  }
}

module.exports = SlugGenerator;
