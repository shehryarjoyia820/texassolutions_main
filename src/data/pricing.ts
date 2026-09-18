import type { RegionCode } from './regions';
import { ENTERPRISE_PRICE_TABLES } from './pricing-enterprise';
import { SERVICE_ORDER } from './services';

/**
 * CMS model: priceTable (service x region)
 * Every figure below comes from section 6 of the specification.
 * `plus: true` renders a trailing "+" on the high end.
 * `null` means "quoted per job" for that region.
 */
export type Range = [number, number];

export interface PriceRow {
  id: string;
  label: string;
  note?: string;
  unit: 'one-time' | 'monthly' | 'weekly' | 'hourly' | 'per-lead' | 'per-appointment' | 'per-unit';
  plus?: Partial<Record<RegionCode, boolean>>;
  values: Record<RegionCode, Range | null>;
  /** Region-specific footnote, e.g. London agency rates. */
  footnotes?: Partial<Record<RegionCode, string>>;
}

/** Regions authored by hand in section 6 of the spec. */
type AuthoredRegion = 'US' | 'UK' | 'CA' | 'AU' | 'EU';

type AuthoredRow = Omit<PriceRow, 'values'> & {
  values: Record<AuthoredRegion, Range | null> & Partial<Record<RegionCode, Range | null>>;
};

type AuthoredTable = Omit<PriceTable, 'rows'> & { rows: AuthoredRow[] };

/**
 * Gulf and Asia tables are authored in USD from the US row: Gulf enterprise
 * rates track US levels, Asia sits about 10% below. Services not offered in a
 * region (truck dispatch, engine supply) carry explicit nulls instead.
 */
const DERIVED_FACTOR: Partial<Record<RegionCode, number>> = { GCC: 1.0, APAC: 0.9 };
const NOT_OFFERED: Record<string, RegionCode[]> = {
  'truck-dispatch': ['GCC', 'APAC'],
  'auto-engines': ['GCC', 'APAC'],
};

function tidyValue(n: number) {
  if (n >= 100000) return Math.round(n / 5000) * 5000;
  if (n >= 10000) return Math.round(n / 1000) * 1000;
  if (n >= 1000) return Math.round(n / 100) * 100;
  return Math.round(n / 5) * 5;
}

function completeTable(t: AuthoredTable): PriceTable {
  return {
    ...t,
    rows: t.rows.map((row) => {
      const values = { ...row.values } as Record<RegionCode, Range | null>;
      const plus = { ...(row.plus ?? {}) };
      for (const [code, factor] of Object.entries(DERIVED_FACTOR) as [RegionCode, number][]) {
        if (values[code] !== undefined) continue;
        if (NOT_OFFERED[t.service]?.includes(code)) {
          values[code] = null;
          continue;
        }
        const us = row.values.US;
        values[code] = us ? [tidyValue(us[0] * factor), tidyValue(us[1] * factor)] : null;
        if (row.plus?.US) plus[code] = true;
      }
      return { ...row, values, plus };
    }),
  };
}

export interface PriceTable {
  service: string;
  title: string;
  intro: string;
  rows: PriceRow[];
  disclaimer?: string;
}

export const UNIT_LABEL: Record<PriceRow['unit'], string> = {
  'one-time': 'project',
  monthly: 'per month',
  weekly: 'per week',
  hourly: 'per hour',
  'per-lead': 'per qualified lead',
  'per-appointment': 'per booked appointment',
  'per-unit': 'supplied and installed',
};

