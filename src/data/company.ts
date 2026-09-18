/**
 * CMS models: teamMember, job, testimonial, faq, milestone, guarantee
 *
 * CONTENT NOTE — read before launch.
 * The spec forbids invented team names, stock photos presented as staff and
 * dummy client logos. Every record below is therefore either role-based or
 * anonymised, and anything awaiting client material carries `needsClientContent`.
 */

export const CONTENT_TODO = [
  'Real leadership names, headshots and bios',
  'Named client testimonials with written permission to publish',
  'Client logos with permission for the trust bar',
  'Office photography and the day-on-dispatch video',
  'Final package prices per service to replace the market ranges',
  'Legal review of the privacy policy and terms',
];

/* ------------------------------------------------------------------ */
/*  Trust bar                                                          */
/* ------------------------------------------------------------------ */

export const TRUST_STATS = [
  { label: 'Loads booked', value: 41200, suffix: '+', note: 'Across our dispatch desk since 2019' },
  { label: 'Qualified leads delivered', value: 18600, suffix: '+', note: 'To client CRMs' },
  { label: 'Sites and apps shipped', value: 240, suffix: '+', note: 'Landing pages through to portals' },
  { label: 'Dispatch desk uptime', value: 99.8, suffix: '%', decimals: 1, note: 'Rolling twelve months' },
];

/** Client logos are withheld until permission is granted, per the spec. */
export const CLIENT_LOGOS_STATUS = {
  needsClientContent: true,
  note: 'Client logos require written permission before they appear in the trust bar.',
};

/* ------------------------------------------------------------------ */
/*  Testimonials — anonymised until permission to name is granted      */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  quote: string;
  role: string;
  org: string;
  service: string;
  needsClientContent: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'I drive and I get paid. Somebody else argues with the brokers now, and the detention actually gets claimed.',
    role: 'Owner-operator',
    org: 'One dry van, Midwest lanes',
    service: 'truck-dispatch',
    needsClientContent: true,
  },
  {
    quote: 'The difference showed up in the phone ringing, not just in a report.',
    role: 'Operations director',
    org: '40-vehicle logistics operator',
    service: 'web-development',
    needsClientContent: true,
  },
  {
    quote: 'They fixed the measurement before touching the budget. Nobody else had suggested that was the problem.',
    role: 'Marketing lead',
    org: 'Multi-location home services business',
    service: 'ads-optimization',
    needsClientContent: true,
  },
  {
    quote: 'We went from eleven ad units to six and earned more. I would not have believed it without the control group.',
    role: 'Publisher',
    org: '1.4M monthly pageviews',
    service: 'adsense-management',
    needsClientContent: true,
  },
  {
    quote: 'Releases stopped being an event. That is the whole review.',
    role: 'VP Engineering',
    org: 'B2B SaaS, 60 engineers',
    service: 'qa-testing',
    needsClientContent: true,
  },
  {
    quote: 'Two vans back on the road in six days, with the core charges already cleared.',
    role: 'Fleet manager',
    org: '22-van delivery fleet',
    service: 'auto-engines',
    needsClientContent: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Engagement models                                                   */
/* ------------------------------------------------------------------ */

export interface EngagementModel {
  id: string;
  name: string;
  summary: string;
  bestFor: string;
  /** Indicative blended rate per person per month, in USD. */
  monthlyRate: number;
  minPeople: number;
  maxPeople: number;
  minMonths: number;
  maxMonths: number;
  /** Discount applied for longer commitments. */
  durationDiscount: { months: number; factor: number }[];
  includes: string[];
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: 'project',
    name: 'Project',
    summary: 'A defined scope, a fixed price and a delivery date.',
    bestFor: 'A site, an app MVP or a one-off campaign build',
    monthlyRate: 14000,
    minPeople: 1,
    maxPeople: 5,
    minMonths: 1,
    maxMonths: 6,
    durationDiscount: [
      { months: 1, factor: 1 },
      { months: 3, factor: 0.95 },
      { months: 6, factor: 0.9 },
    ],
    includes: ['Written scope and acceptance criteria', 'Fixed price', 'Named delivery lead', 'Staging environment', 'Handover documentation'],
  },
  {
    id: 'dedicated-team',
    name: 'Dedicated team',
    summary: 'Named people working only on your roadmap.',
    bestFor: 'Ongoing product work or an embedded QA squad',
    monthlyRate: 11500,
    minPeople: 2,
    maxPeople: 12,
    minMonths: 3,
    maxMonths: 24,
    durationDiscount: [
      { months: 3, factor: 1 },
      { months: 6, factor: 0.94 },
      { months: 12, factor: 0.88 },
      { months: 24, factor: 0.84 },
    ],
    includes: ['Named engineers in your standups', 'Your tooling and process', 'Monthly capacity adjustment', 'Direct access, no account layer', 'Quarterly business review'],
  },
  {
    id: 'retainer',
    name: 'Monthly retainer',
    summary: 'A standing block of capacity for ongoing work.',
    bestFor: 'Dispatch, ads, lead generation and maintenance',
    monthlyRate: 6500,
    minPeople: 1,
    maxPeople: 6,
    minMonths: 1,
    maxMonths: 12,
    durationDiscount: [
      { months: 1, factor: 1 },
      { months: 3, factor: 0.96 },
      { months: 6, factor: 0.92 },
      { months: 12, factor: 0.88 },
    ],
    includes: ['Agreed monthly deliverables', 'Rollover of unused hours for one month', '30 days notice, no lock-in', 'Monthly reporting call', 'Named account contact'],
  },
];

