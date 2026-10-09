/**
 * THE price list. Owner-supplied rates, October 2026, in US dollars, for
 * delivery from the Pakistan team. Every price on the site (homepage,
 * service pages, package cards, the pricing page and both calculators) is
 * read from this file through src/data/pricing.ts. Change a number here and
 * it changes everywhere.
 *
 * No region multipliers: one price list for every client. Premiums for
 * onsite delivery, extended time-zone overlap or specialist requirements are
 * quoted separately in writing (see PREMIUMS_NOTE).
 */

export type Range = [number, number];

/* ------------------------------------------------------------------ */
/*  Hourly rates                                                       */
/* ------------------------------------------------------------------ */

export interface HourlyRate {
  id: string;
  label: string;
  /** Service page this rate belongs to. */
  service: string;
  rate: Range;
}

export const HOURLY_RATES: HourlyRate[] = [
  { id: 'design-hourly', label: 'UI/UX and graphic design', service: 'web-development', rate: [15, 25] },
  { id: 'website-hourly', label: 'Website development / WordPress', service: 'web-development', rate: [15, 25] },
  { id: 'fullstack-hourly', label: 'Custom software / full-stack development', service: 'web-development', rate: [20, 35] },
  { id: 'mobile-hourly', label: 'Mobile app development', service: 'web-development', rate: [20, 35] },
  { id: 'qa-manual-hourly', label: 'Manual QA testing', service: 'qa-testing', rate: [12, 18] },
  { id: 'qa-automation-hourly', label: 'QA automation', service: 'qa-testing', rate: [18, 28] },
  { id: 'ai-hourly', label: 'AI integrations, chatbots and agents', service: 'ai-machine-learning', rate: [25, 40] },
  { id: 'data-hourly', label: 'Data analytics / dashboards', service: 'data-analytics', rate: [20, 30] },
  { id: 'cloud-hourly', label: 'Cloud / DevOps', service: 'cloud-devops', rate: [25, 40] },
  { id: 'crm-hourly', label: 'CRM configuration and integrations', service: 'crm-erp', rate: [20, 35] },
  { id: 'security-hourly', label: 'Cybersecurity specialist', service: 'cybersecurity', rate: [35, 60] },
];

export const SPECIALIST_QUOTE_NOTE =
  'Specialist assessments, formal audits and third-party certification fees require separate quotes.';

/* ------------------------------------------------------------------ */
/*  Dedicated monthly resources                                        */
/* ------------------------------------------------------------------ */

/** Every monthly allocation is up to this many working hours. */
export const HOURS_PER_ALLOCATION = 160;

export interface MonthlyResource {
  id: string;
  label: string;
  price: number;
  /** Hourly rate that applies to approved hours above the allocation. */
  overageHourly: Range;
}

export const MONTHLY_RESOURCES: MonthlyResource[] = [
  { id: 'dev-junior', label: 'Junior developer', price: 2000, overageHourly: [20, 35] },
  { id: 'dev-middle', label: 'Mid-level developer', price: 3000, overageHourly: [20, 35] },
  { id: 'dev-senior', label: 'Senior developer', price: 4500, overageHourly: [20, 35] },
  { id: 'qa-manual', label: 'Manual QA engineer', price: 1600, overageHourly: [12, 18] },
  { id: 'qa-automation', label: 'QA automation engineer', price: 2800, overageHourly: [18, 28] },
  { id: 'designer', label: 'UI/UX designer', price: 2400, overageHourly: [15, 25] },
  { id: 'ai-engineer', label: 'AI engineer', price: 4500, overageHourly: [25, 40] },
  { id: 'devops', label: 'DevOps engineer', price: 4000, overageHourly: [25, 40] },
  { id: 'dev-lead', label: 'Tech lead / architect', price: 5500, overageHourly: [20, 35] },
];

export const RESOURCE_NOTE =
  `Each allocation includes up to ${HOURS_PER_ALLOCATION} working hours per month, during which the person is dedicated to your work. ` +
  'Monthly rates reflect reserved capacity and may be lower than ad-hoc hourly billing.';

/* ------------------------------------------------------------------ */
/*  Development packages (monthly capacity allocations)                */
/* ------------------------------------------------------------------ */

export interface PackageLine {
  label: string;
  hours: number;
}

export interface DevPackage {
  id: string;
  name: string;
  price: number;
  lines: PackageLine[];
  /** Hourly rates for approved hours above the allocation. */
  overage: { label: string; rate: Range }[];
}

