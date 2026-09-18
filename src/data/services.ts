import { ENTERPRISE_SERVICES } from './services-enterprise';

/**
 * CMS models: service, subService, package, faq, caseStudy
 * Each service carries its own accent colour and icon set so pages feel
 * distinct but related, per section 5 of the specification.
 */

export type InteractiveKind =
  | 'template-gallery'
  | 'cpl-calculator'
  | 'creative-slider'
  | 'revenue-estimator'
  | 'dispatch-fee'
  | 'coverage-builder'
  | 'engine-finder'
  | 'ballpark'
  | 'team-builder';

export interface SubService {
  slug: string;
  name: string;
  summary: string;
  body: string;
  deliverables: string[];
  /** Primary keyword target for this page. */
  keyword: string;
}

export interface PackageTier {
  name: 'Starter' | 'Growth' | 'Pro';
  tagline: string;
  /** Row id in the service price table that this tier quotes from. */
  priceRow: string;
  /** Which end of the range the tier sits at. */
  anchor: 'low' | 'mid' | 'high';
  features: string[];
  popular?: boolean;
}

export interface ProcessStep {
  title: string;
  body: string;
  duration: string;
}

export interface ServiceCaseStudy {
  slug: string;
  client: string;
  sector: string;
  challenge: string;
  work: string[];
  results: { label: string; before: string; after: string; delta: string }[];
  quote?: { text: string; role: string };
}

export interface Service {
  slug: string;
  name: string;
  navLabel: string;
  promise: string;
  summary: string;
  description: string;
  icon: string;
  /** RGB triplet, written into --svc on the service page. */
  accent: string;
  accentHex: string;
  heroVisual: string;
  interactive: InteractiveKind;
  interactiveTitle: string;
  startingPriceRow: string;
  problem: { title: string; body: string; points: string[] };
  solution: { title: string; body: string; points: string[] };
  subServices: SubService[];
  included: string[];
  packages: PackageTier[];
  process: ProcessStep[];
  tools: string[];
  caseStudy: ServiceCaseStudy;
  faqs: { q: string; a: string }[];
  metrics: { label: string; value: string }[];
  timelines?: string;
}

