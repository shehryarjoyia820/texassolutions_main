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

/* ------------------------------------------------------------------ */
/*  Dental revenue cycle management (Texas Solutions RCM)              */
/* ------------------------------------------------------------------ */

/**
 * Dental RCM is run by the dental division, Texas Solutions RCM, at
 * rcm.texassolutions.co. It is dental only, with published per-location pricing
 * (RCM_TIERS below); a free consultation and written proposal confirm the tier.
 * Keep this block in step with that site.
 */
export const RCM_SITE = 'https://rcm.texassolutions.co';

/** "10%" from [0.1, 0.1], "4-7%" from [0.04, 0.07]. */
export function pctLabel(p: Range): string {
  const lo = Math.round(p[0] * 1000) / 10;
  const hi = Math.round(p[1] * 1000) / 10;
  return lo === hi ? `${lo}%` : `${lo}-${hi}%`;
}

export interface RcmService {
  slug: string;
  name: string;
  /** Matching page on rcm.texassolutions.co. */
  rcmPath: string;
  summary: string;
  points: string[];
  keyword: string;
}

/** The eight dental RCM services, as offered on rcm.texassolutions.co. */
export const RCM_SERVICES: RcmService[] = [
  {
    slug: 'eligibility-verification',
    name: 'Insurance verification and eligibility',
    rcmPath: '/services/dental-insurance-verification/',
    summary: 'Benefits checked before the appointment, so the front desk knows what to collect.',
    points: ['Dental insurance eligibility verification', 'Benefits breakdowns', 'Deductible and annual maximum checks', 'Frequency limitation and waiting period checks', 'Patient responsibility estimates'],
    keyword: 'dental insurance verification services',
  },
  {
    slug: 'dental-billing',
    name: 'Dental claims management',
    rcmPath: '/services/dental-claims-processing/',
    summary: 'Claims built, coded, attached and followed until the carrier answers.',
    points: ['Dental claim creation and submission', 'CDT code and documentation review', 'Claim attachments and corrections', 'Rejected claim resubmission', 'Claim status tracking and follow-up'],
    keyword: 'dental billing services',
  },
  {
    slug: 'denial-management',
    name: 'Denial management and appeals',
    rcmPath: '/services/denial-management/',
    summary: 'Every denial worked, and the cause behind repeat denials fixed.',
    points: ['Claim denial analysis', 'Corrected claims submission', 'Appeals and reconsiderations', 'Missing documentation follow-up', 'Denial prevention and root-cause analysis'],
    keyword: 'dental denial management services',
  },
  {
    slug: 'payment-posting',
    name: 'Payment posting',
    rcmPath: '/services/payment-posting/',
    summary: 'EOBs and ERAs posted, adjusted and reconciled against deposits.',
    points: ['EOB and ERA payment posting', 'Insurance and patient payment entry', 'Contractual adjustments', 'Payment reconciliation', 'Underpayment and discrepancy checks'],
    keyword: 'dental payment posting services',
  },
  {
    slug: 'ar-follow-up',
    name: 'Accounts receivable (A/R) management',
    rcmPath: '/services/dental-accounts-receivable/',
    summary: 'Insurance A/R from your start date worked by age bucket; older A/R cleanup is a separate project.',
    points: ['30, 60 and 90+ day A/R follow-up', 'Outstanding claim follow-up', 'Carrier calls and portal checks', 'Aging report analysis', 'Older A/R cleanup quoted as a separate project'],
    keyword: 'dental accounts receivable services',
  },
  {
    slug: 'patient-billing',
    name: 'Patient billing and collections support',
    rcmPath: '/services/patient-billing/',
    summary: 'Patient statements prepared and sent; balance conversations stay with your front desk.',
    points: ['Patient statement processing', 'Patient balance review', 'Payment allocation', 'Patient billing coordination', 'No phone calls to patients'],
    keyword: 'dental patient billing services',
  },
  {
    slug: 'credentialing',
    name: 'Dental credentialing and provider enrollment',
    rcmPath: '/services/dental-credentialing/',
    summary: 'Dentists enrolled with the networks you accept, and kept current.',
    points: ['Dental provider credentialing', 'Insurance network enrollment', 'Re-credentialing', 'Provider information updates', 'EFT and ERA enrollment assistance'],
    keyword: 'dental credentialing services',
  },
  {
    slug: 'rcm-reporting',
    name: 'Dental RCM reporting and revenue analysis',
    rcmPath: '/services/rcm-analytics-reporting/',
    summary: 'Aging, claim status, denial trends and monthly revenue from your own data.',
    points: ['A/R aging reports', 'Claim status reporting', 'Denial trend analysis', 'Collection and adjustment reporting', 'Monthly revenue performance reports'],
    keyword: 'dental RCM reporting',
  },
];

