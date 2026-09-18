import { PRICE_TABLES, PRICE_SOURCES } from '@/data/pricing';
import { SERVICES } from '@/data/services';
import { PricingTables } from '@/components/pages/pricing-tables';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Pricing — every service, every region',
  description:
    'Published price ranges for all seven service lines across the US, UK, Canada, Australia and Europe, with the sources behind each figure and the ones we derived rather than measured.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Pricing', href: '/pricing' }])} />

      <PageHero
        eyebrow="Pricing"
        title="Every number we publish, in one place"
        body="Five regions, seven service lines, and the sources underneath. Where a figure is derived rather than measured, the page says so."
        trail={[{ label: 'Pricing' }]}
      />

      <PricingTables tables={PRICE_TABLES} services={SERVICES} />

      {/* ---- Sources ---- */}
      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Sources"
            title="Where these benchmarks come from"
            body="Published market surveys and rate guides, listed so you can check them yourself rather than take our word for it."
          />
          <ul className="mt-10 grid gap-2 sm:grid-cols-2">
            {PRICE_SOURCES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-line bg-bg-elev px-4 py-3 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <NoteBox tone="warn" className="mt-8">
            Two honest caveats. The AdSense management row is our own rate card, not a market benchmark, because
            no public pricing survey exists for that service. Canadian and European figures are scaled from US
            and UK benchmarks rather than measured locally, and should be treated as indicative.
          </NoteBox>
        </Container>
      </Section>

      <CtaSection
        title="Turn a table into your number"
        body="The calculator reads these exact tables and narrows the range once it knows your scope, timeline and region."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Ask about a figure' }}
      />
    </>
  );
}
