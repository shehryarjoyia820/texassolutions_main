import type { RegionCode } from './regions';
import { ENTERPRISE_ESTIMATE_CONFIG } from './estimate-config-enterprise';

/**
 * CMS model: estimateQuestionSet
 *
 * Every range, multiplier and adder in this file is authored data. The engine
 * in src/lib/estimate.ts only combines them, so pricing can change without a
 * code change. This mirrors the example config in section 7 of the spec.
 */

export type Billing = 'one-time' | 'monthly' | 'weekly';

export interface QuestionOption {
  value: string;
  label: string;
  hint?: string;
  /** Multiplies the running base range. */
  factor?: number;
  /** Adds a flat range, in the region currency, before the timeline multiplier. */
  add?: [number, number];
}

export type Question =
  | {
      id: string;
      type: 'select';
      label: string;
      help?: string;
      options: QuestionOption[];
      defaultValue: string;
    }
  | {
      id: string;
      type: 'multi';
      label: string;
      help?: string;
      options: QuestionOption[];
      defaultValue: string[];
    }
  | {
      id: string;
      type: 'number';
      label: string;
      help?: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      unit?: string;
      /** Extra cost per unit above `freeUnits`. */
      perUnit?: [number, number];
      freeUnits?: number;
      /** Currency-formatted rather than plain number. */
      currency?: boolean;
    }
  | {
      id: string;
      type: 'text';
      label: string;
      help?: string;
      placeholder?: string;
      defaultValue: string;
      required?: boolean;
    };

export interface SubType {
  id: string;
  label: string;
  description: string;
  /** Row in the service price table that seeds the base range. */
  priceRow?: string;
  /** Explicit base range per region, used when no price row fits. */
  base?: Record<RegionCode, [number, number]>;
  billingOverride?: Billing;
}

export interface EstimateServiceConfig {
  service: string;
  billing: Billing;
  regions: RegionCode[];
  subTypeLabel: string;
  subTypes: SubType[];
  questions: Question[];
  /** Recurring services multiply by this many months by default. */
  defaultDurationMonths?: number;
  durationOptions?: number[];
  disclaimer: string;
  /** Extra output rows rendered under the range bar. */
  outputNotes: string[];
}

export const TIMELINE_MULTIPLIERS = [
  { id: 'rush', label: 'Rush, under 2 weeks', multiplier: 1.3, hint: 'Reprioritised ahead of the queue' },
  { id: 'standard', label: 'Standard', multiplier: 1.0, hint: 'Next available start' },
  { id: 'flexible', label: 'Flexible, 2 months or more', multiplier: 0.9, hint: 'Scheduled around other work' },
] as const;

export type TimelineId = (typeof TIMELINE_MULTIPLIERS)[number]['id'];

export const ESTIMATE_DISCLAIMER =
  'Rough estimate only. Final pricing is confirmed after a consultation.';