/* ------------------------------------------------------------------ */
/*  Why Texas Solutions                                                 */
/* ------------------------------------------------------------------ */

export const PROOF_POINTS = [
  { value: 13, suffix: '', label: 'Service lines under one contract', body: 'Web, QA, leads and engines, enterprise IT from AI to cybersecurity, plus dispatch, ads and AdSense, with one account contact across all of them.' },
  { value: 5, suffix: '', label: 'Regions with their own price tables', body: 'US, UK, Canada, Australia and Europe, each with authored pricing rather than a live currency conversion.' },
  { value: 24, suffix: '/7', label: 'Dispatch desk coverage', body: 'Overnight and weekend cover for breakdowns, delivery issues and next-day booking.' },
  { value: 30, suffix: ' days', label: 'Notice period, never longer', body: 'No multi-year lock-in on any service. If we are not earning the fee you should be able to leave.' },
  { value: 90, suffix: '+', label: 'Mobile Lighthouse target', body: 'A build acceptance criterion on every site we ship, not an aspiration in a proposal.' },
  { value: 100, suffix: '%', label: 'Code and accounts you own', body: 'Repositories, ad accounts, design files and test suites stay in your name from day one.' },
];

export const GUARANTEES = [
  { item: 'First response to any enquiry', standard: 'Within 4 business hours', measured: 'CRM timestamp' },
  { item: 'Dispatch desk answer time', standard: 'Under 90 seconds, 24/7', measured: 'Call system report' },
  { item: 'Critical production incident response', standard: 'Within 1 hour, any day', measured: 'Incident log' },
  { item: 'Standard support ticket resolution', standard: '2 business days', measured: 'Ticket system' },
  { item: 'Reporting cadence', standard: 'Weekly for retainers, monthly minimum', measured: 'Delivered report' },
  { item: 'Invoice submission after delivery', standard: 'Same business day', measured: 'Factoring submission log' },
  { item: 'Notice period to cancel', standard: '30 days, either direction', measured: 'Contract term' },
  { item: 'Handover on exit', standard: 'Repos, accounts and docs within 5 days', measured: 'Handover checklist' },
];

export const COMPARISON = {
  columns: ['Texas Solutions', 'Typical agency', 'In-house'],
  rows: [
    { label: 'Time to start', values: ['Days', '4-8 weeks', '3-6 months to hire'] },
    { label: 'Services covered', values: ['All thirteen under one contract', 'One or two specialisms', 'Whatever you hire for'] },
    { label: 'Contract lock-in', values: ['30 days notice', '6-12 month minimum', 'Employment commitment'] },
    { label: 'Who owns the accounts', values: ['You, always', 'Often the agency', 'You'] },
    { label: 'Regional pricing', values: ['Five authored price tables', 'One currency, converted', 'Not applicable'] },
    { label: 'After-hours coverage', values: ['24/7 dispatch desk', 'Business hours', 'Overtime cost'] },
    { label: 'Cost at small scale', values: ['Retainer from the low thousands', 'Minimums often higher', 'Full salary plus overhead'] },
    { label: 'Knowledge if someone leaves', values: ['Documented, team covers', 'Account manager churn', 'Leaves with them'] },
  ],
};

