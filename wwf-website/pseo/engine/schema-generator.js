// ===================================
// pSEO Engine — JSON-LD Schema Generator
// ===================================

const config = require('../config');

class SchemaGenerator {
  /**
   * Generate schema for a glossary/definition page
   */
  static glossaryPage(term, definition, url) {
    return {
      type: 'DefinedTerm',
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        'name': term,
        'description': definition,
        'url': `${config.BASE_URL}${url}`,
        'inDefinedTermSet': {
          '@type': 'DefinedTermSet',
          'name': 'Waste Picker & NGO Glossary',
          'url': `${config.BASE_URL}/seo/glossary/`
        }
      }
    };
  }

  /**
   * Generate FAQPage schema
   */
  static faqSchema(faqs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }

  /**
   * Generate Article schema for informational pages
   */
  static articlePage(title, description, url, datePublished) {
    return {
      type: 'Article',
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': title,
        'description': description,
        'url': `${config.BASE_URL}${url}`,
        'datePublished': datePublished || '2026-04-22',
        'author': {
          '@type': 'Organization',
          'name': config.SITE_NAME,
          'url': config.BASE_URL
        },
        'publisher': {
          '@type': 'Organization',
          'name': config.SITE_NAME,
          'url': config.BASE_URL
        }
      }
    };
  }

  /**
   * Generate BreadcrumbList schema
   */
  static breadcrumb(items) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${config.BASE_URL}${item.url}`
      }))
    };
  }

  /**
   * Generate LocalBusiness/Organization page schema
   */
  static locationPage(location, url) {
    return {
      type: 'Article',
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': `Waste Picker Welfare in ${location.name}`,
        'description': location.description,
        'url': `${config.BASE_URL}${url}`,
        'about': {
          '@type': 'Place',
          'name': location.name,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': location.city,
            'addressRegion': location.state,
            'addressCountry': 'IN'
          }
        },
        'author': {
          '@type': 'Organization',
          'name': config.SITE_NAME
        }
      }
    };
  }
}

module.exports = SchemaGenerator;
