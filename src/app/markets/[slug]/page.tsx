import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { MARKETS, MARKET_MAP } from '@/data/markets';
import { SERVICES } from '@/data/services';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { getRegion } from '@/data/regions';
import { formatMoney } from '@/lib/format';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Accordion, ButtonLink, Container, Section, SectionHeading } from '@/components/ui';
import { QuickAnswer, MarketLinks } from '@/components/seo-blocks';
import { JsonLd, absUrl, breadcrumbSchema, faqSchema, pageMeta, speakableSchema } from '@/lib/seo';
import { SITE } from '@/data/site';

export function generateStaticParams() {
  return MARKETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = MARKET_MAP[slug];
  if (!market) return {};
  return pageMeta({
    title: market.metaTitle,
    description: market.metaDescription,
    path: `/markets/${market.slug}`,
    keywords: market.keywords,
  });
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = MARKET_MAP[slug];
  if (!market) notFound();

  const region = getRegion(market.region);
  const path = `/markets/${market.slug}`;
  const services = market.focusServices
    .map((s) => SERVICES.find((x) => x.slug === s))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));
  const others = MARKETS.filter((m) => m.slug !== market.slug).map((m) => ({ slug: m.slug, name: m.name, flag: m.flag }));

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: `${SITE.name} — ${market.name}`,
            url: absUrl(path),
            description: market.metaDescription,
            areaServed: market.countries.map((name) => ({ '@type': 'Country', name })),
            provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            knowsLanguage: market.slug === 'uae-gulf' ? ['en', 'ar'] : ['en'],
          },
          faqSchema(market.faqs),
          speakableSchema(path, market.metaTitle),
          breadcrumbSchema([
            { label: 'Markets', href: '/markets' },
            { label: market.name, href: path },
          ]),
        ]}
      />

      <PageHero
        eyebrow={`${market.flag} ${market.name}`}
        title={market.headline}
        body={market.intro[0]}
        trail={[{ label: 'Markets', href: '/markets' }, { label: market.name }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/estimate?region=${market.region}`} size="lg" arrow magnetic>
            Get a Rough Estimate in {region.currency}
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Book a consultation
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-bg-soft py-10">
        <Container>
          <QuickAnswer question={`Who provides software development, AI and QA services in ${market.name}?`} answer={market.quickAnswer} />
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="prose-ts max-w-none">
              <h2 className="!mt-0">How we work with companies in {market.name}</h2>
              {market.intro.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p>
                We serve clients across {market.countries.join(', ')}, including teams in {market.cities.join(', ')}.
              </p>
            </div>
            <dl className="grid content-start gap-3">
              {market.coverage.map((c) => (
                <div key={c.label} className="rounded-xl border border-line bg-bg-elev p-5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-fg-subtle">
                    {c.label.includes('hour') ? <Clock className="h-3.5 w-3.5" aria-hidden /> : <MapPin className="h-3.5 w-3.5" aria-hidden />}
                    {c.label}
                  </dt>
                  <dd className="mt-1.5 font-medium">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow={`Services in ${market.name}`}
            title={`Software, AI, QA and more for ${market.name}`}
            body={`Starting prices from our ${region.label} price table, in ${region.currency}.`}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const row = PRICE_TABLE_MAP[svc.slug]?.rows.find((r) => r.id === svc.startingPriceRow);
              const value = row?.values[market.region];
              return (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50"
                  style={{ ['--svc' as string]: svc.accent } as React.CSSProperties}
                >
                  <h3 className="font-display text-lg font-semibold group-hover:text-svc">
                    {svc.navLabel} in {market.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{svc.summary}</p>
                  <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-fg-subtle">
                      From{' '}
                      <span className="font-display font-semibold text-svc">
                        {value ? formatMoney(value[0], market.region, { compact: true }) : 'per job'}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-svc transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Compliance" title={`Data and regulatory requirements in ${market.name}`} />
              <ul className="mt-8 space-y-3">
                {market.compliance.map((c) => (
                  <li key={c.name} className="flex gap-3 rounded-xl border border-line bg-bg-soft p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
                    <span>
                      <span className="block font-medium">{c.name}</span>
                      <span className="mt-0.5 block text-sm text-fg-muted">{c.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-fg-subtle">
                This is an engineering summary, not legal advice. Your counsel should confirm obligations for your
                organisation.
              </p>
            </div>
            <div>
              <SectionHeading eyebrow="Why Texas Solutions" title={`Why companies in ${market.name} choose us`} />
              <ul className="mt-8 space-y-3">
                {market.whyUs.map((w) => (
                  <li key={w} className="flex gap-3 text-fg-muted">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Frequently asked questions" title={`Working with us from ${market.name}`} />
            <Accordion items={market.faqs} defaultOpen={0} />
          </div>
          <div className="mt-14">
            <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">Other markets we serve</p>
            <MarketLinks markets={others} />
          </div>
        </Container>
      </Section>

      <CtaSection
        title={`Price your project for ${market.name}`}
        body={`The calculator reads our ${region.label} price table and returns a low, likely and high range in ${region.currency}.`}
        primary={{ href: `/estimate?region=${market.region}`, label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Talk to us' }}
      />
    </>
  );
}
