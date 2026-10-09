import { MapPin } from 'lucide-react';
import { MILESTONES, VALUES, LEADERSHIP, CSR } from '@/data/company';
import { OFFICES, CERTIFICATIONS, INTERNAL_PRACTICES } from '@/data/site';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, Badge } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'About us',
  description:
    'Texas Solutions runs thirteen service lines from its office in Midland, Texas, with a delivery team in Lahore, Pakistan. Owner and CEO: Shehryar Joyia.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'About us', href: '/about' }])} />

      <PageHero
        eyebrow="About us"
        title="One accountable team, thirteen service lines"
        body="Texas Solutions is run from Midland, Texas, with a delivery team in Lahore, Pakistan. Software, marketing and truck dispatch, with one published price list and a named contact."
        trail={[{ label: 'About us' }]}
      />

      {/* ---- Story ---- */}
      <Section id="story">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="prose-ts">
              <p className="text-lg text-fg">
                Texas Solutions provides software development, QA, marketing and lead generation, and truck
                dispatch for US carriers, under one company and one account contact.
              </p>
              <p>
                A dispatch desk and a QA practice are not obvious neighbours, but both are back-office work that
                a small operator cannot staff on its own and cannot afford to get wrong.
              </p>
              <p>
                The promise is simple: a named person is accountable, the price is published, and you can leave
                on thirty days notice.
              </p>
            </div>

            <Reveal direction="left">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  At a glance
                </p>
                <dl className="mt-5 space-y-4">
                  {[
                    ['Owner and CEO', 'Shehryar Joyia'],
                    ['Service lines', 'Thirteen, each with its own agreement'],
                    ['Office', 'Midland, Texas'],
                    ['Delivery team', 'Lahore, Pakistan'],
                    ['Dispatch desk', '24/7'],
                    ['Pricing', 'One published US dollar price list'],
                    ['Notice period', '30 days, every service'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 border-b border-accent/15 pb-3 last:border-0">
                      <dt className="text-sm text-fg-subtle">{k}</dt>
                      <dd className="text-right text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Timeline (hidden until history is verified) ---- */}
      {MILESTONES.length > 0 && (
      <Section tone="soft" id="timeline">
        <Container>
          <SectionHeading eyebrow="Timeline" title="How thirteen service lines came together" />
          <ol className="relative mt-12 border-l border-line pl-8 sm:pl-10">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.04} as="li" className="relative pb-10 last:pb-0">
                <span
                  className="absolute -left-[calc(2rem+6px)] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-accent sm:-left-[calc(2.5rem+6px)]"
                  aria-hidden
                />
                <span className="font-mono text-sm font-semibold text-accent">{m.year}</span>
                <h3 className="mt-1.5 font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>
      )}

      {/* ---- Leadership ---- */}
      <Section id="leadership">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="Who is accountable"
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.filter((p) => p.name).map((p) => (
              <RevealItem key={p.role}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-bg-soft text-fg-subtle">
                    <span className="font-display text-base font-semibold text-accent">{p.name?.charAt(0)}</span>
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-accent">{p.role}</p>
                  <p className="mt-2.5 text-xs leading-relaxed text-fg-muted">{p.focus}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-subtle">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {p.region}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Values ---- */}
      <Section tone="soft" id="values">
        <Container>
          <SectionHeading eyebrow="Values" title="Six things we hold to" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <h3 className="font-display text-lg font-semibold text-accent">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{v.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- How we work (internal practices, not certifications) ---- */}
      <Section id="how-we-work">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="Internal practices we follow"
            body="These are our own working practices. They are not certifications or third-party accreditations."
          />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTERNAL_PRACTICES.map((c) => (
              <RevealItem key={c.name}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <Badge>Internal practice</Badge>
                  <h3 className="mt-3 font-display text-base font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{c.detail}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          {CERTIFICATIONS.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {CERTIFICATIONS.map((c) => (
                <li key={c.name} className="rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm">
                  {c.name} <span className="text-fg-subtle">{c.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* ---- Offices ---- */}
      <Section tone="soft" id="offices">
        <Container>
          <SectionHeading eyebrow="Where we are" title="Midland, Texas and Lahore, Pakistan" />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2">
            {OFFICES.map((o) => (
              <RevealItem key={o.city}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{o.city}</h3>
                      <p className="text-sm text-fg-subtle">{o.country}</p>
                    </div>
                    <MapPin className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  </div>
                  {o.address.length > 0 && (
                    <address className="mt-4 text-sm not-italic leading-relaxed text-fg-muted">
                      {o.address.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </address>
                  )}
                  <p className="mt-3 text-xs text-fg-subtle">{o.focus}</p>
                  <p className="mt-1 text-xs text-fg-subtle">{o.timezone.replace('_', ' ')}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- CSR (hidden while empty) ---- */}
      {CSR.length > 0 && (
      <Section id="csr">
        <Container>
          <SectionHeading
            eyebrow="Corporate responsibility"
            title="Commitments"
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {CSR.map((c) => (
              <RevealItem key={c.title}>
                <div className="h-full rounded-2xl border border-line bg-bg-soft p-7">
                  <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-fg-muted">{c.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
      )}

      <CtaSection
        title="Want to talk to us?"
        body="Every enquiry reaches a named person rather than a queue, and the first reply comes within one business day."
        primary={{ href: '/contact', label: 'Contact us' }}
        secondary={{ href: '/look-inside', label: 'Look inside the company' }}
      />
    </>
  );
}
