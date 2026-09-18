import type { RegionCode } from '@/data/regions';
import { PRICE_TABLE_MAP, DISPATCH_MODELS, type Range } from '@/data/pricing';
import {
  ESTIMATE_CONFIG_MAP,
  TIMELINE_MULTIPLIERS,
  type EstimateServiceConfig,
  type Question,
  type TimelineId,
} from '@/data/estimate-config';
import { tidyRange } from './format';

export type AnswerValue = string | number | string[];
export type Answers = Record<string, AnswerValue>;

export interface LineItem {
  label: string;
  detail?: string;
  /** Contribution to the range, or null for informational rows. */
  range: Range | null;
  kind: 'base' | 'multiplier' | 'addition' | 'info';
  multiplier?: number;
}

export interface DispatchComparison {
  percentRate: number;
  percentWeekly: Range;
  flatWeekly: Range;
  breakEvenWeeklyGross: number;
  trucks: number;
  weeklyGrossPerTruck: number;
  cheaperModel: 'percent' | 'flat' | 'equal';
}

export interface AdSenseProjection {
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: Range;
  upliftRange: Range;
  ourFee: Range;
}

export interface AdsProjection {
  adSpend: number;
  percentOfSpendFee: Range;
  flatFee: Range;
  recommended: 'percent' | 'flat';
}

export interface EstimateResult {
  service: string;
  subType: string;
  region: RegionCode;
  billing: 'one-time' | 'monthly' | 'weekly';
  /** Low, likely and high, after every modifier. */
  low: number;
  likely: number;
  high: number;
  /** Total across the chosen duration, for recurring services. */
  totalLow?: number;
  totalHigh?: number;
  durationMonths?: number;
  timeline: TimelineId;
  timelineMultiplier: number;
  lineItems: LineItem[];
  assumptions: string[];
  dispatch?: DispatchComparison;
  adsense?: AdSenseProjection;
  ads?: AdsProjection;
  perLead?: Range;
  unavailable?: string;
}

function clampRange([low, high]: Range): Range {
  return [Math.max(0, low), Math.max(0, high)];
}

function scale([low, high]: Range, factor: number): Range {
  return [low * factor, high * factor];
}

function add([aLow, aHigh]: Range, [bLow, bHigh]: Range): Range {
  return [aLow + bLow, aHigh + bHigh];
}

function questionById(config: EstimateServiceConfig, id: string): Question | undefined {
  return config.questions.find((q) => q.id === id);
}

function num(answers: Answers, id: string, fallback = 0): number {
  const v = answers[id];
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return fallback;
}

function str(answers: Answers, id: string, fallback = ''): string {
  const v = answers[id];
  return typeof v === 'string' ? v : fallback;
}

function list(answers: Answers, id: string): string[] {
  const v = answers[id];
  return Array.isArray(v) ? v : [];
}

/** Seeds the base range from the service price table for the chosen region. */
function baseRange(
  config: EstimateServiceConfig,
  subTypeId: string,
  region: RegionCode,
): { range: Range | null; label: string } {
  const subType = config.subTypes.find((s) => s.id === subTypeId) ?? config.subTypes[0];
  if (subType.base) return { range: subType.base[region], label: subType.label };

  const table = PRICE_TABLE_MAP[config.service];
  const row = table?.rows.find((r) => r.id === subType.priceRow);
  const range = row?.values[region] ?? null;
  return { range, label: subType.label };
}

/**
 * Applies every scope answer to the base range, then the timeline multiplier,
 * then duration for recurring services. Section 7 of the specification.
 */