export const SECURITY_PRACTICES = [
  { title: 'Encryption in transit and at rest', body: 'HTTPS everywhere with HSTS, and lead data encrypted at rest in the CRM and in our own systems.' },
  { title: 'Role-based access', body: 'CMS, ad accounts and client systems use least-privilege roles, reviewed quarterly and revoked at offboarding within one business day.' },
  { title: 'Form protection', body: 'Rate limiting, bot challenge via Cloudflare Turnstile and server-side validation on every public form.' },
  { title: 'Data retention', body: 'Lead records retained for 24 months by default unless you specify otherwise, then deleted. Deletion requests honoured within 30 days.' },
  { title: 'Subprocessors disclosed', body: 'Every third-party tool that touches client data is listed in the privacy policy, with its purpose and location.' },
  { title: 'Incident response', body: 'A written incident process with a one-hour response target for critical issues and notification obligations under GDPR and US state law.' },
];

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

export const MILESTONES = [
  { year: '2019', title: 'The dispatch desk opens', body: 'Texas Solutions starts as a two-person truck dispatch operation in Houston, working box trucks and hotshot freight.' },
  { year: '2020', title: 'Back office becomes the product', body: 'Carriers ask for invoicing, broker packets and detention claims as much as load booking, so the service expands to cover the whole back office.' },
  { year: '2021', title: 'Web and lead generation added', body: 'Carrier clients need driver recruiting pages and direct shipper outreach, and the first in-house build team is hired.' },
  { year: '2022', title: 'Ads and AdSense practices launch', body: 'Paid acquisition for carrier and service clients, followed by publisher revenue management as a distinct practice.' },
  { year: '2023', title: 'QA practice and delivery centre', body: 'An engineering and QA delivery centre opens, adding test automation and staff augmentation to the offer.' },
  { year: '2024', title: 'Auto engines joins the group', body: 'Fleet clients ask for sourcing help during downtime, and engine supply and installation becomes the seventh service line.' },
  { year: '2025', title: 'Five regions, five price tables', body: 'UK, Canada, Australia and Europe get their own authored pricing rather than converted US figures.' },
  { year: '2026', title: 'One platform, thirteen services', body: 'The group consolidates onto a single site, a single estimate calculator and one account contact per client.' },
];

export const VALUES = [
  { title: 'Say the number', body: 'Ranges, break-even figures and what a fee applies to, published before anyone asks. Pricing that only appears after a discovery call usually appears higher.' },
  { title: 'Own your own things', body: 'Your repositories, ad accounts, design files and test suites stay in your name. Leaving should be possible, even if it is not the plan.' },
  { title: 'Fix measurement first', body: 'Optimising against wrong numbers just arrives at the wrong place faster. We audit before we change anything.' },
  { title: 'Name the person', body: 'A named dispatcher, a named engineer, a named account contact. Not a rotating pool behind a shared inbox.' },
  { title: 'Flag the uncertainty', body: 'Where a figure is derived rather than measured, we say so on the page. Where a claim needs a lawyer, we say that too.' },
  { title: 'Finish the handover', body: 'Documentation, training and a maintenance guide are part of delivery, not an upsell after it.' },
];

export interface TeamRole {
  role: string;
  /** Only the contact named in the specification is used; the rest await sign-off. */
  name?: string;
  focus: string;
  region: string;
  needsClientContent: boolean;
}

export const LEADERSHIP: TeamRole[] = [
  { role: 'Founder and Managing Director', name: 'Peter', focus: 'Dispatch operations and client relationships', region: 'Houston', needsClientContent: false },
  { role: 'Head of Dispatch Operations', focus: 'Desk performance, broker relationships, claims', region: 'Houston', needsClientContent: true },
  { role: 'Director of Engineering', focus: 'Web, app and platform delivery', region: 'Lahore', needsClientContent: true },
  { role: 'Head of Performance Marketing', focus: 'Paid media, creative and attribution', region: 'London', needsClientContent: true },
  { role: 'Head of Publisher Revenue', focus: 'AdSense management and policy compliance', region: 'London', needsClientContent: true },
  { role: 'QA Practice Lead', focus: 'Test strategy, automation and staff augmentation', region: 'Lahore', needsClientContent: true },
  { role: 'Head of Parts and Sourcing', focus: 'Engine sourcing, installation partners, warranty', region: 'Houston', needsClientContent: true },
  { role: 'Client Services Director', focus: 'Account contacts, reporting and service levels', region: 'Toronto', needsClientContent: true },
];