const BASE_PRICE_TABLES: AuthoredTable[] = [
  {
    service: 'web-development',
    title: 'Web and app development',
    intro:
      'Fixed-scope builds are quoted as a project. Ongoing work and staff augmentation run on the hourly rate for your region.',
    rows: [
      {
        id: 'landing-page',
        label: 'Landing page',
        note: 'Single page, copy polish, one form, analytics',
        unit: 'one-time',
        values: { US: [300, 800], UK: [500, 1500], CA: [800, 2500], AU: [800, 2500], EU: [500, 2000] },
      },
      {
        id: 'business-site',
        label: 'Small business site, 5-10 pages',
        note: 'CMS, blog, contact flows, on-page SEO',
        unit: 'one-time',
        values: { US: [3000, 10000], UK: [3000, 8000], CA: [4000, 12000], AU: [3000, 10000], EU: [3000, 10000] },
      },
      {
        id: 'agency-build',
        label: 'Custom agency build',
        note: 'Bespoke design system, motion, integrations',
        unit: 'one-time',
        plus: { US: true, AU: true },
        values: { US: [8000, 35000], UK: [8000, 30000], CA: [10000, 40000], AU: [8000, 25000], EU: [8000, 35000] },
      },
      {
        id: 'ecommerce',
        label: 'E-commerce store',
        note: 'Catalogue, checkout, payments, fulfilment hooks',
        unit: 'one-time',
        plus: { US: true, AU: true },
        values: { US: [10000, 50000], UK: [8000, 40000], CA: [12000, 50000], AU: [10000, 50000], EU: [10000, 45000] },
      },
      {
        id: 'web-app',
        label: 'Web app or portal',
        note: 'Auth, roles, dashboards, third-party APIs',
        unit: 'one-time',
        plus: { AU: true },
        values: {
          US: [30000, 150000],
          UK: [25000, 120000],
          CA: [40000, 180000],
          AU: [30000, 150000],
          EU: [30000, 150000],
        },
      },
      {
        id: 'app-mvp',
        label: 'Mobile app MVP',
        note: 'iOS and Android, core journey only',
        unit: 'one-time',
        values: { US: [25000, 60000], UK: [40000, 80000], CA: [35000, 80000], AU: [40000, 90000], EU: [40000, 90000] },
      },
      {
        id: 'app-mid',
        label: 'Mid-complexity app',
        note: 'Offline sync, payments, back office',
        unit: 'one-time',
        values: {
          US: [60000, 150000],
          UK: [60000, 150000],
          CA: [80000, 200000],
          AU: [80000, 200000],
          EU: [60000, 150000],
        },
      },
      {
        id: 'app-enterprise',
        label: 'Enterprise or AI app',
        note: 'Scale, compliance, model integration',
        unit: 'one-time',
        plus: { US: true, UK: true, CA: true, AU: true },
        values: {
          US: [150000, 150000],
          UK: [150000, 150000],
          CA: [200000, 200000],
          AU: [200000, 200000],
          EU: [150000, 400000],
        },
      },
      {
        id: 'dev-hourly',
        label: 'Developer hourly rate',
        unit: 'hourly',
        values: { US: [100, 200], UK: [50, 75], CA: [90, 130], AU: [90, 120], EU: [40, 80] },
        footnotes: {
          UK: 'London agency rates run 80-180 GBP per hour.',
          EU: 'Eastern Europe 40-80 EUR; Western Europe 90-200 EUR.',
        },
      },
    ],
  },
  {
    service: 'lead-generation',
    title: 'Lead generation',
    intro:
      'Most accounts run a monthly retainer. Per-lead and per-appointment pricing is available once volume is proven.',
    rows: [
      {
        id: 'retainer',
        label: 'Lead generation retainer',
        note: 'Outbound, copy, data, sequencing, reporting',
        unit: 'monthly',
        values: { US: [2500, 15000], UK: [2000, 10000], CA: [3000, 15000], AU: [3000, 15000], EU: [2000, 12000] },
      },
      {
        id: 'per-lead',
        label: 'Per qualified lead',
        note: 'Meets the agreed qualification criteria',
        unit: 'per-lead',
        values: { US: [150, 600], UK: [120, 450], CA: [200, 700], AU: [200, 700], EU: [120, 500] },
      },
      {
        id: 'per-appointment',
        label: 'Per booked appointment',
        note: 'Held meeting on your calendar',
        unit: 'per-appointment',
        values: { US: [300, 900], UK: [250, 700], CA: [400, 1000], AU: [400, 1000], EU: [250, 800] },
      },
    ],
  },
  {
    service: 'ads-optimization',
    title: 'Ads optimization and design',
    intro: 'Management is billed as a flat monthly fee or 10-20% of ad spend, whichever suits the account better.',
    rows: [
      {
        id: 'management',
        label: 'Ads management',
        note: 'Or 10-20% of ad spend',
        unit: 'monthly',
        values: { US: [500, 3000], UK: [500, 2500], CA: [800, 3500], AU: [800, 3500], EU: [600, 3000] },
      },
      {
        id: 'setup',
        label: 'Ads setup and tracking',
        note: 'Account build, conversion tracking, GTM',
        unit: 'one-time',
        values: { US: [500, 2000], UK: [250, 1500], CA: [600, 2500], AU: [600, 2500], EU: [500, 2000] },
      },
      {
        id: 'creative-pack',
        label: 'Ad creative pack, 5 statics with copy',
        unit: 'one-time',
        values: { US: [300, 1500], UK: [250, 1200], CA: [400, 2000], AU: [400, 2000], EU: [300, 1500] },
      },
    ],
  },
  {
    service: 'adsense-management',
    title: 'AdSense revenue management',
    intro:
      'Billed per site, as a flat monthly fee or 15-30% of the revenue uplift we create above your trailing three-month baseline.',
    rows: [
      {
        id: 'per-site',
        label: 'AdSense management, per site',
        note: 'Or 15-30% of revenue uplift',
        unit: 'monthly',
        values: { US: [500, 2500], UK: [500, 2500], CA: [500, 2500], AU: [500, 2500], EU: [500, 2500] },
      },
    ],
    disclaimer:
      'This is our own rate card, not a market benchmark. No public pricing survey exists for AdSense revenue management.',
  },
  {
    service: 'truck-dispatch',
    title: 'Truck dispatch',
    intro:
      'Two ways to pay, side by side. The percentage applies to linehaul only, never to fuel surcharge or detention. No long-term contract, 30 days notice.',
    rows: [
      {
        id: 'box-truck-flat',
        label: 'Box truck, hotshot, sprinter or cargo van, flat weekly',
        note: 'Alternative to 10% of gross',
        unit: 'weekly',
        values: { US: [350, 500], UK: [350, 500], CA: [350, 500], AU: [350, 500], EU: [350, 500] },
      },
      {
        id: 'semi-flat',
        label: 'Semi: dry van, flatbed, reefer, step deck, flat weekly',
        note: 'Alternative to 7% of gross',
        unit: 'weekly',
        values: { US: [250, 400], UK: [250, 400], CA: [250, 400], AU: [250, 400], EU: [250, 400] },
      },
    ],
    disclaimer:
      'Flat weekly rates are quoted in USD per truck for every region. The US market sits at 3-10% of gross with 5-7% typical; our 10% box-truck rate buys full back-office service, not load-finding alone.',
  },
  {
    service: 'qa-testing',
    title: 'Quality assurance and testing',
    intro: 'Hourly for short engagements, managed monthly for embedded QA.',
    rows: [
      {
        id: 'qa-hourly',
        label: 'QA engineer hourly',
        unit: 'hourly',
        values: { US: [70, 120], UK: [50, 90], CA: [80, 130], AU: [80, 130], EU: [35, 85] },
        footnotes: { EU: 'Eastern Europe 35-85 EUR; Western Europe 90-200 EUR.' },
      },
      {
        id: 'qa-managed',
        label: 'Managed QA team',
        note: 'Dedicated testers, sprint cadence, reporting',
        unit: 'monthly',
        values: { US: [4000, 8000], UK: [3200, 6500], CA: [5000, 9500], AU: [5000, 9500], EU: [3000, 7500] },
      },
    ],
  },
  {
    service: 'auto-engines',
    title: 'Auto engines',
    intro: 'Supplied and installed, including core return handling and warranty registration.',
    rows: [
      {
        id: 'used',
        label: 'Used engine',
        note: 'Tested, mileage-verified, warranty options',
        unit: 'per-unit',
        values: { US: [2600, 4500], UK: [2860, 5400], CA: [2990, 5175], AU: [2990, 5175], EU: null },
      },
      {
        id: 'reman',
        label: 'Remanufactured engine',
        note: 'Rebuilt to OEM specification',
        unit: 'per-unit',
        values: { US: [4000, 6500], UK: [4400, 7800], CA: [4600, 7475], AU: [4600, 7475], EU: null },
      },
      {
        id: 'crate-euro',
        label: 'Crate, truck or European engine',
        unit: 'per-unit',
        values: { US: [6000, 12000], UK: [6600, 14400], CA: [6900, 13800], AU: [6900, 13800], EU: null },
      },
      {
        id: 'hd-diesel',
        label: 'Heavy-duty diesel',
        unit: 'per-unit',
        plus: { US: true, UK: true, CA: true, AU: true },
        values: { US: [12000, 25000], UK: [13200, 30000], CA: [13800, 28750], AU: [13800, 28750], EU: null },
      },
    ],
    disclaimer:
      'UK figures add 10-20% for import. Canada and Australia sit 10-15% above US levels. European engines are quoted per vehicle.',
  },
];

