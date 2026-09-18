'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Check, Phone, type LucideIcon } from 'lucide-react';
import type { Service } from '@/data/services';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { SITE } from '@/data/site';
import { useRegion } from './providers';
import { formatMoney, formatRange } from '@/lib/format';
import { Reveal, RevealGroup, RevealItem, SplitText, Marquee, TiltCard } from './motion';
import {
  Accordion,
  ArrowLink,
  Badge,
  Breadcrumbs,
  ButtonLink,
  Container,
  Section,
  SectionHeading,
  NoteBox,
} from './ui';
import { ServicePriceTable } from './price-table';
import { ServiceInteractive } from './service-widgets';
import { cn } from '@/lib/utils';
import type { ServiceSeo } from '@/data/seo-content';
import { QuickAnswer, SeoGuide, MarketLinks } from './seo-blocks';

export function ServiceDetail({
  service,
  seo,
  markets = [],
}: {
  service: Service;
  seo?: ServiceSeo;
  markets?: { slug: string; name: string; flag: string }[];
}) {
  const { code, region } = useRegion();
  const Icon = (Icons[service.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;

  const table = PRICE_TABLE_MAP[service.slug];
  const startRow = table?.rows.find((r) => r.id === service.startingPriceRow);
  const startValue = startRow?.values[code];

  return (
    <div style={{ ['--svc' as string]: service.accent }}>
      {/* ---------- 1. Hero ---------- */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-noise opacity-50" />
          <div className="absolute inset-0 svc-glow" />
        </div>

        <Container className="py-[clamp(3rem,7vw,6rem)]">
          <Breadcrumbs trail={[{ label: 'Services', href: '/services' }, { label: service.name }]} />

          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <span className="mb-6 inline-grid h-14 w-14 place-items-center rounded-2xl border border-svc/30 bg-svc/10 text-svc">
                <Icon className="h-7 w-7" aria-hidden />
              </span>

              <h1 className="text-display-lg">
                <SplitText text={service.name} />
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
                {service.promise}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href={`/estimate?service=${service.slug}`}
                  size="lg"
                  variant="service"
                  icon={ArrowRight}
                  magnetic
                  trackLabel="Get a Rough Estimate"
                  trackLocation={`service-hero-${service.slug}`}
                >
                  Get a Rough Estimate
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="secondary">
                  Talk to a specialist
                </ButtonLink>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-[3.25rem] items-center gap-2 px-2 text-sm font-medium text-fg-muted transition-colors hover:text-svc"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {SITE.phone}
                </a>
              </div>
            </div>

            <Reveal direction="left">
              <div className="rounded-2xl border border-svc/25 bg-svc/5 p-7">
                <p className="text-xs uppercase tracking-wider text-fg-subtle">
                  Starting price · {region.label}
                </p>
                <p className="mt-2 font-display text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-none text-svc">
                  {startValue ? formatMoney(startValue[0], code, { compact: true }) : 'Per job'}
                  {startRow && startValue && (
                    <span className="ml-2 font-sans text-base font-normal text-fg-subtle">
                      {startRow.unit === 'monthly'
                        ? 'per month'
                        : startRow.unit === 'weekly'
                          ? 'per week'
                          : startRow.unit === 'hourly'
                            ? 'per hour'
                            : startRow.unit === 'per-unit'
                              ? 'installed'
                              : 'project'}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-fg-muted">{startRow?.label}</p>

                <dl className="mt-7 grid gap-4 border-t border-svc/20 pt-6 sm:grid-cols-3">
                  {service.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">{m.label}</dt>
                      <dd className="mt-1 font-display text-lg font-semibold">{m.value}</dd>
                    </div>
                  ))}
                </dl>

                {service.timelines && (
                  <p className="mt-6 border-t border-svc/20 pt-5 text-xs leading-relaxed text-fg-subtle">
                    {service.timelines}
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Quick answer (AEO) ---------- */}
      {seo && (
        <section className="border-b border-line bg-bg-soft py-10">
          <Container>
            <QuickAnswer question={`What is ${service.name.toLowerCase()} from Texas Solutions?`} answer={seo.quickAnswer} />
          </Container>
        </section>
      )}

      {/* ---------- 2. Problem and solution ---------- */}
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-bg-soft p-7 sm:p-9">
                <Badge>The problem</Badge>
                <h2 className="mt-4 text-display-sm">{service.problem.title}</h2>
                <p className="mt-4 leading-relaxed text-fg-muted">{service.problem.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {service.problem.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger/70" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-svc/30 bg-svc/5 p-7 sm:p-9">
                <Badge tone="service">What we do about it</Badge>
                <h2 className="mt-4 text-display-sm">{service.solution.title}</h2>
                <p className="mt-4 leading-relaxed text-fg-muted">{service.solution.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {service.solution.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- 3. Sub-services ---------- */}
      <Section tone="soft" id="sub-services">
        <Container>
          <SectionHeading
            eyebrow="What is inside"
            title={`${service.subServices.length} ways we run ${service.navLabel.toLowerCase()}`}
            body="Each one has its own page with what is delivered and what it targets in search."
          />

          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.subServices.map((sub) => (
              <RevealItem key={sub.slug}>
                <TiltCard className="h-full">
                  <Link
                    href={`/services/${service.slug}/${sub.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-[border-color,box-shadow] duration-400 hover:border-svc/50 hover:shadow-svc-glow"
                  >
                    <h3 className="font-display text-lg font-semibold group-hover:text-svc">{sub.name}</h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-muted">{sub.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-svc">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------- 4. What is included ---------- */}
      <Section id="included">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              eyebrow="Always included"
              title="What comes with every engagement"
              body="Not an upsell list. These are part of the price, on every package."
            />
            <RevealGroup className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.included.map((item) => (
                <RevealItem key={item}>
                  <div className="flex gap-3 border-b border-line pb-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                    <span className="text-sm text-fg-muted">{item}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      {/* ---------- 5. Packages ---------- */}
      <Section tone="soft" id="packages">
        <Container>
          <SectionHeading
            eyebrow="Packages"
            title="Three ways to start"
            body={`Prices shown for ${region.label} in ${region.currency}. Change your region in the header to see another market.`}
            align="center"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {service.packages.map((pkg, i) => {
              const row = table?.rows.find((r) => r.id === pkg.priceRow);
              const value = row?.values[code];
              const anchored = value
                ? pkg.anchor === 'low'
                  ? value[0]
                  : pkg.anchor === 'mid'
                    ? Math.round((value[0] + value[1]) / 2)
                    : value[1]
                : null;

              return (
                <Reveal key={pkg.name} delay={i * 0.08}>
                  <div
                    className={cn(
                      'relative flex h-full flex-col rounded-2xl border p-7',
                      pkg.popular ? 'border-svc bg-bg-elev shadow-svc-glow' : 'border-line bg-bg-elev',
                    )}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-7 rounded-full bg-svc px-3 py-1 text-xs font-semibold text-bg">
                        Most chosen
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">{pkg.tagline}</p>

                    <p className="mt-6 font-display text-3xl font-semibold text-svc">
                      {anchored !== null ? (
                        <>
                          {pkg.anchor === 'low' && <span className="text-base font-normal text-fg-subtle">from </span>}
                          {formatMoney(anchored, code, { compact: true })}
                        </>
                      ) : (
                        'Per job'
                      )}
                    </p>
                    <p className="mt-1 text-xs text-fg-subtle">
                      {row?.unit === 'monthly'
                        ? 'per month'
                        : row?.unit === 'weekly'
                          ? 'per truck, per week'
                          : row?.unit === 'hourly'
                            ? 'per hour'
                            : row?.unit === 'per-unit'
                              ? 'supplied and installed'
                              : 'one-time project'}
                    </p>

                    <ul className="mt-7 flex-1 space-y-2.5">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <ButtonLink
                      href={`/estimate?service=${service.slug}&package=${pkg.name.toLowerCase()}`}
                      variant={pkg.popular ? 'service' : 'secondary'}
                      className="mt-7 w-full"
                      icon={ArrowRight}
                    >
                      Estimate this package
                    </ButtonLink>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12">
            <h3 className="mb-5 font-display text-lg font-semibold">Full price table for {region.label}</h3>
            <ServicePriceTable service={service.slug} accent="svc" />
          </div>
        </Container>
      </Section>

      {/* ---------- Interactive element ---------- */}
      <Section id="interactive">
        <Container>
          <SectionHeading
            eyebrow="Try it yourself"
            title={service.interactiveTitle}
            body="Move the inputs and the numbers move with them. Nothing is submitted until you choose to."
          />
          <div className="mt-10">
            <ServiceInteractive kind={service.interactive} slug={service.slug} />
          </div>
        </Container>
      </Section>

      {/* ---------- 6. Process ---------- */}
      <Section tone="soft" id="process">
        <Container>
          <SectionHeading eyebrow="Process" title="How the work actually runs" />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} className="bg-bg-elev">
                <div className="flex h-full flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-svc/15 font-display text-sm font-semibold text-svc">
                      {i + 1}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---------- 7. Tools strip ---------- */}
      <section className="border-y border-line py-10">
        <Container>
          <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Tools and platforms we work in
          </p>
        </Container>
        <Marquee slow>
          {service.tools.map((tool) => (
            <span
              key={tool}
              className="shrink-0 whitespace-nowrap rounded-xl border border-line bg-bg-elev px-5 py-2.5 text-sm font-medium text-fg-muted"
            >
              {tool}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------- 8. Case study ---------- */}
      <Section id="case-study">
        <Container>
          <SectionHeading eyebrow="Case study" title={service.caseStudy.client} body={service.caseStudy.challenge} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                What we did
              </p>
              <ul className="mt-4 space-y-3">
                {service.caseStudy.work.map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-fg-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
              {service.caseStudy.quote && (
                <blockquote className="mt-7 border-l-2 border-svc pl-5">
                  <p className="italic leading-relaxed text-fg">“{service.caseStudy.quote.text}”</p>
                  <footer className="mt-2 text-sm text-fg-subtle">{service.caseStudy.quote.role}</footer>
                </blockquote>
              )}
            </div>

            <RevealGroup className="grid gap-4 sm:grid-cols-2">
              {service.caseStudy.results.map((r) => (
                <RevealItem key={r.label}>
                  <div className="rounded-xl border border-line bg-bg-soft p-5">
                    <p className="text-xs text-fg-subtle">{r.label}</p>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-sm text-fg-subtle line-through">{r.before}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-fg-subtle" aria-hidden />
                      <span className="font-display text-2xl font-semibold text-svc">{r.after}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-success">{r.delta}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <NoteBox className="mt-8">
            Sample engagement profile showing the kind of result this service targets. It is replaced with a
            client-approved case study, with names and logos, before launch.
          </NoteBox>
        </Container>
      </Section>

      {/* ---------- Guide (SEO) ---------- */}
      {seo && (
        <Section id="guide">
          <Container>
            <SeoGuide title={seo.guideTitle} sections={seo.guide} keywords={seo.keywords} accent="svc" />
          </Container>
        </Section>
      )}

      {/* ---------- Markets ---------- */}
      {markets.length > 0 && (
        <section className="border-y border-line bg-bg-soft py-12">
          <Container>
            <h2 className="font-display text-xl font-semibold">
              {service.navLabel} for clients in the US, UK, Europe, the Gulf and Asia
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">
              Pricing is published for each region, and engineering hours overlap with your working day.
            </p>
            <div className="mt-6">
              <MarketLinks markets={markets} />
            </div>
          </Container>
        </section>
      )}

      {/* ---------- 9. FAQ ---------- */}
      <Section tone="soft" id="faq">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Frequently asked questions"
              title={`${service.navLabel}: your questions answered`}
            />
            <Accordion items={[...service.faqs, ...(seo?.faqs ?? [])]} defaultOpen={0} />
          </div>
        </Container>
      </Section>

      {/* ---------- 10. CTA into the calculator ---------- */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 svc-glow" />
        <Container className="relative py-section-sm">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-display-md">Put a number on it</h2>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">
              The calculator opens on {service.navLabel.toLowerCase()} already selected. Seven questions and you
              have a range in {region.currency}.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={`/estimate?service=${service.slug}`}
                size="lg"
                variant="service"
                icon={ArrowRight}
                magnetic
                trackLabel="Estimate from service CTA"
                trackLocation={service.slug}
              >
                Estimate {service.navLabel}
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">
                See all pricing
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-fg-subtle">
              Rough estimate only. Final pricing is confirmed after a consultation.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function SubServiceDetail({
  service,
  sub,
}: {
  service: Service;
  sub: Service['subServices'][number];
}) {
  const { code, region } = useRegion();
  const table = PRICE_TABLE_MAP[service.slug];
  const startRow = table?.rows.find((r) => r.id === service.startingPriceRow);
  const startValue = startRow?.values[code];

  const siblings = service.subServices.filter((s) => s.slug !== sub.slug);

  return (
    <div style={{ ['--svc' as string]: service.accent }}>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 svc-glow" />
        <Container className="py-[clamp(2.5rem,6vw,5rem)]">
          <Breadcrumbs
            trail={[
              { label: 'Services', href: '/services' },
              { label: service.navLabel, href: `/services/${service.slug}` },
              { label: sub.name },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div>
              <Badge tone="service">{service.navLabel}</Badge>
              <h1 className="mt-5 text-display-lg">
                <SplitText text={sub.name} />
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{sub.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`/estimate?service=${service.slug}`}
                  size="lg"
                  variant="service"
                  icon={ArrowRight}
                >
                  Get a Rough Estimate
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="secondary">
                  Ask a question
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-2xl border border-svc/25 bg-svc/5 p-7">
              <p className="text-xs uppercase tracking-wider text-fg-subtle">
                {service.navLabel} from · {region.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-svc">
                {startValue ? formatMoney(startValue[0], code, { compact: true }) : 'Per job'}
              </p>
              <p className="mt-1.5 text-sm text-fg-muted">{startRow?.label}</p>
              <ArrowLink href={`/services/${service.slug}#packages`} className="mt-5">
                See all packages and ranges
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="prose-ts">
                <p className="text-lg text-fg">{sub.body}</p>
              </div>

              <h2 className="mt-12 text-display-sm">What you get</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {sub.deliverables.map((d) => (
                  <li key={d} className="flex gap-2.5 rounded-lg border border-line bg-bg-soft p-4 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-display-sm">How it fits the rest</h2>
              <p className="mt-4 leading-relaxed text-fg-muted">
                {sub.name} is one part of {service.name.toLowerCase()}. Most clients combine two or three of
                these, and the packages on the main service page price them together.
              </p>
              <ArrowLink href={`/services/${service.slug}`} className="mt-5">
                Back to {service.navLabel}
              </ArrowLink>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-line bg-bg-elev p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Other {service.navLabel.toLowerCase()} services
                </p>
                <ul className="mt-4 space-y-1">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${service.slug}/${s.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-bg-soft"
                      >
                        <span className="text-fg-muted group-hover:text-svc">{s.name}</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-1 group-hover:text-svc"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-2xl border border-svc/25 bg-svc/5 p-6">
                <p className="font-display text-lg font-semibold">Not sure this is the piece you need?</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Tell us the outcome you want and we will say which of these actually gets you there, or that
                  none of them do.
                </p>
                <ButtonLink href="/contact" variant="service" className="mt-5 w-full" icon={ArrowRight}>
                  Talk it through
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Questions" title={`About ${service.navLabel.toLowerCase()}`} />
            <Accordion items={service.faqs.slice(0, 4)} defaultOpen={0} />
          </div>
        </Container>
      </Section>
    </div>
  );
}
