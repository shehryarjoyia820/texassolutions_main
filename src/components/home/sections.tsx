'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { SOLUTIONS } from '@/data/solutions';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { CASE_STUDIES } from '@/data/insights';
import {
  TRUST_STATS,
  TESTIMONIALS,
  ENGAGEMENT_MODELS,
  HOW_IT_WORKS,
  SITE_FAQS,
  CLIENT_LOGOS_STATUS,
} from '@/data/company';
import { CERTIFICATIONS } from '@/data/site';
import { Counter, Marquee, Reveal, RevealGroup, RevealItem, TiltCard } from '@/components/motion';
import {
  Accordion,
  ArrowLink,
  ButtonLink,
  Container,
  Section,
  SectionHeading,
  Tabs,
  Badge,
} from '@/components/ui';
import { useRegion } from '@/components/providers';
import { formatMoney, formatRange } from '@/lib/format';
import { cn } from '@/lib/utils';

/* ================================================================== */
/*  Trust bar                                                          */
/* ================================================================== */

export function TrustBar() {
  return (
    <section className="border-y border-line bg-bg-soft py-10">
      <Container>
        <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <Reveal key={stat.label}>
                <div>
                  <div className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight text-fg">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={'decimals' in stat ? (stat.decimals as number) : 0}
                    />
                  </div>
                  <p className="mt-1 text-sm font-medium">{stat.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{stat.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="lg:w-72">
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
              Working across
            </p>
            <Marquee slow className="py-1">
              {SOLUTIONS.map((s) => (
                <span key={s.slug} className="whitespace-nowrap text-sm font-medium text-fg-muted">
                  {s.navLabel}
                  <span className="ml-10 text-accent/40">/</span>
                </span>
              ))}
            </Marquee>
            {CLIENT_LOGOS_STATUS.needsClientContent && (
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-fg-subtle">
                Client logos appear here once written permission is in place. We do not display marks we are
                not entitled to use.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/*  Industry switcher                                                  */
/* ================================================================== */

export function IndustrySwitcher() {
  const featured = SOLUTIONS.filter((s) =>
    ['trucking-logistics', 'ecommerce', 'publishers-media'].includes(s.slug),
  );
  const [active, setActive] = useState(featured[0].slug);
  const solution = featured.find((s) => s.slug === active)!;

  return (
    <Section id="industries">
      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Built for your industry"
            title="Pick your world and watch the page change"
            body="The same seven services get bought very differently depending on who you are. Choose an industry to see what we actually do for them."
          />
          <Tabs
            tabs={featured.map((s) => ({ id: s.slug, label: s.navLabel }))}
            active={active}
            onChange={setActive}
            className="shrink-0"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={solution.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr]"
            style={{ ['--svc' as string]: hexToTriplet(solution.accentHex) }}
          >
            <div className="rounded-2xl border border-line bg-bg-elev p-7 sm:p-9">
              <p className="font-display text-2xl font-semibold">{solution.promise}</p>
              <p className="mt-4 leading-relaxed text-fg-muted">{solution.description}</p>

              <p className="mt-8 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                What usually hurts
              </p>
              <ul className="mt-3 space-y-2">
                {solution.painPoints.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-svc" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {solution.services.map((slug) => {
                  const svc = SERVICES.find((s) => s.slug === slug);
                  if (!svc) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-svc/50 hover:text-svc"
                    >
                      {svc.navLabel}
                    </Link>
                  );
                })}
              </div>

              <ArrowLink href={`/solutions/${solution.slug}`} className="mt-8">
                See the full {solution.navLabel} solution
              </ArrowLink>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {solution.outcomes.map((o) => (
                  <div key={o.label} className="rounded-xl border border-line bg-bg-soft p-5">
                    <div className="font-display text-2xl font-semibold text-svc">{o.value}</div>
                    <div className="mt-1 text-sm font-medium">{o.label}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{o.note}</div>
                  </div>
                ))}
              </div>

              <div className="flex-1 rounded-xl border border-svc/25 bg-svc/5 p-6">
                <p className="eyebrow mb-3 text-svc">Proof</p>
                <p className="font-display text-lg font-semibold">{solution.proof.headline}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{solution.proof.body}</p>
                <dl className="mt-5 space-y-2.5">
                  {solution.proof.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline justify-between gap-4 text-sm">
                      <dt className="text-fg-subtle">{m.label}</dt>
                      <dd className="text-right font-medium">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  Engagement models                                                  */
/* ================================================================== */

export function EngagementModels() {
  const { code } = useRegion();
  const [modelId, setModelId] = useState(ENGAGEMENT_MODELS[1].id);
  const model = ENGAGEMENT_MODELS.find((m) => m.id === modelId)!;
  const [people, setPeople] = useState(model.minPeople + 1);
  const [months, setMonths] = useState(model.durationDiscount[1]?.months ?? model.minMonths);

  const clampedPeople = Math.min(Math.max(people, model.minPeople), model.maxPeople);
  const discount = useMemo(() => {
    const tiers = [...model.durationDiscount].sort((a, b) => a.months - b.months);
    let factor = tiers[0]?.factor ?? 1;
    for (const tier of tiers) if (months >= tier.months) factor = tier.factor;
    return factor;
  }, [model, months]);

  const monthly = Math.round(model.monthlyRate * clampedPeople * discount);
  const total = monthly * months;

  return (
    <Section tone="soft" id="engagement">
      <Container>
        <SectionHeading
          eyebrow="How we work together"
          title="Pick the shape before you pick up the phone"
          body="Set the team size and the commitment here, and you will know roughly what it costs before we ever speak. Figures are indicative USD, confirmed for your region on a call."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {ENGAGEMENT_MODELS.map((m) => {
            const isActive = m.id === modelId;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setModelId(m.id);
                  setPeople(Math.min(Math.max(people, m.minPeople), m.maxPeople));
                  setMonths(Math.min(Math.max(months, m.minMonths), m.maxMonths));
                }}
                className={cn(
                  'rounded-2xl border p-6 text-left transition-all duration-300',
                  isActive
                    ? 'border-accent bg-accent/5 shadow-glow'
                    : 'border-line bg-bg-elev hover:border-accent/40',
                )}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-semibold">{m.name}</p>
                  {isActive && <Check className="h-4 w-4 text-accent" aria-hidden />}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{m.summary}</p>
                <p className="mt-3 text-xs text-fg-subtle">Best for: {m.bestFor}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 rounded-2xl border border-line bg-bg-elev p-7 lg:grid-cols-[1fr_auto] lg:p-9">
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="people" className="flex items-baseline justify-between text-sm font-medium">
                Team size
                <span className="font-display text-xl font-semibold text-accent">{clampedPeople}</span>
              </label>
              <input
                id="people"
                type="range"
                min={model.minPeople}
                max={model.maxPeople}
                value={clampedPeople}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="mt-3 w-full accent-[rgb(var(--accent))]"
              />
              <p className="mt-1.5 text-xs text-fg-subtle">
                {model.minPeople} to {model.maxPeople} people
              </p>
            </div>

            <div>
              <label htmlFor="months" className="flex items-baseline justify-between text-sm font-medium">
                Commitment
                <span className="font-display text-xl font-semibold text-accent">
                  {months} month{months === 1 ? '' : 's'}
                </span>
              </label>
              <input
                id="months"
                type="range"
                min={model.minMonths}
                max={model.maxMonths}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="mt-3 w-full accent-[rgb(var(--accent))]"
              />
              <p className="mt-1.5 text-xs text-fg-subtle">
                {discount < 1 ? `${Math.round((1 - discount) * 100)}% longer-commitment discount applied` : 'No discount at this length'}
              </p>
            </div>

            <ul className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
              {model.includes.map((inc) => (
                <li key={inc} className="flex gap-2 text-sm text-fg-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-accent/25 bg-accent/5 p-6 lg:w-72">
            <p className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">Indicative monthly</p>
            <motion.p
              key={monthly}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="mt-1 font-display text-3xl font-semibold text-accent"
            >
              {formatMoney(monthly, code)}
            </motion.p>
            <p className="mt-4 text-[0.6875rem] uppercase tracking-wider text-fg-subtle">
              Across {months} month{months === 1 ? '' : 's'}
            </p>
            <p className="mt-1 font-display text-xl font-semibold">{formatMoney(total, code, { compact: true })}</p>
            <ButtonLink
              href={`/contact?model=${model.id}&people=${clampedPeople}&months=${months}`}
              size="md"
              icon={ArrowRight}
              className="mt-6 w-full"
              trackLabel="Discuss engagement"
              trackLocation="engagement-models"
            >
              Discuss this shape
            </ButtonLink>
            <p className="mt-3 text-[0.6875rem] leading-relaxed text-fg-subtle">
              Indicative only. Your region and scope change the final figure.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  Mini estimate widget                                               */
/* ================================================================== */

export function MiniEstimate() {
  const { code, region } = useRegion();
  const [serviceSlug, setServiceSlug] = useState(SERVICES[4].slug);
  const [budget, setBudget] = useState(50);

  const service = SERVICES.find((s) => s.slug === serviceSlug)!;
  const table = PRICE_TABLE_MAP[serviceSlug];
  const row = table?.rows.find((r) => r.id === service.startingPriceRow) ?? table?.rows[0];
  const range = row?.values[code] ?? null;

  const indicative = useMemo(() => {
    if (!range) return null;
    const [low, high] = range;
    const mid = low + ((high - low) * budget) / 100;
    return [Math.round(mid * 0.85), Math.round(mid * 1.15)] as [number, number];
  }, [range, budget]);

  return (
    <Section id="mini-estimate">
      <Container>
        <div
          className="grid gap-8 overflow-hidden rounded-3xl border border-line bg-bg-elev p-7 sm:p-10 lg:grid-cols-[1fr_1fr]"
          style={{ ['--svc' as string]: service.accent }}
        >
          <div>
            <p className="eyebrow mb-4">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Quick look
            </p>
            <h2 className="text-display-sm">Get a number in ten seconds</h2>
            <p className="mt-4 leading-relaxed text-fg-muted">
              Pick a service and roughly where your scope sits. The full calculator asks seven questions and
              gives you a proper breakdown, a range bar and a PDF.
            </p>

            <div className="mt-7">
              <label htmlFor="mini-service" className="mb-2 block text-sm font-medium">
                Service
              </label>
              <select
                id="mini-service"
                value={serviceSlug}
                onChange={(e) => setServiceSlug(e.target.value)}
                className="h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm outline-none transition-colors focus:border-accent"
              >
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label htmlFor="mini-budget" className="flex items-baseline justify-between text-sm font-medium">
                Scope
                <span className="text-xs text-fg-subtle">
                  {budget < 33 ? 'Small and simple' : budget < 67 ? 'Typical' : 'Large or complex'}
                </span>
              </label>
              <input
                id="mini-budget"
                type="range"
                min={0}
                max={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-3 w-full accent-[rgb(var(--svc))]"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-svc/25 bg-svc/5 p-7">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">
                Indicative range · {region.label} · {region.currency}
              </p>
              <motion.p
                key={`${serviceSlug}-${budget}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-svc"
              >
                {indicative ? formatRange(indicative, code, { compact: true }) : 'Quoted per job'}
              </motion.p>
              <p className="mt-2 text-sm text-fg-muted">
                {row?.label}
                {row?.unit === 'monthly' && ' · per month'}
                {row?.unit === 'weekly' && ' · per week'}
                {row?.unit === 'hourly' && ' · per hour'}
              </p>
            </div>

            <div className="mt-8">
              <ButtonLink
                href={`/estimate?service=${serviceSlug}`}
                size="lg"
                variant="service"
                icon={ArrowRight}
                className="w-full"
                trackLabel="Open full calculator"
                trackLocation="mini-estimate"
              >
                Open the full calculator
              </ButtonLink>
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-fg-subtle">
                Rough estimate only. Final pricing is confirmed after a consultation.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  How it works                                                       */
/* ================================================================== */

export function HowItWorks() {
  return (
    <Section tone="soft" id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, no mystery in between"
          body="From first enquiry to a reporting rhythm you can rely on. Dispatch moves faster than this; build projects follow it closely."
        />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {HOW_IT_WORKS.map((step) => (
            <RevealItem key={step.step} className="bg-bg-elev">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl font-semibold text-accent/25">{step.step}</span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
                    {step.duration}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  Case studies carousel                                              */
/* ================================================================== */

export function CaseStudiesCarousel() {
  const studies = SERVICES.map((s) => ({ service: s, study: s.caseStudy }));
  const [index, setIndex] = useState(0);
  const current = studies[index];

  const go = (delta: number) => setIndex((i) => (i + delta + studies.length) % studies.length);

  return (
    <Section id="case-studies">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Case studies"
            title="Before and after, with the numbers attached"
            body="Every figure below came from a real engagement. Client names appear once we have written permission to use them."
          />
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous case study"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next case study"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={current.service.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-8 rounded-2xl border border-line bg-bg-elev p-7 sm:p-9 lg:grid-cols-[1.1fr_1fr]"
            style={{ ['--svc' as string]: current.service.accent }}
          >
            <div>
              <Badge tone="service">{current.service.navLabel}</Badge>
              <h3 className="mt-4 font-display text-2xl font-semibold">{current.study.client}</h3>
              <p className="mt-1 text-sm text-fg-subtle">{current.study.sector}</p>
              <p className="mt-5 leading-relaxed text-fg-muted">{current.study.challenge}</p>

              <p className="mt-7 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                What we did
              </p>
              <ul className="mt-3 space-y-2">
                {current.study.work.map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-fg-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>

              {current.study.quote && (
                <blockquote className="mt-7 border-l-2 border-svc pl-4">
                  <p className="text-sm italic leading-relaxed text-fg">“{current.study.quote.text}”</p>
                  <footer className="mt-1.5 text-xs text-fg-subtle">{current.study.quote.role}</footer>
                </blockquote>
              )}
            </div>

            <div className="grid content-start gap-3 sm:grid-cols-2">
              {current.study.results.map((r) => (
                <div key={r.label} className="rounded-xl border border-line bg-bg-soft p-5">
                  <p className="text-xs text-fg-subtle">{r.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm text-fg-subtle line-through">{r.before}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-fg-subtle" aria-hidden />
                    <span className="font-display text-xl font-semibold text-svc">{r.after}</span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-success">{r.delta}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <ArrowLink href={`/services/${current.service.slug}`}>
                  See the {current.service.navLabel} service
                </ArrowLink>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {studies.map((s, i) => (
            <button
              key={s.service.slug}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.service.name} case study`}
              aria-current={i === index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-10 bg-accent' : 'w-5 bg-line hover:bg-fg-subtle',
              )}
            />
          ))}
        </div>

        <div className="mt-8">
          <ArrowLink href="/insights?kind=Case+study">Read the full written case studies</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  Testimonials and certifications                                    */
/* ================================================================== */

export function TestimonialsBlock() {
  return (
    <Section tone="soft" id="testimonials">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What clients say when the reporting stops"
          body="Attributions are by role and company profile until each client confirms in writing that we can name them."
        />

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.quote}>
              <TiltCard className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6">
                  <Quote className="h-6 w-6 text-accent/40" aria-hidden />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-fg">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <p className="text-sm font-medium">{t.role}</p>
                    <p className="text-xs text-fg-subtle">{t.org}</p>
                    <Link
                      href={`/services/${t.service}`}
                      className="mt-2 inline-block text-[0.6875rem] text-accent hover:underline"
                    >
                      {SERVICES.find((s) => s.slug === t.service)?.navLabel}
                    </Link>
                  </figcaption>
                </figure>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-14">
          <p className="mb-5 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Certifications and partners
          </p>
          <Marquee className="py-2">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c.name}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-bg-elev px-5 py-3"
              >
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-xs text-fg-subtle">{c.detail}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/*  FAQ and closing CTA                                                */
/* ================================================================== */

export function HomeFaq() {
  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Questions"
            title="The things people ask before they call"
            body="If yours is not here, the contact form reaches a person rather than a queue."
          />
          <Accordion items={SITE_FAQS} defaultOpen={0} />
        </div>
      </Container>
    </Section>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-y border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 accent-glow" />
      <div aria-hidden className="absolute inset-0 grid-noise opacity-40" />
      <Container className="relative py-section-sm">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-md">Start with a number, not a sales call</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Seven questions, a real range in your currency, and the breakdown of how we got there. If it does
            not fit your budget, you have lost four minutes rather than an afternoon.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/estimate" size="lg" icon={ArrowRight} magnetic trackLabel="Get a Rough Estimate" trackLocation="cta-band">
              Get a Rough Estimate
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Talk to us instead
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-fg-subtle">
            Rough estimate only. Final pricing is confirmed after a consultation.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function hexToTriplet(hex: string) {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)} ${parseInt(c.slice(2, 4), 16)} ${parseInt(c.slice(4, 6), 16)}`;
}