export const RCM_SPECIALTIES = [
  'General dentistry',
  'Orthodontics',
  'Endodontics',
  'Periodontics',
  'Oral and maxillofacial surgery',
  'Pediatric dentistry',
  'Prosthodontics',
  'Dental group practices and DSOs',
];

/** Practice management systems the team commonly works in. No partnership with any vendor. */
export const RCM_SOFTWARE = ['Open Dental', 'Dentrix', 'Eaglesoft'];
export const RCM_SOFTWARE_NOTE =
  'The team works inside Open Dental, Dentrix and Eaglesoft through named accounts your administrator controls; other systems are confirmed during the consultation. Nothing to install and no data to migrate. Texas Solutions is not a partner, reseller or integration vendor of any software company.';

/** Electronic dental transactions (X12) used across the cycle. */
export const RCM_TRANSACTIONS = [
  { code: '837D', what: 'Electronic dental claim (the ADA claim form equivalent)' },
  { code: '835', what: 'Electronic remittance advice (ERA) for payment posting' },
  { code: '270/271', what: 'Eligibility inquiry and response' },
  { code: '276/277', what: 'Claim status inquiry and response' },
];

/**
 * Published dental RCM pricing (rcm.texassolutions.co/pricing, October 2026).
 * Per location, per month, set by the insurance collections posted that month.
 * Patient payments are not part of the fee base. No setup fee.
 */
export interface RcmTier {
  id: string;
  label: string;
  /** Monthly insurance collections, inclusive lower bound and exclusive upper bound. */
  from: number;
  to: number | null;
  flat?: number;
  percent?: number;
}

export const RCM_TIERS: RcmTier[] = [
  { id: 'rcm-flat', label: 'Under $40,000', from: 0, to: 40000, flat: 1200 },
  { id: 'rcm-35', label: '$40,000 to $99,999', from: 40000, to: 100000, percent: 0.035 },
  { id: 'rcm-30', label: '$100,000 to $149,999', from: 100000, to: 150000, percent: 0.03 },
  { id: 'rcm-25', label: '$150,000 and above', from: 150000, to: null, percent: 0.025 },
];

/** Monthly fee for one location from that month's insurance collections. */
export function rcmFee(collections: number): { tier: RcmTier; fee: number } {
  const tier = RCM_TIERS.find((t) => collections >= t.from && (t.to === null || collections < t.to)) ?? RCM_TIERS[0];
  return { tier, fee: tier.flat ?? Math.round(collections * (tier.percent ?? 0)) };
}

export const RCM_FEE_BASIS =
  'Insurance collections are the carrier payments we post for a location in that month (PPO, DHMO, indemnity and Medicaid dental). Patient payments are not part of the fee base.';
export const RCM_INCLUDED_NOTE =
  'The monthly fee covers seven of the eight services: insurance verification, claims, denials and appeals, payment posting, A/R management from your start date, patient statements and reporting.';
export const RCM_EXTRA_NOTE =
  'Charged separately: credentialing and provider enrollment, and cleanup of A/R that existed before your start date, each quoted after a review. Your clearinghouse and software subscriptions stay with your practice.';

export const RCM_TERMS =
  'Per location, per month: a flat $1,200 when insurance collections are under $40,000, then 3.5% ($40,000 to $99,999), 3% ($100,000 to $149,999) or 2.5% ($150,000 and above) of that month\'s insurance collections. Groups and DSOs get a custom quote. No setup fee; a free consultation and written proposal confirm your tier and scope before work begins.';

export const RCM_DATA_NOTE =
  'Please do not send patient information through this website, its forms or its chat. We sign a Business Associate Agreement with your practice before accessing any patient data, and we work only inside your own systems through named accounts.';