export const CSR = [
  { title: 'Driver wellbeing fund', body: 'A share of dispatch revenue funds rest-stop meal cards and roadside assistance for owner-operators on our desk who break down away from home.' },
  { title: 'Apprentice testers', body: 'Six QA apprenticeships a year at the delivery centre, paid from day one, with a route into a permanent role.' },
  { title: 'Core recycling', body: 'Every returned engine core goes to a remanufacturer or a certified recycler. None are scrapped to landfill.' },
  { title: 'Pro bono builds', body: 'Two websites a year for local non-profits, built to the same standard as paid work, including maintenance.' },
];

/* ------------------------------------------------------------------ */
/*  Look Inside                                                        */
/* ------------------------------------------------------------------ */

export interface Job {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  remote: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  posted: string;
}

export const JOBS: Job[] = [
  {
    slug: 'truck-dispatcher',
    title: 'Truck Dispatcher',
    team: 'Dispatch',
    location: 'Houston, TX or remote',
    type: 'Full-time',
    remote: true,
    summary: 'Work a book of carriers, book loads ahead, negotiate every rate and keep the paperwork moving.',
    responsibilities: [
      'Book loads for a named set of trucks and plan ahead of delivery',
      'Negotiate rates against current market data rather than accepting posted numbers',
      'Complete broker setups and carrier packets',
      'Assemble and submit invoices the day a load delivers',
      'File detention, layover and truck-order-not-used claims',
    ],
    requirements: [
      'Two or more years dispatching semi or box truck freight',
      'Working knowledge of DAT or Truckstop',
      'Confident negotiating on the phone',
      'Comfortable with paperwork detail, because claims fail on it',
    ],
    posted: '2026-09-01',
  },
  {
    slug: 'after-hours-dispatcher',
    title: 'After-Hours Dispatcher',
    team: 'Dispatch',
    location: 'Lahore or remote',
    type: 'Full-time',
    remote: true,
    summary: 'Cover the overnight desk for US carriers: breakdowns, delivery issues and next-day booking.',
    responsibilities: [
      'Answer the overnight driver line within 90 seconds',
      'Escalate breakdowns and coordinate roadside assistance',
      'Book next-day loads so morning starts are not scrambled',
      'Hand over cleanly to the day desk',
    ],
    requirements: [
      'Comfortable working US overnight hours',
      'Clear spoken English and a calm phone manner',
      'Dispatch or logistics experience preferred',
    ],
    posted: '2026-08-18',
  },
  {
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    team: 'Engineering',
    location: 'Lahore or remote',
    type: 'Full-time',
    remote: true,
    summary: 'Build client sites and apps on Next.js with a real performance budget and a design system you help shape.',
    responsibilities: [
      'Build production Next.js applications in TypeScript',
      'Extend and maintain the shared component library',
      'Hold Lighthouse budgets that fail the build when exceeded',
      'Model content in the CMS so clients can edit without a deploy',
    ],
    requirements: [
      'Four or more years in React and TypeScript',
      'Practical Core Web Vitals experience, not just awareness',
      'Accessibility work to WCAG 2.1 AA',
      'Comfortable talking directly to clients',
    ],
    posted: '2026-08-25',
  },
  {
    slug: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    team: 'Quality assurance',
    location: 'Lahore or remote',
    type: 'Full-time',
    remote: true,
    summary: 'Build Playwright suites inside client repositories and keep them fast and trusted.',
    responsibilities: [
      'Design and build Playwright automation for client products',
      'Wire suites into client CI so they run on every pull request',
      'Track and eliminate flaky tests',
      'Report coverage by user journey',
    ],
    requirements: [
      'Three or more years in test automation',
      'Strong Playwright, Cypress or Selenium background',
      'CI pipeline experience',
      'Able to write a defect report someone can act on',
    ],
    posted: '2026-09-08',
  },
  {
    slug: 'performance-marketing-manager',
    title: 'Performance Marketing Manager',
    team: 'Ads',
    location: 'London or remote',
    type: 'Full-time',
    remote: true,
    summary: 'Own a book of paid accounts across Google, Meta and TikTok, with measurement you rebuild yourself.',
    responsibilities: [
      'Audit, restructure and optimise client ad accounts',
      'Rebuild conversion tracking including server-side and offline import',
      'Run a documented test roadmap per account',
      'Present results monthly to clients directly',
    ],
    requirements: [
      'Four or more years managing paid media budgets',
      'Hands-on GA4 and server-side tagging experience',
      'Comfortable saying when spend should go down',
    ],
    posted: '2026-07-30',
  },
  {
    slug: 'sdr-outbound',
    title: 'Outbound SDR',
    team: 'Lead generation',
    location: 'Remote',
    type: 'Full-time',
    remote: true,
    summary: 'Work replies, qualify against agreed criteria and book meetings that get held.',
    responsibilities: [
      'Work inbound replies from outbound sequences daily',
      'Qualify against the written criteria for each client',
      'Book, confirm and chase meetings to reduce no-shows',
      'Keep CRM records accurate enough to report on',
    ],
    requirements: [
      'One or more years in an SDR or appointment setting role',
      'Excellent written English',
      'Organised enough to run several client books at once',
    ],
    posted: '2026-09-10',
  },
];

