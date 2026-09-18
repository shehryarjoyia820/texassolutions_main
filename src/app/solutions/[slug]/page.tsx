import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { SOLUTIONS, getSolution } from '@/data/solutions';
import { SERVICES } from '@/data/services';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Accordion, ArrowLink, ButtonLink, Container, Section, SectionHeading } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return pageMeta({
    title: `${solution.name} — ${solution.promise}`,
    description: solution.summary,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const accent = hexToTriplet(solution.accentHex);

  return (
    <div style={{ ['--svc' as string]: accent }}>
      <JsonLd
        data={[
          faqSchema(solution.faqs),
          breadcrumbSchema([
            { label: 'Solutions', href: '/solutions' },
            { label: solution.name, href: `/solutions/${solution.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Solution"
        title={solution.name}
        body={solution.promise}
        trail={[{ label: 'Solutions', href: '/solutions' }, { label: solution.name }]}
        accent={accent}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/estimate" size="lg" variant="service" arrow magnetic>
            Get a Rough Estimate
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Talk to us
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-lg leading-relaxed text-fg">{solution.description}</p>

              <h2 className="mt-12 text-display-sm">What usually hurts</h2>
              <ul className="mt-6 space-y-3">
                {solution.painPoints.map((p) => (
                  <li key={p} className="flex gap-3 rounded-lg border border-line bg-bg-soft p-4 text-sm text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger/70" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Outcomes to expect
                </p>
                <dl className="mt-4 space-y-4">
                  {solution.outcomes.map((o) => (
                    <div key={o.label} className="border-b border-svc/15 pb-4 last:border-0 last:pb-0">
                      <dd className="font-display text-2xl font-semibold text-svc">{o.value}</dd>
                      <dt className="mt-0.5 text-sm font-medium">{o.label}</dt>
                      <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{o.note}</p>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-bg-elev p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Services in this solution
                </p>
                <ul className="mt-4 space-y-1">
                  {solution.services.map((s) => {
                    const svc = SERVICES.find((x) => x.slug === s);
                    if (!svc) return null;
                    return (
                      <li key={s}>
                        <Link
                          href={`/services/${s}`}
                          className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-bg-soft"
                        >
                          <span className="text-fg-muted group-hover:text-svc">{svc.navLabel}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-fg-subtle transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading eyebrow="The playbook" title="What we actually do, in order" />
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {solution.playbook.map((step, i) => (
              <RevealItem key={step.title} className="bg-bg-elev">
                <div className="flex h-full flex-col p-7">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-svc/15 font-display text-sm font-semibold text-svc">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-2xl border border-svc/25 bg-svc/5 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow mb-4 text-svc">Proof</p>
                <h2 className="text-display-sm">{solution.proof.headline}</h2>
                <p className="mt-4 leading-relaxed text-fg-muted">{solution.proof.body}</p>
                <ArrowLink href="/insights?kind=Case+study" className="mt-6">
                  Read the written case studies
                </ArrowLink>
              </div>
              <dl className="grid gap-4">
                {solution.proof.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-line bg-bg-elev p-5">
                    <dt className="text-xs text-fg-subtle">{m.label}</dt>
                    <dd className="mt-1.5 font-display text-xl font-semibold text-svc">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Questions" title={`About ${solution.navLabel.toLowerCase()}`} />
            <Accordion items={solution.faqs} defaultOpen={0} />
          </div>
        </Container>
      </Section>

      <CtaSection
        title={`Ready to price a ${solution.navLabel.toLowerCase()} engagement?`}
        body="The calculator covers every service in this solution. Answer seven questions and you have a range in your own currency."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Book a consultation' }}
      />
    </div>
  );
}

function hexToTriplet(hex: string) {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)} ${parseInt(c.slice(2, 4), 16)} ${parseInt(c.slice(4, 6), 16)}`;
}
