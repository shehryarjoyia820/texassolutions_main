/**
 * CMS models: product, marketplaceItem
 * The spec says only build pages for products that exist. Each product below
 * carries a `status` so the grid can show what is live versus in development,
 * rather than implying everything ships today.
 */

export type ProductStatus = 'live' | 'beta' | 'planned';

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  icon: string;
  accentHex: string;
  status: ProductStatus;
  category: string;
  /** Related service slug. */
  service: string;
  features: { title: string; body: string }[];
  audience: string[];
  integrations: string[];
  faqs: { q: string; a: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: 'dispatch-portal',
    name: 'Dispatch Portal',
    tagline: 'Every load, document and settlement in one place.',
    summary: 'The carrier-facing portal behind our dispatch desk: loads, documents, settlements and claims.',
    description:
      'Carriers on our dispatch service get a portal rather than a group chat. Booked loads, rate confirmations, bills of lading, proof of delivery, invoices and detention claims all live in one timeline per truck, with weekly settlement summaries you can export.',
    icon: 'Truck',
    accentHex: '#FF7A1A',
    status: 'live',
    category: 'Operations',
    service: 'truck-dispatch',
    features: [
      { title: 'Load timeline per truck', body: 'Booked, in transit, delivered and invoiced, with the rate confirmation attached at every stage.' },
      { title: 'Document vault', body: 'Rate confirmations, bills of lading and proof of delivery stored and searchable, not buried in a phone.' },
      { title: 'Settlement summaries', body: 'Weekly gross, fees, accessorials and claims in one exportable statement.' },
      { title: 'Claim tracking', body: 'Detention, layover and truck-order-not-used claims with their filing status and payment outcome.' },
    ],
    audience: ['Owner-operators', 'Small fleets', 'Fleet managers'],
    integrations: ['QuickBooks', 'Triumph', 'RTS Financial', 'Motive', 'Samsara'],
    faqs: [
      { q: 'Is the portal included with dispatch?', a: 'Yes, at no extra cost for every truck on a dispatch agreement. It is not sold separately today.' },
      { q: 'Can my accountant get access?', a: 'Yes. You can invite read-only users and restrict them to settlements and documents.' },
    ],
  },
  {
    slug: 'lead-crm',
    name: 'Lead CRM',
    tagline: 'Scoring and routing for outbound teams.',
    summary: 'A lightweight CRM layer for lead generation clients: scoring, routing and response-time tracking.',
    description:
      'Built for teams whose main problem is not storing leads but working them fast enough. Leads arrive scored against the agreed qualification criteria, route to the right rep and start a response-time clock that is reported weekly.',
    icon: 'Users',
    accentHex: '#22C55E',
    status: 'beta',
    category: 'Sales',
    service: 'lead-generation',
    features: [
      { title: 'Fit and intent scoring', body: 'Leads scored on the criteria agreed at kickoff, so sales sees the right ones first.' },
      { title: 'Routing rules', body: 'Territory, sector or round-robin routing with escalation when nobody picks up.' },
      { title: 'Response-time clock', body: 'Time to first contact measured per lead and reported against your service level.' },
      { title: 'Two-way sync', body: 'Bidirectional sync with HubSpot and Salesforce so it complements rather than replaces your CRM.' },
    ],
    audience: ['Sales managers', 'Outbound teams', 'Agencies'],
    integrations: ['HubSpot', 'Salesforce', 'Pipedrive', 'Slack', 'Zapier'],
    faqs: [
      { q: 'Does this replace HubSpot or Salesforce?', a: 'No. It sits alongside them and syncs both ways. It handles scoring, routing and response-time measurement, which most CRMs do awkwardly.' },
      { q: 'Is it available standalone?', a: 'It is in beta with lead generation clients only. Standalone availability has not been announced.' },
    ],
  },
  {
    slug: 'ad-creative-library',
    name: 'Ad Creative Library',
    tagline: 'Every creative, every result, searchable.',
    summary: 'A searchable archive of ad creative with the performance data attached to each asset.',
    description:
      'Creative decisions get made from memory far too often. This library stores every static, carousel and video we produce for your account with its spend, click-through rate and cost per acquisition attached, so the next brief starts from evidence.',
    icon: 'Images',
    accentHex: '#A855F7',
    status: 'beta',
    category: 'Marketing',
    service: 'ads-optimization',
    features: [
      { title: 'Performance attached', body: 'Spend, click-through rate, cost per acquisition and fatigue curve stored against each asset.' },
      { title: 'Angle tagging', body: 'Tag by hook, format, offer and audience so you can ask what worked rather than scroll.' },
      { title: 'Placement variants', body: 'Every size and placement generated from one master, versioned together.' },
      { title: 'Fatigue alerts', body: 'A nudge when frequency climbs and performance starts to decay.' },
    ],
    audience: ['Performance marketers', 'Creative teams', 'Agencies'],
    integrations: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Figma', 'Google Drive'],
    faqs: [
      { q: 'Who owns the creative in the library?', a: 'You do. Every asset is yours and exportable at any time, including the source files.' },
      { q: 'Does it work with creative we produced ourselves?', a: 'Yes, you can upload existing assets and the library will pull their performance data from the connected ad accounts.' },
    ],
  },
  {
    slug: 'adsense-dashboard',
    name: 'AdSense Dashboard',
    tagline: 'Revenue per unit, per page type, per source.',
    summary: 'Publisher reporting that breaks revenue down to the individual ad unit.',
    description:
      'AdSense reports at site level, which is not granular enough to make layout decisions. This dashboard instruments each unit and reports revenue by unit, page type and traffic source, alongside Core Web Vitals for the same pages.',
    icon: 'LineChart',
    accentHex: '#F59E0B',
    status: 'live',
    category: 'Publishing',
    service: 'adsense-management',
    features: [
      { title: 'Per-unit revenue', body: 'What each placement earns, so low performers can be removed with evidence.' },
      { title: 'Vitals alongside revenue', body: 'Layout shift and load time for the same pages, because one costs the other.' },
      { title: 'Traffic source breakdown', body: 'Revenue per session split by search, social and direct.' },
      { title: 'Test control groups', body: 'Hold back a slice of traffic so layout changes can be measured rather than assumed.' },
    ],
    audience: ['Publishers', 'Content site owners', 'Media operators'],
    integrations: ['Google AdSense', 'Google Ad Manager', 'GA4', 'Search Console', 'Looker Studio'],
    faqs: [
      { q: 'Does this need code on our site?', a: 'A small instrumentation snippet, yes. It is asynchronous and does not affect Core Web Vitals, which we verify as part of setup.' },
      { q: 'Is it included with management?', a: 'Yes, on Growth and Pro AdSense plans.' },
    ],
  },
  {
    slug: 'website-templates',
    name: 'Website Templates',
    tagline: 'Production-ready templates, not theme demos.',
    summary: 'Industry templates on our design system, deployable in days rather than weeks.',
    description:
      'The same component library we use for custom builds, packaged as industry templates. They ship with the CMS models, the forms, the schema markup and the performance budget already configured, so a launch takes days.',
    icon: 'LayoutTemplate',
    accentHex: '#4F8CFF',
    status: 'live',
    category: 'Web',
    service: 'web-development',
    features: [
      { title: 'CMS already modelled', body: 'Every block is editable on day one, with preview and draft workflow configured.' },
      { title: 'Performance budget included', body: 'Lighthouse 90+ on mobile out of the box, enforced in the build.' },
      { title: 'Light and dark themes', body: 'Token-driven theming so brand colours are a config change, not a redesign.' },
      { title: 'Forms and tracking wired', body: 'Contact, quote and newsletter flows with consent wording and CRM handoff ready.' },
    ],
    audience: ['Small businesses', 'Agencies', 'Franchise operators'],
    integrations: ['Next.js', 'Sanity', 'Vercel', 'HubSpot', 'GA4'],
    faqs: [
      { q: 'Can we customise a template?', a: 'Yes. The tokens cover colour, type and spacing, and we can extend a template with custom blocks as a fixed-scope piece of work.' },
      { q: 'Do we own the template code?', a: 'Yes, outright, with no ongoing licence.' },
    ],
  },
  {
    slug: 'qa-test-suite',
    name: 'QA Test Suite',
    tagline: 'A regression pack you own, running in your pipeline.',
    summary: 'Playwright suites and reporting, built for your product and handed over.',
    description:
      'Not a hosted tool you rent. We build the Playwright framework, the suites and the reporting inside your repository and your CI, then hand it over documented. The product is the package and the discipline around it, not a subscription.',
    icon: 'ShieldCheck',
    accentHex: '#06B6D4',
    status: 'live',
    category: 'Engineering',
    service: 'qa-testing',
    features: [
      { title: 'Framework in your repo', body: 'Playwright configured with fixtures, page objects and data seeding conventions.' },
      { title: 'CI integration', body: 'Runs on every pull request with results posted back to the change.' },
      { title: 'Journey coverage reporting', body: 'Coverage by user journey, which is the number that actually predicts escaped defects.' },
      { title: 'Flake monitoring', body: 'Unreliable tests surfaced and fixed, so the suite stays trusted.' },
    ],
    audience: ['Engineering teams', 'QA leads', 'Product owners'],
    integrations: ['Playwright', 'GitHub Actions', 'GitLab CI', 'Jira', 'TestRail', 'BrowserStack'],
    faqs: [
      { q: 'Is there a subscription?', a: 'No. You own the suite. Ongoing work is optional and billed as QA time.' },
      { q: 'What if we already use Cypress?', a: 'We will build in Cypress rather than force a migration. Playwright is our default for new work, not a requirement.' },
    ],
  },
];

