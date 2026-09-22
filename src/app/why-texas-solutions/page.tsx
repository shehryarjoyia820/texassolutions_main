import { Check, Minus, ShieldCheck } from 'lucide-react';
import {
  PROOF_POINTS,
  GUARANTEES,
  COMPARISON,
  SECURITY_PRACTICES,
  HOW_IT_WORKS,
} from '@/data/company';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { Counter, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Why Texas Solutions',
  description:
    'Thirteen service lines under one contract, published pricing in five regions, thirty days notice and accounts that stay in your name. Guarantees, SLAs and a straight comparison against agencies and in-house.',
  path: '/why-texas-solutions',
});

export default function WhyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Why Texas Solutions', href: '/why-texas-solutions' }])} />

      <PageHero
        eyebrow="Why us"
        title="What we commit to, in writing"
        body="Most of this page is numbers you can hold us to rather than adjectives. Where a claim needs a caveat, the caveat is on the page."
        trail={[{ label: 'Why Texas Solutions' }]}
      />

      {/* ---- Six proof points ---- */}
      <Section id="difference">
        <Container>
          <SectionHeading
            eyebrow="Our difference"
            title="Six things that are true here and often not elsewhere"
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROOF_POINTS.map((p) => (
              <RevealItem key={p.label}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-7">
                  <div className="font-display text-[2.75rem] font-semibold leading-none tracking-tight text-accent">
                    <Counter value={p.value} suffix={p.suffix} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{p.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Process ---- */}
      <Section tone="soft" id="process">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="From enquiry to a reporting rhythm"
            body="Dispatch moves faster than this. Build projects follow it closely."
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step} className="bg-bg-elev">
                <div className="flex h-full flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-semibold text-accent/25">{s.step}</span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
                      {s.duration}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---- Guarantees ---- */}
      <Section id="guarantees">
        <Container>
          <SectionHeading
            eyebrow="Guarantees and SLAs"
            title="The response times we hold ourselves to"
            body="Each row names how it is measured, because a service level nobody measures is a slogan."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Service level commitments</caption>
              <thead>
                <tr className="border-b border-line bg-bg-soft">
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    Commitment
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    Standard
                  </th>
                  <th scope="col" className="hidden px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle sm:table-cell">
                    Measured by
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {GUARANTEES.map((g) => (
                  <tr key={g.item} className="bg-bg-elev">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-fg">
                      {g.item}
                    </th>
                    <td className="px-5 py-4 text-accent">{g.standard}</td>
                    <td className="hidden px-5 py-4 text-fg-subtle sm:table-cell">{g.measured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* ---- Comparison ---- */}
      <Section tone="soft" id="compare">
        <Container>
          <SectionHeading
            eyebrow="Compare us"
            title="Against a typical agency, and against hiring"
            body="Written as fairly as we can. In-house wins on some rows and we have not hidden those."
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">Texas Solutions compared with a typical agency and in-house teams</caption>
              <thead>
                <tr className="border-b border-line bg-bg-soft">
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle" />
                  {COMPARISON.columns.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${
                        i === 0 ? 'text-accent' : 'text-fg-subtle'
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARISON.rows.map((row) => (
                  <tr key={row.label} className="bg-bg-elev">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-fg">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={`px-5 py-4 ${i === 0 ? 'font-medium text-accent' : 'text-fg-muted'}`}>
                        <span className="flex items-start gap-2">
                          {i === 0 ? (
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                          ) : (
                            <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-subtle" aria-hidden />
                          )}
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* ---- Pricing philosophy ---- */}
      <Section id="pricing">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Pricing philosophy"
              title="Why the numbers are on the website"
              body="Pricing that only appears after a discovery call usually appears higher. Ours is published, per region, and the calculator reads the same tables."
            />
            <Reveal>
              <ul className="space-y-4">
                {[
                  ['Ranges, not single numbers', 'A single figure before scope is known is a guess dressed as a quote. We publish the range and narrow it with you.'],
                  ['Five authored tables', 'Each region has its own figures. We do not convert currency live, because conversion implies a precision we do not have.'],
                  ['Derived figures are flagged', 'Canadian and European numbers are scaled from US and UK benchmarks. The pricing page says so on the page, not in a footnote.'],
                  ['The fee base is stated', 'Dispatch is a stated percentage of weekly gross with no flat rate: 5% for semis, 8% for hotshots, 10% for box trucks. AdSense uplift is measured against an agreed baseline. Ads fees are the lower of flat or percentage.'],
                ].map(([title, body]) => (
                  <li key={title} className="rounded-xl border border-line bg-bg-soft p-5">
                    <p className="font-display text-base font-semibold">{title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Security ---- */}
      <Section tone="soft" id="security">
        <Container>
          <SectionHeading
            eyebrow="Security and compliance"
            title="How we handle your data"
            body="Written for a buyer doing due diligence rather than for a badge wall."
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_PRACTICES.map((s) => (
              <RevealItem key={s.title}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <ShieldCheck className="h-6 w-6 text-success" aria-hidden />
                  <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox tone="warn" className="mt-8">
            ISO 27001 and SOC 2 are shown as aligned and in readiness assessment respectively, not as
            completed certifications. We will change that wording the day the certificates exist and not
            before.
          </NoteBox>
        </Container>
      </Section>

      <CtaSection
        title="Hold us to the numbers on this page"
        body="If a service level here matters to your decision, it goes into the agreement. Start with a range and a conversation."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Ask about SLAs' }}
      />
    </>
  );
}
