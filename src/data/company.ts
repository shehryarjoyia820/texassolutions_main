/**
 * CMS models: teamMember, job, testimonial, faq, milestone, guarantee
 *
 * CONTENT NOTE
 * Only owner-confirmed facts are published (confirmed 2026-10-09). Arrays left
 * empty below hold content that has not been verified; pages hide the matching
 * section while an array is empty.
 */

export const CONTENT_TODO = [
  'Leadership headshots and bios beyond the owner',
  'Named client testimonials with written permission to publish',
  'Client logos with permission for the trust bar',
  'Client-approved case studies to replace the illustrative examples',
  'Final package prices per service to replace the market ranges',
  'Legal review of the privacy policy and terms',
];

/* ------------------------------------------------------------------ */
/*  Trust bar                                                          */
/* ------------------------------------------------------------------ */

export interface TrustStat {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  note: string;
}

/** Owner-verified figures only. */
export const TRUST_STATS: TrustStat[] = [
  { label: 'Websites and apps developed', value: 10, suffix: '', note: 'Built and delivered for clients' },
  { label: 'Qualified leads delivered', value: 1000, suffix: '+', note: 'To client CRMs' },
];

/** Client logos are withheld until permission is granted, per the spec. */
export const CLIENT_LOGOS_STATUS = {
  needsClientContent: true,
  note: 'Client logos require written permission before they appear in the trust bar.',
};

/* ------------------------------------------------------------------ */
/*  Testimonials — none published until a client gives written consent */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  quote: string;
  role: string;
  org: string;
  service: string;
  needsClientContent: boolean;
}

export const TESTIMONIALS: Testimonial[] = [];

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
  { value: 1, suffix: '', label: 'Published price list', body: 'One set of US dollar ranges for every client, with no pricing by location.' },
  { value: 24, suffix: '/7', label: 'Dispatch desk coverage', body: 'Overnight and weekend cover for breakdowns, delivery issues and next-day booking.' },
  { value: 30, suffix: ' days', label: 'Notice period, never longer', body: 'No multi-year lock-in on any service. If we are not earning the fee you should be able to leave.' },
  { value: 90, suffix: '+', label: 'Mobile Lighthouse target', body: 'A build acceptance criterion on every site we ship, not an aspiration in a proposal.' },
  { value: 100, suffix: '%', label: 'Code and accounts you own', body: 'Repositories, ad accounts, design files and test suites stay in your name from day one.' },
];

/**
 * Service commitments written into the service agreement. Only modest,
 * contractual commitments are listed here.
 */
export const GUARANTEES = [
  { item: 'First response to any enquiry', standard: 'Within 1 business day', measured: 'Service agreement' },
  { item: 'Reporting cadence', standard: 'Weekly for retainers', measured: 'Service agreement' },
  { item: 'Notice period to cancel', standard: '30 days, either direction', measured: 'Service agreement' },
  { item: 'Handover on exit', standard: 'Repositories, accounts and documentation handed over', measured: 'Service agreement' },
];

export const COMPARISON = {
  columns: ['Texas Solutions', 'Typical agency', 'In-house'],
  rows: [
    { label: 'Time to start', values: ['Days', '4-8 weeks', '3-6 months to hire'] },
    { label: 'Services covered', values: ['All thirteen under one contract', 'One or two specialisms', 'Whatever you hire for'] },
    { label: 'Contract lock-in', values: ['30 days notice', '6-12 month minimum', 'Employment commitment'] },
    { label: 'Who owns the accounts', values: ['You, always', 'Often the agency', 'You'] },
    { label: 'Published pricing', values: ['One public US dollar price list', 'Quoted after discovery calls', 'Not applicable'] },
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
  { title: 'Subprocessors disclosed', body: 'A list of the third-party tools that touch client data, with the purpose of each, is available on request.' },
  { title: 'Incident response', body: 'A written incident process covering notification obligations under applicable data breach laws.' },
];

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

/** Company history is not published until it has been verified. */
export const MILESTONES: Milestone[] = [];

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
  name?: string;
  focus: string;
  region: string;
  needsClientContent: boolean;
}

/** Confirmed people only. No unnamed role cards. */
export const LEADERSHIP: TeamRole[] = [
  { role: 'Owner and CEO', name: 'Shehryar Joyia', focus: 'Company strategy, dispatch operations and client relationships', region: 'Midland, Texas', needsClientContent: false },
];

export interface CsrItem {
  title: string;
  body: string;
}

export const CSR: CsrItem[] = [];

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

/** No open roles are currently published. */
export const JOBS: Job[] = [];

