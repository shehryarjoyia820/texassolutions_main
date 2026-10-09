import type { RegionCode } from './regions';
import { ENTERPRISE_PRICE_TABLES } from './pricing-enterprise';
import { SERVICE_ORDER } from './services';
import { SPECIALIST_QUOTE_NOTE } from './rates';

/**
 * Price tables per service, built from the owner rate card in ./rates.ts.
 * One price list in US dollars: every region code carries the same value, so
 * components that look up `values[code]` keep working without multipliers.
 *
 * Row kinds:
 *  - project  fixed-scope build, quoted from the range after scoping
 *  - hourly   hourly rate for the role
 *  - resource dedicated person, up to 160 hours a month
 *  - support  starting monthly price with a stated starting scope
 *  - example  worked example (truck dispatch), not a price
 */
export { usd, PLUS, rateCardRows, resourceRows, project, supportRow } from './price-rows';
export type { Range, RowKind, PriceRow, PriceTable } from './price-rows';
import { usd, PLUS, rateCardRows, resourceRows, project, supportRow, type Range, type PriceRow, type PriceTable } from './price-rows';

export const UNIT_LABEL: Record<PriceRow['unit'], string> = {
  'one-time': 'project',
  monthly: 'per month',
  weekly: 'per week',
  hourly: 'per hour',
  'per-lead': 'per qualified lead',
  'per-appointment': 'per booked appointment',
  'per-unit': 'supplied and installed',
};

const BASE_PRICE_TABLES: PriceTable[] = [
  {
    service: 'web-development',
    title: 'Web and app development',
    intro:
      'Fixed-scope builds are priced from the range below after a written scope. Ongoing and ad-hoc work is billed by the hour or through a monthly development package.',
    rows: [
      project('landing-page', 'Landing page', 'Single page, copy polish, one form, analytics', [500, 1500]),
      project('business-site', 'Small business site, 5-10 pages', 'CMS, blog, contact flows, on-page SEO', [2000, 5000]),
      project('agency-build', 'Custom agency build', 'Bespoke design system, motion, integrations', [5000, 15000], true),
      project('ecommerce', 'E-commerce store', 'Catalogue, checkout, payments, fulfilment hooks', [5000, 20000], true),
      project('web-app', 'Web app or portal', 'Auth, roles, dashboards, third-party APIs', [15000, 75000]),
      project('app-mvp', 'Mobile app MVP', 'iOS and Android, core journey only', [15000, 35000]),
      project('app-mid', 'Mid-complexity app', 'Offline sync, payments, back office', [35000, 80000]),
      project('app-enterprise', 'Enterprise or AI app', 'Scale, compliance, model integration', [80000, 80000], true),
      ...rateCardRows('web-development'),
    ],
    disclaimer: 'Hosting, domains, paid plugins, app-store fees and third-party APIs are separate.',
  },
  {
    service: 'lead-generation',
    title: 'Lead generation',
    intro: 'A monthly support allocation for research and outreach. Lead counts are not guaranteed.',
    rows: supportRow('lead-generation', 'retainer'),
    disclaimer: 'Paid data, outreach tools and sending infrastructure are separate. We do not guarantee lead counts or revenue.',
  },
  {
    service: 'ads-optimization',
    title: 'Ads optimization and design',
    intro: 'Management is a monthly fee by scope. Ad spend is paid by you directly to the platform.',
    rows: [
      ...supportRow('ads-optimization', 'management'),
      { id: 'setup', label: 'Ads setup and tracking', note: 'Account build, conversion tracking, GTM', unit: 'one-time', kind: 'project', values: usd([300, 1000]) },
      { id: 'creative-pack', label: 'Ad creative pack, 5 statics with copy', unit: 'one-time', kind: 'project', values: usd([200, 600]) },
    ],
    disclaimer: 'Ad spend is not included. We do not guarantee leads, sales or revenue increases.',
  },
  {
    service: 'adsense-management',
    title: 'AdSense revenue management',
    intro: 'A monthly review and optimisation recommendations, per site.',
    rows: supportRow('adsense-management', 'per-site'),
    disclaimer: 'We do not guarantee AdSense approval or revenue increases. Google sets AdSense policies and revenue share.',
  },
  {
    service: 'truck-dispatch',
    title: 'Truck dispatch',
    intro:
      "The fee is a percentage of the truck's weekly gross (OTR): semi trucks 5%, hotshots 8%, box trucks and straight trucks 10%. No flat rate, no setup fee, no monthly subscription and no extra charges. The dollar figures below are examples only.",
    rows: [
      {
        id: 'semi',
        label: 'Semi trucks (dry van, reefer, flatbed, step deck, power only): 5%',
        note: 'Example: 5% of USD 8,000-10,000 weekly gross',
        unit: 'weekly',
        kind: 'example',
        values: usd([400, 500]),
      },
      {
        id: 'hotshot',
        label: 'Hotshot trucks: 8%',
        note: 'Example: 8% of USD 7,000-9,000 weekly gross',
        unit: 'weekly',
        kind: 'example',
        values: usd([560, 720]),
      },
      {
        id: 'box-truck',
        label: 'Box trucks and straight trucks: 10%',
        note: 'Example: 10% of USD 7,000-9,000 weekly gross',
        unit: 'weekly',
        kind: 'example',
        values: usd([700, 900]),
      },
    ],
    disclaimer:
      'Examples assume typical OTR weekly gross per truck; your fee is the percentage of what your truck actually grosses. Local and regional work is quoted separately. Final percentage is confirmed in the dispatch agreement. Gross and earnings are not guaranteed.',
  },
  {
    service: 'qa-testing',
    title: 'Quality assurance and testing',
    intro: 'Hourly for short engagements, a monthly retainer for regular testing, or a dedicated QA engineer.',
    rows: [
      ...rateCardRows('qa-testing').map((r) => (r.id === 'qa-retainer' ? { ...r, id: 'qa-managed' } : r)),
      ...resourceRows(['qa-manual', 'qa-automation']),
    ],
    disclaimer: 'Device-cloud, test-tool and CI licences are separate.',
  },
  {
    service: 'auto-engines',
    title: 'Auto engines',
    intro:
      'Supplied and installed, including core return handling and warranty registration. Engine supply is priced separately from all other services.',
    rows: [
      { id: 'used', label: 'Used engine', note: 'Tested, mileage-verified, warranty options', unit: 'per-unit', kind: 'unit', values: usd([2600, 4500]) },
      { id: 'reman', label: 'Remanufactured engine', note: 'Rebuilt to OEM specification', unit: 'per-unit', kind: 'unit', values: usd([4000, 6500]) },
      { id: 'crate-euro', label: 'Crate, truck or European engine', unit: 'per-unit', kind: 'unit', values: usd([6000, 12000]) },
      { id: 'hd-diesel', label: 'Heavy-duty diesel', unit: 'per-unit', kind: 'unit', values: usd([12000, 25000]), plus: PLUS },
    ],
    disclaimer: 'European engines are quoted per vehicle. Core charges are refunded when the old unit is returned.',
  },
];