const BASE_SERVICES: Service[] = [
  {
    slug: 'web-development',
    name: 'Custom Software, Web and App Development',
    navLabel: 'Software and App Development',
    promise: 'Sites and apps that load fast, rank well and turn visitors into booked work.',
    summary: 'Custom software, SaaS platforms, web applications, enterprise portals and iOS and Android apps, built to a design system and handed over with documentation.',
    description:
      'We design and build the whole surface a customer touches: the landing page that catches the ad click, the site that answers their questions, the store that takes the order and the app that keeps them coming back. Everything ships on a component library you own, with a CMS your team can actually use.',
    icon: 'Code2',
    accent: '79 140 255',
    accentHex: '#4F8CFF',
    heroVisual: 'Browser and phone mockups assembling on scroll',
    interactive: 'template-gallery',
    interactiveTitle: 'Template and niche gallery',
    startingPriceRow: 'landing-page',
    timelines: 'Landing page 1-2 weeks · business site 4-8 weeks · e-commerce 6-12 weeks · app MVP 3-4 months',
    problem: {
      title: 'A site that looks fine and sells nothing',
      body: 'Most business sites were built once, by someone who has since left, on a theme nobody can safely update. Pages load slowly, the copy talks about the company instead of the customer, and nothing on the page tells a visitor what to do next.',
      points: [
        'Page speed scores in the 40s on mobile, so ad clicks bounce before they render',
        'No CMS, so every copy change is a developer ticket',
        'Forms that email a mailbox nobody reads, with no CRM behind them',
        'Design that cannot stretch to a new service line without a rebuild',
      ],
    },
    solution: {
      title: 'One system, built to extend',
      body: 'We start from your conversion path, not a theme. You get a token-driven design system, a component library, a CMS wired to every block, and analytics that tell you which section earns the enquiry.',
      points: [
        'Lighthouse 90+ on mobile as an acceptance criterion, not an aspiration',
        'Every block editable in the CMS, including pricing and FAQs',
        'Forms land in your CRM with source, campaign and page attribution',
        'Component library documented so your next agency can pick it up',
      ],
    },
    subServices: [
      {
        slug: 'custom-software-development',
        name: 'Custom software development',
        summary: 'Software built around your processes, integrated with your systems and owned by you.',
        body: 'Bespoke business software that replaces spreadsheets, disconnected tools and expensive per-seat licences: workflow systems, operations platforms, customer portals and internal tools, integrated with your CRM, ERP, accounting and data stack. We run discovery, architecture, development, QA and cloud deployment, and hand over documented code in your repository.',
        deliverables: ['Discovery and requirements', 'Solution architecture', 'Agile development in two-week sprints', 'Automated testing in CI', 'Cloud deployment on AWS or Azure', 'Documentation and handover'],
        keyword: 'custom software development company',
      },
      {
        slug: 'saas-development',
        name: 'SaaS development',
        summary: 'Multi-tenant SaaS platforms with billing, roles and analytics.',
        body: 'We build SaaS products from MVP to scale: multi-tenant architecture, authentication and single sign-on, roles and permissions, Stripe or Paddle subscription billing, usage analytics, audit trails and an admin console. Releases are phased so you can onboard paying customers before the full roadmap is done.',
        deliverables: ['Product and MVP scoping', 'Multi-tenant architecture', 'Auth, SSO and permissions', 'Subscription billing', 'Admin console and analytics', 'Scaling and performance testing'],
        keyword: 'SaaS development company',
      },
      {
        slug: 'enterprise-software',
        name: 'Enterprise software development',
        summary: 'Secure, integrated systems for large organisations.',
        body: 'Enterprise applications that meet security, compliance and scale requirements: single sign-on with Azure AD or Okta, role-based access, audit logging, data residency in-region for GDPR, UAE and Saudi PDPL or Singapore PDPA, and integrations with Salesforce, Dynamics 365, SAP and Odoo.',
        deliverables: ['Security and compliance design', 'SSO and role-based access', 'ERP and CRM integration', 'Data residency planning', 'Load and security testing', 'Long-term support SLAs'],
        keyword: 'enterprise software development services',
      },
      {
        slug: 'landing-pages',
        name: 'Landing pages',
        summary: 'Single-purpose pages built to convert one campaign, one offer, one audience.',
        body: 'A landing page has one job. We write the offer, build the page, wire the tracking and give you a variant to test against it. Most go live inside two weeks.',
        deliverables: ['Offer and copy workshop', 'Design and build', 'Form plus CRM handoff', 'Conversion tracking and GTM', 'A/B variant'],
        keyword: 'high converting landing page design',
      },
      {
        slug: 'business-websites',
        name: 'Business websites',
        summary: 'Five to ten page sites with a CMS, blog and contact flows your team can run.',
        body: 'The core marketing site: services, proof, pricing guidance, team and contact. Built on a design system so adding a page later takes hours, not a rebuild.',
        deliverables: ['Sitemap and wireframes', 'Design system and page templates', 'CMS setup and training', 'On-page SEO and schema', 'Analytics and consent'],
        keyword: 'small business website development',
      },
      {
        slug: 'ecommerce',
        name: 'E-commerce',
        summary: 'Catalogue, checkout, payments and fulfilment that survive a busy season.',
        body: 'Storefronts on Shopify, WooCommerce or headless commerce, with the operational plumbing that keeps orders moving: inventory sync, shipping rules, tax, returns and abandoned cart recovery.',
        deliverables: ['Catalogue and merchandising', 'Checkout and payments', 'Shipping, tax and fulfilment', 'Abandoned cart and email flows', 'Performance and load testing'],
        keyword: 'ecommerce website development agency',
      },
      {
        slug: 'web-apps',
        name: 'Web apps and portals',
        summary: 'Authenticated dashboards, customer portals and internal tools.',
        body: 'When a spreadsheet stops scaling, we build the tool that replaces it: roles and permissions, dashboards, workflow, audit trails and the integrations that feed it.',
        deliverables: ['Discovery and data model', 'Auth, roles and permissions', 'Dashboards and workflow', 'Third-party API integration', 'Documentation and handover'],
        keyword: 'custom web application development',
      },
      {
        slug: 'mobile-apps',
        name: 'Mobile apps',
        summary: 'iOS, Android and cross-platform apps, from MVP to mid-complexity.',
        body: 'React Native and Flutter for most builds, native where the hardware demands it. We scope an MVP you can ship in a quarter, then iterate on what users actually do.',
        deliverables: ['MVP scope and prototype', 'iOS and Android build', 'Push, analytics and crash reporting', 'Store submission', 'Post-launch iteration'],
        keyword: 'mobile app development company',
      },
      {
        slug: 'cms-templates',
        name: 'CMS and templates',
        summary: 'Reusable page templates and a CMS your marketing team is not afraid of.',
        body: 'Every block your site needs, modelled in the CMS with sensible defaults, preview and validation, so a marketer can build a campaign page without a deploy.',
        deliverables: ['Content modelling', 'Block library', 'Preview and draft workflow', 'Editor training', 'Maintenance guide'],
        keyword: 'headless cms website templates',
      },
      {
        slug: 'redesigns',
        name: 'Redesigns and migrations',
        summary: 'Replatform without losing the rankings you spent years earning.',
        body: 'We audit the existing site, map every URL, preserve what ranks, redirect what moves and measure the result for ninety days after launch.',
        deliverables: ['Technical and content audit', 'URL map and redirects', 'Design system refresh', 'Phased migration', '90-day ranking watch'],
        keyword: 'website redesign and migration services',
      },
      {
        slug: 'maintenance',
        name: 'Maintenance and support',
        summary: 'Patching, monitoring, backups and a named engineer who answers.',
        body: 'Monthly retainers covering security patching, dependency upgrades, uptime monitoring, backups and a pool of change hours for the small requests that pile up.',
        deliverables: ['Security patching', 'Uptime and error monitoring', 'Backups and restore tests', 'Monthly change hours', 'Quarterly performance review'],
        keyword: 'website maintenance and support plans',
      },
    ],
    included: [
      'Discovery workshop and written scope',
      'Design system with light and dark themes',
      'Responsive build across four breakpoints',
      'CMS modelling, setup and editor training',
      'On-page SEO, schema markup and sitemap',
      'Analytics, consent and conversion tracking',
      'Accessibility pass to WCAG 2.1 AA',
      'Performance budget and Lighthouse verification',
      'Repository access and maintenance guide',
      'Thirty days of post-launch support',
    ],
    packages: [
      {
        name: 'Starter',
        tagline: 'One page, one offer, live in two weeks.',
        priceRow: 'landing-page',
        anchor: 'low',
        features: ['Single landing page', 'Copy polish on your draft', 'One form with CRM handoff', 'Analytics and conversion tracking', 'Two rounds of revisions'],
      },
      {
        name: 'Growth',
        tagline: 'The full marketing site, CMS and all.',
        priceRow: 'business-site',
        anchor: 'mid',
        popular: true,
        features: ['Five to ten pages', 'Design system and block library', 'CMS setup plus editor training', 'Blog and case study templates', 'On-page SEO and schema', 'Ninety days of support'],
      },
      {
        name: 'Pro',
        tagline: 'Store, portal or app with integrations.',
        priceRow: 'agency-build',
        anchor: 'high',
        features: ['Bespoke design system and motion', 'E-commerce, portal or app build', 'Third-party and CRM integrations', 'Load and performance testing', 'Dedicated squad and sprint cadence', 'Twelve months of maintenance'],
      },
    ],
    process: [
      { title: 'Discovery', body: 'We map the conversion path, audit what exists and agree the scope in writing before anyone opens a design tool.', duration: 'Week 1' },
      { title: 'Design system', body: 'Tokens, components and two or three key templates, in light and dark, signed off in Figma.', duration: 'Weeks 2-3' },
      { title: 'Build', body: 'Front end, CMS modelling and integrations, on a staging URL you can watch fill up.', duration: 'Weeks 3-7' },
      { title: 'Launch', body: 'Cross-browser QA, Lighthouse, schema, redirects, analytics, training and handover.', duration: 'Week 8' },
    ],
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Sanity', 'Shopify', 'WordPress', 'React Native', 'Flutter', 'Vercel', 'Cloudflare', 'Playwright'],
    caseStudy: {
      slug: 'regional-logistics-site-rebuild',
      client: 'Regional logistics operator, 40 vehicles',
      sector: 'Trucking and logistics',
      challenge:
        'The existing site took nine seconds to render on a phone, had no CMS and sent every enquiry to a shared mailbox. Paid traffic was bouncing before the hero appeared.',
      work: [
        'Rebuilt on Next.js with a token-driven design system',
        'Modelled every block in the CMS, including service pricing',
        'Wired forms into the CRM with campaign attribution',
        'Added a quote calculator on the carrier landing page',
      ],
      results: [
        { label: 'Mobile Lighthouse', before: '41', after: '96', delta: '+55' },
        { label: 'Largest Contentful Paint', before: '8.9s', after: '1.6s', delta: '-82%' },
        { label: 'Enquiries per month', before: '11', after: '38', delta: '+245%' },
        { label: 'Cost per enquiry', before: '$187', after: '$61', delta: '-67%' },
      ],
      quote: {
        text: 'The difference showed up in the phone ringing, not just in a report.',
        role: 'Operations director',
      },
    },
    faqs: [
      { q: 'Who owns the code and the design files?', a: 'You do, from day one. The repository sits in your GitHub organisation and the Figma library is shared to your account. There is no licence to keep paying and nothing is locked to us.' },
      { q: 'Can our marketing team edit the site without a developer?', a: 'Yes. Every block on every page is modelled in the CMS with preview and draft workflow. Editor training is part of handover and the maintenance guide covers the rest.' },
      { q: 'How do you hit Lighthouse 90+ with this much animation?', a: 'We animate only transform and opacity, lazy-load anything below the fold, keep the motion bundle under roughly 80 KB gzipped and set a performance budget that fails the build when it is exceeded.' },
      { q: 'What happens to our search rankings during a redesign?', a: 'We map every existing URL, preserve the pages that rank, redirect what moves and monitor positions for ninety days after launch. Ranking loss during migration is a planning failure, not an inevitability.' },
      { q: 'Do you work with our existing developers?', a: 'Often. We can deliver a design system and component library that your team builds on, or embed alongside them for a defined stretch.' },
    ],
    metrics: [
      { label: 'Mobile Lighthouse target', value: '90+' },
      { label: 'Landing page turnaround', value: '1-2 wks' },
      { label: 'Post-launch support', value: '30 days' },
    ],
  },

  {
    slug: 'lead-generation',
    name: 'Lead Generation',
    navLabel: 'Lead Generation',
    promise: 'A predictable number of qualified conversations on your calendar every month.',
    summary: 'B2B outbound, cold email, LinkedIn, appointment setting and the data work that makes them land.',
    description:
      'We build and run the outbound engine: the list, the message, the sequence, the follow-up and the booked meeting. You get qualified conversations with people who match your ideal customer, not a spreadsheet of raw contacts.',
    icon: 'Filter',
    accent: '34 197 94',
    accentHex: '#22C55E',
    heroVisual: 'Funnel filling with leads',
    interactive: 'cpl-calculator',
    interactiveTitle: 'Cost-per-lead calculator',
    startingPriceRow: 'retainer',
    problem: {
      title: 'Pipeline that depends on referrals and luck',
      body: 'When new business arrives by word of mouth, good months and bad months have no explanation and no fix. The sales team spends its best hours prospecting instead of closing.',
      points: [
        'No repeatable source of new conversations',
        'Reps prospecting instead of selling',
        'Lists bought once, never cleaned, burning the sending domain',
        'No agreed definition of what counts as qualified',
      ],
    },
    solution: {
      title: 'An outbound system with a number attached',
      body: 'We agree the qualification criteria first, then build the list, warm the domains, write the sequences and run the follow-up until a meeting is held. Every step is measured so the cost per booked meeting is a known figure.',
      points: [
        'Written ideal customer profile and qualification criteria',
        'Verified, deduplicated lists refreshed every month',
        'Dedicated sending domains, warmed before volume',
        'Meetings confirmed and reminded so they actually happen',
      ],
    },
    subServices: [
      {
        slug: 'b2b-outbound',
        name: 'B2B outbound',
        summary: 'Multi-channel outbound to a defined ideal customer profile.',
        body: 'Email, LinkedIn and phone working from one list and one message, so a prospect sees a coherent approach instead of three disconnected pitches.',
        deliverables: ['ICP definition', 'Channel plan', 'Sequence build', 'Weekly reporting', 'Meeting handoff'],
        keyword: 'b2b outbound lead generation agency',
      },
      {
        slug: 'cold-email',
        name: 'Cold email',
        summary: 'Deliverability-first email programmes that reach the inbox.',
        body: 'Dedicated domains, SPF, DKIM and DMARC configured properly, warmed inboxes, volume ramped slowly and copy written to get a reply rather than a click.',
        deliverables: ['Domain and inbox setup', 'Authentication and warming', 'Copy and sequence', 'Reply handling', 'Deliverability monitoring'],
        keyword: 'cold email lead generation service',
      },
      {
        slug: 'linkedin-outreach',
        name: 'LinkedIn outreach',
        summary: 'Connection, conversation and content working together.',
        body: 'Profile positioning, targeted connection requests and a conversation cadence that stays inside LinkedIn limits, supported by content that makes the outreach land warmer.',
        deliverables: ['Profile optimisation', 'Targeting and list build', 'Connection and message cadence', 'Content support', 'Reply management'],
        keyword: 'linkedin lead generation services',
      },
      {
        slug: 'appointment-setting',
        name: 'Appointment setting',
        summary: 'We book the meeting, confirm it and chase the no-shows.',
        body: 'Trained setters work your replies and inbound, qualify against the agreed criteria and put the meeting on the right calendar with a confirmation and a reminder sequence.',
        deliverables: ['Qualification script', 'Calendar integration', 'Confirmation and reminders', 'No-show recovery', 'Weekly pipeline review'],
        keyword: 'b2b appointment setting services',
      },
      {
        slug: 'campaign-landing-pages',
        name: 'Campaign landing pages',
        summary: 'Pages built for the campaign, not repurposed from the homepage.',
        body: 'Every outbound campaign gets a page that answers the exact promise in the message, with one form and one next step.',
        deliverables: ['Offer and page copy', 'Design and build', 'Form and CRM wiring', 'Tracking', 'A/B variant'],
        keyword: 'lead generation landing page',
      },
      {
        slug: 'lead-qualification',
        name: 'Lead qualification',
        summary: 'Scoring and routing so sales only sees what it should.',
        body: 'Rules that score inbound and outbound leads against fit and intent, then route them to the right rep with the context already attached.',
        deliverables: ['Scoring model', 'Routing rules', 'CRM field mapping', 'SLA on response time', 'Monthly calibration'],
        keyword: 'lead qualification and scoring',
      },
      {
        slug: 'data-list-building',
        name: 'Data and list building',
        summary: 'Verified contact data that does not bounce.',
        body: 'Sourced, enriched, verified and deduplicated against your CRM, with suppression lists respected and refreshed monthly.',
        deliverables: ['Source and enrich', 'Email verification', 'CRM deduplication', 'Suppression handling', 'Monthly refresh'],
        keyword: 'b2b contact data list building',
      },
    ],
    included: [
      'Written ideal customer profile',
      'Agreed qualification criteria before launch',
      'Dedicated sending domains and warming',
      'Verified, deduplicated contact data',
      'Sequence copywriting and testing',
      'Reply handling within one business day',
      'CRM integration and lead routing',
      'Weekly reporting call',
      'Monthly list refresh',
      'No long-term contract',
    ],
    packages: [
      {
        name: 'Starter',
        tagline: 'One channel, one segment, proof of concept.',
        priceRow: 'retainer',
        anchor: 'low',
        features: ['One outbound channel', 'One target segment', 'Up to 1,000 contacts per month', 'Sequence copy and testing', 'Monthly report'],
      },
      {
        name: 'Growth',
        tagline: 'Multi-channel with appointment setting.',
        priceRow: 'retainer',
        anchor: 'mid',
        popular: true,
        features: ['Email plus LinkedIn', 'Two or three segments', 'Up to 4,000 contacts per month', 'Appointment setting included', 'CRM integration', 'Weekly reporting call'],
      },
      {
        name: 'Pro',
        tagline: 'Full outbound team with dedicated setters.',
        priceRow: 'retainer',
        anchor: 'high',
        features: ['Email, LinkedIn and phone', 'Unlimited segments', 'Dedicated setters', 'Campaign landing pages', 'Lead scoring and routing', 'Named account manager'],
      },
    ],
    process: [
      { title: 'Define', body: 'Ideal customer profile, qualification criteria and the offer, written down and agreed before any sending.', duration: 'Week 1' },
      { title: 'Build', body: 'Domains, inboxes, warming, list build, verification and sequence copy.', duration: 'Weeks 2-3' },
      { title: 'Run', body: 'Volume ramps as deliverability holds. Replies worked daily, meetings booked and confirmed.', duration: 'Week 4 onward' },
      { title: 'Tune', body: 'Weekly review of reply rate, meeting rate and cost per meeting. Copy and targeting adjusted monthly.', duration: 'Ongoing' },
    ],
    tools: ['HubSpot', 'Salesforce', 'Instantly', 'Smartlead', 'Apollo', 'Clay', 'Sales Navigator', 'Zapier', 'Calendly'],
    caseStudy: {
      slug: 'freight-brokerage-outbound',
      client: 'Freight brokerage, 12 seats',
      sector: 'Logistics',
      challenge:
        'Reps were cold calling from a stale list, the sending domain was already flagged and there was no agreed definition of a qualified shipper.',
      work: [
        'Rebuilt the list against a written ideal customer profile',
        'Moved sending to dedicated warmed domains',
        'Wrote a three-touch sequence per shipper segment',
        'Added setters to confirm and chase meetings',
      ],
      results: [
        { label: 'Meetings per month', before: '6', after: '31', delta: '+417%' },
        { label: 'Cost per booked meeting', before: '$740', after: '$268', delta: '-64%' },
        { label: 'Email deliverability', before: '62%', after: '97%', delta: '+35pts' },
        { label: 'No-show rate', before: '38%', after: '11%', delta: '-27pts' },
      ],
    },
    faqs: [
      { q: 'What counts as a qualified lead?', a: 'Whatever we agree in writing before launch, usually a combination of company size, sector, geography, role seniority and a stated need. If a lead does not meet the criteria, it does not get billed.' },
      { q: 'Will cold email damage our domain reputation?', a: 'Not if it is done properly. We send from dedicated domains that are separate from your main one, authenticate them with SPF, DKIM and DMARC, warm them for several weeks and ramp volume only while deliverability holds.' },
      { q: 'How long before we see meetings?', a: 'Domain warming takes two to three weeks, so the first meetings usually land in week four or five. Meaningful volume data arrives around week eight.' },
      { q: 'Do you work per lead or on a retainer?', a: 'Most accounts start on a retainer because it lets us invest in deliverability and testing. Once volume and quality are proven, we can move to per qualified lead or per booked appointment.' },
      { q: 'Are you compliant with GDPR and CAN-SPAM?', a: 'Yes. B2B outreach in the UK and EU runs on legitimate interest with clear opt-out, records of the basis for contact and honoured suppression lists. US sending follows CAN-SPAM identification and opt-out rules.' },
    ],
    metrics: [
      { label: 'Typical deliverability', value: '95%+' },
      { label: 'First meetings by', value: 'Week 4-5' },
      { label: 'Reporting cadence', value: 'Weekly' },
    ],
  },

  {
    slug: 'ads-optimization',
    name: 'Ads Optimization and Design',
    navLabel: 'Ads Optimization and Design',
    promise: 'Lower cost per acquisition from the budget you already spend.',
    summary: 'Google, Meta, TikTok and LinkedIn management, account audits, creative design and conversion tracking that survives cookie loss.',
    description:
      'Most accounts do not need more budget, they need fewer wasted clicks and creative that earns the click in the first place. We audit, restructure, rebuild the tracking and design the creative, then optimise on the metric that pays your bills.',
    icon: 'Target',
    accent: '168 85 247',
    accentHex: '#A855F7',
    heroVisual: 'Ad cards flipping to reveal before and after metrics',
    interactive: 'creative-slider',
    interactiveTitle: 'Before and after creative',
    startingPriceRow: 'management',
    problem: {
      title: 'Spend going up, results going sideways',
      body: 'Accounts accumulate: old campaigns nobody paused, audiences that overlap, conversion tags that stopped firing after a site change. The reporting looks busy and the cost per sale keeps climbing.',
      points: [
        'Conversion tracking broken or double-counting',
        'Budget spread across overlapping audiences',
        'One creative running for months past fatigue',
        'Optimising for clicks or leads instead of revenue',
      ],
    },
    solution: {
      title: 'Fix the measurement, then the money',
      body: 'We start with an audit and rebuild the tracking, because optimising against wrong numbers just gets you to the wrong place faster. Then we restructure the account, ship fresh creative on a cadence and test deliberately.',
      points: [
        'Server-side conversion tracking with offline import',
        'Account restructured around intent, not history',
        'Creative refreshed on a fixed cadence before fatigue',
        'One documented test at a time, with a decision rule',
      ],
    },
    subServices: [
      { slug: 'google-ads', name: 'Google Ads', summary: 'Search, Performance Max, Shopping and YouTube.', body: 'Intent-led search structures, negative keyword hygiene, Performance Max fed with proper asset groups and audience signals, and Shopping feeds that are actually optimised.', deliverables: ['Account audit', 'Campaign restructure', 'Keyword and negative management', 'Shopping feed optimisation', 'Weekly optimisation'], keyword: 'google ads management agency' },
      { slug: 'meta-ads', name: 'Meta Ads', summary: 'Facebook and Instagram, from prospecting to retention.', body: 'Broad prospecting with strong creative, clean retargeting that does not cannibalise, and the Conversions API set up so attribution survives browser restrictions.', deliverables: ['Account audit', 'Conversions API setup', 'Campaign structure', 'Creative testing', 'Weekly optimisation'], keyword: 'facebook ads management services' },
      { slug: 'tiktok-ads', name: 'TikTok Ads', summary: 'Native creative and Spark Ads that do not look like ads.', body: 'Short-form creative built for the platform, tested in volume, with the events API wired so you can measure past the last click.', deliverables: ['Creative strategy', 'Spark Ads setup', 'Events API', 'Creative production', 'Optimisation'], keyword: 'tiktok ads agency' },
      { slug: 'linkedin-ads', name: 'LinkedIn Ads', summary: 'Expensive clicks, so targeting and offer have to be right.', body: 'Tight account and job-title targeting, lead gen forms wired straight to the CRM, and content offers matched to the stage of the buying process.', deliverables: ['Audience build', 'Lead gen form setup', 'Offer and creative', 'CRM integration', 'Optimisation'], keyword: 'linkedin ads management' },
      { slug: 'account-audits', name: 'Account audits', summary: 'A fixed-fee read of what is working and what is burning money.', body: 'A structured review of structure, tracking, creative, bidding and budget, delivered as a prioritised action list with the estimated saving next to each item.', deliverables: ['Tracking verification', 'Structure review', 'Wasted spend analysis', 'Creative assessment', 'Prioritised action list'], keyword: 'ppc account audit' },
      { slug: 'creative-design', name: 'Creative design', summary: 'Static, carousel and video creative produced on a cadence.', body: 'Concepts built from the angles that convert, produced in every placement size, shipped in packs so there is always something fresh entering the test.', deliverables: ['Concept and angle development', 'Static and carousel design', 'Short-form video editing', 'Placement resizing', 'Monthly creative pack'], keyword: 'paid ad creative design service' },
      { slug: 'ab-testing', name: 'A/B testing', summary: 'One variable, one decision rule, one outcome.', body: 'Tests planned with a hypothesis and a stopping rule, run long enough to mean something, documented so the account keeps its institutional memory.', deliverables: ['Test roadmap', 'Hypothesis and success criteria', 'Test build', 'Analysis', 'Decision log'], keyword: 'ad ab testing service' },
      { slug: 'conversion-tracking', name: 'Conversion tracking', summary: 'Server-side measurement that holds up after cookie loss.', body: 'GA4, Tag Manager, server-side tagging, Conversions API and offline conversion import so closed revenue, not form fills, becomes the optimisation target.', deliverables: ['Tracking audit', 'GA4 and GTM setup', 'Server-side tagging', 'Offline conversion import', 'Verification and QA'], keyword: 'conversion tracking setup service' },
    ],
    included: [
      'Full account audit before any changes',
      'Conversion tracking rebuilt and verified',
      'Campaign restructure and negative hygiene',
      'Monthly creative pack',
      'Documented test roadmap',
      'Budget pacing and alerts',
      'Live reporting dashboard',
      'Monthly review call',
      'Landing page recommendations',
      'No platform lock-in, accounts stay yours',
    ],
    packages: [
      { name: 'Starter', tagline: 'One platform, under $10k monthly spend.', priceRow: 'management', anchor: 'low', features: ['One ad platform', 'Account audit and restructure', 'Conversion tracking setup', 'Monthly creative refresh', 'Monthly report'] },
      { name: 'Growth', tagline: 'Two platforms with creative production.', priceRow: 'management', anchor: 'mid', popular: true, features: ['Two ad platforms', 'Server-side tracking', 'Five creatives per month', 'Documented test roadmap', 'Live dashboard', 'Bi-weekly calls'] },
      { name: 'Pro', tagline: 'Full-funnel across every channel.', priceRow: 'management', anchor: 'high', features: ['All platforms', 'Offline conversion import', 'Ten-plus creatives per month', 'Landing page builds included', 'Dedicated strategist', 'Weekly calls'] },
    ],
    process: [
      { title: 'Audit', body: 'Tracking verified, wasted spend quantified, prioritised action list with estimated savings.', duration: 'Week 1' },
      { title: 'Rebuild', body: 'Tracking fixed first, then account structure, audiences and budget allocation.', duration: 'Weeks 2-3' },
      { title: 'Create', body: 'First creative pack ships and enters testing against the incumbent.', duration: 'Week 3' },
      { title: 'Optimise', body: 'Weekly optimisation, monthly creative refresh, one documented test at a time.', duration: 'Ongoing' },
    ],
    tools: ['Google Ads', 'Meta Ads Manager', 'TikTok Ads', 'LinkedIn Campaign Manager', 'GA4', 'Google Tag Manager', 'Looker Studio', 'Figma', 'After Effects'],
    caseStudy: {
      slug: 'home-services-ppc-rebuild',
      client: 'Multi-location home services business',
      sector: 'Home services',
      challenge:
        'Conversion tracking had been double-counting for months, so the account had been optimising toward the wrong campaigns. Cost per booked job was rising while reported cost per lead looked fine.',
      work: [
        'Rebuilt GA4 and server-side tagging from scratch',
        'Imported closed jobs as offline conversions',
        'Restructured campaigns by service and location intent',
        'Shipped a monthly creative pack per service line',
      ],
      results: [
        { label: 'Cost per booked job', before: '$412', after: '$168', delta: '-59%' },
        { label: 'Booked jobs per month', before: '47', after: '122', delta: '+160%' },
        { label: 'Wasted spend', before: '31%', after: '6%', delta: '-25pts' },
        { label: 'Return on ad spend', before: '2.1x', after: '5.4x', delta: '+157%' },
      ],
    },
    faqs: [
      { q: 'Do you charge a flat fee or a percentage of spend?', a: 'Either. Flat monthly fees suit accounts with steady budgets; 10 to 20 percent of ad spend suits accounts that scale seasonally. We recommend whichever costs you less at your current spend.' },
      { q: 'Who owns the ad accounts?', a: 'You do. We work inside your accounts with delegated access. If we part ways, you keep every campaign, audience and piece of creative.' },
      { q: 'How quickly will cost per acquisition come down?', a: 'Tracking fixes show up within days. Structural changes need two to four weeks of data. Creative-driven gains usually land in month two or three once enough variants have been tested.' },
      { q: 'What is the minimum ad spend you work with?', a: 'Around $3,000 a month per platform. Below that there is not enough data to optimise on and the management fee eats too much of the budget.' },
      { q: 'Can you work with our in-house designer?', a: 'Yes. We can supply concepts and angles for your team to produce, or produce everything ourselves, whichever is faster for you.' },
    ],
    metrics: [
      { label: 'Audit turnaround', value: '5 days' },
      { label: 'Creative cadence', value: 'Monthly' },
      { label: 'Minimum spend', value: '$3k/mo' },
    ],
  },

  {
    slug: 'adsense-management',
    name: 'Google AdSense Revenue Management',
    navLabel: 'AdSense Revenue Management',
    promise: 'More revenue per thousand pageviews, without a policy strike.',
    summary: 'Account setup and approval, placement optimisation, policy compliance, RPM and CTR tuning, header bidding advice and reporting.',
    description:
      'Publishers leave money on the table in two directions: placements that under-monetise and placements that risk the account. We tune layout, density and demand for revenue per session, while keeping every page inside Google publisher policy.',
    icon: 'LineChart',
    accent: '245 158 11',
    accentHex: '#F59E0B',
    heroVisual: 'Revenue chart drawing on scroll',
    interactive: 'revenue-estimator',
    interactiveTitle: 'AdSense revenue estimator',
    startingPriceRow: 'per-site',
    problem: {
      title: 'Traffic growing, RPM flat',
      body: 'Ad units get added one at a time over years, nobody measures what each one earns, and the layout slowly degrades both revenue and the reading experience. Then a policy warning arrives with no explanation.',
      points: [
        'No idea which unit earns what',
        'Layouts that hurt Core Web Vitals and therefore traffic',
        'Policy warnings with no clear remediation path',
        'Single demand source, so no price competition',
      ],
    },
    solution: {
      title: 'Measure every unit, then tune density',
      body: 'We instrument each placement, find the units that earn and the units that only cost layout shift, and rebalance density against session depth. Policy compliance is audited first, because a suspended account earns nothing.',
      points: [
        'Per-unit revenue reporting, not just site totals',
        'Layout tuned against Core Web Vitals and session RPM together',
        'Full policy audit with a written remediation list',
        'Header bidding advice where scale justifies it',
      ],
    },
    subServices: [
      { slug: 'account-setup', name: 'Account setup and approval', summary: 'Get approved the first time.', body: 'Pre-application audit against the publisher policies, content and navigation fixes, ads.txt, and the application itself, plus remediation if a previous application was rejected.', deliverables: ['Pre-application audit', 'Content and navigation fixes', 'ads.txt setup', 'Application submission', 'Rejection remediation'], keyword: 'google adsense approval service' },
      { slug: 'placement-optimization', name: 'Placement optimisation', summary: 'Fewer, better-placed units usually earn more.', body: 'We test placement, size, density and lazy loading against session RPM rather than per-impression CPM, so the layout earns more without pushing readers away.', deliverables: ['Placement audit', 'Unit-level reporting', 'Density testing', 'Lazy load implementation', 'Monthly tuning'], keyword: 'adsense placement optimization' },
      { slug: 'policy-compliance', name: 'Policy compliance', summary: 'Stay inside the rules that keep the account alive.', body: 'A full audit against Google publisher policies and the Better Ads standards, with a written remediation list and ongoing monitoring for new content.', deliverables: ['Policy audit', 'Remediation plan', 'Invalid traffic review', 'Appeal support', 'Ongoing monitoring'], keyword: 'adsense policy compliance audit' },
      { slug: 'rpm-ctr-tuning', name: 'RPM and CTR tuning', summary: 'Tune the numbers that actually move revenue.', body: 'Ad sizes, formats, refresh rules, floor prices and category blocking, reviewed against a controlled baseline so you know which change did what.', deliverables: ['Baseline measurement', 'Format and size testing', 'Floor price tuning', 'Category blocking', 'Monthly report'], keyword: 'increase adsense rpm' },
      { slug: 'header-bidding', name: 'Header bidding advice', summary: 'When to add demand partners, and when not to bother.', body: 'Above roughly half a million monthly pageviews, extra demand usually pays for its complexity. We model the uplift before you commit to it.', deliverables: ['Feasibility model', 'Partner shortlist', 'Prebid configuration advice', 'Latency budget', 'Uplift measurement'], keyword: 'header bidding for publishers' },
      { slug: 'reporting', name: 'Reporting', summary: 'One dashboard, per unit, per page type.', body: 'Revenue by unit, page type and traffic source in one place, with month-on-month movement explained rather than just charted.', deliverables: ['Dashboard build', 'Per-unit breakdown', 'Traffic source attribution', 'Monthly commentary', 'Forecast'], keyword: 'adsense revenue reporting dashboard' },
    ],
    included: [
      'Policy compliance audit before any change',
      'Per-unit revenue instrumentation',
      'Core Web Vitals measured alongside RPM',
      'Controlled testing against a baseline',
      'ads.txt and seller verification',
      'Invalid traffic monitoring',
      'Monthly dashboard and commentary',
      'Appeal support if a warning lands',
      'Header bidding feasibility modelling',
      'No changes published without your approval',
    ],
    packages: [
      { name: 'Starter', tagline: 'One site, under 100k monthly pageviews.', priceRow: 'per-site', anchor: 'low', features: ['One site', 'Policy audit', 'Placement optimisation', 'Monthly report', 'Email support'] },
      { name: 'Growth', tagline: 'One site at scale, or a small portfolio.', priceRow: 'per-site', anchor: 'mid', popular: true, features: ['Up to three sites', 'Per-unit instrumentation', 'Controlled testing programme', 'Core Web Vitals tuning', 'Monthly call'] },
      { name: 'Pro', tagline: 'Portfolio with header bidding.', priceRow: 'per-site', anchor: 'high', features: ['Unlimited sites', 'Header bidding advice and setup support', 'Dedicated analyst', 'Custom dashboard', 'Weekly monitoring', 'Priority appeal support'] },
    ],
    process: [
      { title: 'Audit', body: 'Policy compliance, current layout, per-unit revenue and Core Web Vitals baseline.', duration: 'Week 1' },
      { title: 'Remediate', body: 'Policy risks fixed first, ads.txt verified, invalid traffic sources identified.', duration: 'Week 2' },
      { title: 'Test', body: 'Placement and density changes rolled out against a held-back control.', duration: 'Weeks 3-6' },
      { title: 'Scale', body: 'Winning layout applied across page types, with monthly tuning and reporting.', duration: 'Ongoing' },
    ],
    tools: ['Google AdSense', 'Google Ad Manager', 'GA4', 'Search Console', 'PageSpeed Insights', 'Looker Studio', 'Prebid.js'],
    caseStudy: {
      slug: 'niche-publisher-rpm',
      client: 'Niche content publisher, 1.4M monthly pageviews',
      sector: 'Publishing and media',
      challenge:
        'Session RPM had been flat for eighteen months while traffic grew. A policy warning on a legacy content category was threatening the whole account.',
      work: [
        'Resolved the policy warning and removed the at-risk category',
        'Instrumented every ad unit for per-unit revenue',
        'Reduced unit count on article pages and repositioned the rest',
        'Implemented lazy loading to recover Core Web Vitals',
      ],
      results: [
        { label: 'Session RPM', before: '$4.10', after: '$7.35', delta: '+79%' },
        { label: 'Ad units per article', before: '11', after: '6', delta: '-45%' },
        { label: 'Cumulative Layout Shift', before: '0.31', after: '0.04', delta: '-87%' },
        { label: 'Policy warnings', before: '1 active', after: '0', delta: 'Resolved' },
      ],
    },
    faqs: [
      { q: 'Will you get our AdSense account approved?', a: 'We audit against the publisher policies before applying and fix what would cause a rejection. We cannot guarantee approval because Google makes that decision, but a pre-application audit removes the common causes.' },
      { q: 'Does adding more ad units increase revenue?', a: 'Usually not past a point. More units lower the value of each impression, hurt Core Web Vitals and push readers away, which cuts sessions. We optimise revenue per session, which often means fewer units.' },
      { q: 'How is your fee calculated?', a: 'Either a flat monthly fee per site, or 15 to 30 percent of the revenue uplift above your trailing three-month baseline. The baseline is agreed in writing before we start.' },
      { q: 'What happens if we get a policy strike?', a: 'We audit the flagged content, write the remediation, make the fixes and support the appeal. Ongoing monitoring is included so new content is checked before it becomes a problem.' },
      { q: 'Is this pricing a market benchmark?', a: 'No. It is our own rate card. No public pricing survey exists for AdSense revenue management, and we would rather say so than imply a benchmark that does not exist.' },
    ],
    metrics: [
      { label: 'Typical RPM uplift', value: '35-80%' },
      { label: 'Audit turnaround', value: '7 days' },
      { label: 'Reporting', value: 'Per unit' },
    ],
  },

  {
    slug: 'truck-dispatch',
    name: 'Truck Dispatch',
    navLabel: 'Truck Dispatch',
    promise: 'Your trucks loaded, your paperwork done, your phone quiet.',
    summary: 'Box truck, hotshot and semi dispatch with load booking, rate negotiation, broker packets, invoicing support and after-hours coverage.',
    description:
      'A full back office for owner-operators and small fleets. We find and book the loads, negotiate the rate, set up the broker, send the packet, chase the paperwork and handle detention claims, so the driver drives and the owner is not on the phone until midnight.',
    icon: 'Truck',
    accent: '255 122 26',
    accentHex: '#FF7A1A',
    heroVisual: 'Truck moving across a route map',
    interactive: 'dispatch-fee',
    interactiveTitle: 'Percentage versus flat weekly',
    startingPriceRow: 'semi-flat',
    problem: {
      title: 'The truck moves, the back office does not',
      body: 'Owner-operators lose their evenings to load boards, broker setups and invoices. Deadhead miles creep up, detention goes unclaimed, and an unpaid invoice from three weeks ago is still unpaid.',
      points: [
        'Hours a day on load boards instead of resting',
        'Rates accepted rather than negotiated',
        'Broker packets and carrier setups eating the weekend',
        'Detention and layover time never claimed',
      ],
    },
    solution: {
      title: 'A dispatcher who works your truck like it is theirs',
      body: 'A named dispatcher learns your lanes, your equipment and where you want to be on Friday. They book ahead, negotiate every rate, handle the setup and the packet, and chase the money.',
      points: [
        'Named dispatcher, not a rotating pool',
        'Rate negotiation on every load, not just the first',
        'Broker setups, packets and invoicing handled',
        'Detention and layover claims filed as standard',
        'After-hours and weekend coverage available',
      ],
    },
    subServices: [
      { slug: 'box-truck-hotshot', name: 'Box truck and hotshot', summary: 'Straight trucks, sprinters, cargo vans and hotshot trailers.', body: 'The lanes and load boards for box truck and hotshot work are different from semi freight. We run them daily and know which brokers pay on time.', deliverables: ['Daily load booking', 'Rate negotiation', 'Broker setup', 'Invoicing support', 'Lane planning'], keyword: 'box truck dispatch service' },
      { slug: 'semi-dispatch', name: 'Semi dispatch', summary: 'Dry van, flatbed, reefer and step deck.', body: 'Equipment-specific dispatch with the permits, securement and temperature rules that go with it, at 7 percent of linehaul or a flat weekly rate.', deliverables: ['Equipment-matched loads', 'Permit and securement guidance', 'Rate negotiation', 'Broker packets', 'Weekly settlement summary'], keyword: 'semi truck dispatch service' },
      { slug: 'load-booking', name: 'Load booking', summary: 'Booked ahead, not scrambled the morning of.', body: 'We work the boards and our broker relationships to keep the next load booked before the current one delivers, with your home time on the plan.', deliverables: ['Next-load-booked planning', 'Multi-board coverage', 'Home time planning', 'Deadhead minimisation', 'Daily check calls'], keyword: 'truck load booking service' },
      { slug: 'rate-negotiation', name: 'Rate negotiation', summary: 'Every load, every time.', body: 'We negotiate against current market rate data and lane history rather than taking the posted number, and we know which brokers move and which do not.', deliverables: ['Market rate benchmarking', 'Negotiation on every load', 'Lane rate history', 'Accessorial capture', 'Rate confirmation review'], keyword: 'freight rate negotiation service' },
      { slug: 'broker-packets', name: 'Broker packets and setup', summary: 'Carrier packages completed and filed for you.', body: 'New broker setups, W-9s, certificates of insurance, authority documents and notice of assignment handled so a good load is never lost to paperwork.', deliverables: ['Carrier setup submission', 'W-9 and COI handling', 'Authority documentation', 'Notice of assignment', 'Broker credit checks'], keyword: 'carrier broker packet service' },
      { slug: 'invoicing-factoring', name: 'Invoicing and factoring support', summary: 'Invoices out same day, then chased.', body: 'Rate confirmation, bill of lading and proof of delivery assembled and submitted the day the load delivers, to your factor or direct to the broker, then followed up until it pays.', deliverables: ['Same-day invoicing', 'Factoring submission', 'Paperwork assembly', 'Ageing follow-up', 'Payment reconciliation'], keyword: 'truck dispatch invoicing and factoring' },
      { slug: 'detention-claims', name: 'Detention claims', summary: 'Waiting time is billable time.', body: 'We log arrival and departure, document the delay properly and file the claim, because detention that is not documented is detention that is not paid.', deliverables: ['Arrival and departure logging', 'Documentation pack', 'Claim filing', 'Broker follow-up', 'Layover and TONU claims'], keyword: 'truck detention claim service' },
      { slug: 'after-hours', name: 'After-hours coverage', summary: 'Nights and weekends, so you are not the one answering.', body: 'Overnight and weekend desk coverage for breakdowns, delivery issues and next-day booking, quoted per fleet.', deliverables: ['Overnight desk', 'Weekend booking', 'Breakdown escalation', 'Driver support line', 'Morning handover'], keyword: 'after hours truck dispatch' },
    ],
    included: [
      'Named dispatcher who knows your truck',
      'Rate negotiation on every single load',
      'Broker setup and carrier packets',
      'Same-day invoicing and factoring submission',
      'Detention, layover and TONU claims filed',
      'Home time planned into the schedule',
      'Weekly settlement summary',
      'Document storage you can access',
      'No long-term contract, 30 days notice',
      'Fee on linehaul only, never on fuel surcharge',
    ],
    packages: [
      { name: 'Starter', tagline: 'One truck, standard hours.', priceRow: 'semi-flat', anchor: 'low', features: ['Single truck', 'Load booking and rate negotiation', 'Broker setup and packets', 'Same-day invoicing', 'Weekday coverage'] },
      { name: 'Growth', tagline: 'Small fleet with claims handling.', priceRow: 'semi-flat', anchor: 'mid', popular: true, features: ['Two to five trucks', 'Named dispatcher', 'Detention and layover claims', 'Factoring submission', 'Weekly settlement summary', 'Extended hours'] },
      { name: 'Pro', tagline: 'Fleet with 24/7 desk.', priceRow: 'box-truck-flat', anchor: 'high', features: ['Six or more trucks', 'Dedicated dispatch team', 'After-hours and weekend desk', 'Lane and revenue analytics', 'Compliance support', 'Named account manager'] },
    ],
    process: [
      { title: 'Onboard', body: 'We collect your authority, insurance, W-9 and equipment details, and learn your preferred lanes and home time.', duration: 'Day 1' },
      { title: 'Set up', body: 'Broker setups filed, factoring connected, document storage created, dispatcher assigned.', duration: 'Days 2-3' },
      { title: 'Dispatch', body: 'First loads booked and negotiated. Daily check calls and next-load-booked planning.', duration: 'Day 3 onward' },
      { title: 'Settle', body: 'Same-day invoicing, claims filed, weekly settlement summary and a monthly lane review.', duration: 'Weekly' },
    ],
    tools: ['DAT', 'Truckstop', '123Loadboard', 'Amousetrap', 'QuickBooks', 'Triumph', 'RTS Financial', 'Motive', 'Samsara'],
    caseStudy: {
      slug: 'owner-operator-dispatch',
      client: 'Owner-operator, one dry van',
      sector: 'Trucking',
      challenge:
        'Booking his own loads, averaging heavy deadhead and never filing detention. Spending three to four hours a day on the boards and still sitting on Mondays.',
      work: [
        'Assigned a named dispatcher and mapped preferred lanes',
        'Moved to next-load-booked planning',
        'Filed detention on every qualifying stop',
        'Same-day invoicing through his factor',
      ],
      results: [
        { label: 'Weekly gross', before: '$4,900', after: '$7,150', delta: '+46%' },
        { label: 'Deadhead miles', before: '19%', after: '8%', delta: '-11pts' },
        { label: 'Detention recovered', before: '$0', after: '$2,340/qtr', delta: 'New' },
        { label: 'Hours on load boards', before: '3.5/day', after: '0', delta: 'Eliminated' },
      ],
      quote: { text: 'I drive and I get paid. Somebody else argues with the brokers now.', role: 'Owner-operator' },
    },
    faqs: [
      { q: 'What exactly does the percentage apply to?', a: 'Linehaul only. We do not take a percentage of fuel surcharge, detention, layover or any other accessorial. Those are yours in full.' },
      { q: 'Percentage or flat weekly, which is cheaper?', a: 'It depends on your weekly gross. Flat weekly wins above the break-even point and percentage wins below it. The calculator on this page shows your exact break-even figure for your equipment.' },
      { q: 'Am I locked into a contract?', a: 'No. Thirty days notice, either direction, no termination fee. If the service is not earning its fee you should be able to leave.' },
      { q: 'Why is box truck 10 percent when the market is 5 to 7?', a: 'Because the 5 to 7 percent figure usually buys load-finding alone. Our fee covers the full back office: broker setups, packets, invoicing, factoring submission and detention claims. Compare total cost, not just the percentage.' },
      { q: 'Do you handle my invoicing and factoring?', a: 'Yes. We assemble the rate confirmation, bill of lading and proof of delivery and submit the same day the load delivers, either to your factor or direct to the broker, then follow up until it pays.' },
      { q: 'Can I keep my own broker relationships?', a: 'Absolutely. We work your existing brokers alongside ours, and every setup we file is in your carrier name, not ours.' },
    ],
    metrics: [
      { label: 'Semi rate', value: '7% of gross' },
      { label: 'Box truck rate', value: '10% of gross' },
      { label: 'Notice period', value: '30 days' },
    ],
  },

  {
    slug: 'qa-testing',
    name: 'Quality Assurance and Testing',
    navLabel: 'QA and Testing',
    promise: 'Find it before your customers do.',
    summary: 'Manual testing, automation in Playwright, Selenium and Cypress, regression, performance, mobile, API, security and QA staff augmentation.',
    description:
      'We build the test coverage your release process is missing: a regression suite that runs on every pull request, performance budgets that fail the build, and manual exploratory testing on the journeys that earn your revenue.',
    icon: 'ShieldCheck',
    accent: '6 182 212',
    accentHex: '#06B6D4',
    heroVisual: 'Bugs caught by a checklist',
    interactive: 'coverage-builder',
    interactiveTitle: 'Test coverage checklist builder',
    startingPriceRow: 'qa-hourly',
    problem: {
      title: 'Releases that need a held breath',
      body: 'Testing happens at the end, by whoever is free, against a checklist in a spreadsheet. Regressions reach production, hotfixes land on Friday nights and nobody can say what coverage actually exists.',
      points: [
        'No automated regression, so every release is manual',
        'Coverage that nobody can quantify',
        'Performance and load untested until something falls over',
        'Bugs reported without the steps to reproduce them',
      ],
    },
    solution: {
      title: 'Coverage you can point at',
      body: 'We write the test plan, automate the regression paths, wire it into your pipeline and report coverage as a number you can track. Manual effort goes where automation has no advantage.',
      points: [
        'Regression suite running on every pull request',
        'Coverage reported by journey, not just by line',
        'Performance and load budgets enforced in CI',
        'Defects filed with reproduction steps and evidence',
      ],
    },
    subServices: [
      { slug: 'manual-testing', name: 'Manual testing', summary: 'Exploratory and scripted testing by people who try to break things.', body: 'Structured test plans for the critical journeys plus exploratory sessions where a tester follows the smell rather than the script.', deliverables: ['Test plan', 'Test case library', 'Exploratory sessions', 'Defect reports with evidence', 'Release sign-off'], keyword: 'manual software testing services' },
      { slug: 'test-automation', name: 'Test automation', summary: 'Playwright, Selenium and Cypress suites wired into CI.', body: 'Automation for the paths that run every release, built to be maintainable, with the flaky-test discipline that keeps a suite trusted.', deliverables: ['Framework setup', 'Suite development', 'CI integration', 'Flake monitoring', 'Maintenance and handover'], keyword: 'test automation services playwright' },
      { slug: 'regression', name: 'Regression testing', summary: 'Nothing that worked last week stops working this week.', body: 'A growing regression pack covering everything that has ever broken, run automatically before every release.', deliverables: ['Regression pack', 'Automated execution', 'Per-release reporting', 'Coverage growth tracking', 'Defect triage'], keyword: 'regression testing service' },
      { slug: 'performance-load', name: 'Performance and load', summary: 'Know the breaking point before your traffic finds it.', body: 'Load profiles modelled on real traffic, soak tests for memory leaks and spike tests for launch days, with budgets enforced in the pipeline.', deliverables: ['Load profile modelling', 'Baseline and spike tests', 'Soak testing', 'Bottleneck analysis', 'Performance budgets in CI'], keyword: 'performance and load testing service' },
      { slug: 'mobile-testing', name: 'Mobile testing', summary: 'Real devices, not just simulators.', body: 'Coverage across the device and OS matrix that matters for your users, including the low-end Android handsets that simulators flatter.', deliverables: ['Device matrix definition', 'Real device testing', 'OS version coverage', 'Store submission checks', 'Crash and ANR analysis'], keyword: 'mobile app testing service' },
      { slug: 'api-testing', name: 'API testing', summary: 'Contract, integration and error-path coverage.', body: 'Schema validation, contract testing between services, authentication and authorisation checks and the error paths nobody remembers to test.', deliverables: ['Contract tests', 'Schema validation', 'Auth and permission testing', 'Error path coverage', 'CI integration'], keyword: 'api testing services' },
      { slug: 'security-testing', name: 'Security testing', summary: 'The OWASP basics, tested properly.', body: 'Authentication, authorisation, injection, access control and dependency scanning, reported with severity and a remediation path. This is application security testing, not a formal penetration test certification.', deliverables: ['OWASP Top 10 review', 'Access control testing', 'Dependency scanning', 'Severity-rated findings', 'Retest after fixes'], keyword: 'application security testing service' },
      { slug: 'qa-staff-augmentation', name: 'QA staff augmentation', summary: 'Embedded testers in your sprints, on your tooling.', body: 'Named QA engineers who join your standups, work your board and use your tools, available for a defined stretch without a hiring cycle.', deliverables: ['Named engineers', 'Sprint integration', 'Your tooling and process', 'Handover documentation', 'Flexible ramp up and down'], keyword: 'qa staff augmentation' },
    ],
    included: [
      'Written test strategy and plan',
      'Test case library you keep',
      'Automated regression in your pipeline',
      'Defect reports with reproduction steps and evidence',
      'Coverage reported per journey',
      'Performance budgets enforced in CI',
      'Accessibility checks to WCAG 2.1 AA',
      'Release sign-off report',
      'Flaky-test monitoring and remediation',
      'Framework handover and documentation',
    ],
    packages: [
      { name: 'Starter', tagline: 'Manual coverage on the critical paths.', priceRow: 'qa-hourly', anchor: 'low', features: ['Test plan and case library', 'Manual regression per release', 'Defect reporting', 'Release sign-off', 'Up to 40 hours a month'] },
      { name: 'Growth', tagline: 'Automated regression in your pipeline.', priceRow: 'qa-managed', anchor: 'mid', popular: true, features: ['Automation framework setup', 'Regression suite build', 'CI integration', 'API test coverage', 'Manual exploratory sessions', 'Monthly coverage report'] },
      { name: 'Pro', tagline: 'Embedded QA team with performance and security.', priceRow: 'qa-managed', anchor: 'high', features: ['Dedicated QA squad', 'Full automation ownership', 'Performance and load testing', 'Security testing', 'Mobile device lab', 'QA lead in your planning'] },
    ],
    process: [
      { title: 'Assess', body: 'We review your release process, existing coverage and defect history, then write the test strategy.', duration: 'Week 1' },
      { title: 'Plan', body: 'Critical journeys identified and prioritised, test cases written, automation candidates chosen.', duration: 'Week 2' },
      { title: 'Automate', body: 'Framework stood up, first suites built and wired into CI so they run on every pull request.', duration: 'Weeks 3-6' },
      { title: 'Run', body: 'Regression on every release, exploratory sessions each sprint, coverage tracked and grown.', duration: 'Ongoing' },
    ],
    tools: ['Playwright', 'Cypress', 'Selenium', 'Appium', 'k6', 'JMeter', 'Postman', 'Jira', 'TestRail', 'BrowserStack', 'GitHub Actions', 'OWASP ZAP'],
    caseStudy: {
      slug: 'saas-release-stability',
      client: 'B2B SaaS platform, 60 person engineering team',
      sector: 'SaaS',
      challenge:
        'Every release needed two days of manual testing and still produced hotfixes. There was no way to say what was covered, so scope crept and confidence fell.',
      work: [
        'Wrote the test strategy and mapped critical journeys',
        'Built a Playwright regression suite in CI',
        'Added k6 load tests with budgets that fail the build',
        'Introduced defect templates with reproduction evidence',
      ],
      results: [
        { label: 'Release testing time', before: '2 days', after: '35 min', delta: '-97%' },
        { label: 'Production hotfixes per month', before: '9', after: '1', delta: '-89%' },
        { label: 'Automated journey coverage', before: '0%', after: '84%', delta: '+84pts' },
        { label: 'Escaped defects per release', before: '14', after: '2', delta: '-86%' },
      ],
    },
    faqs: [
      { q: 'Which automation framework do you use?', a: 'Playwright for most new work because of its speed and reliability. We also work in Cypress and Selenium, and will stay in whatever your team already maintains rather than forcing a migration.' },
      { q: 'Do we keep the test suite?', a: 'Yes. It lives in your repository, uses your CI and is documented at handover. There is nothing proprietary to keep paying for.' },
      { q: 'How do you measure coverage?', a: 'By user journey rather than by code line. Line coverage can be high while the checkout still breaks. We report which critical paths are automated, which are manual and which are untested.' },
      { q: 'Is your security testing a penetration test?', a: 'No. We test the OWASP Top 10 application risks and report severity-rated findings. A formal penetration test with a certificate for compliance purposes needs an accredited provider, and we will say so rather than imply otherwise.' },
      { q: 'Can your testers work in our sprints?', a: 'Yes, that is what the staff augmentation option is. Named engineers join your standups, work your board and use your tooling, and can ramp up or down as the roadmap changes.' },
    ],
    metrics: [
      { label: 'Regression run time', value: 'Under 1 hr' },
      { label: 'Journey coverage target', value: '80%+' },
      { label: 'Framework', value: 'You own it' },
    ],
  },

  {
    slug: 'auto-engines',
    name: 'Auto Engines',
    navLabel: 'Auto Engines',
    promise: 'The right engine, sourced, delivered and installed, with a warranty that means something.',
    summary: 'Used, remanufactured and crate engines, sourced and installed, with warranty options and core return handled.',
    description:
      'We source used, remanufactured and crate engines from vetted suppliers, verify them before they ship, arrange installation through partner shops and handle the warranty registration and core return so you are not chasing paperwork after the job.',
    icon: 'Cog',
    accent: '239 68 68',
    accentHex: '#EF4444',
    heroVisual: 'Exploded engine view on scroll',
    interactive: 'engine-finder',
    interactiveTitle: 'Engine finder',
    startingPriceRow: 'used',
    problem: {
      title: 'A quote for a long block and a lot of unknowns',
      body: 'Engine replacement goes wrong in the gaps: the wrong casting number arrives, the mileage was never verified, the warranty needs paperwork nobody filed, and the core return charge lands two months later.',
      points: [
        'Unverified mileage and no compression data',
        'Wrong engine code for the trim or emissions region',
        'Warranty voided by an unregistered install',
        'Surprise core charges after the job is done',
      ],
    },
    solution: {
      title: 'Verified before it ships, documented after it lands',
      body: 'We match by VIN, not by guess. Every unit is verified before dispatch, installation runs through a vetted shop, and warranty registration and the core return are handled by us.',
      points: [
        'VIN-matched sourcing with casting and emissions checks',
        'Compression and leak-down data before dispatch',
        'Installation through vetted partner shops',
        'Warranty registered and core return arranged',
      ],
    },
    subServices: [
      { slug: 'used-engines', name: 'Used engines', summary: 'Tested, mileage-verified units from vetted dismantlers.', body: 'Low-mileage units pulled from vehicles with documented history, compression tested and leak-down checked before they ship.', deliverables: ['VIN-matched sourcing', 'Mileage verification', 'Compression and leak-down test', 'Warranty options', 'Delivery to your shop'], keyword: 'used engine for sale with warranty' },
      { slug: 'remanufactured-engines', name: 'Remanufactured engines', summary: 'Rebuilt to OEM specification with new wear parts.', body: 'Machined blocks, new bearings, rings, seals and gaskets, assembled to tolerance and run-tested, with a longer warranty than a used unit.', deliverables: ['OEM-spec rebuild', 'New wear components', 'Run testing', 'Extended warranty', 'Core return handling'], keyword: 'remanufactured engine supplier' },
      { slug: 'crate-engines', name: 'Crate engines', summary: 'New units, factory or performance spec.', body: 'Brand new crate engines in factory or performance specification, supplied with the ancillaries and documentation the install needs.', deliverables: ['New crate unit', 'Factory or performance spec', 'Ancillary sourcing', 'Full manufacturer warranty', 'Installation coordination'], keyword: 'crate engine supplier' },
      { slug: 'sourcing', name: 'Sourcing', summary: 'Hard-to-find engines located by VIN.', body: 'When the usual suppliers cannot help, we work a wider network for European, heavy-duty diesel and discontinued units, and tell you honestly if it is not worth finding.', deliverables: ['VIN-based identification', 'Multi-supplier search', 'Condition verification', 'Landed cost quote', 'Import handling'], keyword: 'engine sourcing service' },
      { slug: 'installation', name: 'Installation', summary: 'Vetted partner shops, one point of contact.', body: 'Installation through shops we have vetted, with the labour quoted up front and the job coordinated so you are not managing two suppliers.', deliverables: ['Partner shop matching', 'Labour quote up front', 'Fluids and ancillaries', 'Post-install road test', 'Single point of contact'], keyword: 'engine replacement and installation' },
      { slug: 'warranty', name: 'Warranty options', summary: 'Cover you can actually claim on.', body: 'Parts-only and parts-plus-labour cover, registered at install so a claim later does not fail on paperwork, with the exclusions explained before you buy.', deliverables: ['Cover options explained', 'Registration at install', 'Claim handling', 'Exclusions in writing', 'Extended cover available'], keyword: 'used engine warranty' },
      { slug: 'core-returns', name: 'Core returns', summary: 'The old unit collected, the charge cleared.', body: 'Collection arranged, condition documented and the core charge cleared from your account, so it does not resurface as a surprise invoice.', deliverables: ['Collection arranged', 'Condition documentation', 'Charge reconciliation', 'Deadline tracking', 'Proof of return'], keyword: 'engine core return process' },
    ],
    included: [
      'VIN-matched identification',
      'Casting number and emissions region verification',
      'Compression and leak-down data before dispatch',
      'Written condition report with photographs',
      'Warranty options explained in plain terms',
      'Installation through vetted partner shops',
      'Labour quoted before work starts',
      'Warranty registered at install',
      'Core return collected and reconciled',
      'One point of contact for the whole job',
    ],
    packages: [
      { name: 'Starter', tagline: 'Used unit, supplied only.', priceRow: 'used', anchor: 'low', features: ['VIN-matched used engine', 'Mileage verification', 'Compression test data', 'Standard warranty', 'Delivery to your shop'] },
      { name: 'Growth', tagline: 'Remanufactured, supplied and installed.', priceRow: 'reman', anchor: 'mid', popular: true, features: ['Remanufactured to OEM spec', 'Installation at a partner shop', 'Fluids and ancillaries', 'Extended warranty', 'Core return handled', 'Post-install road test'] },
      { name: 'Pro', tagline: 'Crate, European or heavy-duty diesel.', priceRow: 'crate-euro', anchor: 'high', features: ['Crate, European or HD diesel unit', 'Specialist installation', 'Import and customs handling', 'Full manufacturer warranty', 'Priority sourcing', 'Dedicated job manager'] },
    ],
    process: [
      { title: 'Identify', body: 'VIN, engine code, casting number and emissions region confirmed so the right unit is sourced first time.', duration: 'Day 1' },
      { title: 'Source', body: 'Suppliers searched, condition verified, test data and photographs sent with a landed cost quote.', duration: 'Days 2-5' },
      { title: 'Install', body: 'Unit delivered to a vetted shop, labour quoted up front, fluids and ancillaries included, road tested after.', duration: 'Days 5-12' },
      { title: 'Close', body: 'Warranty registered, core collected and the charge cleared, documentation sent to you.', duration: 'Within 30 days' },
    ],
    tools: ['VIN decoding', 'Compression testing', 'Leak-down testing', 'Partner dismantler network', 'Vetted installation shops', 'Freight and import handling'],
    caseStudy: {
      slug: 'fleet-engine-replacement',
      client: 'Regional delivery fleet, 22 vans',
      sector: 'Automotive and fleet',
      challenge:
        'Two vans were off the road waiting on engines, with a local quote that carried no verified mileage and a core charge that was not explained.',
      work: [
        'VIN-matched both units and verified emissions region',
        'Sourced low-mileage used engines with compression data',
        'Coordinated installation through a partner shop',
        'Handled warranty registration and both core returns',
      ],
      results: [
        { label: 'Vehicle downtime', before: '18 days', after: '6 days', delta: '-67%' },
        { label: 'Cost per replacement', before: '$5,800', after: '$3,950', delta: '-32%' },
        { label: 'Comeback rate', before: '1 of 2', after: '0 of 2', delta: 'Eliminated' },
        { label: 'Core charges outstanding', before: '$1,400', after: '$0', delta: 'Cleared' },
      ],
    },
    faqs: [
      { q: 'How do you verify a used engine before it ships?', a: 'We confirm the VIN, engine code and casting number, check the emissions region matches your vehicle, and obtain compression and leak-down figures plus photographs. You see all of it before anything is dispatched.' },
      { q: 'What does the warranty actually cover?', a: 'Parts-only cover replaces the unit; parts-plus-labour also covers the install cost of doing so. Both need the engine registered at installation and the service interval kept. We put the exclusions in writing before you buy.' },
      { q: 'What is a core charge?', a: 'A deposit on your old engine, refunded when it is returned in a rebuildable condition. We arrange collection, document its condition and clear the charge, so it does not appear as a surprise invoice later.' },
      { q: 'Do you install, or only supply?', a: 'Both. Installation runs through vetted partner shops with the labour quoted before work starts, and we stay the single point of contact for the whole job.' },
      { q: 'Can you source European and heavy-duty diesel engines?', a: 'Yes. Those go through our wider sourcing network and are quoted per vehicle, since availability and landed cost vary too much for a published range to be honest.' },
    ],
    metrics: [
      { label: 'Typical sourcing time', value: '2-5 days' },
      { label: 'Verification', value: 'Before dispatch' },
      { label: 'Core return', value: 'Handled' },
    ],
  },
];

