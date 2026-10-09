import { OFFICES, SITE } from '@/data/site';
import { PageHero } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { InvestorForm } from '@/components/forms';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Investors',
  description:
    'Company overview and investment enquiries for Texas Solutions: thirteen service lines, an office in Midland, Texas and a delivery team in Lahore, Pakistan.',
  path: '/investors',
});

export default function InvestorsPage() {
  const office = OFFICES[0];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Investors', href: '/investors' }])} />

      <PageHero
        eyebrow="Investors"
        title="Company overview and investment enquiries"
        body="A short overview of Texas Solutions and the route to a conversation with the owner."
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
                cybersecurity and dedicated teams; and truck dispatch, ads and AdSense management. Each line
                carries its own agreements and pricing.
              </p>
              <p>
                The company is run from its office in Midland, Texas, with a delivery team in Lahore, Pakistan
                covering engineering, QA and after-hours dispatch support.
              </p>
              <h2>How we charge</h2>
              <p>
                Dispatch is a percentage of carrier weekly gross: 5% for semis, 8% for hotshots and 10% for box
                trucks. Marketing and QA run on monthly retainers. Development is project-based. Engine supply is
                transactional.
              </p>
            </div>

            <Reveal direction="left">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-7" id="facts">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  At a glance
                </p>
                <dl className="mt-5 space-y-4">
                  {[
                    ['Owner and CEO', SITE.ceo],
                    ['Service lines', 'Thirteen'],
                    ['Office', office.address.slice(1).join(', ')],
                    ['Delivery team', 'Lahore, Pakistan'],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-accent/15 pb-4 last:border-0 last:pb-0">
                      <dt className="text-sm text-fg-subtle">{k}</dt>
                      <dd className="mt-0.5 text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          <NoteBox tone="warn" className="mt-10">
            This page is for information only. Nothing here is an offer to sell or a solicitation to buy
            securities.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- Enquiry ---- */}
      <Section tone="soft" id="enquiry">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Investment enquiry"
              title={`Talk to ${SITE.ceo}, Owner and CEO`}
              body={`Send an enquiry with the form below, or email ${SITE.email} or call ${SITE.phone}.`}
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
