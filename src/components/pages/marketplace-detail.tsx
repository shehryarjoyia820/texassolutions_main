'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { MarketplaceItem } from '@/data/catalog';
import { MARKETPLACE_ITEMS } from '@/data/catalog';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { SERVICES } from '@/data/services';
import { useRegion } from '@/components/providers';
import { formatRange } from '@/lib/format';
import { PageHero, CtaSection } from '@/components/page-shell';
import { ArrowLink, Badge, ButtonLink, Container, Section, NoteBox } from '@/components/ui';
import { EnquiryForm } from '@/components/forms';
import { RevealGroup, RevealItem, TiltCard } from '@/components/motion';
import { TemplatePreview } from '@/components/template-preview';

export function MarketplaceDetail({ item }: { item: MarketplaceItem }) {
  const { code, region } = useRegion();
  const accent = hexToTriplet(item.accentHex);

  const row =
    item.priceService && item.priceRow
      ? PRICE_TABLE_MAP[item.priceService]?.rows.find((r) => r.id === item.priceRow)
      : undefined;
  const value = row?.values[code] ?? null;
  const service = SERVICES.find((s) => s.slug === item.service);

  const related = MARKETPLACE_ITEMS.filter((m) => m.category === item.category && m.slug !== item.slug).slice(0, 3);

  return (
    <div style={{ ['--svc' as string]: accent }}>
      <PageHero
        eyebrow={item.category}
        title={item.name}
        body={item.summary}
        trail={[{ label: 'Marketplace', href: '/marketplace' }, { label: item.name }]}
        accent={accent}
      >
        <div className="flex flex-wrap items-center gap-3">
          {item.tags.map((t) => (
            <Badge key={t} tone="service">
              {t}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              {item.preview && (
                <TiltCard className="mb-10" max={4}>
                  <TemplatePreview config={item.preview} accent={item.accentHex} className="shadow-lift" />
                </TiltCard>
              )}
              <p className="text-lg leading-relaxed text-fg">{item.description}</p>

              {item.pages && (
                <>
                  <h2 className="mt-10 text-display-sm">Pages and screens included</h2>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.pages.map((pg) => (
                      <li key={pg} className="rounded-full border border-svc/30 bg-svc/5 px-3 py-1.5 text-sm text-fg-muted">
                        {pg}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h2 className="mt-12 text-display-sm">What is included</h2>
              <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
                {item.highlights.map((h) => (
                  <RevealItem key={h}>
                    <div className="flex gap-3 rounded-xl border border-line bg-bg-soft p-4">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                      <span className="text-sm text-fg-muted">{h}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              {service && (
                <div className="mt-10 rounded-2xl border border-line bg-bg-elev p-6">
                  <p className="text-sm text-fg-muted">
                    This is delivered by our{' '}
                    <Link href={`/services/${service.slug}`} className="font-medium text-svc hover:underline">
                      {service.navLabel}
                    </Link>{' '}
                    team, on the same process and the same service levels as a custom engagement.
                  </p>
                </div>
              )}

              <NoteBox tone="warn" className="mt-6">
                Enquiry-only in this release. There is no checkout: you tell us what you need, we confirm
                availability and the price for your region, then we invoice.
              </NoteBox>

              {related.length > 0 && (
                <>
                  <h2 className="mt-14 text-display-sm">Others in {item.category.toLowerCase()}</h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/marketplace/${r.slug}`}
                          className="group flex h-full flex-col rounded-xl border border-line bg-bg-soft p-5 transition-colors hover:border-svc/40"
                        >
                          <span className="font-display text-sm font-semibold group-hover:text-svc">{r.name}</span>
                          <span className="mt-1.5 flex-1 text-xs leading-relaxed text-fg-subtle">{r.summary}</span>
                          <ArrowRight className="mt-3 h-4 w-4 text-svc transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
                <p className="text-xs uppercase tracking-wider text-fg-subtle">
                  Price · {region.label} · {region.currency}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-svc">
                  {item.priceLabel ?? formatRange(value, code, { plus: row?.plus?.[code], compact: true })}
                </p>
                {row && <p className="mt-1.5 text-sm text-fg-muted">Priced from: {row.label}</p>}
                {item.priceService && (
                  <ArrowLink href="/pricing" className="mt-4">
                    See the full price table
                  </ArrowLink>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-bg-elev p-6">
                <h2 className="font-display text-lg font-semibold">Enquire about {item.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  We reply within one business day with availability and a confirmed price.
                </p>
                <div className="mt-5">
                  <EnquiryForm subject={item.name} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Need this, but different?"
        body="Most marketplace items started as a custom build. Tell us what is different about your case and we will scope the delta rather than force a fit."
        primary={{ href: '/estimate', label: 'Run the calculator' }}
        secondary={{ href: '/marketplace', label: 'Back to marketplace' }}
      />
    </div>
  );
}

function hexToTriplet(hex: string) {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)} ${parseInt(c.slice(2, 4), 16)} ${parseInt(c.slice(4, 6), 16)}`;
}