export const LIFE_AT: { title: string; body: string }[] = [];

export const DISPATCH_DAY: { time: string; title: string; body: string }[] = [];

/* ------------------------------------------------------------------ */
/*  Investors                                                          */
/* ------------------------------------------------------------------ */

export const INVESTOR_METRICS: { label: string; value: string; note: string }[] = [];

export const INVESTOR_REPORTS: { title: string; kind: string; pages: number; gated: boolean; summary: string }[] = [];

export const PRESS: { date: string; title: string; outlet: string }[] = [];

/* ------------------------------------------------------------------ */
/*  Advertise                                                          */
/* ------------------------------------------------------------------ */

export const AUDIENCE_STATS: { label: string; value: string; note: string }[] = [];

export const AD_PLACEMENTS: { name: string; spec: string; where: string; availability: string }[] = [];

/* ------------------------------------------------------------------ */
/*  Site-wide FAQ                                                      */
/* ------------------------------------------------------------------ */

export const SITE_FAQS = [
  { q: 'What does Texas Solutions do?', a: 'Texas Solutions is a software development and technology services company. It builds custom software, web applications, SaaS platforms and mobile apps; develops AI and machine learning solutions; provides QA and software testing; supplies dedicated development teams; and runs cloud, data, CRM and ERP, and cybersecurity projects. It also operates a truck dispatch service for US carriers.' },
  { q: 'Where is Texas Solutions based?', a: 'Texas Solutions LLC has its office at 401 W Kentucky Ave, Midland, TX 79701, USA, and a delivery team in Lahore, Pakistan covering engineering, QA and after-hours dispatch support.' },
  { q: 'Who does Texas Solutions work with?', a: 'Growing businesses and enterprises that want senior engineers, published pricing and a named contact, plus US owner-operators and small fleets for truck dispatch. We work remotely and overlap with your business hours.' },
  { q: 'Is Texas Solutions a good choice for outsourcing software development?', a: 'It suits companies that want senior engineers, published pricing, working-hours overlap and full ownership of their code. Every project has a named delivery lead, automated testing from the first sprint and a 30-day notice period rather than a long lock-in.' },
  { q: 'Can we use one service without buying the others?', a: 'Yes. Every service line stands on its own with its own agreement. Clients who use several get one account contact across all of them, but nothing is bundled by force.' },
  { q: 'What currency are your prices in?', a: 'All prices are published and invoiced in US dollars. Every client sees the same price list; final pricing is confirmed in writing after a consultation.' },
  { q: 'Is the estimate calculator a quote?', a: 'No. It returns a rough range from the answers you give, using the same published tables as the pricing page. Final pricing is confirmed after a consultation.' },
  { q: 'What are your contract terms?', a: 'Thirty days notice on every recurring service, in either direction, with no termination fee. Project work is governed by the written scope and its acceptance criteria.' },
  { q: 'Who owns the work you produce?', a: 'You do. Repositories, design files, ad accounts, test suites and creative all sit in your name from day one, and handover of repositories, accounts and documentation is part of the exit process.' },
  { q: 'Where are your teams based?', a: 'Midland, Texas and Lahore, Pakistan. The Lahore delivery team covers engineering, QA and after-hours dispatch support, so the dispatch desk is covered around the clock.' },
  { q: 'How quickly can you start?', a: 'Dispatch onboarding takes about three days. Marketing retainers start within a week. Build projects start at the next available sprint boundary, usually inside two weeks.' },
  { q: 'Do you work with small businesses or only enterprises?', a: 'Both. Every service line has a published starting range, so a single owner-operator and a larger engineering organisation can both see where a service starts.' },
];

/* ------------------------------------------------------------------ */
/*  Process (site-wide, used on Home and Why pages)                    */
/* ------------------------------------------------------------------ */

export const HOW_IT_WORKS = [
  { step: '01', title: 'Tell us the situation', body: 'Use the estimate calculator or the contact form. Either way you get a range and an honest read on whether we are the right fit.', duration: 'Same day' },
  { step: '02', title: 'Scope and price it', body: 'A consultation to confirm the detail, then a written scope with acceptance criteria and a firm price.', duration: '2-4 days' },
  { step: '03', title: 'Start the work', body: 'A named lead, a kickoff, and access to the environment or desk where the work happens. Dispatch starts in three days.', duration: 'Week 1' },
  { step: '04', title: 'Report and adjust', body: 'Weekly for retainers, monthly at minimum, with the metric that matters to you rather than a vanity dashboard.', duration: 'Ongoing' },
];
