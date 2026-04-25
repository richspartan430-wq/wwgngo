// ===================================
// pSEO Playbook - Personas
// ===================================

const config = require('../config');
const SchemaGenerator = require('../engine/schema-generator');

function generate(seedData) {
  const personas = seedData.personas || [];
  const categories = (seedData.categories && seedData.categories.categories) || [];
  const pages = [];

  for (const persona of personas) {
    const url = `/seo/personas/${persona.slug}.html`;
    const sections = _buildSections(persona, categories);
    const faqs = _buildFaqs(persona);

    const internalLinks = [
      '/index.html',
      '/about.html',
      '/programs.html',
      '/gallery.html',
      '/get-involved.html',
      '/contact.html'
    ];

    const relatedPages = personas
      .filter(p => p.slug !== persona.slug)
      .slice(0, 3)
      .map(p => `/seo/personas/${p.slug}.html`);

    const page = {
      url,
      playbook_type: 'personas',
      seo: {
        title: `${persona.name} Guide for Waste Picker NGO Partnerships | ${config.SITE_SHORT}`,
        meta_description: `Action guide for ${persona.name.toLowerCase()} engaging with waste picker welfare programs. Pain points, solutions, program fit, and measurable collaboration paths.`,
        primary_keyword: `${persona.name.toLowerCase()} waste picker NGO guide`,
        secondary_keywords: [
          `${persona.name.toLowerCase()} NGO partnership`,
          `${persona.name.toLowerCase()} social impact strategy`,
          `waste picker community support`,
          `Delhi NCR NGO collaboration`,
          `waste picker welfare programs`
        ],
        search_intent: 'informational'
      },
      content: {
        h1: `${persona.name}: How to Create Real Impact with Waste Picker Communities`,
        introduction: `${persona.description} This guide is designed for ${persona.name.toLowerCase()} stakeholders who want practical, high-confidence decisions instead of generic NGO advice. It explains the exact constraints this persona usually faces, the solution design patterns that work in waste picker communities, and the most reliable way to align with the Waste Pickers Welfare Foundation for measurable outcomes across Delhi NCR.`,
        sections,
        faq: faqs,
        call_to_action: `If you are a ${persona.name.toLowerCase()} looking for practical collaboration, contact Waste Pickers Welfare Foundation at +91-9968125328. We can co-design a scoped engagement plan with clear milestones, transparent reporting, and direct community outcomes.`
      },
      schema: SchemaGenerator.articlePage(
        `${persona.name} Waste Picker NGO Guide`,
        `Persona-specific strategy for ${persona.name.toLowerCase()} supporting waste picker welfare in Delhi NCR.`,
        url,
        '2026-04-22'
      ),
      internal_links: [...new Set(internalLinks)],
      related_pages: [...new Set(relatedPages)],
      data_requirements_used: ['personas.json', 'categories.json']
    };

    pages.push(page);
  }

  return pages;
}