export function computeEstimate(input: {
  service: string;
  subType: string;
  region: RegionCode;
  answers: Answers;
  timeline: TimelineId;
  durationMonths?: number;
}): EstimateResult {
  const { service, subType, region, answers, timeline } = input;
  const config = ESTIMATE_CONFIG_MAP[service];

  const timelineEntry = TIMELINE_MULTIPLIERS.find((t) => t.id === timeline) ?? TIMELINE_MULTIPLIERS[1];
  const tMultiplier = timelineEntry.multiplier;

  const lineItems: LineItem[] = [];
  const assumptions: string[] = [];

  if (!config) {
    return {
      service,
      subType,
      region,
      billing: 'one-time',
      low: 0,
      likely: 0,
      high: 0,
      timeline,
      timelineMultiplier: tMultiplier,
      lineItems,
      assumptions,
      unavailable: 'No estimate configuration exists for this service yet.',
    };
  }

  const billing = config.subTypes.find((s) => s.id === subType)?.billingOverride ?? config.billing;

  if (!config.regions.includes(region)) {
    return {
      service,
      subType,
      region,
      billing,
      low: 0,
      likely: 0,
      high: 0,
      timeline,
      timelineMultiplier: tMultiplier,
      lineItems,
      assumptions,
      unavailable: `We do not currently run ${config.service.replace(/-/g, ' ')} in this region. Contact us and we will tell you honestly whether we can help.`,
    };
  }

  const base = baseRange(config, subType, region);

  if (!base.range) {
    return {
      service,
      subType,
      region,
      billing,
      low: 0,
      likely: 0,
      high: 0,
      timeline,
      timelineMultiplier: tMultiplier,
      lineItems,
      assumptions,
      unavailable:
        'This combination is quoted per job rather than from a published range. Send us the details and we will price it properly.',
    };
  }

  let range: Range = [...base.range] as Range;

  // Add-ons are authored in US terms. Scale them by how this region's base
  // row compares with the US row, so a CAD or GBP estimate stays coherent.
  const usBase = baseRange(config, subType, 'US').range;
  const regionScale =
    usBase && usBase[0] + usBase[1] > 0 ? (range[0] + range[1]) / (usBase[0] + usBase[1]) : 1;
  const scaled = ([lo, hi]: Range): Range => [lo * regionScale, hi * regionScale];

  if (service === 'dedicated-teams') {
    // Itransition-style team pricing: each role at its regional monthly rate.
    const table = PRICE_TABLE_MAP['dedicated-teams'];
    range = [0, 0];
    let headcount = 0;
    for (const q of config.questions) {
      const count = num(answers, q.id, q.type === 'number' ? q.defaultValue : 0);
      const row = table?.rows.find((r) => r.id === q.id);
      const rate = row?.values[region];
      if (!count || !rate) continue;
      headcount += count;
      const line: Range = [rate[0] * count, rate[1] * count];
      range = add(range, line);
      lineItems.push({ label: row!.label, detail: `${count} x monthly rate`, range: line, kind: 'addition' });
    }
    if (subType === 'full' && headcount > 0) {
      const before = [...range] as Range;
      range = scale(range, 1.12);
      lineItems.push({
        label: 'Full working-hours overlap',
        range: [range[0] - before[0], range[1] - before[1]],
        kind: 'multiplier',
        multiplier: 1.12,
      });
    }
    if (headcount >= 4) {
      lineItems.push({ label: 'Delivery manager', detail: 'Included free on teams of four or more', range: [0, 0], kind: 'info' });
    }
    assumptions.push(`${headcount} full-time ${headcount === 1 ? 'person' : 'people'} on the team.`);
  } else {
    lineItems.push({ label: `${base.label} base range`, range: [...range] as Range, kind: 'base' });
  }

  // ---- scope answers -------------------------------------------------
  for (const q of service === 'dedicated-teams' ? [] : config.questions) {
    if (q.type === 'select') {
      const chosen = q.options.find((o) => o.value === str(answers, q.id, q.defaultValue));
      if (!chosen) continue;
      if (chosen.factor && chosen.factor !== 1) {
        const before = [...range] as Range;
        range = scale(range, chosen.factor);
        lineItems.push({
          label: q.label,
          detail: chosen.label,
          range: [range[0] - before[0], range[1] - before[1]],
          kind: 'multiplier',
          multiplier: chosen.factor,
        });
      } else if (chosen.add) {
        const addition = scaled(chosen.add);
        range = add(range, addition);
        lineItems.push({ label: q.label, detail: chosen.label, range: addition, kind: 'addition' });
      }
    }

    if (q.type === 'multi') {
      const chosen = list(answers, q.id);
      // Mobile platform question only applies to the mobile app sub-type.
      if (q.id === 'platforms' && service === 'web-development' && subType !== 'mobile-app') continue;
      for (const value of chosen) {
        const opt = q.options.find((o) => o.value === value);
        if (!opt) continue;
        if (opt.add) {
          const addition = scaled(opt.add);
          range = add(range, addition);
          lineItems.push({ label: q.label, detail: opt.label, range: addition, kind: 'addition' });
        } else if (opt.factor && opt.factor !== 1) {
          const before = [...range] as Range;
          range = scale(range, opt.factor);
          lineItems.push({
            label: q.label,
            detail: opt.label,
            range: [range[0] - before[0], range[1] - before[1]],
            kind: 'multiplier',
            multiplier: opt.factor,
          });
        }
      }
    }

    if (q.type === 'number' && q.perUnit) {
      const value = num(answers, q.id, q.defaultValue);
      const free = q.freeUnits ?? 0;
      const extra = Math.max(0, value - free);
      if (extra > 0) {
        const addition: Range = scaled([q.perUnit[0] * extra, q.perUnit[1] * extra]);
        range = add(range, addition);
        lineItems.push({
          label: q.label,
          detail: `${extra} beyond the ${free} included`,
          range: addition,
          kind: 'addition',
        });
      }
    }
  }

  // ---- timeline ------------------------------------------------------
  const beforeTimeline = [...range] as Range;
  range = scale(range, tMultiplier);
  if (tMultiplier !== 1) {
    lineItems.push({
      label: 'Timeline',
      detail: timelineEntry.label,
      range: [range[0] - beforeTimeline[0], range[1] - beforeTimeline[1]],
      kind: 'multiplier',
      multiplier: tMultiplier,
    });
  }

  range = clampRange(tidyRange(range));

  // ---- duration for recurring services -------------------------------
  const durationMonths =
    billing === 'monthly' ? (input.durationMonths ?? config.defaultDurationMonths ?? 1) : undefined;

  const result: EstimateResult = {
    service,
    subType,
    region,
    billing,
    low: range[0],
    likely: Math.round((range[0] + range[1]) / 2),
    high: range[1],
    timeline,
    timelineMultiplier: tMultiplier,
    lineItems,
    assumptions,
    durationMonths,
    totalLow: durationMonths ? range[0] * durationMonths : undefined,
    totalHigh: durationMonths ? range[1] * durationMonths : undefined,
  };

  // ---- service-specific outputs --------------------------------------
  if (service === 'truck-dispatch') {
    result.dispatch = dispatchComparison(subType, answers);
    // The headline range is the weekly fee for the whole fleet, not the base row.
    const d = result.dispatch;
    const low = Math.min(d.percentWeekly[0], d.flatWeekly[0]);
    const high = Math.max(d.percentWeekly[1], d.flatWeekly[1]);
    result.low = Math.round(low);
    result.high = Math.round(high);
    result.likely = Math.round((low + high) / 2);
    assumptions.push(
      `${d.trucks} truck${d.trucks === 1 ? '' : 's'} at ${d.weeklyGrossPerTruck.toLocaleString()} average weekly linehaul each.`,
    );
    assumptions.push('Fee applies to linehaul only, not fuel surcharge or detention.');
  }

  if (service === 'adsense-management') {
    result.adsense = adsenseProjection(answers, range);
    assumptions.push('Uplift assumes placement and density tuning against a held-back control group.');
  }

  if (service === 'ads-optimization') {
    const adSpend = num(answers, 'adSpend', 10000);
    const percentFee: Range = [adSpend * 0.1, adSpend * 0.2];
    result.ads = {
      adSpend,
      percentOfSpendFee: tidyRange(percentFee),
      flatFee: [range[0], range[1]],
      recommended: percentFee[0] < range[0] ? 'percent' : 'flat',
    };
    assumptions.push(`Ad spend of ${adSpend.toLocaleString()} per month is paid to the platforms, not to us.`);
  }

  if (service === 'lead-generation') {
    const leads = num(answers, 'leadsPerMonth', 30);
    if (leads > 0) {
      result.perLead = tidyRange([range[0] / leads, range[1] / leads]);
      assumptions.push(`Based on ${leads} qualified leads per month against the agreed criteria.`);
    }
  }

  if (service === 'auto-engines') {
    const installs = str(answers, 'installation', 'yes') === 'yes';
    const partsShare = installs ? 0.72 : 1;
    const parts: Range = tidyRange([range[0] * partsShare, range[1] * partsShare]);
    const labour: Range = tidyRange([range[0] - parts[0], range[1] - parts[1]]);
    lineItems.push({ label: 'Parts', range: parts, kind: 'info' });
    if (installs) lineItems.push({ label: 'Labour', range: labour, kind: 'info' });
    const vehicle = [str(answers, 'year'), str(answers, 'make'), str(answers, 'model')].filter(Boolean).join(' ');
    if (vehicle) assumptions.push(`Quoted for a ${vehicle}. Nothing is ordered until the VIN match is confirmed.`);
  }

  if (durationMonths && durationMonths > 1) {
    assumptions.push(`Total shown across ${durationMonths} months at the monthly rate.`);
  }

  assumptions.push(`${timelineEntry.label} timeline applies a ${tMultiplier.toFixed(2)}x multiplier.`);

  return result;
}