export const DEV_PACKAGES: DevPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1000,
    lines: [
      { label: 'Development hours', hours: 40 },
      { label: 'Manual QA hours', hours: 10 },
    ],
    overage: [
      { label: 'Development', rate: [20, 35] },
      { label: 'Manual QA', rate: [12, 18] },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 3500,
    lines: [
      { label: 'Mid-level development hours', hours: 160 },
      { label: 'Manual QA hours', hours: 40 },
    ],
    overage: [
      { label: 'Development', rate: [20, 35] },
      { label: 'Manual QA', rate: [12, 18] },
    ],
  },
  {
    id: 'product-team',
    name: 'Product Team',
    price: 8000,
    lines: [
      { label: 'Mid-level development hours', hours: 160 },
      { label: 'Senior development hours', hours: 160 },
      { label: 'Manual QA hours', hours: 40 },
    ],
    overage: [
      { label: 'Development', rate: [20, 35] },
      { label: 'Manual QA', rate: [12, 18] },
    ],
  },
];

export const PACKAGE_INCLUDES = ['Routine coordination', 'Weekly progress reporting'];
export const PACKAGE_EXCLUDES =
  'A dedicated project manager, designer or architect is additional unless explicitly included in your agreement.';

/* ------------------------------------------------------------------ */
/*  Other monthly services (starting prices and starting scope)        */
/* ------------------------------------------------------------------ */

export interface SupportPlan {
  id: string;
  label: string;
  service: string;
  from: number;
  scope: string;
  /** Included hours, where the plan is hour-based. */
  hours?: number;
  overageHourly?: Range;
}

export const SUPPORT_PLANS: SupportPlan[] = [
  { id: 'website-maintenance', label: 'Website maintenance', service: 'web-development', from: 150, hours: 5, scope: 'Up to 5 hours of updates and fixes', overageHourly: [15, 25] },
  { id: 'qa-retainer', label: 'Manual QA retainer', service: 'qa-testing', from: 300, hours: 20, scope: 'Up to 20 testing hours', overageHourly: [12, 18] },
  { id: 'leadgen-support', label: 'Lead-generation support', service: 'lead-generation', from: 600, hours: 40, scope: 'Up to 40 research and outreach-support hours' },
  { id: 'ads-management', label: 'Ads management', service: 'ads-optimization', from: 300, scope: 'One platform, up to 3 campaigns' },
  { id: 'adsense-management', label: 'AdSense management', service: 'adsense-management', from: 200, scope: 'One site, monthly review and optimisation recommendations' },
  { id: 'ai-maintenance', label: 'AI workflow maintenance', service: 'ai-machine-learning', from: 300, hours: 8, scope: 'Up to 8 support hours', overageHourly: [25, 40] },
  { id: 'dashboard-support', label: 'Dashboard support', service: 'data-analytics', from: 300, hours: 10, scope: 'Up to 10 support hours', overageHourly: [20, 30] },
  { id: 'cloud-support', label: 'Cloud/DevOps support', service: 'cloud-devops', from: 400, hours: 10, scope: 'Up to 10 support hours, business-hours coverage', overageHourly: [25, 40] },
  { id: 'crm-support', label: 'CRM support', service: 'crm-erp', from: 300, hours: 10, scope: 'Up to 10 support hours', overageHourly: [20, 35] },
];

/* ------------------------------------------------------------------ */
/*  Terms shown beside prices                                          */
/* ------------------------------------------------------------------ */

export const PRICE_TERMS = {
  currency: 'All prices are in US dollars (USD).',
  capacity:
    'Monthly packages and retainers are capacity allocations, not unlimited work. Unused hours do not carry over unless your agreement says so.',
  overage:
    'Hours above an allocation are billed at the hourly rate shown for that role, and only after you approve them in writing.',
  support:
    'Support plans cover business hours. Engineering support is not 24/7 at these rates; extended or out-of-hours cover is quoted separately.',
  thirdParty:
    'Ad spend, paid data, outreach tools, hosting, cloud charges, API and AI-model usage, and software licences are separate and billed at cost or paid directly by you.',
  noGuarantees: 'We do not guarantee lead counts, revenue increases or AdSense approval.',
  taxes: 'Prices exclude any sales tax, VAT or withholding tax that applies to your invoice.',
  billing: 'Monthly services are billed monthly in advance. Fixed-scope projects are billed in milestones agreed in the proposal.',
};

export const PREMIUMS_NOTE =
  'Onsite delivery, extended time-zone overlap or specialist requirements (for example regulated-industry compliance) can carry a premium. Any premium is explained and quoted in writing before work starts.';