function _buildSections(persona, categories) {
  const categoryNames = categories.map(c => c.name).slice(0, 6);
  const painPoints = (persona.pain_points || []).map(p => `- ${p}`).join('\n');
  const solutions = (persona.solutions || []).map(s => `- ${s}`).join('\n');
  const motivations = (persona.motivations || []).map(m => `- ${m}`).join('\n');

  return [
    {
      heading: `${persona.name} Snapshot: Decision Context and Constraints`,
      body: `${persona.description}\n\nMost ${persona.name.toLowerCase()} stakeholders work under strong constraints: limited time, high accountability, and pressure to demonstrate visible impact. In waste picker welfare, these constraints become sharper because communities are often under-documented, needs are cross-sectoral, and outcomes require consistent local engagement instead of one-off activity.\n\nA practical operating model for this persona starts with clear scope, location targeting, and measurable milestones. Instead of trying to solve everything at once, effective engagement focuses on a priority wedge, such as school retention, preventive healthcare access, or women-led livelihood strengthening, then layers additional interventions once local trust is established.`
    },
    {
      heading: `Top Pain Points for ${persona.name}`,
      body: `The most common friction points we see for ${persona.name.toLowerCase()} collaborators are:\n\n${painPoints}\n\nThese pain points are valid and expected. Waste picker ecosystems are dynamic, and program performance can vary by neighborhood, municipal practice, seasonality, and market cycles. The best way to de-risk decisions is to align on transparent baseline data, realistic timelines, and a reporting format that reflects real community behavior instead of vanity metrics.`
    },
    {
      heading: `Solution Blueprint: What Works in Practice`,
      body: `For this persona, an effective solution stack typically includes:\n\n${solutions}\n\nExecution quality matters more than presentation quality. In this context, the strongest collaborations use a rhythm of monthly field actions, quarterly review checkpoints, and adaptive planning based on what communities actually need. That approach allows quick correction when assumptions fail and increases confidence that investment is reaching the right households with the right service intensity.`
    },
    {
      heading: `Program Fit Matrix for ${persona.name}`,
      body: `Waste picker welfare is not a single-theme issue. It intersects education, health, gender, livelihoods, and governance. For ${persona.name.toLowerCase()} stakeholders, the most useful way to prioritize is to map intent against program pathways:\n\n- Child Education: Best when your objective is long-term mobility and child labor reduction.\n- Healthcare: Best when urgent risk reduction and service access are priorities.\n- Women Empowerment: Best when household resilience and financial agency are core goals.\n- Community Development: Best when rights access and scheme linkages are required.\n- Skill Development: Best when income diversification is the primary objective.\n\nCurrent high-relevance categories in this ecosystem include ${categoryNames.join(', ')}. A portfolio approach often works best: one high-urgency track plus one long-horizon track.`
    },
    {
      heading: `Motivation Alignment and Outcome Planning`,
      body: `Common motivations for this persona include:\n\n${motivations}\n\nMotivation is useful only when translated into measurable outputs. A robust plan should define: baseline condition, target beneficiary segment, expected behavior change, and time-bound verification method. Example indicators include school attendance continuity, health referral completion rate, women's group participation frequency, and documentation completion for scheme access.\n\nWhen these indicators are reviewed consistently, ${persona.name.toLowerCase()} partners get both accountability and strategic clarity. This prevents drift, reduces duplicate effort, and improves cross-team confidence in long-term support decisions.`
    },
    {
      heading: `90-Day Collaboration Roadmap for ${persona.name}`,
      body: `A practical 90-day roadmap can look like this:\n\n- Days 1-15: Define location scope, beneficiary segment, and measurable goals.\n- Days 16-30: Conduct field baseline and shortlist immediate risk interventions.\n- Days 31-60: Run pilot actions with weekly field observations and issue logging.\n- Days 61-75: Review outcomes, identify bottlenecks, and recalibrate service model.\n- Days 76-90: Publish milestone report and lock next-quarter execution plan.\n\nThis roadmap gives ${persona.name.toLowerCase()} collaborators a structured path to move from intent to evidence-based action while keeping local realities at the center.`
    },
    {
      heading: `Common Mistakes ${persona.name} Can Avoid`,
      body: `Three mistakes appear repeatedly in early collaborations. First, over-scoping: trying to solve every community issue in one quarter usually weakens execution quality. Second, reporting without field verification: dashboard-only review can miss critical realities like beneficiary drop-off, seasonality, and local access barriers. Third, short campaign cycles without continuity planning: one-time activity may look active but does not build durable outcomes. A better pattern is disciplined sequencing: narrow initial scope, verify on ground, then scale what works. For ${persona.name.toLowerCase()} stakeholders, this approach improves confidence, protects resources, and leads to stronger long-term trust with communities and partners.`
    }
  ];
}

function _buildFaqs(persona) {
  return [
    {
      question: `Why does a ${persona.name.toLowerCase()} need a dedicated strategy for waste picker communities?`,
      answer: `Because outcomes in this space depend on local context, trust, and cross-program coordination. A dedicated strategy helps ${persona.name.toLowerCase()} stakeholders avoid fragmented interventions and build measurable, repeatable impact.`
    },
    {
      question: `How quickly can ${persona.name.toLowerCase()} collaborations show results?`,
      answer: 'Early operational signals can appear within 30 to 90 days when goals are scoped clearly and baseline tracking is in place. Durable community outcomes generally require multiple quarters of consistent execution.'
    },
    {
      question: `What should ${persona.name.toLowerCase()} prioritize first?`,
      answer: 'Start with one urgent and one strategic objective, for example healthcare access plus school retention. This creates immediate value while building long-term stability.'
    },
    {
      question: 'How can we verify impact quality?',
      answer: 'Use transparent baseline metrics, time-bound milestones, field verification, and quarterly review loops. Pair narrative case evidence with numeric outcome indicators for complete visibility.'
    }
  ];
}

module.exports = { generate };
