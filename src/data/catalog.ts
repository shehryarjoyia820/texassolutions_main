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

import type { TemplatePreviewConfig } from '@/components/template-preview';

export type MarketplaceCategory =
  | 'Website templates'
  | 'Landing pages'
  | 'Ad creative packs'
  | 'Engine listings'
  | 'AI and automation'
  | 'Dashboards and data'
  | 'Cloud and security kits'
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
  /** Rendered miniature for templates and landing pages. */
  preview?: TemplatePreviewConfig;
  /** Pages or screens included, shown on template cards. */
  pages?: string[];
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
    preview: { layout: 'split', brand: 'Lonestar Freight', headline: 'Drive with a carrier that pays on time', sub: 'Home weekly. Paid every Friday. Dispatch that answers.', cta: 'Apply to drive', nav: ['Drivers', 'Shippers', 'Lanes', 'About'], tone: 'dark', accent2: '#FFC53D' },
    pages: ['Home', 'Drive for us', 'Shippers', 'Lane map', 'Equipment', 'Apply', 'Quote'],
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
    preview: { layout: 'booking', brand: 'Northside Health', headline: 'Care that fits around your week', sub: 'Same-week appointments at four locations.', cta: 'Book now', nav: ['Services', 'Doctors', 'Locations', 'Patients'], tone: 'light', accent2: '#0EA5E9' },
    pages: ['Home', 'Services', 'Practitioners', 'Locations', 'Intake', 'Booking', 'Patient info'],
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
    preview: { layout: 'store', brand: 'Atlas Goods', headline: 'Built to last. Priced to move.', sub: 'Free shipping over $75. Easy returns.', cta: 'Shop now', nav: ['New', 'Men', 'Women', 'Sale'], tone: 'light', accent2: '#A855F7' },
    pages: ['Home', 'Collection', 'Product', 'Cart', 'Checkout', 'Account', 'Order tracking'],
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
    preview: { layout: 'centered', brand: 'Offer Page', headline: 'Cut your cost per lead in 30 days', sub: 'One offer, one form, one next step.', cta: 'Claim your audit', nav: ['How it works', 'Results', 'FAQ'], tone: 'dark', accent2: '#22C55E' },
    pages: ['Offer A', 'Offer B', 'Offer C', 'Variant for each', 'Thank-you pages'],
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
  /* ---------------- more website templates ---------------- */
  {
    slug: 'saas-product-template',
    name: 'SaaS Product Template',
    category: 'Website templates',
    summary: 'Marketing site plus in-app dashboard shell for a software product.',
    description:
      'A product marketing site with pricing, changelog and docs, paired with an authenticated dashboard shell: navigation, charts, tables, settings and billing screens ready to connect to your API.',
    priceService: 'web-development',
    priceRow: 'web-app',
    tags: ['SaaS', 'Dashboard', 'Auth'],
    highlights: ['Pricing, changelog and docs pages', 'Dashboard shell with charts and tables', 'Auth, settings and billing screens', 'Dark and light themes'],
    service: 'web-development',
    accentHex: '#6366F1',
    preview: { layout: 'dashboard', brand: 'Metricly', headline: 'Good morning, Alex', cta: 'Upgrade', nav: ['Dashboard', 'Reports', 'Team'], tone: 'dark', accent2: '#22D3EE' },
    pages: ['Home', 'Pricing', 'Docs', 'Changelog', 'Sign in', 'Dashboard', 'Settings', 'Billing'],
  },
  {
    slug: 'real-estate-template',
    name: 'Real Estate Listings Template',
    category: 'Website templates',
    summary: 'IDX-ready listing search with instant lead routing.',
    description:
      'Property search with filters, saved searches and map view, listing pages with enquiry forms that route to the right agent in seconds, and agent profile pages. Built to take an IDX or MLS feed.',
    priceService: 'web-development',
    priceRow: 'agency-build',
    tags: ['Real estate', 'IDX', 'Lead routing'],
    highlights: ['Search with filters and map view', 'Saved searches and alerts', 'Instant agent routing', 'IDX and MLS feed ready'],
    service: 'web-development',
    accentHex: '#A855F7',
    preview: { layout: 'listing', brand: 'Bluebonnet Realty', headline: 'Find your place in Texas', sub: '2,400 homes listed this week.', cta: 'List with us', nav: ['Buy', 'Sell', 'Rent', 'Agents'], tone: 'light', accent2: '#F59E0B' },
    pages: ['Home', 'Search', 'Listing', 'Map', 'Agents', 'Sell', 'Valuation'],
  },
  {
    slug: 'professional-services-template',
    name: 'Professional Services Template',
    category: 'Website templates',
    summary: 'For law, accounting and consulting firms that sell trust.',
    description:
      'Practice areas, partner profiles, insights and a consultation booking flow, with the restrained typography and proof points that professional buyers expect.',
    priceService: 'web-development',
    priceRow: 'business-site',
    tags: ['Legal', 'Accounting', 'Consulting'],
    highlights: ['Practice area pages', 'Partner and team profiles', 'Insights and articles', 'Consultation booking'],
    service: 'web-development',
    accentHex: '#0EA5E9',
    preview: { layout: 'split', brand: 'Hale & Moreno', headline: 'Counsel that sees around corners', sub: 'Corporate, employment and property law.', cta: 'Book a consultation', nav: ['Practice', 'People', 'Insights', 'Contact'], tone: 'light', accent2: '#1E3A8A' },
    pages: ['Home', 'Practice areas', 'People', 'Insights', 'Careers', 'Contact'],
  },
  {
    slug: 'restaurant-template',
    name: 'Restaurant and Hospitality Template',
    category: 'Website templates',
    summary: 'Menus, reservations and online ordering in one site.',
    description:
      'Menus that are easy to update, table reservations, online ordering hand-off and location pages for multi-site groups, built mobile first because that is where diners look.',
    priceService: 'web-development',
    priceRow: 'business-site',
    tags: ['Hospitality', 'Reservations', 'Mobile first'],
    highlights: ['Editable menus', 'Reservation widget', 'Online ordering hand-off', 'Multi-location pages'],
    service: 'web-development',
    accentHex: '#EF4444',
    preview: { layout: 'booking', brand: 'Ember & Oak', headline: 'Wood-fired, every night', sub: 'Reserve a table or order for pickup.', cta: 'Reserve', nav: ['Menu', 'Locations', 'Events', 'Gift cards'], tone: 'dark', accent2: '#F59E0B' },
    pages: ['Home', 'Menu', 'Reservations', 'Locations', 'Private events', 'Gift cards'],
  },
  {
    slug: 'publisher-magazine-template',
    name: 'Publisher Magazine Template',
    category: 'Website templates',
    summary: 'Fast editorial layout with ad slots that do not shift the page.',
    description:
      'Article, category and author templates with reserved ad slots, so revenue units load without hurting Core Web Vitals. Built for AdSense and Ad Manager from the start.',
    priceService: 'web-development',
    priceRow: 'business-site',
    tags: ['Publishing', 'AdSense ready', 'Core Web Vitals'],
    highlights: ['Reserved, shift-free ad slots', 'Article and author templates', 'Newsletter capture', 'Lighthouse 90+ on mobile'],
    service: 'web-development',
    accentHex: '#F59E0B',
    preview: { layout: 'editorial', brand: 'The Road Report', headline: 'Freight rates cool as capacity returns', cta: 'Subscribe', nav: ['News', 'Rates', 'Guides', 'Podcast'], tone: 'light', accent2: '#EF4444' },
    pages: ['Home', 'Category', 'Article', 'Author', 'Newsletter', 'Advertise'],
  },
  {
    slug: 'logistics-portal-template',
    name: 'Logistics Customer Portal',
    category: 'Website templates',
    summary: 'Shipment tracking, documents and invoices for your shippers.',
    description:
      'A customer portal where shippers track loads, download proof of delivery, view invoices and request quotes, so your team stops answering where-is-my-truck calls.',
    priceService: 'web-development',
    priceRow: 'web-app',
    tags: ['Logistics', 'Portal', 'Tracking'],
    highlights: ['Live shipment tracking', 'Document downloads', 'Invoice history', 'Quote requests'],
    service: 'web-development',
    accentHex: '#FF7A1A',
    preview: { layout: 'dashboard', brand: 'FreightView', headline: 'Shipments this week', cta: 'New quote', nav: ['Loads', 'Docs', 'Invoices'], tone: 'dark', accent2: '#FFC53D' },
    pages: ['Sign in', 'Shipments', 'Tracking', 'Documents', 'Invoices', 'Quotes', 'Users'],
  },

  /* ---------------- more landing pages ---------------- */
  {
    slug: 'webinar-landing-page',
    name: 'Webinar and Event Landing Page',
    category: 'Landing pages',
    summary: 'Registration page with reminders and replay access.',
    description:
      'An event page with speaker profiles, agenda and a registration flow that sends calendar invites, reminders and the replay link automatically.',
    priceService: 'web-development',
    priceRow: 'landing-page',
    tags: ['Events', 'Registration', 'Email flows'],
    highlights: ['Speaker and agenda blocks', 'Calendar invites', 'Reminder sequence', 'Replay gating'],
    service: 'web-development',
    accentHex: '#EC4899',
    preview: { layout: 'centered', brand: 'Live Session', headline: 'Watch a dispatcher work, live', sub: 'October 15 · 2 hours · Online', cta: 'Save my seat', nav: ['Agenda', 'Speakers', 'FAQ'], tone: 'dark', accent2: '#A855F7' },
    pages: ['Registration', 'Confirmation', 'Replay'],
  },
  {
    slug: 'app-launch-landing-page',
    name: 'App Launch Landing Page',
    category: 'Landing pages',
    summary: 'Pre-launch waitlist that turns into a store download page.',
    description:
      'A launch page with waitlist capture and referral positions before release, then App Store and Google Play buttons, screenshots and reviews afterwards.',
    priceService: 'web-development',
    priceRow: 'landing-page',
    tags: ['Mobile apps', 'Waitlist', 'Launch'],
    highlights: ['Waitlist with referral ranking', 'Store download switch', 'Screenshot carousel', 'Press kit block'],
    service: 'web-development',
    accentHex: '#22C55E',
    preview: { layout: 'split', brand: 'Routewise', headline: 'Your loads, one tap away', sub: 'Join 3,200 drivers on the waitlist.', cta: 'Join waitlist', nav: ['Features', 'Pricing', 'FAQ'], tone: 'light', accent2: '#0EA5E9' },
    pages: ['Waitlist', 'Launch', 'Press kit'],
  },

  /* ---------------- ad creative ---------------- */
  {
    slug: 'linkedin-b2b-creative-pack',
    name: 'LinkedIn B2B Creative Pack',
    category: 'Ad creative packs',
    summary: 'Document ads, carousels and single images for B2B buyers.',
    description:
      'Five LinkedIn creatives built around a single B2B offer: a document ad, a carousel and three single images, with copy written for senior buyers rather than consumers.',
    priceService: 'ads-optimization',
    priceRow: 'creative-pack',
    tags: ['LinkedIn', 'B2B', 'Document ads'],
    highlights: ['Document ad for lead gen forms', 'Five-card carousel', 'Three single-image variants', 'Copy for senior buyers'],
    service: 'ads-optimization',
    accentHex: '#0A66C2',
  },

  /* ---------------- AI and automation ---------------- */
  {
    slug: 'support-chatbot-starter',
    name: 'Support Chatbot Starter',
    category: 'AI and automation',
    summary: 'A grounded assistant on your help centre, live in weeks.',
    description:
      'Ingests your help centre and policies, answers with citations, hands off to a person when unsure and reports on what customers ask most. Deploys to your website, Slack or Teams.',
    priceService: 'ai-machine-learning',
    priceRow: 'ai-chatbot',
    tags: ['Chatbot', 'Retrieval', 'Support'],
    highlights: ['Answers with citations', 'Human hand-off', 'Website, Slack or Teams', 'Question analytics'],
    service: 'ai-machine-learning',
    accentHex: '#EC4899',
  },
  {
    slug: 'document-extraction-kit',
    name: 'Document Extraction Kit',
    category: 'AI and automation',
    summary: 'Invoices, BOLs and forms turned into structured data.',
    description:
      'Extracts fields from invoices, bills of lading, rate confirmations and forms into your system of record, with confidence scores and a review queue for anything uncertain.',
    priceService: 'ai-machine-learning',
    priceRow: 'ai-genai',
    tags: ['Extraction', 'Invoices', 'Logistics'],
    highlights: ['Invoices, BOLs and rate cons', 'Confidence scoring', 'Human review queue', 'ERP and TMS export'],
    service: 'ai-machine-learning',
    accentHex: '#EC4899',
  },
  {
    slug: 'ai-agent-pilot',
    name: 'AI Agent Pilot',
    category: 'AI and automation',
    summary: 'One multi-step workflow automated, measured and approved.',
    description:
      'A fixed-scope pilot that automates one multi-step workflow, such as quote preparation or lead research, with approvals before any irreversible action and a report comparing it with the current process.',
    priceService: 'ai-machine-learning',
    priceRow: 'ai-consulting',
    tags: ['AI agents', 'Pilot', 'Workflow'],
    highlights: ['One workflow end to end', 'Approval checkpoints', 'Full audit log', 'Before and after report'],
    service: 'ai-machine-learning',
    accentHex: '#EC4899',
  },

  /* ---------------- dashboards and data ---------------- */
  {
    slug: 'executive-dashboard-pack',
    name: 'Executive Dashboard Pack',
    category: 'Dashboards and data',
    summary: 'Revenue, pipeline, cash and operations on one screen.',
    description:
      'A Power BI or Looker executive pack connected to your CRM, accounting and operations tools, with every metric defined once and refreshed automatically.',
    priceService: 'data-analytics',
    priceRow: 'bi-dashboards',
    tags: ['Power BI', 'Looker', 'Executive'],
    highlights: ['Revenue and pipeline', 'Cash and margin', 'Operations KPIs', 'Automated refresh'],
    service: 'data-analytics',
    accentHex: '#0EA5E9',
  },
  {
    slug: 'marketing-attribution-dashboard',
    name: 'Marketing Attribution Dashboard',
    category: 'Dashboards and data',
    summary: 'Spend to closed revenue, by channel and campaign.',
    description:
      'Joins ad platform spend with CRM outcomes so you can see cost per opportunity and cost per closed deal by channel, not just cost per click.',
    priceService: 'data-analytics',
    priceRow: 'bi-dashboards',
    tags: ['Attribution', 'Ads', 'CRM'],
    highlights: ['Google, Meta, LinkedIn and TikTok', 'CRM outcome join', 'Cost per closed deal', 'Weekly email digest'],
    service: 'data-analytics',
    accentHex: '#0EA5E9',
  },
  {
    slug: 'fleet-operations-dashboard',
    name: 'Fleet Operations Dashboard',
    category: 'Dashboards and data',
    summary: 'Revenue per mile, deadhead and detention by truck.',
    description:
      'Built for carriers: pulls loads, settlements and telematics into one view of revenue per mile, deadhead, detention recovered and utilisation by truck and lane.',
    priceService: 'data-analytics',
    priceRow: 'bi-dashboards',
    tags: ['Trucking', 'Telematics', 'Fleet'],
    highlights: ['Revenue per mile by lane', 'Deadhead and utilisation', 'Detention recovered', 'Motive and Samsara ready'],
    service: 'data-analytics',
    accentHex: '#FF7A1A',
  },

  /* ---------------- cloud and security kits ---------------- */
  {
    slug: 'aws-landing-zone',
    name: 'AWS Landing Zone',
    category: 'Cloud and security kits',
    summary: 'A secure, multi-account AWS foundation as code.',
    description:
      'Accounts, networking, identity, logging, guardrails and budgets defined in Terraform, so every future workload lands somewhere secure and governed.',
    priceService: 'cloud-devops',
    priceRow: 'devops-setup',
    tags: ['AWS', 'Terraform', 'Governance'],
    highlights: ['Multi-account structure', 'Central logging and guardrails', 'SSO and least privilege', 'Budgets and alerts'],
    service: 'cloud-devops',
    accentHex: '#6366F1',
  },
  {
    slug: 'soc2-starter-kit',
    name: 'SOC 2 Starter Kit',
    category: 'Cloud and security kits',
    summary: 'Policies, controls and evidence to get audit-ready.',
    description:
      'The policy set, control mapping and evidence collection most startups need for a first SOC 2 report, tailored to your stack and handed over ready for the auditor.',
    priceService: 'cybersecurity',
    priceRow: 'compliance-readiness',
    tags: ['SOC 2', 'Compliance', 'Startups'],
    highlights: ['Full policy set', 'Control mapping', 'Evidence collection', 'Auditor coordination'],
    service: 'cybersecurity',
    accentHex: '#84CC16',
  },
  {
    slug: 'security-quick-scan',
    name: 'Security Quick Scan',
    category: 'Cloud and security kits',
    summary: 'A two-week look at where you are most exposed.',
    description:
      'Cloud configuration, identity, public attack surface and your main application, scanned and reviewed, with a short risk-ranked report and a call to walk through it.',
    priceService: 'cybersecurity',
    priceRow: 'security-assessment',
    tags: ['Assessment', 'Cloud', 'Quick win'],
    highlights: ['Cloud and identity review', 'External attack surface', 'Risk-ranked findings', 'Walkthrough call'],
    service: 'cybersecurity',
    accentHex: '#84CC16',
  },

  /* ---------------- add-ons ---------------- */
  {
    slug: 'verified-lead-list',
    name: 'Verified Lead List',
    category: 'Add-ons',
    summary: 'Contacts matched to your ideal customer profile, verified.',
    description:
      'A list built against your written ideal customer profile, enriched, email-verified and deduplicated against your CRM, ready for your own outbound or ours.',
    priceService: 'lead-generation',
    priceRow: 'per-lead',
    tags: ['Data', 'Outbound', 'Verified'],
    highlights: ['Built to your ICP', 'Email verification', 'CRM deduplication', 'Suppression respected'],
    service: 'lead-generation',
    accentHex: '#22C55E',
  },
  {
    slug: 'dedicated-developer-trial',
    name: 'Dedicated Developer Trial',
    category: 'Add-ons',
    summary: 'One engineer for one month, no long commitment.',
    description:
      'Try the dedicated team model with a single engineer matched to your stack for one month. You interview them first, and you can scale up or stop at the end of the month.',
    priceService: 'dedicated-teams',
    priceRow: 'dev-middle',
    tags: ['Dedicated teams', 'Trial', 'Flexible'],
    highlights: ['You interview first', 'Starts within two weeks', 'Your tools and ceremonies', 'Stop or scale after a month'],
    service: 'dedicated-teams',
    accentHex: '#D946EF',
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
  'AI and automation',
  'Dashboards and data',
  'Cloud and security kits',
  'Add-ons',
  'Partner tools',
];