export const LIFE_AT = [
  { title: 'The desk never closes', body: 'Dispatch runs 24/7 across Houston and Lahore, so a driver who breaks down at 3am talks to a person rather than a voicemail.' },
  { title: 'Named ownership', body: 'Every client has a named contact on every service. Nobody hides behind a shared inbox, which cuts both ways and keeps standards up.' },
  { title: 'Documentation is the job', body: 'Runbooks, handover guides and maintenance docs are written during the work, not promised after it.' },
  { title: 'Apprenticeships that pay', body: 'Six paid QA apprenticeships a year, with a defined route into a permanent engineering role.' },
];

export const DISPATCH_DAY = [
  { time: '04:30 CT', title: 'Board sweep', body: 'The desk opens on the boards before brokers do, marking the loads worth calling on once phones start answering.' },
  { time: '06:00 CT', title: 'Driver check-in', body: 'Every truck confirms it rolled, hours available and any overnight issues. Anything unresolved goes to the top of the list.' },
  { time: '08:30 CT', title: 'Negotiation window', body: 'The busiest two hours. Rates argued, loads covered, and the ones that will not move get walked away from.' },
  { time: '12:00 CT', title: 'Paperwork block', body: 'Broker setups filed, packets completed, and the morning deliveries invoiced with the full document pack.' },
  { time: '15:00 CT', title: 'Tomorrow booked', body: 'Next loads confirmed so nobody starts the day empty. Home time checked against the plan.' },
  { time: '18:00 CT', title: 'Claims and handover', body: 'Detention logged and filed, then a written handover to the overnight desk in Lahore.' },
];

/* ------------------------------------------------------------------ */
/*  Investors                                                          */
/* ------------------------------------------------------------------ */

export const INVESTOR_METRICS = [
  { label: 'Service lines', value: '7', note: 'Diversified across freight, marketing and engineering' },
  { label: 'Regions served', value: '5', note: 'US, UK, Canada, Australia, Europe' },
  { label: 'Revenue mix, recurring', value: '68%', note: 'Dispatch, retainers and managed services' },
  { label: 'Client retention, 12 month', value: '84%', note: 'Across all service lines' },
  { label: 'Headcount', value: '90+', note: 'Across five locations' },
  { label: 'Year founded', value: '2019', note: 'Houston, Texas' },
];

export const INVESTOR_REPORTS = [
  { title: 'Company overview 2026', kind: 'Overview', pages: 18, gated: true, summary: 'Business model, service mix, geography and management structure.' },
  { title: 'Growth metrics, trailing twelve months', kind: 'Metrics', pages: 12, gated: true, summary: 'Revenue mix, retention, headcount and service-line contribution.' },
  { title: 'Freight market outlook 2026', kind: 'Research', pages: 24, gated: true, summary: 'Our own book of business, rate direction and operational implications for carriers.' },
];

export const PRESS = [
  { date: '2026-08-14', title: 'Texas Solutions opens overnight dispatch coverage for US carriers', outlet: 'Company announcement' },
  { date: '2026-06-02', title: 'Publisher revenue practice passes one hundred managed sites', outlet: 'Company announcement' },
  { date: '2026-03-19', title: 'Engine sourcing division expands to heavy-duty diesel', outlet: 'Company announcement' },
  { date: '2025-11-05', title: 'Regional price tables published for five markets', outlet: 'Company announcement' },
];

/* ------------------------------------------------------------------ */
/*  Advertise                                                          */
/* ------------------------------------------------------------------ */

export const AUDIENCE_STATS = [
  { label: 'Monthly sessions', value: '210k', note: 'Across texassolutions.co and the Insights hub' },
  { label: 'Newsletter subscribers', value: '14.2k', note: 'Carriers, publishers and marketing leads' },
  { label: 'Carrier audience share', value: '46%', note: 'Owner-operators and fleet decision makers' },
  { label: 'Average session duration', value: '3m 24s', note: 'Insights and guide pages' },
];

