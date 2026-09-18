import { MapPin, User } from 'lucide-react';
import { MILESTONES, VALUES, LEADERSHIP, CSR } from '@/data/company';
import { OFFICES, CERTIFICATIONS, SITE } from '@/data/site';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox, Badge } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'About us',
  description:
    'Texas Solutions started as a two-person truck dispatch desk in Houston in 2019 and now runs seven service lines across five offices.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'About us', href: '/about' }])} />

      <PageHero
        eyebrow="About us"
        title="It started with one phone and a load board"
        body="Texas Solutions began as a two-person dispatch desk in Houston in 2019. Everything since has come from carriers asking for one more thing we did not yet do."
        trail={[{ label: 'About us' }]}
      />

      {/* ---- Story ---- */}
      <Section id="story">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="prose-ts">
              <p className="text-lg text-fg">
                The first client was an owner-operator running a dry van who was spending three hours a night
                on load boards and still sitting empty on Mondays. Booking his loads was the whole business.
              </p>
              <p>
                Within a year the work had changed shape. Carriers wanted the invoicing done, the broker
                packets filled in, the detention claimed. Then they wanted a website that would recruit
                drivers, then outbound to find shippers directly, then paid ads, then someone to test the
                software they had commissioned. Each service line exists because a client asked twice.
              </p>
              <p>
                That history explains the odd-looking mix. A dispatch desk and a QA practice are not obvious
                neighbours, but both are back-office work that a small operator cannot staff on its own and
                cannot afford to get wrong.
              </p>
              <p>
                What has not changed is the shape of the promise: a named person is accountable, the price is
                published, and you can leave on thirty days notice.
              </p>
            </div>

            <Reveal direction="left">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  At a glance
                </p>
                <dl className="mt-5 space-y-4">
                  {[
                    ['Founded', `${SITE.founded}, Houston, Texas`],
                    ['Service lines', 'Seven, each with its own agreement'],
                    ['Offices', 'Houston, London, Toronto, Sydney, Lahore'],
                    ['Dispatch coverage', '24/7 across two time zones'],
                    ['Regions priced', 'US, UK, Canada, Australia, Europe'],
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

      {/* ---- Timeline ---- */}
      <Section tone="soft" id="timeline">
        <Container>
          <SectionHeading eyebrow="Timeline" title="How seven service lines came together" />
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

      {/* ---- Leadership ---- */}
      <Section id="leadership">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="Who is accountable for what"
            body="Roles are listed with the person who holds them where we have permission to publish a name. The rest are named once headshots and bios are signed off."
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((p) => (
              <RevealItem key={p.role}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-bg-soft text-fg-subtle">
                    {p.name ? (
                      <span className="font-display text-base font-semibold text-accent">{p.name.charAt(0)}</span>
                    ) : (
                      <User className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{p.name ?? 'Name pending sign-off'}</h3>
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

          <NoteBox className="mt-8">
            We do not publish stock photography with invented names against it. Real headshots and bios replace
            these cards before launch.
          </NoteBox>
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

      {/* ---- Certifications ---- */}
      <Section id="certifications">
        <Container>
          <SectionHeading
            eyebrow="Certifications and partners"
            title="Where each badge actually stands"
            body="Status is published next to each one rather than implied by an image."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Certification and partner status</caption>
              <thead>
                <tr className="border-b border-line bg-bg-soft">
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Badge</th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Area</th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {CERTIFICATIONS.map((c) => (
                  <tr key={c.name} className="bg-bg-elev">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-fg">{c.name}</th>
                    <td className="px-5 py-4 text-fg-muted">{c.detail}</td>
                    <td className="px-5 py-4">
                      <Badge tone={c.note.includes('progress') || c.note.includes('Verify') ? 'warn' : 'success'}>
                        {c.note}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* ---- Offices ---- */}
      <Section tone="soft" id="offices">
        <Container>
          <SectionHeading eyebrow="Offices" title="Five locations, four time zones" />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <address className="mt-4 text-sm not-italic leading-relaxed text-fg-muted">
                    {o.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </address>
                  <p className="mt-3 text-xs text-fg-subtle">{o.focus}</p>
                  <p className="mt-1 text-xs text-fg-subtle">{o.timezone.replace('_', ' ')}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <NoteBox className="mt-8">
            An interactive office map is added once photography and exact suite numbers are confirmed. We would
            rather show an accurate list than an imprecise pin.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- CSR ---- */}
      <Section id="csr">
        <Container>
          <SectionHeading
            eyebrow="Corporate responsibility"
            title="Four commitments with a budget attached"
            body="Each of these has a line in the annual plan rather than a paragraph on a website."
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

      <CtaSection
        title="Want to talk to the people on this page?"
        body="Every enquiry reaches a named person rather than a queue, and the first reply comes within four business hours."
        primary={{ href: '/contact', label: 'Contact us' }}
        secondary={{ href: '/look-inside', label: 'Look inside the company' }}
      />
    </>
  );
}