/** Every table, in the same order as the services across the site. */
export const PRICE_TABLES: PriceTable[] = SERVICE_ORDER.map((slug) =>
  [...BASE_PRICE_TABLES.map(completeTable), ...ENTERPRISE_PRICE_TABLES].find((t) => t.service === slug),
).filter((t): t is PriceTable => Boolean(t));

export const PRICE_TABLE_MAP: Record<string, PriceTable> = PRICE_TABLES.reduce(
  (acc, t) => ({ ...acc, [t.service]: t }),
  {} as Record<string, PriceTable>,
);

export function getPriceRow(service: string, rowId: string): PriceRow | undefined {
  return PRICE_TABLE_MAP[service]?.rows.find((r) => r.id === rowId);
}

/** Dispatch percentage models, used by the service page and the calculator. */
export const DISPATCH_MODELS = [
  {
    id: 'boxTruckOrHotshot',
    label: 'Box truck, hotshot, sprinter or cargo van',
    percent: 0.1,
    flatWeekly: [350, 500] as Range,
    /** Typical weekly linehaul gross for this equipment on our desk. */
    typicalGross: [7000, 9000] as Range,
  },
  {
    id: 'semi',
    label: 'Semi: dry van, flatbed, reefer, step deck',
    percent: 0.07,
    flatWeekly: [250, 400] as Range,
    typicalGross: [8000, 10000] as Range,
  },
] as const;

