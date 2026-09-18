import { FileText, Newspaper } from 'lucide-react';
import { INVESTOR_METRICS, INVESTOR_REPORTS, PRESS, LEADERSHIP, MILESTONES } from '@/data/company';
import { PageHero } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox, Badge } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { GatedDownloadForm, InvestorForm } from '@/components/forms';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';
import { formatDateShort } from '@/lib/format';

export const metadata = pageMeta({
  title: 'Investors',
  description:
    'Company overview, growth metrics, leadership, reports and investment enquiries for Texas Solutions.',
  path: '/investors',
});

export default function InvestorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Investors', href: '/investors' }])} />

      <PageHero
        eyebrow="Investors"
        title="A diversified services group, built from customer demand"
        body="Thirteen service lines across freight, marketing and engineering, with most revenue recurring. This page carries the headline numbers and the route to a conversation."
        trail={[{ label: 'Investors' }]}
      />

      <Section id="overview">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="prose-ts">
              <h2 className="!mt-0">Company overview</h2>
              <p>
                Texas Solutions operates thirteen service lines: web and app development, quality assurance,
                lead generation and auto engines; enterprise IT across AI, data, cloud, CRM and ERP,
                cybersecurity and dedicated teams; and truck dispatch, ads and AdSense management. Each line carries its own agreements and pricing, and each was added because
                existing clients asked for it.
              </p>
              <p>
                That origin matters commercially. Customer acquisition for a new line starts inside the
                existing base, which keeps the cost of expansion low and gives each line a proven first
                cohort before it is sold externally.
              </p>
              <p>
                Revenue concentration risk is managed by the mix. Freight cycles, marketing budgets and
                engineering spend do not move together, so a soft quarter in one line has historically been
                offset elsewhere.
              </p>
              <h2>How we charge</h2>
              <p>
                Dispatch is a percentage of carrier linehaul or a flat weekly fee per truck. Marketing and QA
                run on monthly retainers. Development is project-based. Engine supply is transactional. The
                blend produces the recurring share shown below.
              </p>
            </div>

            <Reveal direction="left">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7" id="metrics">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Growth metrics
                </p>
                <dl className="mt-5 space-y-4">
                  {INVESTOR_METRICS.map((m) => (
                    <div key={m.label} className="border-b border-accent/15 pb-4 last:border-0 last:pb-0">
                      <dd className="font-display text-2xl font-semibold text-accent">{m.value}</dd>
                      <dt className="mt-0.5 text-sm font-medium">{m.label}</dt>
                      <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{m.note}</p>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          <NoteBox tone="warn" className="mt-10">
            Figures on this page are management estimates prepared for information only. They are not audited
            financial statements, and nothing here is an offer to sell or a solicitation to buy securities.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- Leadership ---- */}
      <Section tone="soft" id="leadership">
        <Container>
          <SectionHeading eyebrow="Leadership" title="Who runs each part of the business" />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((p) => (
              <RevealItem key={p.role}>
                <div className="h-full rounded-xl border border-line bg-bg-elev p-5">
                  <p className="font-display text-sm font-semibold">{p.name ?? 'Name pending sign-off'}</p>
                  <p className="mt-0.5 text-xs text-accent">{p.role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">{p.focus}</p>
                  <p className="mt-2 text-[0.6875rem] text-fg-subtle">{p.region}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Reports ---- */}
      <Section id="reports">
        <Container>
          <SectionHeading
            eyebrow="Reports"
            title="Downloadable overviews"
            body="Each sits behind a three-field form so we know who has a copy. No drip sequence follows."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <ul className="space-y-4">
              {INVESTOR_REPORTS.map((r) => (
                <Reveal key={r.title} as="li">
                  <div className="flex gap-5 rounded-2xl border border-line bg-bg-elev p-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                      <FileText className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-semibold">{r.title}</h3>
                        <Badge>{r.kind}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{r.summary}</p>
                      <p className="mt-2 text-xs text-fg-subtle">PDF · {r.pages} pages · gated</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <GatedDownloadForm title="Company overview 2026" resource="company-overview-2026" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Press ---- */}
      <Section tone="soft" id="press">
        <Container>
          <SectionHeading
            eyebrow="Press and news"
            title="Company announcements"
            body="Every item below is our own announcement. Third-party coverage is listed separately once it exists."
          />
          <ul className="mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {PRESS.map((p) => (
              <li key={p.title} className="flex flex-wrap items-center gap-4 bg-bg-elev px-6 py-5">
                <Newspaper className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.title}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">
                    {formatDateShort(p.date)} · {p.outlet}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---- Milestones ---- */}
      <Section>
        <Container>
          <SectionHeading eyebrow="History" title="Seven years, thirteen lines" />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.slice(-4).map((m) => (
              <li key={m.year} className="rounded-2xl border border-line bg-bg-soft p-6">
                <span className="font-mono text-sm font-semibold text-accent">{m.year}</span>
                <h3 className="mt-2 font-display text-base font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{m.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---- Enquiry ---- */}
      <Section tone="soft" id="enquiry">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Investment enquiry"
              title="Talk to the managing director"
              body="Investment enquiries skip the sales team entirely and are answered within two business days."
              align="center"
            />
            <div className="mt-10 rounded-2xl border border-line bg-bg-elev p-7 sm:p-9">
              <InvestorForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
