// ===================================
// pSEO Playbook - Glossary
// ===================================

const config = require('../config');
const SchemaGenerator = require('../engine/schema-generator');

function generate(seedData) {
  const terms = seedData.glossaryTerms || [];
  const pages = [];
  const availableSlugs = new Set(terms.map(t => t.slug));

  for (const term of terms) {
    const url = `/seo/glossary/${term.slug}.html`;

    const validRelatedSlugs = (term.related_terms || []).filter(rt => availableSlugs.has(rt));
    const relatedTermLinks = validRelatedSlugs.map(rt => ({
      url: `/seo/glossary/${rt}.html`,
      anchor_text: rt.replace(/-/g, ' ')
    }));

    // Build rich content sections
    const sections = [
      {
        heading: `What is ${term.term}?`,
        body: term.definition_detailed
      },
      {
        heading: `Why ${term.term} Matters for Waste Picker Communities`,
        body: _generateWhyItMatters(term)
      },
      {
        heading: `${term.term} in the Indian Context`,
        body: _generateIndianContext(term)
      },
      {
        heading: `How Waste Pickers Welfare Foundation Addresses ${term.term}`,
        body: _generateWWFConnection(term)
      },
      {
        heading: 'Key Facts and Statistics',
        body: _generateKeyFacts(term)
      },
      {
        heading: `Implementation Checklist for ${term.term}`,
        body: _generateImplementationGuidance(term)
      }
    ];

    const faqs = _generateFAQs(term);

    const internalLinks = [
      '/index.html',
      '/about.html',
      '/programs.html',
      '/gallery.html',
      '/get-involved.html',
      '/contact.html',
      ...relatedTermLinks.slice(0, 4).map(l => l.url)
    ];

    const relatedPages = [
      ...relatedTermLinks.slice(0, 3).map(l => l.url),
      '/programs.html'
    ];

    const page = {
      url,
      playbook_type: 'glossary',
      seo: {
        title: `${term.term} - Definition & Meaning | ${config.SITE_SHORT} Glossary`,
        meta_description: `${term.definition_short} Learn what ${term.term.toLowerCase()} means in the context of waste picker welfare, NGO operations, and social development in India.`,
        primary_keyword: term.term.toLowerCase(),
        secondary_keywords: [
          `what is ${term.term.toLowerCase()}`,
          `${term.term.toLowerCase()} meaning`,
          `${term.term.toLowerCase()} definition`,
          `${term.term.toLowerCase()} in India`,
          ...validRelatedSlugs.map(t => t.replace(/-/g, ' '))
        ],
        search_intent: 'informational'
      },
      content: {
        h1: `What is ${term.term}?`,
        introduction: `${term.definition_short} In this comprehensive guide, we explain the meaning of ${term.term.toLowerCase()}, its significance for waste picker communities in India, and how organizations like the Waste Pickers Welfare Foundation work with this concept to create meaningful impact across Delhi NCR.`,
        sections,
        faq: faqs,
        call_to_action: 'Want to support waste picker communities? The Waste Pickers Welfare Foundation works across Delhi NCR to provide education, healthcare, and empowerment to waste picker families. Your donation is 80G tax exempt. Contact us at +91-9968125328 or visit our donation page to make a difference.'
      },
      schema: SchemaGenerator.glossaryPage(term.term, term.definition_short, url),
      internal_links: [...new Set(internalLinks)],
      related_pages: [...new Set(relatedPages)],
      data_requirements_used: ['glossary-terms.json']
    };

    pages.push(page);
  }

  return pages;
}

// --- Content generators ---

