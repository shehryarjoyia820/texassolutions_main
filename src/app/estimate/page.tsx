import { Suspense } from 'react';
import { EstimateWizard } from '@/components/estimate/wizard';
import { PageHero } from '@/components/page-shell';
import { Container, Section, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Rough Estimate calculator',
  description:
    'Seven questions and you have a low, likely and high range in your own currency, with the breakdown of how we got there and a PDF you can keep.',
  path: '/estimate',
});

export default function EstimatePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Rough Estimate', href: '/estimate' }])} />

      <PageHero
        eyebrow="Rough Estimate"
        title="A real number, before anyone calls you"
        body="Seven steps. You get a low, likely and high range in your currency, the assumptions we used and a line-item breakdown. Nothing is sent anywhere until you choose to."
        trail={[{ label: 'Rough Estimate' }]}
      />

      <Suspense
        fallback={
          <Section>
            <Container>
              <p className="text-center text-sm text-fg-subtle">Loading the calculator…</p>
            </Container>
          </Section>
        }
      >
        <EstimateWizard />
      </Suspense>

      <Section tone="soft">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            <NoteBox>
              <strong className="block text-fg">Where the numbers come from</strong>
              Every range reads the same published price table as the pricing page. Nothing is invented at
              runtime.
            </NoteBox>
            <NoteBox>
              <strong className="block text-fg">What changes them</strong>
              Your region sets the table. Scope answers add or multiply. Timeline applies a 1.30, 1.00 or 0.90
              multiplier.
            </NoteBox>
            <NoteBox>
              <strong className="block text-fg">What it is not</strong>
              Not a quote. A quote follows a consultation and arrives in writing with acceptance criteria.
            </NoteBox>
          </div>
        </Container>
      </Section>
    </>
  );
}
