'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileText,
  Globe,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { SERVICES } from '@/data/services';
import { REGIONS, getRegion, type RegionCode } from '@/data/regions';
import {
  ESTIMATE_CONFIG_MAP,
  TIMELINE_MULTIPLIERS,
  ESTIMATE_DISCLAIMER,
  type TimelineId,
  type Question,
} from '@/data/estimate-config';
import { SITE } from '@/data/site';
import { DISPATCH_MODELS } from '@/data/pricing';
import { computeEstimate, defaultAnswers, questionApplies, type Answers, type EstimateResult } from '@/lib/estimate';
import { formatMoney, formatNumber, formatRange } from '@/lib/format';
import { trackEstimateStep } from '@/lib/analytics';
import { submitForm, HONEYPOT_FIELD, CONSENT_WORDING } from '@/lib/forms';
import { useRegion } from '@/components/providers';
import { Button, ButtonLink, Container, NoteBox, RangeBar } from '@/components/ui';
import { ConsentCheckbox, Field, Honeypot, Select, TextArea } from '@/components/forms';
import { cn } from '@/lib/utils';
import { buildEstimateDocument } from './print';

const STEPS = [
  'Region',
  'Service',
  'Sub-type',
  'Scope',
  'Timeline',
  'Your details',
  'Your range',
] as const;