/** Percentage versus flat weekly, with the break-even gross. Spec section 7. */
export function dispatchComparison(subTypeId: string, answers: Answers): DispatchComparison {
  const model = DISPATCH_MODELS.find((m) => m.id === subTypeId) ?? DISPATCH_MODELS[1];
  const trucks = Math.max(1, num(answers, 'trucks', 1));
  const weeklyGrossPerTruck = Math.max(0, num(answers, 'weeklyGross', 5500));

  const percentPerTruck = weeklyGrossPerTruck * model.percent;
  const percentWeekly: Range = [percentPerTruck * trucks, percentPerTruck * trucks];

  let flatLow = model.flatWeekly[0] * trucks;
  let flatHigh = model.flatWeekly[1] * trucks;

  const afterHours = str(answers, 'afterHours', 'no');
  if (afterHours === 'evenings') {
    flatLow += 60 * trucks;
    flatHigh += 110 * trucks;
  } else if (afterHours === 'full') {
    flatLow += 120 * trucks;
    flatHigh += 220 * trucks;
  }

  // Break-even uses the midpoint of the flat range, per truck.
  const flatMidPerTruck = (model.flatWeekly[0] + model.flatWeekly[1]) / 2;
  const breakEvenWeeklyGross = Math.round(flatMidPerTruck / model.percent);

  const flatMidTotal = (flatLow + flatHigh) / 2;
  const percentTotal = percentWeekly[0];

  return {
    percentRate: model.percent,
    percentWeekly: [Math.round(percentWeekly[0]), Math.round(percentWeekly[1])],
    flatWeekly: [Math.round(flatLow), Math.round(flatHigh)],
    breakEvenWeeklyGross,
    trucks,
    weeklyGrossPerTruck,
    cheaperModel:
      Math.abs(percentTotal - flatMidTotal) < 1 ? 'equal' : percentTotal < flatMidTotal ? 'percent' : 'flat',
  };
}

