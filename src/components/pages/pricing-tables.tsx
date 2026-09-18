'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Globe2, Table2 } from 'lucide-react';
import type { PriceTable } from '@/data/pricing';
import { DISPATCH_MODELS, dispatchPercentLabel } from '@/data/pricing';
import type { Service } from '@/data/services';
import { REGIONS, type RegionCode } from '@/data/regions';
import { useRegion } from '@/components/providers';
import { FullPriceTable, ServicePriceTable } from '@/components/price-table';
import { Container, Section, SectionHeading, Tabs, NoteBox, ArrowLink } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

export function PricingTables({ tables, services }: { tables: PriceTable[]; services: Service[] }) {
  const { code, setRegion, region } = useRegion();
  const [view, setView] = useState<'mine' | 'all'>('mine');

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow mb-3">
              <Globe2 className="h-3.5 w-3.5" aria-hidden />
              Currently showing {region.label}
            </p>
            <h2 className="text-display-sm">Choose how you want to read it</h2>
          </div>

          <Tabs
            tabs={[
              { id: 'mine', label: 'My region only', icon: Eye },
              { id: 'all', label: 'Compare all regions', icon: Table2 },
            ]}
            active={view}
            onChange={(v) => setView(v as 'mine' | 'all')}
          />
        </div>

        {/* region switcher */}
        <div className="mt-6 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.code}
              onClick={() => setRegion(r.code as RegionCode)}
              aria-pressed={r.code === code}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                r.code === code
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-fg-muted hover:border-accent/40 hover:text-fg',
              )}
            >
              <span aria-hidden className="mr-1.5">
                {r.flag}
              </span>
              {r.label} · {r.currency}
            </button>
          ))}
        </div>

        <NoteBox className="mt-6">
          Switching region changes which authored table is read. Currency is never converted live, because a
          converted figure would imply a precision these ranges do not have.
        </NoteBox>

        {/* tables */}
        <div className="mt-14 space-y-16">
          {tables.map((table) => {
            const service = services.find((s) => s.slug === table.service);
            return (
              <Reveal key={table.service}>
                <section
                  id={table.service}
                  style={service ? ({ ['--svc' as string]: service.accent } as React.CSSProperties) : undefined}
                  className="scroll-mt-28"
                >
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{table.title}</h3>
                      {service && (
                        <ArrowLink href={`/services/${service.slug}`} className="mt-2">
                          See the {service.navLabel} service page
                        </ArrowLink>
                      )}
                    </div>
                    <Link
                      href={`/estimate?service=${table.service}`}
                      className="rounded-lg border border-svc/40 px-4 py-2 text-sm font-medium text-svc transition-colors hover:bg-svc/10"
                    >
                      Estimate this
                    </Link>
                  </div>

                  {view === 'mine' ? (
                    <ServicePriceTable service={table.service} accent="svc" />
                  ) : (
                    <FullPriceTable table={table} />
                  )}

                  {table.service === 'truck-dispatch' && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {DISPATCH_MODELS.map((m) => (
                        <div key={m.id} className="rounded-xl border border-svc/25 bg-svc/5 p-5">
                          <p className="text-sm font-medium">{m.label}</p>
                          <p className="mt-2 font-display text-2xl font-semibold text-svc">
                            {dispatchPercentLabel(m.percent)} of weekly gross
                          </p>
                          <p className="mt-1 text-xs text-fg-subtle">
                            OTR only, no flat rate. Typical weekly gross USD {m.typicalGross[0].toLocaleString()}–
                            {m.typicalGross[1].toLocaleString()} per truck.
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </Reveal>
            );
          })}
        </div>

        <SectionHeading
          className="mt-20"
          eyebrow="What these are not"
          title="Ranges for guidance, never a binding quote"
          body="Every figure on this page is a published range. A quote follows a consultation, arrives in writing and carries acceptance criteria. If a supplier gives you a firm number before understanding your scope, be careful with it."
        />
      </Container>
    </Section>
  );
}
