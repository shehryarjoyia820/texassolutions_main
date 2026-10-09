import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { CASE_STUDIES } from '@/data/insights';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox, Badge } from '@/components/ui';
import { RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Portfolio',
  description:
    'Illustrative examples for all thirteen service lines, showing the kind of result each service targets. These are examples, not client results.',
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Portfolio', href: '/portfolio' }])} />

      <PageHero
        eyebrow="Portfolio"
        title="Illustrative examples, one per service line"
        body="Each example shows the kind of problem a service addresses and the metrics it targets. They are illustrative examples, not client results."
        trail={[{ label: 'Portfolio' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Illustrative examples"
            title="One example per service line"
            body="Every card below is an illustrative example. The figures are example targets, not results achieved for a client."
          />

          <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2">
            {SERVICES.map((service) => (
              <RevealItem key={service.slug}>
                <article
                  className="flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-7"
                  style={{ ['--svc' as string]: service.accent }}
                >
                  <p className="mb-4 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs font-semibold text-fg">
                    Illustrative example — not a client result
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <Badge tone="service">{service.navLabel}</Badge>
                    <span className="text-xs text-fg-subtle">{service.caseStudy.sector}</span>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-semibold">{service.caseStudy.client}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.caseStudy.challenge}</p>

                  <ul className="mt-5 space-y-2">
                    {service.caseStudy.work.slice(0, 3).map((w) => (
                      <li key={w} className="flex gap-2 text-sm text-fg-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-svc" aria-hidden />
                        {w}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 grid flex-1 grid-cols-2 gap-3">
                    {service.caseStudy.results.slice(0, 4).map((r) => (
                      <div key={r.label} className="rounded-lg border border-line bg-bg-soft p-4">
                        <dt className="text-[0.6875rem] text-fg-subtle">Example target: {r.label}</dt>
                        <dd className="mt-1.5 flex items-baseline gap-1.5">
                          <span className="text-xs text-fg-subtle line-through">{r.before}</span>
                          <span className="font-display text-base font-semibold text-svc">{r.after}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/services/${service.slug}#case-study`}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-svc"
                  >
                    Read the full example
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox className="mt-10">
            These are illustrative examples showing the kind of result each service targets. They are not
            client results. Client names, logos and testimonials are published only with written permission.
          </NoteBox>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Written up in full"
            title="Long-form illustrative examples"
            body="Two examples written up end to end. Both are illustrative examples, not client results."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/insights/${cs.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50"
              >
                <p className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs font-semibold text-fg">
                  Illustrative example — not a client result
                </p>
                <div className="mt-3">
                  <Badge tone="accent">{cs.kind}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-accent">{cs.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-muted">{cs.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Read it
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Want to talk about your project?"
        body="Start with the range. If the numbers work, the next step is a consultation and a written scope."
        primary={{ href: '/estimate', label: 'Get an Estimate' }}
        secondary={{ href: '/contact', label: 'Talk it through' }}
      />
    </>
  );
}
