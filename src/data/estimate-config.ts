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

// Timeline sets the start date only. There is no rush premium or flexibility
// discount on the published rates; any premium is agreed in writing first.
export const TIMELINE_MULTIPLIERS = [
  { id: 'rush', label: 'As soon as possible', multiplier: 1.0, hint: 'Start depends on availability; no rush surcharge' },
  { id: 'standard', label: 'Standard', multiplier: 1.0, hint: 'Next available start' },
  { id: 'flexible', label: 'Flexible, 2 months or more', multiplier: 1.0, hint: 'Scheduled around other work' },
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
          { value: 'polish', label: 'We draft, you polish it', add: [300, 900] },
          { value: 'full', label: 'You write everything', add: [800, 2500] },
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
          { value: 'web', label: 'Web companion', add: [2000, 7000] },
        ],
      },
    ],
    disclaimer: 'Fixed-scope builds are quoted as a project. Hourly work is billed at the published hourly rate.',
    outputNotes: [
      'Includes discovery, design, build, CMS setup, SEO basics and 30 days of support.',
      'Excludes ongoing hosting, licences and paid media budget.',
    ],
  },

  {
    service: 'lead-generation',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'What kind of support?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [
      { id: 'b2b', label: 'B2B research and outreach support', description: 'Prospect research, list building, outreach support', priceRow: 'retainer' },
      { id: 'appointments', label: 'Appointment-setting support', description: 'Outreach follow-up and calendar coordination', priceRow: 'retainer' },
    ],
    questions: [
      {
        id: 'hours',
        type: 'number',
        label: 'Research and outreach-support hours per month',
        help: 'The starting plan includes 40 hours. Extra hours are billed at the plan rate of US$15 per hour, only with your approval.',
        min: 40,
        max: 160,
        step: 10,
        defaultValue: 40,
        unit: 'hours',
        freeUnits: 40,
        perUnit: [15, 15],
      },
    ],
    disclaimer: 'Lead counts are not guaranteed. Paid data, outreach tools and sending infrastructure are separate.',
    outputNotes: [
      'Starting plan: US$600 a month for up to 40 research and outreach-support hours.',
      'Extra hours: US$15 per hour (the plan rate), billed only after written approval.',
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
    ],
    questions: [
      {
        id: 'extraPlatforms',
        type: 'number',
        label: 'Additional platforms beyond the first',
        help: 'Each platform is its own management plan (up to 3 campaigns), from US$300 a month.',
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 0,
        unit: 'platforms',
        freeUnits: 0,
        perUnit: [300, 300],
      },
    ],
    disclaimer: 'Ad spend is paid directly to the platforms and is not included. Results, leads and revenue are not guaranteed.',
    outputNotes: [
      'Starting plan: US$300 a month per platform, up to 3 campaigns.',
      'More than 3 campaigns on a platform, setup and creative work are quoted separately.',
    ],
  },

  {
    service: 'adsense-management',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'How many sites?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [{ id: 'single', label: 'AdSense management', description: 'Monthly review and optimisation recommendations', priceRow: 'per-site' }],
    questions: [
      {
        id: 'sites',
        type: 'number',
        label: 'How many sites?',
        help: 'Each site is its own plan, from US$200 a month.',
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 1,
        unit: 'sites',
        freeUnits: 1,
        perUnit: [200, 200],
      },
    ],
    disclaimer: 'We do not guarantee AdSense approval or revenue increases. Google sets AdSense policies and revenue share.',
    outputNotes: ['Starting plan: US$200 a month per site for a monthly review and optimisation recommendations.'],
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
        help: 'The fee is your percentage of this figure. Typical OTR weekly gross: box truck or hotshot $7,000-$9,000, semi $8,000-$10,000. Use your three-month average.',
        min: 1000,
        max: 20000,
        step: 100,
        defaultValue: 9000,
        currency: true,
        unit: 'per truck',
      },
    ],
    disclaimer: 'Percentage of weekly gross, OTR only. No flat rate, no setup fee, no extra charges, no long-term contract. Final percentage is confirmed in the dispatch agreement.',
    outputNotes: [
      'Fee = your percentage x weekly gross x number of trucks. Dollar figures are examples from the gross you enter.',
      'Load search, rate negotiation, broker packets and paperwork are included.',
    ],
  },

  {
    service: 'qa-testing',
    billing: 'monthly',
    regions: ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'],
    subTypeLabel: 'How do you want QA?',
    defaultDurationMonths: 3,
    durationOptions: [1, 3, 6, 12],
    subTypes: [
      { id: 'retainer', label: 'Manual QA retainer', description: 'From US$300 a month, up to 20 testing hours', priceRow: 'qa-managed' },
      { id: 'manual', label: 'Dedicated manual QA engineer', description: 'US$1,600 a month, up to 160 hours', priceRow: 'qa-manual' },
      { id: 'automation', label: 'Dedicated QA automation engineer', description: 'US$2,800 a month, up to 160 hours', priceRow: 'qa-automation' },
    ],
    questions: [
      {
        id: 'extraHours',
        type: 'number',
        label: 'Extra testing hours per month above the plan',
        help: 'Billed at the manual QA rate of US$12-18 per hour, only with your approval.',
        min: 0,
        max: 160,
        step: 5,
        defaultValue: 0,
        unit: 'hours',
        freeUnits: 0,
        perUnit: [12, 18],
      },
    ],
    disclaimer: 'The test suite is built inside your repository and handed over documented. Device-cloud and tool licences are separate.',
    outputNotes: [
      'Hourly QA without a plan: manual US$12-18 per hour, automation US$18-28 per hour.',
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
