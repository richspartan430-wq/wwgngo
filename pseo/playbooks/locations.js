// ===================================
// pSEO Playbook - Locations
// ===================================

const config = require('../config');
const SchemaGenerator = require('../engine/schema-generator');

function generate(seedData) {
  const locations = seedData.locations || [];
  const pages = [];

  for (const loc of locations) {
    const url = `/seo/locations/${loc.slug}.html`;

    const sections = [
      {
        heading: `Waste Picker Communities in ${loc.name}`,
        body: `${loc.description}\n\nThe area is home to an estimated ${loc.waste_picker_population} waste pickers and their families, who form the backbone of the local informal recycling ecosystem. These communities usually live close to waste generation sources such as markets, commercial streets, residential colonies, and transfer points. Despite their essential role in keeping the city clean and circular, many workers in ${loc.name} still face low and unstable income, poor access to health services, unsafe working conditions, and limited formal recognition by institutions. A location-specific strategy is essential because collection routes, scrap prices, municipal systems, and social support options differ significantly across neighborhoods.`
      },
      {
        heading: `Key Waste Picker Settlements and Local Challenges in ${loc.name}`,
        body: _generateKeyCommunitiesSection(loc)
      },
      {
        heading: `Programs Active in ${loc.name}`,
        body: _generateProgramsSection(loc)
      },
      {
        heading: `Local Income Realities, Scrap Pricing, and Service Gaps in ${loc.name}`,
        body: _generateLocalEconomics(loc)
      },
      {
        heading: `Regulations, Schemes, and Local Governance in ${loc.name}`,
        body: _generateRegulationSection(loc)
      },
      {
        heading: `Waste Management Trends and Planning Context in ${loc.name}`,
        body: _generateWasteContext(loc)
      },
      {
        heading: `Practical Recommendations for Donors, Volunteers, and Institutions in ${loc.name}`,
        body: _generateRecommendations(loc)
      }
    ];

    const faqs = [
      {
        question: `How many waste pickers are in ${loc.name}?`,
        answer: `${loc.name} is estimated to have ${loc.waste_picker_population} waste pickers and family members connected to informal recycling. The number often fluctuates seasonally and remains undercounted because many workers are informal, mobile, and not officially registered.`
      },
      {
        question: `What programs does Waste Pickers Welfare Foundation run in ${loc.name}?`,
        answer: loc.programs_active.length > 0
          ? `Current programs in ${loc.name} include ${loc.programs_active.map(p => p.replace(/-/g, ' ')).join(', ')}. These efforts cover child education, healthcare outreach, women-centered livelihood support, community mobilization, and access to welfare schemes.`
          : `The Foundation is evaluating expansion opportunities in ${loc.name}. Existing operational experience from nearby NCR communities can be adapted with local partners, volunteers, and municipal coordination to launch phased support.`
      },
      {
        question: `What local issues affect waste picker livelihoods in ${loc.name}?`,
        answer: `Common issues include fluctuating scrap rates, inconsistent access to segregated dry waste, long-distance transport costs, identity documentation gaps, and low access to safety gear and health services. These issues are location-dependent and require local coordination with ward officials, scrap dealers, and civil society groups.`
      },
      {
        question: `How can I help waste picker families in ${loc.name}?`,
        answer: `You can support through tax-exempt donations, volunteering in education or outreach, sponsoring health camps, or enabling corporate CSR partnerships. Contact +91-9968125328 to discuss location-specific support plans for ${loc.name}.`
      }
    ];

    const internalLinks = [
      '/index.html',
      '/about.html',
      '/programs.html',
      '/gallery.html',
      '/get-involved.html',
      '/contact.html'
    ];

    const relatedPages = locations
      .filter(l => l.slug !== loc.slug)
      .slice(0, 4)
      .map(l => `/seo/locations/${l.slug}.html`);

    const page = {
      url,
      playbook_type: 'locations',
      seo: {
        title: `Waste Picker Welfare in ${loc.name} - ${loc.state} | ${config.SITE_SHORT}`,
        meta_description: `Location guide for waste picker welfare in ${loc.name}, ${loc.state}. Local community insights, program priorities, regulations, and ways to support families through education and healthcare.`,
        primary_keyword: `waste picker welfare ${loc.name.toLowerCase()}`,
        secondary_keywords: [
          `NGO ${loc.name.toLowerCase()}`,
          `waste picker support ${loc.name.toLowerCase()}`,
          `ragpicker welfare ${loc.name.toLowerCase()}`,
          `waste management ${loc.name.toLowerCase()}`,
          `donate NGO ${loc.city.toLowerCase()}`,
          `community development ${loc.name.toLowerCase()}`
        ],
        search_intent: 'informational'
      },
      content: {
        h1: `Waste Picker Welfare in ${loc.name}`,
        introduction: `This location guide explains how waste picker communities in ${loc.name}, ${loc.state} work, what barriers they face, and what practical interventions create measurable results. ${loc.name} has an estimated ${loc.waste_picker_population} workers and families connected to informal recycling. A strong local response blends health access, child education, women's economic strengthening, rights awareness, and better integration with municipal waste systems.`,
        sections,
        faq: faqs,
        call_to_action: `Help us expand impact in ${loc.name}. Your 80G tax-exempt contribution supports education support, healthcare camps, women-led livelihood groups, and community development planning for waste picker families. Contact +91-9968125328 to build a local support initiative.`
      },
      schema: SchemaGenerator.locationPage(loc, url),
      internal_links: internalLinks,
      related_pages: relatedPages,
      data_requirements_used: ['locations.json', 'glossary-terms.json']
    };

    pages.push(page);
  }

  return pages;
}