export const DISPATCH_DISCLAIMER = 'Fee applies to linehaul only, not fuel surcharge or detention.';

/**
 * Regions whose figures were scaled from US and UK benchmarks rather than
 * measured directly. Flagged on the pricing page per the specification.
 */
export const DERIVED_REGIONS: RegionCode[] = ['CA', 'EU', 'GCC', 'APAC'];

/** Source list rendered on the pricing page. */
export const PRICE_SOURCES = [
  { label: 'GoodFirms website development cost survey 2026', href: 'https://www.goodfirms.co/resources/website-construction-cost-survey' },
  { label: 'Webfoundr US website design cost 2026', href: 'https://webfoundr.com/blog/web-design/how-much-does-website-design-cost-in-the-usa-in-2026/' },
  { label: 'WPCreative website cost Australia 2026', href: 'https://wpcreative.com.au/how-much-does-a-website-cost-in-australia/' },
  { label: 'Fireart app development rates by country', href: 'https://fireart.studio/blog/app-development-cost/' },
  { label: 'Guru TechnoLabs app cost by region', href: 'https://www.gurutechnolabs.com/blog/mobile-app-development-cost/' },
  { label: 'Naveck app cost guide 2026', href: 'https://www.naveck.com/blog/mobile-app-development-cost-guide/' },
  { label: 'YourGrowthPartner B2B lead generation pricing', href: 'https://yourgrowthpartner.io/blog/b2b-lead-generation-agency-pricing/' },
  { label: 'AgencyPro PPC management cost 2026', href: 'https://agencypro.app/blog/how-much-does-ppc-management-cost' },
  { label: 'Whito UK marketing cost index 2026', href: 'https://whito.co.uk/research/uk-marketing-cost-index/' },
  { label: 'Clear Click UK PPC agency costs', href: 'https://www.clear-click.com/blog/ppc-agency-cost-uk' },
  { label: 'Google AdSense Help revenue share', href: 'https://support.google.com/adsense/answer/180195?hl=en' },
  { label: 'iDispatchHub truck dispatcher fees 2026', href: 'https://idispatchhub.com/truck-dispatcher-fees/' },
  { label: 'GigaTester QA outsourcing rates 2026', href: 'https://gigatester.com/qa-outsourcing-budget/' },
  { label: 'RepairMath engine replacement cost 2026', href: 'https://repairmath.com/repair/engine-replacement/' },
];