/** Every table, in the same order as the services across the site. */
export const PRICE_TABLES: PriceTable[] = SERVICE_ORDER.map((slug) =>
  [...BASE_PRICE_TABLES, ...ENTERPRISE_PRICE_TABLES].find((t) => t.service === slug),
).filter((t): t is PriceTable => Boolean(t));

export const PRICE_TABLE_MAP: Record<string, PriceTable> = PRICE_TABLES.reduce(
  (acc, t) => ({ ...acc, [t.service]: t }),
  {} as Record<string, PriceTable>,
);

export function getPriceRow(service: string, rowId: string): PriceRow | undefined {
  return PRICE_TABLE_MAP[service]?.rows.find((r) => r.id === rowId);
}

/** Lowest published price for a service, used for "from" figures on cards. */
export function startingPrice(service: string): { row: PriceRow; value: number } | null {
  const table = PRICE_TABLE_MAP[service];
  if (!table) return null;
  let best: { row: PriceRow; value: number } | null = null;
  for (const row of table.rows) {
    const v = row.values.US;
    if (!v || row.kind === 'example') continue;
    if (!best || v[0] < best.value) best = { row, value: v[0] };
  }
  return best;
}

export { SPECIALIST_QUOTE_NOTE };

/** Dispatch percentage models (OTR, no flat rate), used by the service page and the calculators. */
export const DISPATCH_MODELS = [
  {
    id: 'semi',
    label: 'Semi truck: dry van, reefer, flatbed, step deck, power only',
    short: 'Semi truck',
    /** Percentage of weekly gross, low and high (equal when the rate is fixed). */
    percent: [0.05, 0.05] as Range,
    /** Typical OTR weekly gross for this equipment on our desk. */
    typicalGross: [8000, 10000] as Range,
  },
  {
    id: 'hotshot',
    label: 'Hotshot truck',
    short: 'Hotshot',
    percent: [0.08, 0.08] as Range,
    typicalGross: [7000, 9000] as Range,
  },
  {
    id: 'boxTruckOrHotshot',
    label: 'Box truck or straight truck',
    short: 'Box truck',
    percent: [0.1, 0.1] as Range,
    typicalGross: [7000, 9000] as Range,
  },
] as const;

/** "5%" or "8-10%" */
export function dispatchPercentLabel(p: Range): string {
  const lo = Math.round(p[0] * 100);
  const hi = Math.round(p[1] * 100);
  return lo === hi ? `${lo}%` : `${lo}-${hi}%`;
}

export const DISPATCH_DISCLAIMER =
  'OTR operations only. No flat rate, no setup fee, no extra charges. Final percentage is confirmed in the dispatch agreement; gross and earnings are not guaranteed.';

/** Legacy: no region is scaled any more. Kept so older imports compile. */
export const DERIVED_REGIONS: RegionCode[] = [];

/**
 * Market research used when the owner set the rate card. These are external
 * benchmarks, NOT Texas Solutions prices; the pricing page labels them so.
 */
export const PRICE_SOURCES = [
  { label: 'Upstack: offshore software development rates by country', href: 'https://upstackstudio.com/blog/offshore-software-development-rate-by-country/' },
  { label: 'GoodFirms: website development cost survey', href: 'https://www.goodfirms.co/resources/website-construction-cost-survey' },
  { label: 'Fireart: app development rates', href: 'https://fireart.studio/blog/app-development-cost/' },
  { label: 'Space-O: AI chatbot development cost', href: 'https://www.spaceotechnologies.com/blog/ai-chatbot-development-cost/' },
  { label: 'Belkins: lead generation pricing', href: 'https://belkins.io/blog/lead-generation-pricing' },
  { label: 'GigaTester: QA outsourcing rates', href: 'https://gigatester.com/qa-outsourcing-budget/' },
  { label: 'iDispatchHub: truck dispatcher fees', href: 'https://idispatchhub.com/truck-dispatcher-fees/' },
  { label: 'RepairMath: engine replacement cost', href: 'https://repairmath.com/repair/engine-replacement/' },
];