export const PRODUCT_MAP: Record<string, Product> = PRODUCTS.reduce(
  (acc, p) => ({ ...acc, [p.slug]: p }),
  {} as Record<string, Product>,
);

/* ------------------------------------------------------------------ */
/*  Marketplace — enquiry-only in v1, no checkout.                      */
/* ------------------------------------------------------------------ */

export type MarketplaceCategory =
  | 'Website templates'
  | 'Landing pages'
  | 'Ad creative packs'
  | 'Engine listings'
  | 'Add-ons'
  | 'Partner tools';

export interface MarketplaceItem {
  slug: string;
  name: string;
  category: MarketplaceCategory;
  summary: string;
  description: string;
  /** Price row reference, or a plain label where no table applies. */
  priceService?: string;
  priceRow?: string;
  priceLabel?: string;
  tags: string[];
  highlights: string[];
  service: string;
  accentHex: string;
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    slug: 'carrier-website-template',
    name: 'Carrier Website Template',
    category: 'Website templates',
    summary: 'Trucking company site with driver recruiting and shipper enquiry flows.',
    description:
      'Built for carriers who need to recruit drivers and win direct shippers from the same site. Includes a driver application flow, equipment pages, lane coverage map and a shipper quote request wired to your CRM.',
    priceService: 'web-development',
    priceRow: 'business-site',
    tags: ['Trucking', 'Recruiting', 'CMS'],
    highlights: ['Driver application flow', 'Equipment and lane pages', 'Shipper quote request', 'Lighthouse 90+ on mobile'],
    service: 'web-development',
    accentHex: '#FF7A1A',
  },
  {
    slug: 'clinic-website-template',
    name: 'Clinic Website Template',
    category: 'Website templates',
    summary: 'Multi-location clinic site with staged intake and booking.',
    description:
      'Location pages, practitioner profiles and a staged intake form that does not lose people on mobile, with encrypted handling and an audit trail on submissions.',
    priceService: 'web-development',
    priceRow: 'business-site',
    tags: ['Healthcare', 'Booking', 'Compliance'],
    highlights: ['Staged intake with save and resume', 'Location and practitioner pages', 'Encrypted submission handling', 'Booking widget with time zones'],
    service: 'web-development',
    accentHex: '#22C55E',
  },
  {
    slug: 'store-launch-template',
    name: 'Store Launch Template',
    category: 'Website templates',
    summary: 'Headless commerce storefront ready for peak traffic.',
    description:
      'A headless storefront with catalogue, checkout, abandoned cart recovery and the server-side tracking that keeps attribution intact after cookie loss.',
    priceService: 'web-development',
    priceRow: 'ecommerce',
    tags: ['E-commerce', 'Headless', 'Tracking'],
    highlights: ['Catalogue and merchandising', 'Server-side conversion tracking', 'Abandoned cart flows', 'Load tested before peak'],
    service: 'web-development',
    accentHex: '#4F8CFF',
  },
  {
    slug: 'campaign-landing-pack',
    name: 'Campaign Landing Page Pack',
    category: 'Landing pages',
    summary: 'Three campaign pages plus variants, built and tracked.',
    description:
      'Three landing pages for three offers, each with an A/B variant, form, CRM handoff and conversion tracking. Turnaround is usually two weeks.',
    priceService: 'web-development',
    priceRow: 'landing-page',
    tags: ['Paid media', 'Conversion', 'Fast turnaround'],
    highlights: ['Three pages plus variants', 'Copy polish included', 'CRM handoff', 'Conversion tracking'],
    service: 'web-development',
    accentHex: '#4F8CFF',
  },
  {
    slug: 'static-creative-pack',
    name: 'Static Creative Pack',
    category: 'Ad creative packs',
    summary: 'Five statics with copy, in every placement size.',
    description:
      'Five static concepts developed from distinct angles, written and designed, then resized for every placement across Meta, Google and TikTok.',
    priceService: 'ads-optimization',
    priceRow: 'creative-pack',
    tags: ['Meta', 'Google', 'TikTok'],
    highlights: ['Five distinct angles', 'Copy written, not filled in', 'All placement sizes', 'Source files included'],
    service: 'ads-optimization',
    accentHex: '#A855F7',
  },
  {
    slug: 'video-creative-pack',
    name: 'Short-Form Video Pack',
    category: 'Ad creative packs',
    summary: 'Three short-form videos edited for sound-off viewing.',
    description:
      'Three vertical videos cut for the first two seconds, captioned for sound-off viewing and delivered in the aspect ratios each platform actually rewards.',
    priceService: 'ads-optimization',
    priceRow: 'creative-pack',
    tags: ['Video', 'Vertical', 'Captioned'],
    highlights: ['Hook tested in the first 2 seconds', 'Burned-in captions', 'Platform aspect ratios', 'Spark Ads ready'],
    service: 'ads-optimization',
    accentHex: '#A855F7',
  },
  {
    slug: 'used-engine-listings',
    name: 'Used Engine Listings',
    category: 'Engine listings',
    summary: 'Mileage-verified used engines with compression data.',
    description:
      'Current stock of used engines from vetted dismantlers, each with verified mileage, compression and leak-down figures and photographs. Enquire with your VIN and we confirm the match before anything is reserved.',
    priceService: 'auto-engines',
    priceRow: 'used',
    tags: ['Used', 'Verified', 'Warranty options'],
    highlights: ['Mileage verified', 'Compression and leak-down data', 'Photographs before dispatch', 'Core return handled'],
    service: 'auto-engines',
    accentHex: '#EF4444',
  },
  {
    slug: 'reman-engine-listings',
    name: 'Remanufactured Engine Listings',
    category: 'Engine listings',
    summary: 'OEM-spec rebuilds with extended warranty.',
    description:
      'Machined and rebuilt to OEM specification with new bearings, rings, seals and gaskets, run-tested before dispatch and supplied with an extended warranty.',
    priceService: 'auto-engines',
    priceRow: 'reman',
    tags: ['Remanufactured', 'Extended warranty', 'Run tested'],
    highlights: ['Rebuilt to OEM specification', 'New wear components', 'Run-tested before dispatch', 'Installation available'],
    service: 'auto-engines',
    accentHex: '#EF4444',
  },
  {
    slug: 'conversion-tracking-addon',
    name: 'Conversion Tracking Rebuild',
    category: 'Add-ons',
    summary: 'Server-side measurement that survives cookie loss.',
    description:
      'GA4, Tag Manager, server-side tagging, the Conversions API and offline conversion import, verified end to end. Usually the highest-return thing to fix in an ad account.',
    priceService: 'ads-optimization',
    priceRow: 'setup',
    tags: ['GA4', 'Server-side', 'Attribution'],
    highlights: ['Tracking audit first', 'Server-side tagging', 'Offline conversion import', 'Verification report'],
    service: 'ads-optimization',
    accentHex: '#A855F7',
  },
  {
    slug: 'automation-starter-addon',
    name: 'Test Automation Starter',
    category: 'Add-ons',
    summary: 'Playwright framework and your first ten journeys.',
    description:
      'The framework stood up in your repository, wired into CI, with your ten highest-value user journeys automated and documented for your team to extend.',
    priceService: 'qa-testing',
    priceRow: 'qa-managed',
    tags: ['Playwright', 'CI', 'Handover'],
    highlights: ['Framework in your repo', 'Ten journeys automated', 'CI integration', 'Documented handover'],
    service: 'qa-testing',
    accentHex: '#06B6D4',
  },
  {
    slug: 'factoring-partners',
    name: 'Factoring Partners',
    category: 'Partner tools',
    summary: 'Vetted factoring companies for carriers on our desk.',
    description:
      'Introductions to factoring companies we already submit to daily, so paperwork flows without a new integration. We do not take a commission on these introductions.',
    priceLabel: 'Introduction, no fee',
    tags: ['Factoring', 'Cash flow', 'Carriers'],
    highlights: ['Already integrated with our desk', 'Same-day submission', 'No commission taken', 'Terms compared for you'],
    service: 'truck-dispatch',
    accentHex: '#FF7A1A',
  },
  {
    slug: 'load-board-access',
    name: 'Load Board Setup',
    category: 'Partner tools',
    summary: 'Board accounts configured and worked by your dispatcher.',
    description:
      'We set up and configure your load board accounts with the filters and lane preferences that suit your equipment, then work them from our desk.',
    priceLabel: 'Included with dispatch',
    tags: ['DAT', 'Truckstop', 'Setup'],
    highlights: ['Accounts configured for your lanes', 'Filters tuned to your equipment', 'Worked daily by your dispatcher', 'Included with dispatch service'],
    service: 'truck-dispatch',
    accentHex: '#FF7A1A',
  },
];

export const MARKETPLACE_MAP: Record<string, MarketplaceItem> = MARKETPLACE_ITEMS.reduce(
  (acc, m) => ({ ...acc, [m.slug]: m }),
  {} as Record<string, MarketplaceItem>,
);

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  'Website templates',
  'Landing pages',
  'Ad creative packs',
  'Engine listings',
  'Add-ons',
  'Partner tools',
];