function _generateWhyItMatters(term) {
  const categoryContexts = {
    'core-concepts': `Understanding ${term.term.toLowerCase()} is fundamental to grasping the challenges and opportunities in the waste management and informal recycling ecosystem. This concept directly affects the lives of millions of marginalized workers across India, particularly in urban centers like Delhi NCR where waste pickers form the backbone of the recycling chain. Without proper understanding and policy attention to concepts like ${term.term.toLowerCase()}, the most vulnerable members of our society continue to work in hazardous conditions without basic rights, dignity, or access to essential services. Organizations working with waste picker communities use this understanding to design targeted interventions that address root causes rather than just symptoms.`,
    'programs': `${term.term} is a critical program area for waste picker welfare. Communities living in urban slums and waste settlements often lack access to these basic services, making dedicated programs essential. The Waste Pickers Welfare Foundation has identified ${term.term.toLowerCase()} as a priority area based on extensive community needs assessment and years of grassroots experience. Through sustained investment in this area, the Foundation has demonstrated measurable impact, improving lives of thousands of individuals and families annually. The program approach combines immediate service delivery with long-term capacity building, ensuring communities can eventually sustain these improvements.`,
    'legal': `Understanding ${term.term.toLowerCase()} is essential for any organization or individual working in India's nonprofit sector. This legal or regulatory framework element provides the institutional foundation for transparent, accountable, and effective charitable operations. For donors, knowledge of ${term.term.toLowerCase()} ensures their contributions are going to verified, compliant organizations. For nonprofits, proper adherence to these requirements builds credibility, enables access to funding, and demonstrates commitment to governance best practices. The Waste Pickers Welfare Foundation maintains all required legal registrations and certifications, reflecting its commitment to institutional transparency.`,
    'waste-management': `${term.term} is at the heart of India's urban sustainability challenge. With cities generating ever-increasing quantities of waste and landfills reaching crisis levels, understanding and implementing effective ${term.term.toLowerCase()} practices is no longer optional. Waste pickers, who handle an estimated 20% of urban waste recovery, are critical stakeholders in the ${term.term.toLowerCase()} ecosystem. Their inclusion in formal frameworks is essential for both environmental sustainability and social justice. The Waste Pickers Welfare Foundation advocates for waste picker inclusion in all ${term.term.toLowerCase()} policies and programs.`,
    'education': `${term.term} directly impacts the future of children from waste picker families. Education is the most powerful tool for breaking the cycle of intergenerational poverty, and concepts like ${term.term.toLowerCase()} provide the framework for making education accessible to the most marginalized children. In waste picker settlements, children face multiple barriers to education, including poverty, lack of documentation, social stigma, and the economic pressure to contribute to family income. Addressing ${term.term.toLowerCase()} requires a multi-pronged approach combining service delivery, policy advocacy, and community engagement.`,
    'government': `${term.term} represents an important government initiative that directly impacts waste picker communities and the broader informal sector workforce. Understanding these schemes and their implementation mechanisms is crucial for NGOs, community leaders, and individual beneficiaries to access available entitlements. The Waste Pickers Welfare Foundation actively works to bridge the awareness gap between government policy and on-ground implementation, ensuring that waste picker families can leverage schemes like ${term.term.toLowerCase()} for improved livelihoods, social security, and dignity.`,
    'health': `${term.term} is a critical concern for waste picker communities who work in some of the most hazardous environments without adequate protection or medical support. Addressing ${term.term.toLowerCase()} requires a dual approach: immediate healthcare service delivery through camps and referrals, and long-term advocacy for occupational safety standards and health insurance coverage for informal waste workers. The Waste Pickers Welfare Foundation's healthcare programs directly address the impact of ${term.term.toLowerCase()} through monthly health camps, specialist referrals, and community health education.`,
    'getting-involved': `${term.term} is the bridge between public goodwill and tangible community impact. Understanding the mechanics and value of ${term.term.toLowerCase()} empowers individuals and organizations to make informed decisions about supporting waste picker welfare. Every act of support, whether financial, in-kind, or through volunteering, creates ripple effects across waste picker communities, funding education for children, healthcare for families, and livelihood training for women. The Waste Pickers Welfare Foundation has streamlined the process of ${term.term.toLowerCase()} to ensure maximum impact per contribution.`
  };

  return categoryContexts[term.category] || categoryContexts['core-concepts'];
}

