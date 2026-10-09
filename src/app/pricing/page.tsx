import { PRICE_TABLES, PRICE_SOURCES } from '@/data/pricing';
import { SERVICES } from '@/data/services';
import { PricingTables } from '@/components/pages/pricing-tables';
import { RateCard } from '@/components/pages/rate-card';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Pricing — every service, in US dollars',
  description:
    'Texas Solutions pricing in US dollars: hourly rates, dedicated monthly resources, development packages, monthly plans and fixed-scope project ranges for all thirteen service lines.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Pricing', href: '/pricing' }])} />

      <PageHero
        eyebrow="Pricing"
        title="Our prices, in one place"
        body="One US-dollar price list for every client: hourly rates, dedicated resources, development packages, monthly plans and project ranges. The same figures feed every service page and the estimate calculator."
        trail={[{ label: 'Pricing' }]}
      />

      <RateCard />

      <PricingTables tables={PRICE_TABLES} services={SERVICES} />

      {/* ---- Sources ---- */}
      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Market research"
            title="External benchmarks (not our prices)"
            body="Third-party surveys and rate guides we reviewed when setting our rates. They describe the wider market, not what Texas Solutions charges; our prices are the tables above."
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
            Every price on this page is our own rate card. No public pricing survey exists for AdSense management, so
            there is no external benchmark for that line.
          </NoteBox>
        </Container>
      </Section>

      <CtaSection
        title="Turn a table into your number"
        body="The calculator reads these exact tables and shows the estimate, with every line item, before asking for any contact details."
        primary={{ href: '/estimate', label: 'Get an Estimate' }}
        secondary={{ href: '/contact', label: 'Talk to a Specialist' }}
      />
    </>
  );
}