function _generateKeyCommunitiesSection(loc) {
  const lines = loc.key_communities.map(c => {
    return `- ${c}: A meaningful cluster of waste picker households where families often combine door-to-door collection, street picking, and sorting. Typical local issues include housing insecurity, limited sanitation infrastructure, documentation gaps, and irregular access to public services.`;
  });

  return `The Foundation tracks high-need clusters in ${loc.name} to align outreach and services with real conditions:\n\n${lines.join('\n\n')}\n\nA location map built around these communities improves program efficiency. It helps teams prioritize where health camps should be held, where school enrollment drives are most urgent, and where women-led livelihood groups can gain traction quickly.`;
}

function _generateProgramsSection(loc) {
  if (loc.programs_active.length === 0) {
    return `Current operations are limited in ${loc.name}, but local demand signals are clear. The Foundation can phase expansion by starting with community mapping, ID-document support, and referral-based service access. A pilot model usually includes:\n\n- Monthly field visits to build trust and identify high-risk households\n- Awareness sessions on E-Shram, health entitlements, and school enrollment\n- Linkages with nearby health camps and community learning centres\n- Partnerships with local volunteers or institutions for on-ground continuity\n\nIf you are a donor, CSR lead, or local institution in ${loc.name}, supporting this pilot phase can accelerate full program rollout.`;
  }

  const programDescriptions = {
    'child-education': '**Child Education:** Community-based learning support, bridge education, enrollment assistance, and retention support for children of waste picker families who are at risk of dropout.',
    'healthcare': '**Healthcare:** Mobile and camp-based healthcare support including screenings, medicine access, specialist referrals, and health awareness for occupational risks.',
    'women-empowerment': '**Women Empowerment:** Self-Help Group support, financial literacy, rights awareness, and vocational opportunities to diversify household income.',
    'drug-abuse-prevention': '**Drug Abuse Prevention:** Counseling, family support, and referral pathways that reduce addiction risk and improve social stability in high-stress settlements.',
    'community-development': '**Community Development:** Neighborhood-level meetings, government scheme onboarding, documentation support, and collective issue escalation.',
    'skill-development': '**Skill Development:** Practical vocational training and market linkage support so youth and women can move toward safer and more stable income streams.'
  };

  const descriptions = loc.programs_active
    .map(p => programDescriptions[p] || null)
    .filter(Boolean);

  return `Programs in ${loc.name} are selected based on community need and operational feasibility. The current active stack includes:\n\n${descriptions.join('\n\n')}\n\nThis localized mix allows teams to balance immediate support with long-term transition outcomes.`;
}