const BASE_ESTIMATE_CONFIG: EstimateServiceConfig[] = [
  {
    service: 'web-development',
    billing: 'one-time',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'What are we building?',
    subTypes: [
      { id: 'landing-page', label: 'Landing page', description: 'One page, one offer', priceRow: 'landing-page' },
      { id: 'business-site', label: 'Business website', description: '5 to 10 pages with a CMS', priceRow: 'business-site' },
      { id: 'ecommerce', label: 'E-commerce store', description: 'Catalogue, checkout, payments', priceRow: 'ecommerce' },
      { id: 'web-app', label: 'Web app or portal', description: 'Auth, dashboards, workflow', priceRow: 'web-app' },
      { id: 'mobile-app', label: 'Mobile app', description: 'iOS, Android or both', priceRow: 'app-mvp' },
    ],
    questions: [
      {
        id: 'pages',
        type: 'number',
        label: 'How many pages or screens?',
        help: 'Templates count once, not per item of content.',
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 8,
        unit: 'pages',
        freeUnits: 8,
        perUnit: [280, 900],
      },
      {
        id: 'design',
        type: 'select',
        label: 'Template or custom design?',
        defaultValue: 'semi-custom',
        options: [
          { value: 'template', label: 'Start from a template', hint: 'Fastest and cheapest', factor: 0.72 },
          { value: 'semi-custom', label: 'Template, restyled to your brand', hint: 'Most common choice', factor: 1 },
          { value: 'custom', label: 'Fully custom design system', hint: 'Bespoke motion and components', factor: 1.45 },
        ],
      },
      {
        id: 'integrations',
        type: 'number',
        label: 'How many third-party integrations?',
        help: 'CRM, payments, ERP, booking, shipping and similar.',
        min: 0,
        max: 15,
        step: 1,
        defaultValue: 2,
        unit: 'integrations',
        freeUnits: 1,
        perUnit: [700, 2600],
      },
      {
        id: 'cms',
        type: 'select',
        label: 'Do you need a CMS?',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Yes, our team edits content', factor: 1.12 },
          { value: 'no', label: 'No, content is static', factor: 1 },
        ],
      },
      {
        id: 'content',
        type: 'select',
        label: 'Who writes the content?',
        defaultValue: 'client',
        options: [
          { value: 'client', label: 'We supply copy and images', factor: 1 },
          { value: 'polish', label: 'We draft, you polish it', add: [900, 2600] },
          { value: 'full', label: 'You write everything', add: [2400, 7500] },
        ],
      },
      {
        id: 'platforms',
        type: 'multi',
        label: 'Which platforms? (mobile apps only)',
        help: 'Ignored unless you selected a mobile app.',
        defaultValue: ['ios', 'android'],
        options: [
          { value: 'ios', label: 'iOS', factor: 1 },
          { value: 'android', label: 'Android', factor: 1 },
          { value: 'web', label: 'Web companion', add: [4000, 14000] },
        ],
      },
    ],
    disclaimer: 'Fixed-scope builds are quoted as a project. Hourly work is billed at the regional rate.',
    outputNotes: [
      'Includes discovery, design, build, CMS setup, SEO basics and 30 days of support.',
      'Excludes ongoing hosting, licences and paid media budget.',
    ],
  },

  {
    service: 'lead-generation',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'What kind of leads?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [
      { id: 'b2b', label: 'B2B outbound', description: 'Email, LinkedIn and phone', priceRow: 'retainer' },
      { id: 'b2c', label: 'B2C acquisition', description: 'Consumer volume campaigns', priceRow: 'retainer' },
      { id: 'appointments', label: 'Appointment setting', description: 'Held meetings on your calendar', priceRow: 'retainer' },
    ],
    questions: [
      {
        id: 'channels',
        type: 'multi',
        label: 'Which channels?',
        defaultValue: ['email'],
        options: [
          { value: 'email', label: 'Cold email', factor: 1 },
          { value: 'linkedin', label: 'LinkedIn', add: [700, 2400] },
          { value: 'phone', label: 'Phone', add: [1200, 4200] },
          { value: 'paid', label: 'Paid social support', add: [900, 3000] },
        ],
      },
      {
        id: 'leadsPerMonth',
        type: 'number',
        label: 'Qualified leads wanted each month',
        min: 5,
        max: 400,
        step: 5,
        defaultValue: 30,
        unit: 'leads',
        freeUnits: 20,
        perUnit: [95, 320],
      },
      {
        id: 'industry',
        type: 'select',
        label: 'Which industry?',
        help: 'Harder-to-reach buyers cost more per conversation.',
        defaultValue: 'general',
        options: [
          { value: 'general', label: 'General B2B services', factor: 1 },
          { value: 'logistics', label: 'Logistics and freight', factor: 1.05 },
          { value: 'tech', label: 'Software and technology', factor: 1.15 },
          { value: 'healthcare', label: 'Healthcare', factor: 1.3 },
          { value: 'finance', label: 'Finance and insurance', factor: 1.35 },
        ],
      },
    ],
    disclaimer: 'Qualification criteria are agreed in writing before launch. Leads outside the criteria are not billed.',
    outputNotes: [
      'Includes data, domains, warming, copy, sequencing, reply handling and reporting.',
      'First meetings usually land in week four or five, after domain warming.',
    ],
  },

  {
    service: 'ads-optimization',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'Which platform leads the account?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [
      { id: 'google', label: 'Google Ads', description: 'Search, PMax, Shopping', priceRow: 'management' },
      { id: 'meta', label: 'Meta Ads', description: 'Facebook and Instagram', priceRow: 'management' },
      { id: 'tiktok', label: 'TikTok Ads', description: 'Short-form and Spark Ads', priceRow: 'management' },
      { id: 'linkedin', label: 'LinkedIn Ads', description: 'B2B targeting and lead forms', priceRow: 'management' },
      { id: 'creative', label: 'Creative only', description: 'We design, you run it', priceRow: 'creative-pack', billingOverride: 'monthly' },
    ],
    questions: [
      {
        id: 'adSpend',
        type: 'number',
        label: 'Monthly ad spend',
        help: 'Media budget paid to the platforms, not our fee.',
        min: 1000,
        max: 200000,
        step: 500,
        defaultValue: 10000,
        currency: true,
        unit: 'per month',
      },
      {
        id: 'extraPlatforms',
        type: 'number',
        label: 'Additional platforms beyond the first',
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 1,
        unit: 'platforms',
        freeUnits: 0,
        perUnit: [400, 1400],
      },
      {
        id: 'creatives',
        type: 'number',
        label: 'New creatives per month',
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 5,
        unit: 'creatives',
        freeUnits: 3,
        perUnit: [90, 340],
      },
      {
        id: 'tracking',
        type: 'select',
        label: 'Is conversion tracking working today?',
        help: 'A rebuild is usually the highest-return first move.',
        defaultValue: 'unsure',
        options: [
          { value: 'yes', label: 'Yes, verified recently', factor: 1 },
          { value: 'unsure', label: 'Not sure', add: [500, 2000] },
          { value: 'no', label: 'No, it needs rebuilding', add: [800, 2600] },
        ],
      },
    ],
    disclaimer: 'Management is charged as a flat monthly fee or 10-20% of ad spend, whichever is lower for you.',
    outputNotes: [
      'The fee below is our management charge. Ad spend is paid directly to the platforms.',
      'Percentage-of-spend equivalent is shown alongside the flat fee.',
    ],
  },

  {
    service: 'adsense-management',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'One site or a portfolio?',
    defaultDurationMonths: 6,
    durationOptions: [3, 6, 12],
    subTypes: [
      { id: 'single', label: 'Single site', description: 'One domain', priceRow: 'per-site' },
      { id: 'portfolio', label: 'Portfolio', description: 'Several domains under one account', priceRow: 'per-site' },
    ],
    questions: [
      {
        id: 'pageviews',
        type: 'number',
        label: 'Monthly pageviews',
        min: 10000,
        max: 20000000,
        step: 10000,
        defaultValue: 500000,
        unit: 'pageviews',
      },
      {
        id: 'currentRpm',
        type: 'number',
        label: 'Current RPM, revenue per thousand pageviews',
        help: 'Leave at the default if you do not know it.',
        min: 0.5,
        max: 60,
        step: 0.5,
        defaultValue: 4,
        currency: true,
      },
      {
        id: 'sites',
        type: 'number',
        label: 'How many sites?',
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 1,
        unit: 'sites',
        freeUnits: 1,
        perUnit: [280, 900],
      },
      {
        id: 'niche',
        type: 'select',
        label: 'Content niche',
        help: 'Advertiser demand varies widely by subject.',
        defaultValue: 'general',
        options: [
          { value: 'general', label: 'General interest', factor: 1 },
          { value: 'lifestyle', label: 'Lifestyle and entertainment', factor: 0.9 },
          { value: 'tech', label: 'Technology', factor: 1.25 },
          { value: 'finance', label: 'Finance and insurance', factor: 1.7 },
          { value: 'health', label: 'Health', factor: 1.35 },
        ],
      },
    ],
    disclaimer:
      'Our fee is a flat monthly charge per site, or 15-30% of the revenue uplift above your agreed baseline. This is our own rate card, not a market benchmark.',
    outputNotes: [
      'Projected revenue assumes a realistic RPM uplift from placement and density tuning, not a guaranteed outcome.',
      'Policy compliance is audited before any revenue work begins.',
    ],
  },

  {
    service: 'truck-dispatch',
    billing: 'weekly',
    regions: ['US', 'CA'],
    subTypeLabel: 'What are you running?',
    subTypes: [
      { id: 'semi', label: 'Semi truck: dry van, reefer, flatbed, step deck or power only', description: '5% of weekly gross, OTR', priceRow: 'semi' },
      { id: 'hotshot', label: 'Hotshot truck', description: '8% of weekly gross, OTR', priceRow: 'hotshot' },
      { id: 'boxTruckOrHotshot', label: 'Box truck or straight truck', description: '10% of weekly gross, OTR', priceRow: 'box-truck' },
    ],
    questions: [
      {
        id: 'trucks',
        type: 'number',
        label: 'How many trucks?',
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 1,
        unit: 'trucks',
      },
      {
        id: 'weeklyGross',
        type: 'number',
        label: 'Average weekly gross per truck',
        help: 'Typical OTR weekly gross on our desk: box truck or hotshot $7,000-$9,000, semi $8,000-$10,000. Use your three-month average.',
        min: 1000,
        max: 20000,
        step: 100,
        defaultValue: 9000,
        currency: true,
        unit: 'per truck',
      },
    ],
    disclaimer: 'OTR operations only. No flat rate, no setup fee, no long-term contract. Final percentage is discussed with each carrier.',
    outputNotes: [
      'Fee shown as a weekly and monthly range for your whole fleet.',
      'Load search, rate negotiation, broker packets and paperwork are included.',
    ],
  },

  {
    service: 'qa-testing',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'What kind of testing?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [
      { id: 'manual', label: 'Manual testing', description: 'Exploratory and scripted', priceRow: 'qa-hourly' },
      { id: 'automation', label: 'Test automation', description: 'Playwright, Cypress or Selenium', priceRow: 'qa-managed' },
      { id: 'performance', label: 'Performance and load', description: 'Baseline, spike and soak', priceRow: 'qa-managed' },
      { id: 'security', label: 'Security testing', description: 'OWASP Top 10 application risks', priceRow: 'qa-managed' },
    ],
    questions: [
      {
        id: 'platforms',
        type: 'multi',
        label: 'Which platforms need coverage?',
        defaultValue: ['web'],
        options: [
          { value: 'web', label: 'Web', factor: 1 },
          { value: 'ios', label: 'iOS', add: [800, 2200] },
          { value: 'android', label: 'Android', add: [800, 2200] },
          { value: 'api', label: 'APIs', add: [600, 1800] },
        ],
      },
      {
        id: 'scale',
        type: 'number',
        label: 'Test cases or journeys to cover',
        min: 5,
        max: 600,
        step: 5,
        defaultValue: 40,
        unit: 'journeys',
        freeUnits: 25,
        perUnit: [45, 150],
      },
      {
        id: 'sprint',
        type: 'select',
        label: 'Sprint length',
        defaultValue: 'two-week',
        options: [
          { value: 'one-week', label: 'One week', hint: 'More frequent regression runs', factor: 1.2 },
          { value: 'two-week', label: 'Two weeks', factor: 1 },
          { value: 'monthly', label: 'Monthly or ad hoc', factor: 0.85 },
        ],
      },
    ],
    disclaimer: 'The test suite is built inside your repository and handed over documented. There is no licence to keep paying.',
    outputNotes: [
      'Hourly engagements are quoted at the regional QA rate; managed teams are quoted monthly.',
      'Security testing here covers application risks, not a formal accredited penetration test.',
    ],
  },

  {
    service: 'auto-engines',
    billing: 'one-time',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'Which type of engine?',
    subTypes: [
      { id: 'used', label: 'Used', description: 'Tested and mileage-verified', priceRow: 'used' },
      { id: 'reman', label: 'Remanufactured', description: 'Rebuilt to OEM specification', priceRow: 'reman' },
      { id: 'crate', label: 'Crate, truck or European', description: 'New or specialist unit', priceRow: 'crate-euro' },
      { id: 'hd-diesel', label: 'Heavy-duty diesel', description: 'Commercial and truck engines', priceRow: 'hd-diesel' },
    ],
    questions: [
      { id: 'year', type: 'text', label: 'Vehicle year', placeholder: 'e.g. 2016', defaultValue: '', required: true },
      { id: 'make', type: 'text', label: 'Make', placeholder: 'e.g. Ford', defaultValue: '', required: true },
      { id: 'model', type: 'text', label: 'Model', placeholder: 'e.g. Transit 350', defaultValue: '', required: true },
      { id: 'engineCode', type: 'text', label: 'Engine or VIN, if you have it', placeholder: 'e.g. 3.7L V6 or full VIN', defaultValue: '' },
      {
        id: 'installation',
        type: 'select',
        label: 'Do you need installation?',
        defaultValue: 'yes',
        options: [
          { value: 'no', label: 'Supply only', hint: 'Delivered to your shop', factor: 0.72 },
          { value: 'yes', label: 'Supply and install', hint: 'Through a vetted partner shop', factor: 1 },
        ],
      },
      {
        id: 'warranty',
        type: 'select',
        label: 'Warranty cover',
        defaultValue: 'parts',
        options: [
          { value: 'parts', label: 'Parts only', factor: 1 },
          { value: 'parts-labour', label: 'Parts and labour', add: [350, 900] },
          { value: 'extended', label: 'Extended cover', add: [700, 1800] },
        ],
      },
    ],
    disclaimer: 'European engines are quoted per vehicle. Core charges are refunded when the old unit is returned.',
    outputNotes: [
      'Parts and labour are shown separately in the breakdown.',
      'Nothing is ordered until the VIN match is confirmed in writing.',
    ],
  },
];

export const ESTIMATE_CONFIG: EstimateServiceConfig[] = [...BASE_ESTIMATE_CONFIG, ...ENTERPRISE_ESTIMATE_CONFIG];

export const ESTIMATE_CONFIG_MAP: Record<string, EstimateServiceConfig> = ESTIMATE_CONFIG.reduce(
  (acc, c) => ({ ...acc, [c.service]: c }),
  {} as Record<string, EstimateServiceConfig>,
);
