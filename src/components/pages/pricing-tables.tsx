'use client';

import Link from 'next/link';
import type { PriceTable } from '@/data/pricing';
import { DISPATCH_MODELS, dispatchPercentLabel } from '@/data/pricing';
import type { Service } from '@/data/services';
import { FullPriceTable, ServicePriceTable } from '@/components/price-table';
import { Container, Section, SectionHeading, NoteBox, ArrowLink } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

export function PricingTables({ tables, services }: { tables: PriceTable[]; services: Service[] }) {
  const view = 'mine' as 'mine' | 'all';

  return (
    <Section>
      <Container>
        <NoteBox>
          All prices are in US dollars. Ranges are indicative: your scope sets the final figure, and every
          quote is confirmed in writing before work starts.
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
