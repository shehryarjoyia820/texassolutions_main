import { Clock, MapPin, Briefcase } from 'lucide-react';
import { LIFE_AT, DISPATCH_DAY, JOBS, VALUES, LEADERSHIP } from '@/data/company';
import { OFFICES } from '@/data/site';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox, Badge } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { JobApplicationForm } from '@/components/forms';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';
import { formatDateShort } from '@/lib/format';

export const metadata = pageMeta({
  title: 'Look inside Texas Solutions',
  description:
    'How the company actually runs: a day on the dispatch desk from the 4:30am board sweep to overnight handover, our culture, offices and open roles.',
  path: '/look-inside',
});

export default function LookInsidePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Look inside', href: '/look-inside' }])} />

      <PageHero
        eyebrow="Look inside"
        title="The desk never actually closes"
        body="Dispatch runs around the clock across Houston and Lahore, which shapes how the whole company works. This page shows the parts a sales call never covers."
        trail={[{ label: 'Look inside' }]}
      />

      {/* ---- Life at ---- */}
      <Section id="life">
        <Container>
          <SectionHeading eyebrow="Life at Texas Solutions" title="Four things that define working here" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {LIFE_AT.map((l) => (
              <RevealItem key={l.title}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-7">
                  <h3 className="font-display text-lg font-semibold">{l.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-fg-muted">{l.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox className="mt-8">
            Team photography and the day-on-dispatch video are added once we have signed releases from
            everyone who appears in them. Until then this page is written rather than shot.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- A day on dispatch ---- */}
      <Section tone="soft" id="dispatch-day">
        <Container>
          <SectionHeading
            eyebrow="A day on dispatch"
            title="From the 4:30am board sweep to overnight handover"
            body="This is the real rhythm of the desk, in Central Time, as the Houston team runs it."
          />
          <ol className="relative mt-12 border-l border-line pl-8 sm:pl-10">
            {DISPATCH_DAY.map((d, i) => (
              <Reveal key={d.time} delay={i * 0.05} as="li" className="relative pb-9 last:pb-0">
                <span
                  className="absolute -left-[calc(2rem+7px)] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-accent bg-bg sm:-left-[calc(2.5rem+7px)]"
                  aria-hidden
                />
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-accent">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {d.time}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{d.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---- Team ---- */}
      <Section id="team">
        <Container>
          <SectionHeading
            eyebrow="Our team"
            title="Every service line has a named owner"
            body="Around ninety people across five locations. Each client gets a named contact on each service they use."
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((p) => (
              <RevealItem key={p.role}>
                <div className="h-full rounded-xl border border-line bg-bg-soft p-5">
                  <p className="font-display text-sm font-semibold">{p.name ?? 'Name pending sign-off'}</p>
                  <p className="mt-0.5 text-xs text-accent">{p.role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">{p.focus}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Values ---- */}
      <Section tone="soft" id="values">
        <Container>
          <SectionHeading eyebrow="Culture and values" title="What we argue about in reviews" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <h3 className="font-display text-base font-semibold text-accent">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{v.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Offices ---- */}
      <Section id="offices">
        <Container>
          <SectionHeading eyebrow="Office tour" title="Where the work happens" />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((o) => (
              <RevealItem key={o.city}>
                <div className="h-full overflow-hidden rounded-2xl border border-line bg-bg-elev">
                  <div className="relative h-32 overflow-hidden bg-bg-soft">
                    <div aria-hidden className="absolute inset-0 grid-noise opacity-70" />
                    <div aria-hidden className="absolute inset-0 accent-glow" />
                    <span className="absolute bottom-3 left-4 font-display text-xl font-semibold">{o.city}</span>
                  </div>
                  <div className="p-5">
                    <p className="flex items-center gap-1.5 text-xs text-fg-subtle">
                      <MapPin className="h-3 w-3" aria-hidden />
                      {o.country}
                    </p>
                    <p className="mt-2 text-sm text-fg-muted">{o.focus}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <NoteBox className="mt-8">
            Office photography replaces these placeholder panels before launch. We are not using stock
            interiors to imply premises we have not photographed.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- Careers ---- */}
      <Section tone="soft" id="careers">
        <Container>
          <SectionHeading
            eyebrow="Careers"
            title={`${JOBS.length} open roles`}
            body="Most roles are remote-friendly. Dispatch roles need overlap with US hours, and we say which ones on the listing."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <ul className="space-y-4">
                {JOBS.map((job) => (
                  <Reveal key={job.slug} as="li">
                    <article className="rounded-2xl border border-line bg-bg-elev p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-semibold">{job.title}</h3>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle">
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="h-3 w-3" aria-hidden />
                              {job.team}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" aria-hidden />
                              {job.location}
                            </span>
                            <span>Posted {formatDateShort(job.posted)}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge>{job.type}</Badge>
                          {job.remote && <Badge tone="success">Remote</Badge>}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-fg-muted">{job.summary}</p>

                      <details className="group mt-4">
                        <summary className="cursor-pointer list-none text-sm font-medium text-accent">
                          <span className="group-open:hidden">Read the full role</span>
                          <span className="hidden group-open:inline">Hide details</span>
                        </summary>
                        <div className="mt-4 grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                              What you will do
                            </p>
                            <ul className="mt-2.5 space-y-1.5">
                              {job.responsibilities.map((r) => (
                                <li key={r} className="flex gap-2 text-sm text-fg-muted">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                              What we need
                            </p>
                            <ul className="mt-2.5 space-y-1.5">
                              {job.requirements.map((r) => (
                                <li key={r} className="flex gap-2 text-sm text-fg-muted">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7">
                <h2 className="font-display text-xl font-semibold">Apply</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  We read every application ourselves and reply either way, usually within five working days.
                </p>
                <div className="mt-6">
                  <JobApplicationForm roles={JOBS.map((j) => ({ slug: j.slug, title: j.title }))} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Nothing open that fits?"
        body="We keep speculative applications on file for six months and do contact people when a role appears. Send one through the contact form."
        primary={{ href: '/contact', label: 'Send a speculative application' }}
        secondary={{ href: '/about', label: 'Read the company story' }}
      />
    </>
  );
}