function _generateIndianContext(term) {
  return `In India, ${term.term.toLowerCase()} operates within a unique socio-economic landscape defined by rapid urbanization, a massive informal economy employing over 80% of the workforce, and a growing legislative framework for social welfare and environmental protection. The Indian government has launched multiple initiatives, such as Swachh Bharat Mission, NAMASTE scheme, and E-Shram, that intersect with ${term.term.toLowerCase()}. However, implementation challenges persist, particularly in reaching the most marginalized communities like waste pickers. Delhi NCR, where the Waste Pickers Welfare Foundation operates, generates over 15,000 tonnes of waste daily and is home to an estimated 150,000 to 300,000 waste pickers. The region's growth makes ${term.term.toLowerCase()} increasingly relevant as cities grapple with waste management, social inclusion, and sustainable development.`;
}

function _generateWWFConnection(term) {
  return `The Waste Pickers Welfare Foundation integrates ${term.term.toLowerCase()} into its holistic approach to waste picker welfare. Founded in 2014 and operating across multiple communities in Delhi NCR, the Foundation addresses this area through its six core programs: Child Education, Healthcare, Women Empowerment, Drug Abuse Prevention, Community Development, and Skill Development. The Foundation's approach to ${term.term.toLowerCase()} is rooted in community participation, working alongside waste picker families rather than imposing top-down solutions. This participatory methodology ensures that programs are relevant, culturally sensitive, and sustainable. The Foundation holds all required legal registrations, including Trust Registration, 80G, 12A, DARPAN, and CSR, ensuring transparency and accountability in all operations related to ${term.term.toLowerCase()}.`;
}

function _generateKeyFacts(term) {
  return `Here are important numbers that contextualize ${term.term.toLowerCase()} in India:\n\n- India generates approximately 62 million tonnes of municipal solid waste annually, growing at about 5% per year\n- Delhi NCR alone produces over 15,000 tonnes of waste daily across its constituent cities\n- An estimated 1.5 to 4 million waste pickers work across India, with 150,000 to 300,000 in Delhi NCR\n- Waste pickers recover 20 to 25% of total urban waste for recycling, saving municipalities billions annually\n- The informal recycling sector generates an estimated INR 20,000 to 40,000 crore in economic value each year\n- Only 40 to 50% of urban households practice source waste segregation despite legal mandates\n- The Waste Pickers Welfare Foundation has served 4,000+ individuals annually and supported thousands of families with relief\n- 80% of India's workforce operates in the informal economy without social security protections`;
}

function _generateImplementationGuidance(term) {
  return `To translate ${term.term.toLowerCase()} from theory into real community impact, organizations should use a practical checklist: define the local problem in clear terms, map which households are most affected, identify which government or civic systems are relevant, and assign measurable milestones for action. In waste picker settlements, this usually means combining awareness with service access, because information without follow-through rarely changes outcomes. Teams should also document barriers encountered during implementation, such as ID gaps, referral delays, or transport costs, and resolve them in iterative cycles. Finally, progress should be reviewed with community participation so that interventions stay grounded in lived reality rather than top-down assumptions.`;
}

function _generateFAQs(term) {
  return [
    {
      question: `What is ${term.term.toLowerCase()}?`,
      answer: `${term.definition_short} ${term.definition_detailed.split('.').slice(0, 2).join('.').trim()}.`
    },
    {
      question: `Why is ${term.term.toLowerCase()} important for waste picker communities?`,
      answer: `${term.term} directly impacts waste picker communities by influencing their access to rights, services, and opportunities. For the estimated 1.5 to 4 million waste pickers in India, awareness and proper implementation of concepts like ${term.term.toLowerCase()} can mean the difference between exclusion and social inclusion. Organizations like the Waste Pickers Welfare Foundation work to ensure benefits reach the grassroots level.`
    },
    {
      question: `How does Waste Pickers Welfare Foundation work with ${term.term.toLowerCase()}?`,
      answer: `The Foundation integrates ${term.term.toLowerCase()} into its six comprehensive programs covering education, healthcare, women empowerment, drug abuse prevention, community development, and skill development across Delhi NCR.`
    },
    {
      question: 'How can I support these initiatives?',
      answer: 'You can donate (80G tax-exempt), volunteer your time and skills, partner through CSR, or spread awareness. Contact +91-9968125328 or visit wwfngo.org/get-involved.html for more information.'
    }
  ];
}

module.exports = { generate };
