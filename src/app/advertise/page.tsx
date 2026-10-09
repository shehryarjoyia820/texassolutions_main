import { SITE } from '@/data/site';
import { PageHero } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { MediaKitForm } from '@/components/forms';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Advertise with us',
  description:
    'Advertising and sponsorship enquiries for texassolutions.co. Tell us what you want to promote and we will reply with what is available.',
  path: '/advertise',
});

export default function AdvertisePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Advertise with us', href: '/advertise' }])} />

      <PageHero
        eyebrow="Advertise"
        title="Advertising enquiries"
        body="If you sell to carriers, publishers or marketing teams and want to advertise or sponsor content on texassolutions.co, send us an enquiry."
        trail={[{ label: 'Advertise with us' }]}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <Reveal>
              <div>
                <SectionHeading
                  eyebrow="How it works"
                  title="Quoted per enquiry"
                  body="Placement, timing and price depend on what you want to promote, so we reply to each enquiry individually rather than publish a rate card."
                />
                <ul className="mt-8 space-y-3">
                  {[
                    'Tell us what you want to promote and who you want to reach',
                    'We reply with the options available and a price',
                    'Sponsored content is always labelled as sponsored',
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 rounded-lg border border-line bg-bg-soft p-4 text-sm text-fg-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-fg-muted">
                  You can also email <a className="text-accent hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>{' '}
                  or call {SITE.phone}.
                </p>
              </div>
            </Reveal>

            <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7 sm:p-9">
              <h2 className="font-display text-xl font-semibold">Send an advertising enquiry</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                We reply within one business day.
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
            <strong className="block text-fg">Sponsored content and disclosure</strong>
            Sponsored content is labelled as sponsored and carries the disclosure markup search engines expect.
            We do not sell dofollow links.
          </NoteBox>
        </Container>
      </Section>
    </>
  );
}
