'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, GripVertical, Search, TrendingUp } from 'lucide-react';
import { DISPATCH_MODELS, DISPATCH_DISCLAIMER, PRICE_TABLE_MAP, UNIT_LABEL, dispatchPercentLabel } from '@/data/pricing';
import { MONTHLY_RESOURCES, SUPPORT_PLANS } from '@/data/rates';
import { SERVICE_MAP } from '@/data/services';
import { MARKETPLACE_ITEMS } from '@/data/catalog';
import { TemplatePreview } from './template-preview';
import { Minus, Plus } from 'lucide-react';
import type { InteractiveKind } from '@/data/services';
import { useRegion } from './providers';
import { formatMoney, formatNumber, formatRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ButtonLink, NoteBox } from './ui';

export function ServiceInteractive({ kind, slug }: { kind: InteractiveKind; slug: string }) {
  switch (kind) {
    case 'template-gallery':
      return <TemplateGallery />;
    case 'cpl-calculator':
      return <CplCalculator />;
    case 'creative-slider':
      return <CreativeSlider />;
    case 'revenue-estimator':
      return <RevenueEstimator />;
    case 'dispatch-fee':
      return <DispatchFeeCalculator />;
    case 'coverage-builder':
      return <CoverageBuilder />;
    case 'engine-finder':
      return <EngineFinder />;
    case 'ballpark':
      return <BallparkPicker slug={slug} />;
    case 'team-builder':
      return <TeamBuilder />;
    default:
      return (
        <ButtonLink href={`/estimate?service=${slug}`} icon={ArrowRight}>
          Open the calculator
        </ButtonLink>
      );
  }
}

/* ================================================================== */
/*  1. Template and niche gallery                                      */
/* ================================================================== */

const TEMPLATES = MARKETPLACE_ITEMS.filter((m) => m.preview);

