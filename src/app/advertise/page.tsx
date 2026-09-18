import { AUDIENCE_STATS, AD_PLACEMENTS } from '@/data/company';
import { PageHero } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { MediaKitForm } from '@/components/forms';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Advertise with us',
  description:
    'Reach carriers, publishers and marketing leads across texassolutions.co and our newsletter. Placements, availability and the media kit.',
  path: '/advertise',
});

export default function AdvertisePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Advertise with us', href: '/advertise' }])} />

      <PageHero
        eyebrow="Advertise"
        title="An audience that buys trucks, traffic and testing"
        body="Close to half our readers are owner-operators or fleet decision makers. The rest are publishers and marketing leads. Small, specific and worth reaching if you sell to them."
        trail={[{ label: 'Advertise with us' }]}
      />

      <Section>
        <Container>
          <SectionHeading eyebrow="Audience" title="The numbers, unrounded" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE_STATS.map((s) => (
              <RevealItem key={s.label}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <p className="font-display text-3xl font-semibold text-accent">{s.value}</p>
                  <p className="mt-2 text-sm font-medium">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{s.note}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox tone="warn" className="mt-8">
            These are our own analytics figures for the trailing three months. We will share a screen of the
            underlying dashboard on a call rather than ask you to take the numbers on faith.
          </NoteBox>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Placements"
            title="Five ways to reach them"
            body="Inventory is deliberately limited. We would rather turn advertisers away than dilute the pages our readers come for."
          />

          <div className="mt-12 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <caption className="sr-only">Available advertising placements</caption>
              <thead>
                <tr className="border-b border-line bg-bg-elev">
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Placement</th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Specification</th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Where it appears</th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {AD_PLACEMENTS.map((p) => (
                  <tr key={p.name} className="bg-bg-soft">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-fg">{p.name}</th>
                    <td className="px-5 py-4 text-fg-muted">{p.spec}</td>
                    <td className="px-5 py-4 text-fg-muted">{p.where}</td>
                    <td className="px-5 py-4 text-accent">{p.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NoteBox className="mt-6">
            Sponsored posts are labelled as sponsored, sit on a permanent URL and carry the disclosure markup
            search engines expect. We do not sell dofollow links, and we do not publish anything our editor
            would not stand behind.
          </NoteBox>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <Reveal>
              <div>
                <SectionHeading
                  eyebrow="Rate card"
                  title="Rates are quoted per campaign"
                  body="Price depends on placement, duration and exclusivity, so a single published number would be misleading. The media kit carries the current ranges and the audience breakdown in full."
                />
                <ul className="mt-8 space-y-3">
                  {[
                    'Full audience breakdown by role, region and device',
                    'Current rates per placement, including bundle pricing',
                    'Editorial standards and disclosure policy',
                    'Historical click-through and engagement benchmarks',
                    'Production specifications and deadlines',
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 rounded-lg border border-line bg-bg-soft p-4 text-sm text-fg-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7 sm:p-9">
              <h2 className="font-display text-xl font-semibold">Request the media kit</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                The PDF and current rate card arrive by email, usually within the hour on business days.
              </p>
              <div className="mt-6">
                <MediaKitForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <NoteBox>
            <strong className="block text-fg">A note on Google publisher policy</strong>
            Pages carrying third-party advertising on this site follow Google publisher policies and the
            Better Ads standards, the same rules we hold our AdSense management clients to. Ad density is
            capped so Core Web Vitals stay healthy, and no placement is sold that would breach them.
          </NoteBox>
        </Container>
      </Section>
    </>
  );
}
