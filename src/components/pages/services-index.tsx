'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Check, type LucideIcon } from 'lucide-react';
import type { Service } from '@/data/services';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { useRegion } from '@/components/providers';
import { formatMoney } from '@/lib/format';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, ButtonLink, NoteBox } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';

export function ServicesIndex({ services }: { services: Service[] }) {
  const { code, region } = useRegion();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Thirteen service lines, priced in the open"
        body="Each one is a standalone agreement with its own published ranges. Use one, or use several and get a single account contact across all of them."
        trail={[{ label: 'Services' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/estimate" size="lg" icon={ArrowRight} magnetic>
            Get a Rough Estimate
          </ButtonLink>
          <ButtonLink href="/pricing" size="lg" variant="secondary">
            See every price table
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={`Prices shown in ${region.currency}`}
            title={`What each line costs in ${region.label}`}
            body="Starting figures come from the same tables the calculator reads. Change your region in the header and every number on this page changes with it."
          />

          <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = (Icons[service.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
              const table = PRICE_TABLE_MAP[service.slug];
              const row = table?.rows.find((r) => r.id === service.startingPriceRow);
              const value = row?.values[code];

              return (
                <RevealItem key={service.slug}>
                  <article
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-elev p-7 transition-[border-color,box-shadow] duration-500 hover:border-svc/50 hover:shadow-svc-glow sm:p-9"
                    style={{ ['--svc' as string]: service.accent }}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-svc transition-transform duration-500 group-hover:scale-x-100"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-svc/30 bg-svc/10 text-svc">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="text-right">
                        <p className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">From</p>
                        <p className="font-display text-xl font-semibold text-svc">
                          {value ? formatMoney(value[0], code, { compact: true }) : 'Per job'}
                          {row && value && (
                            <span className="ml-1 text-xs font-normal text-fg-subtle">
                              {row.unit === 'monthly'
                                ? '/mo'
                                : row.unit === 'weekly'
                                  ? '/wk'
                                  : row.unit === 'hourly'
                                    ? '/hr'
                                    : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <h2 className="mt-6 font-display text-2xl font-semibold">
                      <Link href={`/services/${service.slug}`} className="hover:text-svc">
                        {service.name}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.summary}</p>

                    <ul className="mt-6 grid flex-1 gap-2 sm:grid-cols-2">
                      {service.subServices.slice(0, 6).map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/services/${service.slug}/${sub.slug}`}
                            className="flex items-start gap-2 text-sm text-fg-muted transition-colors hover:text-svc"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-svc" aria-hidden />
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {service.subServices.length > 6 && (
                      <p className="mt-2 text-xs text-fg-subtle">
                        plus {service.subServices.length - 6} more on the service page
                      </p>
                    )}

                    <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-6">
                      <ButtonLink href={`/services/${service.slug}`} variant="service" size="sm" icon={ArrowRight}>
                        Explore
                      </ButtonLink>
                      <ButtonLink href={`/estimate?service=${service.slug}`} variant="secondary" size="sm">
                        Estimate this
                      </ButtonLink>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal>
            <NoteBox className="mt-10">
              Every figure here is a range for guidance, never a binding quote. The calculator gives a
              narrower range once it knows your scope, and final pricing is confirmed after a consultation.
            </NoteBox>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        title="Not sure which line you need?"
        body="Describe the outcome you want. We will tell you which service gets you there, or that none of ours does."
        primary={{ href: '/contact', label: 'Tell us the situation' }}
        secondary={{ href: '/estimate', label: 'Run the calculator' }}
      />
    </>
  );
}