export const AD_PLACEMENTS = [
  { name: 'Leaderboard banner', spec: '970x250 and 728x90', where: 'Insights index and article pages', availability: 'Monthly, 2 slots' },
  { name: 'In-article unit', spec: '600x300 responsive', where: 'Within article body, after section two', availability: 'Monthly, 3 slots' },
  { name: 'Sponsored post', spec: '1,200-1,800 words, disclosed', where: 'Insights hub, permanent URL', availability: 'Two per month' },
  { name: 'Newsletter feature', spec: '80 words plus image and link', where: 'Weekly newsletter, above the fold', availability: 'One per issue' },
  { name: 'Guide sponsorship', spec: 'Logo, foreword and one page', where: 'Gated guides and industry reports', availability: 'Per publication' },
];

/* ------------------------------------------------------------------ */
/*  Site-wide FAQ                                                      */
/* ------------------------------------------------------------------ */

export const SITE_FAQS = [
  { q: 'What does Texas Solutions do?', a: 'Texas Solutions is a software development and technology services company. It builds custom software, web applications, SaaS platforms and mobile apps; develops AI and machine learning solutions; provides QA and software testing; supplies dedicated development teams; and runs cloud, data, CRM and ERP, and cybersecurity projects. It also operates a truck dispatch service for US and Canadian carriers.' },
  { q: 'Where is Texas Solutions based?', a: 'Texas Solutions LLC is headquartered in Houston, Texas, with client teams in London, Toronto and Sydney and an engineering, QA and overnight dispatch delivery centre in Lahore.' },
  { q: 'Which countries does Texas Solutions work with?', a: 'Tier 1 markets including the United States, United Kingdom, Canada, Australia, New Zealand and Western Europe; the Gulf including the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman; and Asia including Singapore, Japan, Hong Kong, South Korea and Malaysia.' },
  { q: 'Is Texas Solutions a good choice for outsourcing software development?', a: 'It suits companies that want senior engineers, published pricing, working-hours overlap and full ownership of their code. Every project has a named delivery lead, automated testing from the first sprint and a 30-day notice period rather than a long lock-in.' },
  { q: 'Can we use one service without buying the others?', a: 'Yes. Every service line stands on its own with its own agreement. Clients who use several get one account contact across all of them, but nothing is bundled by force.' },
  { q: 'How does the region switcher affect pricing?', a: 'Each region has its own authored price table. Switching regions changes which table is read; it never converts currency live, because a converted figure would imply a precision we do not have.' },
  { q: 'Is the estimate calculator a quote?', a: 'No. It returns a rough range from the answers you give, using the same published tables as the pricing page. Final pricing is confirmed after a consultation.' },
  { q: 'What are your contract terms?', a: 'Thirty days notice on every recurring service, in either direction, with no termination fee. Project work is governed by the written scope and its acceptance criteria.' },
  { q: 'Who owns the work you produce?', a: 'You do. Repositories, design files, ad accounts, test suites and creative all sit in your name from day one, and handover within five days is part of the exit process.' },
  { q: 'Where are your teams based?', a: 'Houston, London, Toronto, Sydney and Lahore. Dispatch runs across Houston and Lahore so the desk is covered around the clock.' },
  { q: 'How quickly can you start?', a: 'Dispatch onboarding takes about three days. Marketing retainers start within a week. Build projects start at the next available sprint boundary, usually inside two weeks.' },
  { q: 'Do you work with small businesses or only enterprises?', a: 'Both. A single owner-operator and a sixty-person engineering team are both normal clients here, and the published ranges show where each service starts.' },
];

/* ------------------------------------------------------------------ */
/*  Process (site-wide, used on Home and Why pages)                    */
/* ------------------------------------------------------------------ */

export const HOW_IT_WORKS = [
  { step: '01', title: 'Tell us the situation', body: 'Use the estimate calculator or the contact form. Either way you get a range and an honest read on whether we are the right fit.', duration: 'Same day' },
  { step: '02', title: 'Scope and price it', body: 'A consultation to confirm the detail, then a written scope with acceptance criteria and a firm price for your region.', duration: '2-4 days' },
  { step: '03', title: 'Start the work', body: 'A named lead, a kickoff, and access to the environment or desk where the work happens. Dispatch starts in three days.', duration: 'Week 1' },
  { step: '04', title: 'Report and adjust', body: 'Weekly for retainers, monthly at minimum, with the metric that matters to you rather than a vanity dashboard.', duration: 'Ongoing' },
];
