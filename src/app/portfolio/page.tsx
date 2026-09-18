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
    'Work from all seven service lines with before and after figures. Client names appear once we have written permission to publish them.',
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Portfolio', href: '/portfolio' }])} />

      <PageHero
        eyebrow="Portfolio"
        title="Work, with the numbers attached"
        body="Seven engagements, one per service line. Each carries the metric that mattered to that client rather than a screenshot of a homepage."
        trail={[{ label: 'Portfolio' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Selected work"
            title="One engagement per service line"
            body="Described by sector and profile rather than by name, because naming a client needs their written permission and we have not assumed it."
          />

          <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2">
            {SERVICES.map((service) => (
              <RevealItem key={service.slug}>
                <article
                  className="flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-7"
                  style={{ ['--svc' as string]: service.accent }}
                >
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
                        <dt className="text-[0.6875rem] text-fg-subtle">{r.label}</dt>
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
                    Read the full case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox className="mt-10">
            Every figure here came from a real engagement. Logos, client names and testimonial attributions are
            published only with written permission, which is why this page describes profiles rather than
            brands.
          </NoteBox>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Written up in full"
            title="The long-form case studies"
            body="Two engagements documented end to end, including what mattered most rather than just what improved."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/insights/${cs.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50"
              >
                <Badge tone="accent">{cs.kind}</Badge>
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
        title="Want a result like one of these?"
        body="Start with the range. If the numbers work, the next step is a consultation and a written scope."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Talk it through' }}
      />
    </>
  );
}