export function EstimateWizard() {
  const params = useSearchParams();
  const { code: headerRegion, setRegion } = useRegion();

  const [step, setStep] = useState(0);
  const [region, setLocalRegion] = useState<RegionCode>(headerRegion);
  const [serviceSlug, setServiceSlug] = useState(params.get('service') ?? '');
  const [subType, setSubType] = useState(params.get('sub') ?? '');
  const [answers, setAnswers] = useState<Answers>({});
  const [timeline, setTimeline] = useState<TimelineId>('standard');
  const [duration, setDuration] = useState<number | undefined>(undefined);

  const [contact, setContact] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const config = serviceSlug ? ESTIMATE_CONFIG_MAP[serviceSlug] : undefined;
  const service = SERVICES.find((s) => s.slug === serviceSlug);

  // Keep the calculator and the header switcher in sync.
  useEffect(() => setLocalRegion(headerRegion), [headerRegion]);

  // Seed answers whenever the service changes.
  useEffect(() => {
    if (!config) return;
    setAnswers(defaultAnswers(config));
    setDuration(config.defaultDurationMonths);
    if (!config.subTypes.some((s) => s.id === subType)) setSubType(config.subTypes[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  // Dispatch: start the gross at the typical figure for the chosen equipment.
  useEffect(() => {
    if (serviceSlug !== 'truck-dispatch') return;
    const model = DISPATCH_MODELS.find((m) => m.id === subType);
    if (!model) return;
    const mid = Math.round((model.typicalGross[0] + model.typicalGross[1]) / 2);
    setAnswers((a) => ({ ...a, weeklyGross: mid }));
  }, [serviceSlug, subType]);

  // One analytics event per step, so drop-off is measurable.
  useEffect(() => {
    trackEstimateStep(step + 1, STEPS[step], { service: serviceSlug || 'none', region });
  }, [step, serviceSlug, region]);

  const result: EstimateResult | null = useMemo(() => {
    if (!config || !subType) return null;
    return computeEstimate({ service: serviceSlug, subType, region, answers, timeline, durationMonths: duration });
  }, [config, serviceSlug, subType, region, answers, timeline, duration]);

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return Boolean(region);
      case 1:
        return Boolean(serviceSlug && config);
      case 2:
        return Boolean(subType);
      case 3:
        return requiredAnswered(config?.questions ?? [], answers, subType, serviceSlug);
      case 4:
        return Boolean(timeline);
      case 5:
        return Boolean(contact.name && contact.email && consent);
      default:
        return false;
    }
  })();

  const next = async () => {
    if (step === 5) {
      await handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = async () => {
    setSending(true);
    setSubmitError('');
    const res = await submitForm({
      form: 'estimate',
      fields: {
        ...contact,
        consent,
        [HONEYPOT_FIELD]: honey,
        region,
        service: serviceSlug,
        subType,
        timeline,
        durationMonths: duration,
        answers,
        result: result
          ? { low: result.low, likely: result.likely, high: result.high, billing: result.billing }
          : null,
      },
    });
    setSending(false);
    if (res.ok) {
      setSubmitted(true);
      setStep(6);
    } else {
      // The range is still worth showing even if the lead did not reach the CRM.
      setSubmitError(res.message);
      setStep(6);
    }
  };

  const reset = () => {
    setStep(0);
    setServiceSlug('');
    setSubType('');
    setAnswers({});
    setTimeline('standard');
    setSubmitted(false);
    setSubmitError('');
  };

  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-4xl">
        <Stepper step={step} onJump={(i) => i < step && setStep(i)} />

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-bg-elev">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-9"
            >
              {step === 0 && <StepRegion region={region} onChange={(r) => { setLocalRegion(r); setRegion(r); }} />}

              {step === 1 && <StepService value={serviceSlug} onChange={setServiceSlug} region={region} />}

              {step === 2 && config && (
                <StepSubType config={config} value={subType} onChange={setSubType} region={region} />
              )}

              {step === 3 && config && (
                <StepScope
                  config={config}
                  subType={subType}
                  answers={answers}
                  onChange={setAnswers}
                  region={region}
                />
              )}

              {step === 4 && (
                <StepTimeline
                  timeline={timeline}
                  onChange={setTimeline}
                  duration={duration}
                  onDuration={setDuration}
                  durationOptions={config?.durationOptions}
                  billing={config?.subTypes.find((st) => st.id === subType)?.billingOverride ?? config?.billing ?? 'one-time'}
                />
              )}

              {step === 5 && (
                <StepContact
                  contact={contact}
                  onChange={setContact}
                  consent={consent}
                  onConsent={setConsent}
                  honey={honey}
                  onHoney={setHoney}
                  result={result}
                  region={region}
                />
              )}

              {step === 6 && result && (
                <StepResult
                  result={result}
                  region={region}
                  submitted={submitted}
                  submitError={submitError}
                  contact={contact}
                  answers={answers}
                  onReset={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {step < 6 && (
            <div className="flex items-center justify-between gap-4 border-t border-line bg-bg-soft px-6 py-5 sm:px-9">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                icon={ArrowLeft}
              >
                Back
              </Button>

              <div className="flex items-center gap-4">
                {step === 3 && result && !result.unavailable && (
                  <span className="hidden text-sm text-fg-subtle sm:block">
                    Running total{' '}
                    <span className="font-display font-semibold text-accent">
                      {formatRange([result.low, result.high], region, { compact: true })}
                    </span>
                  </span>
                )}
                <Button onClick={next} disabled={!canAdvance || sending} icon={sending ? Loader2 : ArrowRight} iconRight>
                  {step === 5 ? (sending ? 'Calculating' : 'See my range') : 'Continue'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-fg-subtle">{ESTIMATE_DISCLAIMER}</p>
      </div>
    </Container>
  );
}

/* ================================================================== */
/*  Stepper                                                            */
/* ================================================================== */

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Estimate progress">
      <ol className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex-1">
              <button
                onClick={() => onJump(i)}
                disabled={i >= step}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'group flex w-full min-w-[5.5rem] flex-col gap-2 rounded-lg px-1 pb-1 pt-2 text-left transition-colors',
                  i < step && 'cursor-pointer',
                )}
              >
                <span
                  className={cn(
                    'h-1 w-full rounded-full transition-colors',
                    done ? 'bg-accent' : current ? 'bg-accent/50' : 'bg-line',
                  )}
                />
                <span className="flex items-center gap-1.5">
                  {done ? (
                    <Check className="h-3 w-3 text-accent" aria-hidden />
                  ) : (
                    <span className={cn('font-mono text-[0.625rem]', current ? 'text-accent' : 'text-fg-subtle')}>
                      {i + 1}
                    </span>
                  )}
                  <span
                    className={cn(
                      'whitespace-nowrap text-xs font-medium',
                      current ? 'text-fg' : done ? 'text-fg-muted' : 'text-fg-subtle',
                    )}
                  >
                    {label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepHeading({ title, body }: { title: string; body?: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-display-sm">{title}</h2>
      {body && <p className="mt-3 leading-relaxed text-fg-muted">{body}</p>}
    </div>
  );
}

/* ================================================================== */
/*  1. Region                                                          */
/* ================================================================== */

function StepRegion({ region, onChange }: { region: RegionCode; onChange: (r: RegionCode) => void }) {
  return (
    <div>
      <StepHeading
        title="Where are you based?"
        body="Each region has its own authored price table. We never convert currency live, because a converted figure implies a precision we do not have."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((r) => (
          <button
            key={r.code}
            onClick={() => onChange(r.code)}
            aria-pressed={r.code === region}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
              r.code === region ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
            )}
          >
            <span className="text-2xl" aria-hidden>
              {r.flag}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{r.label}</span>
              <span className="block text-xs text-fg-subtle">Prices in {r.currency}</span>
            </span>
            {r.code === region && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />}
          </button>
        ))}
      </div>
      <NoteBox className="mt-6">
        <span className="flex items-start gap-2">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          Your choice here also updates the switcher in the header, so pricing stays consistent everywhere on
          the site.
        </span>
      </NoteBox>
    </div>
  );
}

/* ================================================================== */
/*  2. Service                                                         */
/* ================================================================== */

function StepService({
  value,
  onChange,
  region,
}: {
  value: string;
  onChange: (v: string) => void;
  region: RegionCode;
}) {
  return (
    <div>
      <StepHeading title="Which service?" body="Pick the closest fit. You can run the calculator again for another line." />
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const config = ESTIMATE_CONFIG_MAP[s.slug];
          const available = config?.regions.includes(region);
          return (
            <button
              key={s.slug}
              onClick={() => onChange(s.slug)}
              aria-pressed={s.slug === value}
              className={cn(
                'rounded-xl border p-5 text-left transition-colors',
                s.slug === value ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
              )}
              style={{ ['--svc' as string]: s.accent }}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-display text-base font-semibold">{s.name}</span>
                {s.slug === value && <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />}
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-fg-muted">{s.summary}</span>
              {!available && (
                <span className="mt-2 block text-[0.6875rem] text-warn">
                  Not currently offered in this region
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  3. Sub-type                                                        */
/* ================================================================== */

function StepSubType({
  config,
  value,
  onChange,
  region,
}: {
  config: NonNullable<ReturnType<typeof getConfig>>;
  value: string;
  onChange: (v: string) => void;
  region: RegionCode;
}) {
  return (
    <div>
      <StepHeading title={config.subTypeLabel} body="This sets the base range before your scope answers adjust it." />
      <div className="grid gap-3 sm:grid-cols-2">
        {config.subTypes.map((st) => (
          <button
            key={st.id}
            onClick={() => onChange(st.id)}
            aria-pressed={st.id === value}
            className={cn(
              'rounded-xl border p-5 text-left transition-colors',
              st.id === value ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="font-display text-base font-semibold">{st.label}</span>
              {st.id === value && <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />}
            </span>
            <span className="mt-1 block text-xs text-fg-muted">{st.description}</span>
          </button>
        ))}
      </div>
      <NoteBox className="mt-6">{config.disclaimer}</NoteBox>
      <p className="mt-3 text-xs text-fg-subtle">Reading the {getRegion(region).label} price table.</p>
    </div>
  );
}

/* ================================================================== */
/*  4. Scope                                                           */
/* ================================================================== */

function StepScope({
  config,
  subType,
  answers,
  onChange,
  region,
}: {
  config: NonNullable<ReturnType<typeof getConfig>>;
  subType: string;
  answers: Answers;
  onChange: (a: Answers) => void;
  region: RegionCode;
}) {
  const visible = config.questions.filter((q) => questionApplies(config, q, subType));

  const set = (id: string, v: Answers[string]) => onChange({ ...answers, [id]: v });

  return (
    <div>
      <StepHeading title="Tell us about the scope" body="Every answer moves the range. The running total updates as you go." />
      <div className="space-y-7">
        {visible.map((q) => (
          <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} region={region} />
        ))}
      </div>
    </div>
  );
}

function QuestionField({
  q,
  value,
  onChange,
  region,
}: {
  q: Question;
  value: Answers[string] | undefined;
  onChange: (v: Answers[string]) => void;
  region: RegionCode;
}) {
  if (q.type === 'select') {
    const current = (value as string) ?? q.defaultValue;
    return (
      <fieldset>
        <legend className="text-sm font-medium">{q.label}</legend>
        {q.help && <p className="mt-1 text-xs text-fg-subtle">{q.help}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={o.value === current}
              className={cn(
                'rounded-xl border p-4 text-left text-sm transition-colors',
                o.value === current ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
              )}
            >
              <span className="block font-medium">{o.label}</span>
              {o.hint && <span className="mt-0.5 block text-xs text-fg-subtle">{o.hint}</span>}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (q.type === 'multi') {
    const current = (value as string[]) ?? q.defaultValue;
    const toggle = (v: string) =>
      onChange(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
    return (
      <fieldset>
        <legend className="text-sm font-medium">{q.label}</legend>
        {q.help && <p className="mt-1 text-xs text-fg-subtle">{q.help}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((o) => {
            const on = current.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggle(o.value)}
                aria-pressed={on}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  on ? 'border-accent bg-accent/10 text-accent' : 'border-line text-fg-muted hover:border-accent/40',
                )}
              >
                {on && <Check className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />}
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (q.type === 'number') {
    const current = (value as number) ?? q.defaultValue;
    return (
      <div>
        <label htmlFor={q.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-medium">
          {q.label}
          <span className="font-display text-lg font-semibold text-accent">
            {q.currency ? formatMoney(current, region, { decimals: current < 100 ? 2 : 0 }) : formatNumber(current)}
            {q.unit && !q.currency && <span className="ml-1 text-xs font-normal text-fg-subtle">{q.unit}</span>}
          </span>
        </label>
        {q.help && <p className="mt-1 text-xs text-fg-subtle">{q.help}</p>}
        <input
          id={q.id}
          type="range"
          min={q.min}
          max={q.max}
          step={q.step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-3 w-full accent-[rgb(var(--accent))]"
        />
        {typeof q.freeUnits === 'number' && q.freeUnits > 0 && (
          <p className="mt-1.5 text-xs text-fg-subtle">{q.freeUnits} included before extras apply.</p>
        )}
      </div>
    );
  }

  return (
    <Field
      id={q.id}
      label={q.label}
      required={q.required}
      placeholder={q.placeholder}
      hint={q.help}
      value={(value as string) ?? ''}
      onChange={onChange}
    />
  );
}

/* ================================================================== */
/*  5. Timeline                                                        */
/* ================================================================== */

function StepTimeline({
  timeline,
  onChange,
  duration,
  onDuration,
  durationOptions,
  billing,
}: {
  timeline: TimelineId;
  onChange: (t: TimelineId) => void;
  duration?: number;
  onDuration: (n: number) => void;
  durationOptions?: number[];
  billing: string;
}) {
  return (
    <div>
      <StepHeading
        title="How soon do you need it?"
        body="Rush work is reprioritised ahead of the queue, which costs more. Flexible timing costs less because we schedule it around other work."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {TIMELINE_MULTIPLIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-pressed={t.id === timeline}
            className={cn(
              'rounded-xl border p-5 text-left transition-colors',
              t.id === timeline ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
            )}
          >
            <span className="block font-display text-base font-semibold">{t.label}</span>
            <span className="mt-1 block text-xs text-fg-subtle">{t.hint}</span>
            <span
              className={cn(
                'mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium',
                t.multiplier > 1
                  ? 'bg-warn/15 text-warn'
                  : t.multiplier < 1
                    ? 'bg-success/15 text-success'
                    : 'bg-line text-fg-muted',
              )}
            >
              {t.multiplier.toFixed(2)}x
            </span>
          </button>
        ))}
      </div>

      {billing === 'monthly' && durationOptions && (
        <div className="mt-8">
          <p className="text-sm font-medium">How many months?</p>
          <p className="mt-1 text-xs text-fg-subtle">Used to show a total alongside the monthly figure.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {durationOptions.map((m) => (
              <button
                key={m}
                onClick={() => onDuration(m)}
                aria-pressed={m === duration}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  m === duration ? 'border-accent bg-accent/10 text-accent' : 'border-line text-fg-muted hover:border-accent/40',
                )}
              >
                {m} month{m === 1 ? '' : 's'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  6. Contact                                                         */
/* ================================================================== */

function StepContact({
  contact,
  onChange,
  consent,
  onConsent,
  honey,
  onHoney,
  result,
  region,
}: {
  contact: { name: string; email: string; phone: string; company: string; notes: string };
  onChange: (c: typeof contact) => void;
  consent: boolean;
  onConsent: (v: boolean) => void;
  honey: string;
  onHoney: (v: string) => void;
  result: EstimateResult | null;
  region: RegionCode;
}) {
  const set = (k: keyof typeof contact) => (v: string) => onChange({ ...contact, [k]: v });

  return (
    <div className="relative">
      <StepHeading
        title="Where should we send it?"
        body="You will see the range on the next screen either way. These details let us email you a copy and follow up with a proper quote if you want one."
      />
      <Honeypot value={honey} onChange={onHoney} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="est-name" label="Name" required value={contact.name} onChange={set('name')} autoComplete="name" />
        <Field id="est-email" label="Email" type="email" required value={contact.email} onChange={set('email')} autoComplete="email" />
        <Field id="est-phone" label="Phone" type="tel" value={contact.phone} onChange={set('phone')} autoComplete="tel" />
        <Field id="est-company" label="Company" value={contact.company} onChange={set('company')} autoComplete="organization" />
      </div>

      <TextArea
        id="est-notes"
        label="Anything we should know?"
        rows={3}
        className="mt-5"
        placeholder="Constraints, deadlines, or what a previous supplier got wrong."
        value={contact.notes}
        onChange={set('notes')}
      />

      <div className="mt-5">
        <ConsentCheckbox id="est-consent" checked={consent} onChange={onConsent} wording={CONSENT_WORDING} />
      </div>

      {result && !result.unavailable && (
        <div className="mt-6 rounded-xl border border-accent/25 bg-accent/5 p-5">
          <p className="text-xs uppercase tracking-wider text-fg-subtle">Your range so far</p>
          <p className="mt-1.5 font-display text-2xl font-semibold text-accent">
            {formatRange([result.low, result.high], region, { compact: true })}
            <span className="ml-2 text-sm font-normal text-fg-subtle">
              {result.billing === 'monthly' ? 'per month' : result.billing === 'weekly' ? 'per week' : 'one-time'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  7. Result                                                          */
/* ================================================================== */

function StepResult({
  result,
  region,
  submitted,
  submitError,
  contact,
  answers,
  onReset,
}: {
  result: EstimateResult;
  region: RegionCode;
  submitted: boolean;
  submitError: string;
  contact: { name: string; email: string; company: string };
  answers: Answers;
  onReset: () => void;
}) {
  const service = SERVICES.find((s) => s.slug === result.service);
  const config = ESTIMATE_CONFIG_MAP[result.service];
  const r = getRegion(region);

  if (result.unavailable) {
    return (
      <div className="text-center">
        <h2 className="text-display-sm">We cannot price that from a table</h2>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-fg-muted">{result.unavailable}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact" icon={ArrowRight}>
            Send us the details
          </ButtonLink>
          <Button variant="secondary" onClick={onReset} icon={RotateCcw} iconRight={false}>
            Start again
          </Button>
        </div>
      </div>
    );
  }

  const unitLabel =
    result.billing === 'monthly' ? 'per month' : result.billing === 'weekly' ? 'per week' : 'one-time project';

  return (
    <div style={service ? ({ ['--svc' as string]: service.accent } as React.CSSProperties) : undefined}>
      <div className="text-center">
        <p className="eyebrow mb-3 justify-center">Your rough estimate</p>
        <h2 className="text-display-sm">
          {service?.name} · {config?.subTypes.find((s) => s.id === result.subType)?.label}
        </h2>
        <p className="mt-2 text-sm text-fg-subtle">
          {r.flag} {r.label} · {r.currency} · {unitLabel}
        </p>
      </div>

      <div className="mt-9 rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:p-8">
        <RangeBar
          low={result.low}
          likely={result.likely}
          high={result.high}
          formatValue={(n) => formatMoney(n, region, { compact: n >= 10000 })}
        />

        {result.totalLow !== undefined && result.durationMonths && result.durationMonths > 1 && (
          <p className="mt-6 border-t border-accent/20 pt-5 text-sm text-fg-muted">
            Across {result.durationMonths} months that is{' '}
            <span className="font-display font-semibold text-accent">
              {formatRange([result.totalLow, result.totalHigh ?? result.totalLow], region, { compact: true })}
            </span>{' '}
            in total.
          </p>
        )}
      </div>

      {/* Dispatch: both fee models side by side */}
      {result.dispatch && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-bg-soft p-5">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              {(result.dispatch.percentRate * 100).toFixed(0)}% of linehaul
            </p>
            <p className="mt-1.5 font-display text-2xl font-semibold">
              {formatMoney(result.dispatch.percentWeekly[0], region)}
            </p>
            <p className="text-xs text-fg-subtle">per week, {result.dispatch.trucks} truck(s)</p>
          </div>
          <div className="rounded-xl border border-line bg-bg-soft p-5">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">Flat weekly</p>
            <p className="mt-1.5 font-display text-2xl font-semibold">
              {formatRange(result.dispatch.flatWeekly, region)}
            </p>
            <p className="text-xs text-fg-subtle">per week, {result.dispatch.trucks} truck(s)</p>
          </div>
          <div className="rounded-xl border border-svc/30 bg-svc/10 p-5">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">Break-even gross</p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-svc">
              {formatMoney(result.dispatch.breakEvenWeeklyGross, region)}
            </p>
            <p className="text-xs text-fg-subtle">
              per truck, per week. {result.dispatch.cheaperModel === 'percent' ? 'Percentage' : 'Flat'} is cheaper
              for you today.
            </p>
          </div>
        </div>
      )}

      {/* AdSense projection */}
      {result.adsense && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Tile label="Current monthly revenue" value={formatMoney(result.adsense.currentMonthlyRevenue, region, { compact: true })} />
          <Tile label="Projected after tuning" value={formatRange(result.adsense.projectedMonthlyRevenue, region, { compact: true })} accent />
          <Tile label="Our fee, from uplift" value={formatRange(result.adsense.ourFee, region, { compact: true })} />
        </div>
      )}

      {/* Ads fee models */}
      {result.ads && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Tile label="Flat monthly fee" value={formatRange(result.ads.flatFee, region, { compact: true })} />
          <Tile label="10-20% of ad spend" value={formatRange(result.ads.percentOfSpendFee, region, { compact: true })} />
          <Tile
            label="We would recommend"
            value={result.ads.recommended === 'percent' ? 'Percentage of spend' : 'Flat monthly fee'}
            accent
          />
        </div>
      )}

      {/* Per-lead */}
      {result.perLead && (
        <div className="mt-6">
          <Tile label="Works out per qualified lead" value={formatRange(result.perLead, region)} accent />
        </div>
      )}

      {/* Breakdown */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold">How we got there</h3>
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
          {result.lineItems.map((li, i) => (
            <li key={`${li.label}-${i}`} className="flex items-start justify-between gap-4 bg-bg-soft px-5 py-3.5">
              <span className="min-w-0">
                <span className="block text-sm font-medium">{li.label}</span>
                {li.detail && <span className="block text-xs text-fg-subtle">{li.detail}</span>}
              </span>
              <span className="shrink-0 text-right">
                {li.kind === 'multiplier' && li.multiplier && (
                  <span className="block text-xs text-fg-subtle">{li.multiplier.toFixed(2)}x</span>
                )}
                <span
                  className={cn(
                    'font-display text-sm font-semibold',
                    li.kind === 'base' ? 'text-fg' : li.range && li.range[0] < 0 ? 'text-success' : 'text-accent',
                  )}
                >
                  {li.range ? formatRange([Math.round(li.range[0]), Math.round(li.range[1])], region, { compact: true }) : '—'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assumptions */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold">Assumptions we used</h3>
        <ul className="mt-3 space-y-2">
          {[...result.assumptions, ...(config?.outputNotes ?? [])].map((a) => (
            <li key={a} className="flex gap-2.5 text-sm text-fg-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {submitted && (
        <NoteBox className="mt-8">
          A copy is on its way to {contact.email}. Our team has the same summary and will follow up within four
          business hours.
        </NoteBox>
      )}
      {submitError && (
        <NoteBox tone="warn" className="mt-8">
          Your range is correct, but we could not deliver the lead to our systems: {submitError} Save the PDF
          below or email {SITE.email} and we will pick it up.
        </NoteBox>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          icon={Download}
          onClick={() =>
            buildEstimateDocument({
              result,
              region,
              contact,
              answers,
              serviceName: service?.name ?? result.service,
              subTypeLabel: config?.subTypes.find((s) => s.id === result.subType)?.label ?? result.subType,
              outputNotes: config?.outputNotes ?? [],
            })
          }
        >
          Download PDF
        </Button>
        <ButtonLink href="/contact" variant="secondary" icon={ArrowRight}>
          Book a consultation
        </ButtonLink>
        <Button variant="ghost" onClick={onReset} icon={RotateCcw} iconRight={false}>
          Estimate something else
        </Button>
      </div>

      <NoteBox tone="warn" className="mt-6">
        <span className="flex items-start gap-2">
          <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {ESTIMATE_DISCLAIMER} {config?.disclaimer}
        </span>
      </NoteBox>
    </div>
  );
}

function Tile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn('rounded-xl border p-5', accent ? 'border-accent/30 bg-accent/10' : 'border-line bg-bg-soft')}>
      <p className="text-xs uppercase tracking-wider text-fg-subtle">{label}</p>
      <p className={cn('mt-1.5 font-display text-xl font-semibold', accent && 'text-accent')}>{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function getConfig(slug: string) {
  return ESTIMATE_CONFIG_MAP[slug];
}

function requiredAnswered(questions: Question[], answers: Answers, subType: string, service: string): boolean {
  return questions.every((q) => {
    if (q.type !== 'text' || !q.required) return true;
    if (service === 'auto-engines' && ['year', 'make', 'model'].includes(q.id)) {
      const v = answers[q.id];
      return typeof v === 'string' && v.trim().length > 0;
    }
    return true;
  });
}
