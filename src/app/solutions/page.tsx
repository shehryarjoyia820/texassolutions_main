import { SOLUTIONS } from '@/data/solutions';
import { PageHero, FilterGrid, ProofBlock, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Solutions by industry',
  description:
    'Our seven service lines bundled the way each industry actually buys them: trucking, e-commerce, healthcare, real estate, publishers, automotive and SaaS.',
  path: '/solutions',
});

export default function SolutionsPage() {
  const items = SOLUTIONS.map((s) => ({
    id: s.slug,
    title: s.name,
    description: s.summary,
    href: `/solutions/${s.slug}`,
    category: s.services.length > 3 ? 'Full stack' : 'Focused',
    meta: `${s.services.length} services`,
    accentHex: s.accentHex,
    tags: s.services,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Solutions', href: '/solutions' }])} />

      <PageHero
        eyebrow="Solutions"
        title="The same services, bought very differently"
        body="A carrier and a publisher both need web work, but almost nothing about the engagement looks the same. These pages describe what we actually do for each industry."
        trail={[{ label: 'Solutions' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Seven industries"
            title="Pick the one that sounds like you"
            body="Each page lists the pain points we hear most, the playbook we run and the outcomes to expect."
          />
          <div className="mt-10">
            <FilterGrid items={items} categories={['Full stack', 'Focused']} />
          </div>
        </Container>
      </Section>

      <ProofBlock
        title="A dry van owner-operator, three months in"
        body="Moving from self-dispatch to a named dispatcher with next-load-booked planning and same-day invoicing. The gross moved because the empty miles and the unclaimed detention both moved."
        metrics={[
          { label: 'Weekly gross', value: '+46%' },
          { label: 'Deadhead miles', value: '19% to 8%' },
          { label: 'Detention recovered', value: '$2,340/qtr' },
        ]}
        href="/solutions/trucking-logistics"
        cta="See the trucking solution"
      />

      <CtaSection
        title="Your industry not listed?"
        body="The seven lines still apply. Tell us the shape of your business and we will say plainly whether we are a fit."
        primary={{ href: '/contact', label: 'Start a conversation' }}
        secondary={{ href: '/services', label: 'Browse services instead' }}
      />
    </>
  );
}
