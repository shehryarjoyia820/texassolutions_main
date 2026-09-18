import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MARKETS } from '@/data/markets';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading } from '@/components/ui';
import { QuickAnswer } from '@/components/seo-blocks';
import { JsonLd, breadcrumbSchema, pageMeta, speakableSchema } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Markets We Serve | Software, AI & QA for the US, UK, Europe, Gulf and Asia',
  description:
    'Texas Solutions delivers custom software development, AI and machine learning, QA testing and dedicated teams for companies in the United States, UK, Europe, Canada, Australia, the UAE, Saudi Arabia, Qatar, Singapore and Japan.',
  path: '/markets',
  keywords: [
    'offshore software development company',
    'global software development partner',
    'software development company for enterprises',
    'software development company in Dubai',
    'software development company Singapore',
    'software development company UK',
  ],
});

const ANSWER =
  'Texas Solutions serves Tier 1 markets (the United States, United Kingdom, Canada, Australia, New Zealand and Western Europe), the Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman) and Asia (Singapore, Japan, Hong Kong, South Korea and Malaysia). Each market has its own published price table and a working-day overlap with our delivery teams.';

export default function MarketsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ label: 'Markets', href: '/markets' }]), speakableSchema('/markets', 'Markets we serve')]} />
      <PageHero
        eyebrow="Markets"
        title="Software, AI and QA for Tier 1 markets, the Gulf and Asia"
        body="One delivery organisation, published pricing per region, and working hours that overlap with yours."
        trail={[{ label: 'Markets' }]}
      />

      <section className="border-b border-line bg-bg-soft py-10">
        <Container>
          <QuickAnswer question="Which countries does Texas Solutions serve?" answer={ANSWER} />
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Seven market pages" title="Choose your market" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETS.map((m) => (
              <Link
                key={m.slug}
                href={`/markets/${m.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50"
              >
                <span className="text-3xl" aria-hidden>
                  {m.flag}
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold group-hover:text-accent">{m.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{m.headline}</p>
                <p className="mt-4 text-xs text-fg-subtle">{m.cities.slice(0, 5).join(' · ')}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Open the {m.name} page
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Not sure which region applies?"
        body="Pick the region where your company is billed. The calculator and every price table switch with it."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Ask us' }}
      />
    </>
  );
}