function TemplateGallery() {
  const { code } = useRegion();
  const [active, setActive] = useState(TEMPLATES[0].slug);
  const template = TEMPLATES.find((t) => t.slug === active)!;
  const row =
    template.priceService && template.priceRow
      ? PRICE_TABLE_MAP[template.priceService]?.rows.find((r) => r.id === template.priceRow)
      : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-8">
      <div className="no-scrollbar flex gap-2 overflow-x-auto lg:max-h-[34rem] lg:flex-col lg:overflow-y-auto lg:pr-1">
        {TEMPLATES.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActive(t.slug)}
            aria-pressed={t.slug === active}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors lg:w-full',
              t.slug === active ? 'border-svc bg-svc/10' : 'border-line hover:border-svc/40',
            )}
          >
            <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: t.accentHex }} aria-hidden />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{t.name.replace(/ Template| Landing Page/g, '')}</span>
              <span className="block truncate text-xs text-fg-subtle">{t.tags[0]}</span>
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={template.slug}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <TemplatePreview config={template.preview!} accent={template.accentHex} className="shadow-lift" />

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-md">
            <p className="font-display text-lg font-semibold">{template.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">{template.summary}</p>
            {template.pages && (
              <p className="mt-2 text-xs text-fg-subtle">{template.pages.length} pages · {template.pages.slice(0, 4).join(', ')}…</p>
            )}
          </div>
          <div className="text-right">
            {row?.values[code] && (
              <p className="font-display text-lg font-semibold text-svc">
                {formatRange(row.values[code], code, { compact: true })}
              </p>
            )}
            <Link
              href={`/marketplace/${template.slug}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-svc hover:underline"
            >
              View this template
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  2. Cost per lead calculator                                        */
/* ================================================================== */

function CplCalculator() {
  // Lead generation is priced by support hours from the rate card, never by lead count.
  const plan = SUPPORT_PLANS.find((p) => p.id === 'leadgen-support')!;
  const included = plan.hours ?? 40;
  const extraRate = plan.from / included; // the plan rate per hour
  const [hours, setHours] = useState(included);
  const [dealValue, setDealValue] = useState(3000);

  const fee = plan.from + Math.max(0, hours - included) * extraRate;
  const breakEvenDeals = dealValue > 0 ? fee / dealValue : 0;
  const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6 rounded-2xl border border-line bg-bg-soft p-6">
        <Slider
          id="lg-hours"
          label="Research and outreach-support hours per month"
          value={hours}
          min={included}
          max={160}
          step={10}
          onChange={setHours}
          display={`${hours} h`}
        />
        <Slider
          id="lg-deal"
          label="Your average deal value"
          value={dealValue}
          min={500}
          max={50000}
          step={500}
          onChange={setDealValue}
          display={usd(dealValue)}
        />
      </div>

      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6" aria-live="polite">
        <dl className="space-y-5">
          <Metric label="Monthly fee (USD)" value={usd(fee)} big />
          <Metric label="Included" value={`${included} h for ${usd(plan.from)}; extra hours ${usd(extraRate)}/h with your approval`} />
          <Metric label="Deals a month to cover the fee" value={breakEvenDeals.toFixed(1)} />
        </dl>
        <ButtonLink href="/contact?service=lead-generation" variant="service" icon={ArrowRight} className="mt-6 w-full">
          Talk to a Specialist
        </ButtonLink>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-fg-subtle">
          We do not guarantee lead counts or revenue. Paid data and outreach tools are separate. The break-even figure
          uses your own deal value.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  3. Before and after creative slider                                */
/* ================================================================== */

const CREATIVE_METRICS = {
  before: [
    { label: 'Click-through rate', value: '0.68%' },
    { label: 'Cost per acquisition', value: '$412' },
    { label: 'Hook rate, 3 second', value: '11%' },
    { label: 'Frequency', value: '4.9' },
  ],
  after: [
    { label: 'Click-through rate', value: '2.14%' },
    { label: 'Cost per acquisition', value: '$168' },
    { label: 'Hook rate, 3 second', value: '31%' },
    { label: 'Frequency', value: '1.8' },
  ],
};

function CreativeSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-soft">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          {/* after (underneath, revealed from the right) */}
          <CreativePanel variant="after" />
          {/* before (clipped) */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
            <div className="h-full" style={{ width: `${(100 / Math.max(position, 1)) * 100}%` }}>
              <CreativePanel variant="before" />
            </div>
          </div>

          {/* handle */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-svc"
            style={{ left: `${position}%` }}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-svc bg-bg shadow-lift">
              <GripVertical className="h-4 w-4 text-svc" />
            </span>
          </div>

          <label htmlFor="creative-slider" className="sr-only">
            Drag to compare the creative before and after
          </label>
          <input
            id="creative-slider"
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <MetricPanel title="Before" metrics={CREATIVE_METRICS.before} tone="muted" />
        <MetricPanel title="After" metrics={CREATIVE_METRICS.after} tone="svc" />
      </div>
      <p className="mt-3 text-xs text-fg-subtle">
        <strong className="text-fg">Illustrative example — not a client result.</strong> The figures show the kind of change a tracking rebuild and creative refresh aim for; they are not from a client account and are not guaranteed.
      </p>
    </div>
  );
}

function CreativePanel({ variant }: { variant: 'before' | 'after' }) {
  const before = variant === 'before';
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-between p-6 sm:p-9',
        before ? 'bg-bg-elev' : 'bg-gradient-to-br from-svc/20 via-bg-elev to-bg-elev',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            before ? 'bg-fg/10 text-fg-muted' : 'bg-svc text-bg',
          )}
        >
          {before ? 'Before' : 'After'}
        </span>
        <span className="text-xs text-fg-subtle">1080 x 1080</span>
      </div>

      <div className="max-w-md">
        <p
          className={cn(
            'font-display leading-tight',
            before ? 'text-xl text-fg-muted sm:text-2xl' : 'text-2xl font-semibold text-fg sm:text-4xl',
          )}
        >
          {before ? 'Professional services for your business needs' : 'Your ad account is paying for clicks that never convert'}
        </p>
        <p className="mt-2 text-xs text-fg-subtle sm:text-sm">
          {before ? 'Learn more about what we offer' : 'Free audit shows exactly where the budget leaks'}
        </p>
      </div>

      <div
        className={cn(
          'h-9 w-36 rounded-lg',
          before ? 'border border-line bg-bg' : 'bg-svc',
        )}
        aria-hidden
      />
    </div>
  );
}

/* ================================================================== */
/*  4. AdSense revenue estimator                                       */
/* ================================================================== */

function RevenueEstimator() {
  // AdSense management is a flat plan per site from the rate card. No revenue projections.
  const plan = SUPPORT_PLANS.find((p) => p.id === 'adsense-management')!;
  const [sites, setSites] = useState(1);
  const fee = plan.from * sites;
  const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6 rounded-2xl border border-line bg-bg-soft p-6">
        <Slider id="as-sites" label="Sites to manage" value={sites} min={1} max={20} step={1} onChange={setSites} display={`${sites}`} />
        <p className="text-sm text-fg-muted">{plan.scope}, per site.</p>
      </div>
      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6" aria-live="polite">
        <dl className="space-y-5">
          <Metric label="Monthly fee (USD)" value={usd(fee)} big />
          <Metric label="Per site" value={`${usd(plan.from)} a month`} />
        </dl>
        <ButtonLink href="/contact?service=adsense-management" variant="service" icon={ArrowRight} className="mt-6 w-full">
          Talk to a Specialist
        </ButtonLink>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-fg-subtle">
          We do not guarantee AdSense approval or revenue increases. Google sets AdSense policies and revenue share.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  5. Dispatch fee calculator                                         */
/* ================================================================== */

export function DispatchFeeCalculator({ compact = false }: { compact?: boolean }) {
  const { code } = useRegion();
  const [equipment, setEquipment] = useState<(typeof DISPATCH_MODELS)[number]['id']>('semi');
  const [trucks, setTrucks] = useState(1);
  const [gross, setGross] = useState(9000);
  const model = DISPATCH_MODELS.find((m) => m.id === equipment)!;
  const typical = model.typicalGross;
  const weekly: [number, number] = [gross * model.percent[0] * trucks, gross * model.percent[1] * trucks];
  const monthly: [number, number] = [(weekly[0] * 52) / 12, (weekly[1] * 52) / 12];
  const keep: [number, number] = [gross * trucks - weekly[1], gross * trucks - weekly[0]];

  return (
    <div className={cn('grid gap-6', compact ? '' : 'lg:grid-cols-[1fr_1fr]')}>
      <div className="space-y-6 rounded-2xl border border-line bg-bg-soft p-6">
        <div>
          <span className="mb-2.5 block text-sm font-medium">Equipment</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {DISPATCH_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setEquipment(m.id);
                  setGross(Math.round((m.typicalGross[0] + m.typicalGross[1]) / 2));
                }}
                aria-pressed={equipment === m.id}
                className={cn(
                  'rounded-xl border p-3.5 text-left text-sm transition-colors',
                  equipment === m.id ? 'border-svc bg-svc/10' : 'border-line hover:border-svc/40',
                )}
              >
                <span className="block font-medium">{m.short}</span>
                <span className="block text-xs text-fg-subtle">{dispatchPercentLabel(m.percent)} of weekly gross</span>
              </button>
            ))}
          </div>
        </div>

        <Slider id="disp-trucks" label="Trucks" value={trucks} min={1} max={30} step={1} onChange={setTrucks} display={String(trucks)} />
        <Slider
          id="disp-gross"
          label="Average weekly gross per truck"
          value={gross}
          min={1000}
          max={20000}
          step={100}
          onChange={setGross}
          display={formatMoney(gross, code)}
        />
        <p className="-mt-3 text-xs text-fg-subtle">
          Typical OTR gross for a {model.short.toLowerCase()}:{' '}
          {formatRange(typical, code)} per week.
        </p>
      </div>

      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-success/45 bg-success/10 p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              {dispatchPercentLabel(model.percent)} of gross
            </p>
            <p className="mt-1.5 font-display text-2xl font-semibold">{formatRange(weekly, code)}</p>
            <p className="text-xs text-fg-subtle">per week, all trucks</p>
          </div>
          <div className="rounded-xl border border-line bg-bg p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">Monthly (average)</p>
            <p className="mt-1.5 font-display text-2xl font-semibold">{formatRange(monthly, code)}</p>
            <p className="text-xs text-fg-subtle">per month, all trucks</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-line bg-bg p-4">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-fg-subtle">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            You keep of weekly gross
          </p>
          <p className="mt-1.5 font-display text-2xl font-semibold text-svc">{formatRange(keep, code)}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs leading-relaxed text-fg-muted">
            <Check className="h-3.5 w-3.5" aria-hidden /> No flat rate, no setup fee, no monthly subscription.
          </p>
        </div>

        <NoteBox tone="warn" className="mt-4 text-xs">
          {DISPATCH_DISCLAIMER} Load search, rate negotiation, broker packets and paperwork are included.
        </NoteBox>

        {!compact && (
          <ButtonLink href="/estimate?service=truck-dispatch" variant="service" icon={ArrowRight} className="mt-5 w-full">
            Build a full estimate
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  6. Test coverage checklist builder                                 */
/* ================================================================== */

const COVERAGE_ITEMS = [
  { id: 'smoke', label: 'Smoke suite on every deploy', weight: 8, tier: 'Essential' },
  { id: 'auth', label: 'Signup, login and password reset', weight: 12, tier: 'Essential' },
  { id: 'checkout', label: 'Checkout or primary conversion path', weight: 15, tier: 'Essential' },
  { id: 'permissions', label: 'Roles and permission boundaries', weight: 10, tier: 'Essential' },
  { id: 'api', label: 'API contract and schema tests', weight: 9, tier: 'Recommended' },
  { id: 'regression', label: 'Regression pack of past defects', weight: 12, tier: 'Recommended' },
  { id: 'mobile', label: 'Real device mobile coverage', weight: 8, tier: 'Recommended' },
  { id: 'a11y', label: 'Accessibility to WCAG 2.1 AA', weight: 7, tier: 'Recommended' },
  { id: 'load', label: 'Load and soak testing', weight: 9, tier: 'Advanced' },
  { id: 'security', label: 'OWASP Top 10 application review', weight: 10, tier: 'Advanced' },
];

function CoverageBuilder() {
  const [selected, setSelected] = useState<string[]>(['smoke', 'auth', 'checkout']);

  const score = useMemo(
    () => COVERAGE_ITEMS.filter((i) => selected.includes(i.id)).reduce((sum, i) => sum + i.weight, 0),
    [selected],
  );

  const verdict =
    score >= 80 ? 'Strong' : score >= 55 ? 'Reasonable' : score >= 30 ? 'Thin' : 'At risk';

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <fieldset className="min-w-0 rounded-2xl border border-line bg-bg-soft p-6">
        <legend className="px-1 text-sm font-medium">Tick what you already have</legend>
        <ul className="mt-3 space-y-1.5">
          {COVERAGE_ITEMS.map((item) => {
            const on = selected.includes(item.id);
            return (
              <li key={item.id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                    on ? 'border-svc/50 bg-svc/10' : 'border-transparent hover:bg-bg-elev',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 accent-[rgb(var(--svc))]"
                  />
                  <span className="flex-1 text-sm">{item.label}</span>
                  <span className="text-[0.6875rem] text-fg-subtle">{item.tier}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
        <p className="text-xs uppercase tracking-wider text-fg-subtle">Coverage score</p>
        <p className="mt-1 font-display text-5xl font-semibold text-svc">{score}</p>
        <p className="mt-1 text-sm font-medium">{verdict}</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
          <motion.div
            className="h-full rounded-full bg-svc"
            animate={{ width: `${score}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        </div>

        <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
          Biggest gaps
        </p>
        <ul className="mt-2 space-y-1.5">
          {COVERAGE_ITEMS.filter((i) => !selected.includes(i.id))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3)
            .map((i) => (
              <li key={i.id} className="text-sm text-fg-muted">
                {i.label}
              </li>
            ))}
          {selected.length === COVERAGE_ITEMS.length && (
            <li className="text-sm text-success">Nothing missing. We would audit depth rather than breadth.</li>
          )}
        </ul>

        <ButtonLink href="/estimate?service=qa-testing" variant="service" icon={ArrowRight} className="mt-6 w-full">
          Price the missing coverage
        </ButtonLink>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  7. Engine finder                                                   */
/* ================================================================== */

const ENGINE_TYPES = [
  { id: 'used', label: 'Used', row: 'used' },
  { id: 'reman', label: 'Remanufactured', row: 'reman' },
  { id: 'crate', label: 'Crate or European', row: 'crate-euro' },
  { id: 'hd', label: 'Heavy-duty diesel', row: 'hd-diesel' },
];

function EngineFinder() {
  const { code } = useRegion();
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('used');
  const [searched, setSearched] = useState(false);

  const row = PRICE_TABLE_MAP['auto-engines'].rows.find(
    (r) => r.id === ENGINE_TYPES.find((t) => t.id === type)!.row,
  )!;
  const range = row.values[code];
  const ready = year.trim() && make.trim() && model.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form
        className="rounded-2xl border border-line bg-bg-soft p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="ef-year" label="Year" value={year} onChange={setYear} placeholder="2016" />
          <Field id="ef-make" label="Make" value={make} onChange={setMake} placeholder="Ford" />
          <Field id="ef-model" label="Model" value={model} onChange={setModel} placeholder="Transit 350" />
        </div>

        <div className="mt-5">
          <span className="mb-2.5 block text-sm font-medium">Engine type</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {ENGINE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                aria-pressed={type === t.id}
                className={cn(
                  'rounded-xl border p-3 text-left text-sm transition-colors',
                  type === t.id ? 'border-svc bg-svc/10' : 'border-line hover:border-svc/40',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-svc font-semibold text-bg transition-all disabled:opacity-40"
        >
          <Search className="h-4 w-4" aria-hidden />
          Find my engine
        </button>
      </form>

      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
        {searched && ready ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              {year} {make} {model}
            </p>
            <p className="mt-1 text-sm font-medium">{row.label}, supplied and installed</p>
            <p className="mt-3 font-display text-3xl font-semibold text-svc">
              {formatRange(range, code, { plus: row.plus?.[code] })}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-fg-muted">
              {['VIN and casting number confirmed before ordering', 'Compression and leak-down data supplied', 'Warranty registered at install', 'Core return collected and reconciled'].map((x) => (
                <li key={x} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={`/estimate?service=auto-engines&sub=${type === 'hd' ? 'hd-diesel' : type}`}
              variant="service"
              icon={ArrowRight}
              className="mt-6 w-full"
            >
              Get a detailed estimate
            </ButtonLink>
          </motion.div>
        ) : (
          <div className="flex h-full flex-col justify-center text-center">
            <Search className="mx-auto h-8 w-8 text-svc/40" aria-hidden />
            <p className="mt-4 text-sm text-fg-muted">
              Enter the year, make and model to see the price range.
            </p>
            <p className="mt-2 text-xs text-fg-subtle">
              We match by VIN before anything is ordered, so the range here is a guide rather than a quote.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  8. Project ballpark (enterprise services)                          */
/* ================================================================== */

function BallparkPicker({ slug }: { slug: string }) {
  const { code, region } = useRegion();
  const table = PRICE_TABLE_MAP[slug];
  const service = SERVICE_MAP[slug];
  const [rowId, setRowId] = useState(table?.rows[0]?.id ?? '');
  if (!table) return null;
  const row = table.rows.find((r) => r.id === rowId) ?? table.rows[0];
  const value = row.values[code];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-2 sm:grid-cols-2">
        {table.rows.map((r) => (
          <button
            key={r.id}
            onClick={() => setRowId(r.id)}
            aria-pressed={r.id === row.id}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              r.id === row.id ? 'border-svc bg-svc/10' : 'border-line bg-bg-soft hover:border-svc/40',
            )}
          >
            <span className="block text-sm font-medium">{r.label}</span>
            {r.note && <span className="mt-0.5 block text-xs text-fg-subtle">{r.note}</span>}
          </button>
        ))}
      </div>

      <motion.div
        key={row.id + code}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-svc/25 bg-svc/5 p-6"
      >
        <p className="text-xs uppercase tracking-wider text-fg-subtle">
          {row.label} · {region.currency}
        </p>
        <p className="mt-2 font-display text-3xl font-semibold text-svc">
          {formatRange(value, code, { plus: row.plus?.[code], compact: true })}
        </p>
        <p className="mt-1 text-sm text-fg-muted">{UNIT_LABEL[row.unit]}</p>
        {service?.timelines && (
          <p className="mt-5 border-t border-svc/20 pt-4 text-xs leading-relaxed text-fg-subtle">
            Typical timelines: {service.timelines}
          </p>
        )}
        <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
          Ballpark only. Scope, integrations, data readiness and compliance move the figure, and the full
          calculator asks about each of them.
        </p>
        <ButtonLink href={`/estimate?service=${slug}`} variant="service" icon={ArrowRight} className="mt-6 w-full">
          Get a detailed estimate
        </ButtonLink>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  9. Team builder (dedicated teams)                                  */
/* ================================================================== */

function TeamBuilder() {
  // Every price comes from the owner rate card (src/data/rates.ts), one allocation = up to 160 hours a month.
  const [counts, setCounts] = useState<Record<string, number>>({ 'dev-middle': 1 });
  const [months, setMonths] = useState(3);

  const lines = MONTHLY_RESOURCES.filter((r) => (counts[r.id] ?? 0) > 0).map((r) => ({
    ...r,
    n: counts[r.id],
    subtotal: r.price * counts[r.id],
  }));
  const headcount = lines.reduce((a, l) => a + l.n, 0);
  const monthly = lines.reduce((a, l) => a + l.subtotal, 0);
  const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
  const roles = lines.map((l) => `${l.n}x ${l.label}`).join(', ');

  const bump = (id: string, d: number) =>
    setCounts((c) => ({ ...c, [id]: Math.max(0, Math.min(20, (c[id] ?? 0) + d)) }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-2xl border border-line bg-bg-soft p-6">
        <ul className="divide-y divide-line">
          {MONTHLY_RESOURCES.map((role) => {
            const n = counts[role.id] ?? 0;
            return (
              <li key={role.id} className="flex items-center justify-between gap-4 py-2.5">
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{role.label}</span>
                  <span className="block text-xs text-fg-subtle">{usd(role.price)} USD per month · up to 160 h</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => bump(role.id, -1)}
                    aria-label={`Remove one ${role.label}`}
                    disabled={n === 0}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-line hover:border-svc/50 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-display font-semibold" aria-live="polite" aria-label={`${n} ${role.label}`}>
                    {n}
                  </span>
                  <button
                    type="button"
                    onClick={() => bump(role.id, 1)}
                    aria-label={`Add one ${role.label}`}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-line hover:border-svc/50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <Slider
            id="team-months"
            label="Engagement length"
            value={months}
            min={1}
            max={24}
            step={1}
            onChange={setMonths}
            display={`${months} month${months === 1 ? '' : 's'}`}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6" aria-live="polite">
        <p className="text-xs uppercase tracking-wider text-fg-subtle">
          {headcount} {headcount === 1 ? 'person' : 'people'} · USD
        </p>
        <p className="mt-2 font-display text-3xl font-semibold text-svc">{headcount ? usd(monthly) : 'Add a role'}</p>
        <p className="text-sm text-fg-muted">per month, billed monthly in advance</p>

        {headcount > 0 && (
          <table className="mt-5 w-full border-t border-svc/20 text-sm">
            <caption className="sr-only">Monthly breakdown</caption>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td className="py-1.5 text-fg-muted">
                    {l.n} x {l.label}
                    <span className="block text-xs text-fg-subtle">{l.n * 160} h max</span>
                  </td>
                  <td className="py-1.5 text-right font-medium tabular-nums">{usd(l.subtotal)}</td>
                </tr>
              ))}
              <tr className="border-t border-svc/20 font-semibold">
                <td className="py-1.5">Total per month</td>
                <td className="py-1.5 text-right tabular-nums">{usd(monthly)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-fg-muted">Across {months} months</td>
                <td className="py-1.5 text-right tabular-nums">{usd(monthly * months)}</td>
              </tr>
            </tbody>
          </table>
        )}
        <ul className="mt-5 space-y-1.5 text-xs text-fg-subtle">
          <li>Each person is dedicated to your work for up to 160 hours a month.</li>
          <li>Extra hours only with your written approval, at the role&apos;s hourly rate.</li>
          <li>A project manager is not included; quoted separately if needed.</li>
          <li>Resize with 30 days notice. Prices exclude taxes and third-party tools.</li>
        </ul>
        <ButtonLink
          href={`/contact?service=dedicated-teams&roles=${encodeURIComponent(roles)}&months=${months}&estimate_likely=${monthly}&estimate_billing=monthly`}
          variant="service"
          icon={ArrowRight}
          className="mt-6 w-full"
        >
          Ask about this team
        </ButtonLink>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Shared bits                                                        */
/* ================================================================== */

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        {label}
        <span className="font-display text-lg font-semibold text-svc">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 w-full accent-[rgb(var(--svc))]"
      />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-svc"
      />
    </div>
  );
}

function Metric({
  label,
  value,
  big,
  tone,
}: {
  label: string;
  value: string;
  big?: boolean;
  tone?: 'good' | 'bad' | 'neutral';
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-fg-muted">{label}</dt>
      <dd
        className={cn(
          'text-right font-display font-semibold',
          big ? 'text-xl' : 'text-base',
          tone === 'good' && 'text-success',
          tone === 'bad' && 'text-danger',
          !tone && 'text-fg',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function MetricPanel({
  title,
  metrics,
  tone,
}: {
  title: string;
  metrics: { label: string; value: string }[];
  tone: 'muted' | 'svc';
}) {
  return (
    <div className={cn('rounded-xl border p-5', tone === 'svc' ? 'border-svc/30 bg-svc/5' : 'border-line bg-bg-soft')}>
      <p className={cn('text-xs font-semibold uppercase tracking-wider', tone === 'svc' ? 'text-svc' : 'text-fg-subtle')}>
        {title}
      </p>
      <dl className="mt-3 space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-fg-subtle">{m.label}</dt>
            <dd className="font-medium">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
