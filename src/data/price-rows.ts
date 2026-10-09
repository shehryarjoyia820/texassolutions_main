import type { RegionCode } from './regions';
import { HOURLY_RATES, SUPPORT_PLANS, MONTHLY_RESOURCES, type Range as RateRange } from './rates';

/** Shared row types and builders for the price tables (no imports from pricing.ts, to avoid a cycle). */
export type Range = RateRange;

export type RowKind = 'project' | 'hourly' | 'resource' | 'support' | 'example' | 'unit';

export interface PriceRow {
  id: string;
  label: string;
  note?: string;
  unit: 'one-time' | 'monthly' | 'weekly' | 'hourly' | 'per-lead' | 'per-appointment' | 'per-unit';
  kind?: RowKind;
  /** Starting scope or included hours, shown beside the price. */
  scope?: string;
  /** Render as "from $X" (support plans). */
  from?: boolean;
  plus?: Partial<Record<RegionCode, boolean>>;
  /** `null` means quoted per scope. */
  values: Record<RegionCode, Range | null>;
  footnotes?: Partial<Record<RegionCode, string>>;
}

export interface PriceTable {
  service: string;
  title: string;
  intro: string;
  rows: PriceRow[];
  disclaimer?: string;
}

const CODES: RegionCode[] = ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'];

/** Same US-dollar value for every legacy region code (no multipliers). */
export function usd(range: Range | null): Record<RegionCode, Range | null> {
  return CODES.reduce((acc, c) => ({ ...acc, [c]: range }), {} as Record<RegionCode, Range | null>);
}
export const PLUS = { US: true, UK: true, CA: true, AU: true, EU: true, GCC: true, APAC: true };

/** Rows generated from the rate card for one service. */
export function rateCardRows(service: string): PriceRow[] {
  const hourly: PriceRow[] = HOURLY_RATES.filter((r) => r.service === service).map((r) => ({
    id: r.id,
    label: r.label,
    note: 'Hourly, for ad-hoc and short engagements',
    unit: 'hourly',
    kind: 'hourly',
    values: usd(r.rate),
  }));
  const support: PriceRow[] = SUPPORT_PLANS.filter((p) => p.service === service).map((p) => ({
    id: p.id,
    label: p.label,
    note: p.scope,
    scope: p.scope,
    unit: 'monthly',
    kind: 'support',
    from: true,
    values: usd([p.from, p.from]),
  }));
  return [...hourly, ...support];
}

/** Monthly dedicated-resource rows (up to 160 hours each). */
export function resourceRows(ids: string[]): PriceRow[] {
  return MONTHLY_RESOURCES.filter((r) => ids.includes(r.id)).map((r) => ({
    id: r.id,
    label: r.label,
    note: 'Dedicated, up to 160 working hours a month',
    scope: 'Up to 160 hours a month',
    unit: 'monthly',
    kind: 'resource',
    values: usd([r.price, r.price]),
  }));
}

export const project = (id: string, label: string, note: string, range: Range | null, plus = false): PriceRow => ({
  id,
  label,
  note,
  unit: 'one-time',
  kind: 'project',
  values: usd(range),
  ...(plus ? { plus: PLUS } : {}),
});

export function supportRow(service: string, id: string): PriceRow[] {
  return SUPPORT_PLANS.filter((p) => p.service === service).map((p) => ({
    id,
    label: p.label,
    note: p.scope,
    scope: p.scope,
    unit: 'monthly' as const,
    kind: 'support' as const,
    from: true,
    values: usd([p.from, p.from]),
  }));
}

