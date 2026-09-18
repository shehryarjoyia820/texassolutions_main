/**
 * CMS model: region
 * The switcher changes WHICH ROW of a price table is read.
 * It never converts currency live — every region has its own authored figures.
 */
export type RegionCode = 'US' | 'UK' | 'CA' | 'AU' | 'EU' | 'GCC' | 'APAC';

export interface Region {
  code: RegionCode;
  label: string;
  short: string;
  currency: string;
  symbol: string;
  locale: string;
  flag: string;
  /** ISO country codes that resolve to this region during IP/locale detection. */
  countries: string[];
}

export const REGIONS: Region[] = [
  {
    code: 'US',
    label: 'United States',
    short: 'US',
    currency: 'USD',
    symbol: '$',
    locale: 'en-US',
    flag: '🇺🇸',
    countries: ['US', 'PR', 'MX'],
  },
  {
    code: 'UK',
    label: 'United Kingdom',
    short: 'UK',
    currency: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    flag: '🇬🇧',
    countries: ['GB', 'IE'],
  },
  {
    code: 'CA',
    label: 'Canada',
    short: 'Canada',
    currency: 'CAD',
    symbol: 'CA$',
    locale: 'en-CA',
    flag: '🇨🇦',
    countries: ['CA'],
  },
  {
    code: 'AU',
    label: 'Australia',
    short: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    locale: 'en-AU',
    flag: '🇦🇺',
    countries: ['AU', 'NZ'],
  },
  {
    code: 'EU',
    label: 'Europe',
    short: 'Europe',
    currency: 'EUR',
    symbol: '€',
    locale: 'en-IE',
    flag: '🇪🇺',
    countries: ['DE', 'FR', 'NL', 'ES', 'IT', 'PL', 'PT', 'BE', 'AT', 'SE', 'DK', 'FI', 'CZ', 'RO', 'GR', 'HU', 'CH', 'NO', 'LU'],
  },
  {
    code: 'GCC',
    label: 'Gulf (GCC)',
    short: 'Gulf',
    // Gulf currencies are pegged to the dollar and B2B technology work is
    // usually contracted in USD, so the Gulf table is authored in USD.
    currency: 'USD',
    symbol: 'US$',
    locale: 'en-AE',
    flag: '🇦🇪',
    countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'],
  },
  {
    code: 'APAC',
    label: 'Asia',
    short: 'Asia',
    currency: 'USD',
    symbol: 'US$',
    locale: 'en-SG',
    flag: '🌏',
    countries: ['SG', 'JP', 'KR', 'HK', 'TW', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'CN'],
  },
];

export const REGION_CODES = REGIONS.map((r) => r.code);

export const DEFAULT_REGION: RegionCode = 'US';

export const REGION_MAP: Record<RegionCode, Region> = REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.code]: r }),
  {} as Record<RegionCode, Region>,
);

export function getRegion(code: RegionCode | string | null | undefined): Region {
  if (code && code in REGION_MAP) return REGION_MAP[code as RegionCode];
  return REGION_MAP[DEFAULT_REGION];
}

/** Best-effort region guess from the browser locale, used before any manual choice. */
export function guessRegionFromLocale(locale: string | undefined): RegionCode {
  if (!locale) return DEFAULT_REGION;
  const country = locale.split('-')[1]?.toUpperCase();
  if (!country) return DEFAULT_REGION;
  const hit = REGIONS.find((r) => r.countries.includes(country));
  return hit?.code ?? DEFAULT_REGION;
}