/** Projected publisher revenue and our fee. Spec section 7. */
export function adsenseProjection(answers: Answers, feeRange: Range): AdSenseProjection {
  const pageviews = Math.max(0, num(answers, 'pageviews', 500000));
  const currentRpm = Math.max(0, num(answers, 'currentRpm', 4));
  const currentMonthlyRevenue = (pageviews / 1000) * currentRpm;

  // Conservative to optimistic uplift from placement and density tuning.
  const upliftLow = 0.2;
  const upliftHigh = 0.6;

  const projected: Range = [
    currentMonthlyRevenue * (1 + upliftLow),
    currentMonthlyRevenue * (1 + upliftHigh),
  ];
  const uplift: Range = [projected[0] - currentMonthlyRevenue, projected[1] - currentMonthlyRevenue];

  // Fee is the lower of the flat rate and 15-30% of the uplift.
  const upliftFee: Range = [uplift[0] * 0.15, uplift[1] * 0.3];
  const ourFee: Range = [Math.min(feeRange[0], upliftFee[0]), Math.min(feeRange[1], upliftFee[1])];

  return {
    currentMonthlyRevenue: Math.round(currentMonthlyRevenue),
    projectedMonthlyRevenue: tidyRange(projected),
    upliftRange: tidyRange(uplift),
    ourFee: tidyRange([Math.max(ourFee[0], 0), Math.max(ourFee[1], 0)]),
  };
}

/** Default answers for a service, used to seed the wizard. */
export function defaultAnswers(config: EstimateServiceConfig): Answers {
  const answers: Answers = {};
  for (const q of config.questions) {
    answers[q.id] = q.defaultValue as AnswerValue;
  }
  return answers;
}

export function questionApplies(
  config: EstimateServiceConfig,
  q: Question,
  subType: string,
): boolean {
  if (config.service === 'web-development' && q.id === 'platforms') return subType === 'mobile-app';
  if (config.service === 'web-development' && q.id === 'pages') return subType !== 'landing-page';
  return true;
}

export { questionById };