/**
 * Display order across the site: menus, hubs, footer and the calculator.
 * AdSense sits last by request.
 */
export const SERVICE_ORDER = [
  'web-development',
  'qa-testing',
  'lead-generation',
  'auto-engines',
  'ai-machine-learning',
  'data-analytics',
  'cloud-devops',
  'crm-erp',
  'cybersecurity',
  'dedicated-teams',
  'truck-dispatch',
  'ads-optimization',
  'adsense-management',
];

const ALL_SERVICES = [...BASE_SERVICES, ...ENTERPRISE_SERVICES];

export const SERVICES: Service[] = SERVICE_ORDER.map((slug) => {
  const found = ALL_SERVICES.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown service in SERVICE_ORDER: ${slug}`);
  return found;
});

export const SERVICE_MAP: Record<string, Service> = SERVICES.reduce(
  (acc, s) => ({ ...acc, [s.slug]: s }),
  {} as Record<string, Service>,
);

export function getService(slug: string): Service | undefined {
  return SERVICE_MAP[slug];
}

export function getSubService(serviceSlug: string, subSlug: string) {
  const service = SERVICE_MAP[serviceSlug];
  if (!service) return undefined;
  const sub = service.subServices.find((s) => s.slug === subSlug);
  if (!sub) return undefined;
  return { service, sub };
}

export const ALL_SUB_SERVICE_PATHS = SERVICES.flatMap((s) =>
  s.subServices.map((sub) => ({ slug: s.slug, sub: sub.slug })),
);
