import { getRegion, type RegionCode } from '@/data/regions';
import type { Range } from '@/data/pricing';

/** Compact currency, e.g. $8,000 or $150k. */
export function formatMoney(
  amount: number,
  region: RegionCode,
  opts: { compact?: boolean; decimals?: number } = {},
): string {
  const r = getRegion(region);
  const { compact = false, decimals = 0 } = opts;

  if (compact && amount >= 10000) {
    const thousands = amount / 1000;
    const rounded = thousands >= 100 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
    return `${r.symbol}${rounded}k`;
  }

  return `${r.symbol}${amount.toLocaleString(r.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** "$3,000 – $10,000" or "$8,000 – $35,000+" */
export function formatRange(
  range: Range | null,
  region: RegionCode,
  opts: { plus?: boolean; compact?: boolean; decimals?: number } = {},
): string {
  if (!range) return 'Quoted per job';
  const [low, high] = range;
  const { plus = false, compact = false, decimals = 0 } = opts;

  if (low === high) {
    return `${formatMoney(low, region, { compact, decimals })}${plus ? '+' : ''}`;
  }
  return `${formatMoney(low, region, { compact, decimals })} – ${formatMoney(high, region, { compact, decimals })}${
    plus ? '+' : ''
  }`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDate(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Rounds a range to figures a human would quote. */
export function tidyRange([low, high]: Range): Range {
  return [tidy(low), tidy(high)];
}

function tidy(n: number): number {
  if (n >= 100000) return Math.round(n / 5000) * 5000;
  if (n >= 10000) return Math.round(n / 1000) * 1000;
  if (n >= 1000) return Math.round(n / 100) * 100;
  if (n >= 100) return Math.round(n / 10) * 10;
  return Math.round(n);
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