function _generateLocalEconomics(loc) {
  const pricingByType = {
    district: {
      plastic: 'INR 12-20 per kg',
      paper: 'INR 8-14 per kg',
      metal: 'INR 22-45 per kg'
    },
    city: {
      plastic: 'INR 13-22 per kg',
      paper: 'INR 9-15 per kg',
      metal: 'INR 24-50 per kg'
    },
    region: {
      plastic: 'INR 12-24 per kg',
      paper: 'INR 8-16 per kg',
      metal: 'INR 22-52 per kg'
    }
  };

  const rates = pricingByType[loc.type] || pricingByType.city;

  return `In ${loc.name}, household income for waste picker families is strongly affected by daily scrap-rate volatility, transport costs, and access to segregated recyclable material. A typical worker may earn enough for immediate expenses on good collection days, but income can drop sharply during rain, market slowdown, or route disruption.\n\nIndicative local resale ranges (can vary by season and buyer):\n- Mixed plastic: ${rates.plastic}\n- Paper and cardboard: ${rates.paper}\n- Metal scrap: ${rates.metal}\n\nBeyond commodity rates, service gaps also shape livelihood outcomes: low access to protective gear, delayed treatment for injuries, low child-school retention due financial stress, and limited formal savings mechanisms. Location-specific welfare planning in ${loc.name} should therefore combine livelihood stabilization with health and education continuity.`;
}

function _generateRegulationSection(loc) {
  const authorityByState = {
    Delhi: 'Municipal Corporation of Delhi (MCD) and district welfare offices',
    'Uttar Pradesh': 'Nagar Nigam/Nagar Palika structures and district social welfare offices',
    Haryana: 'Municipal Corporation frameworks with district-level labor and welfare coordination',
    'Multi-state': 'Cross-jurisdiction municipal bodies across Delhi, Uttar Pradesh, and Haryana'
  };

  const localAuthority = authorityByState[loc.state] || 'local urban local body and district welfare administration';

  return `${loc.name} is governed by ${localAuthority}. For waste picker welfare, implementation quality often depends on ward-level execution rather than policy announcements alone.\n\nKey regulatory and scheme pillars relevant to families in ${loc.name}:\n- Solid Waste Management Rules (2016) for source segregation and material recovery\n- E-Shram registration for social security visibility of unorganized workers\n- State health and insurance linkages for vulnerable households\n- Child education enrollment pathways under Right to Education frameworks\n\nIn practice, the biggest gaps are awareness, documentation readiness, and last-mile follow-through. Local civil society support helps bridge these gaps so that policy entitlements convert into real outcomes for families.`;
}

function _generateWasteContext(loc) {
  const contextByType = {
    district: `As a district-level urban zone, ${loc.name} has high-density waste movement and strong dependence on informal sorting and collection. Door-to-door formal systems do not always reach every settlement consistently, so informal workers remain essential for recovery and diversion. Planning should focus on safer collection routes, localized dry-waste aggregation points, and stronger community engagement on segregation at source.`,
    city: `${loc.name} generates substantial municipal waste each day and depends on mixed formal-informal systems to keep recyclable flows moving. As urban growth accelerates, route pressure, rising disposal costs, and material contamination become more severe. Integrating waste picker knowledge into city-level planning can improve both diversion rates and livelihoods.`,
    region: `${loc.name} represents a multi-city, multi-state waste ecosystem. Jurisdiction boundaries often create operational friction for workers and service providers, especially for transport, route continuity, and documentation support. Regional coordination can reduce duplication and improve welfare outcomes through shared standards, interoperable registration support, and harmonized service referral networks.`
  };

  return contextByType[loc.type] || contextByType.city;
}

function _generateRecommendations(loc) {
  return `For stakeholders who want measurable progress in ${loc.name}, practical actions include:\n\n- Build a ward-level baseline: Map settlements, route patterns, and urgent household risks before launching programs.\n- Start with a dual-track service model: Combine immediate support (health and documentation) with long-term pathways (education retention and skill building).\n- Use local champions: Train community volunteers and SHG leaders to maintain continuity between formal camp days.\n- Align with local institutions: Coordinate with schools, clinics, and municipal officers to reduce referral friction.\n- Track outcomes quarterly: Monitor school retention, health follow-up rates, and income stabilization indicators to refine local strategy.\n\nThis approach helps turn one-time support into durable welfare progress for waste picker families in ${loc.name}.`;
}

module.exports = { generate };
