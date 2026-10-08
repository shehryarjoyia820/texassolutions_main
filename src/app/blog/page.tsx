import { INSIGHTS, INSIGHT_KINDS } from '@/data/insights';
import { PageHero, FilterGrid, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading } from '@/components/ui';
import { NewsletterBlock } from '@/components/pages/newsletter-block';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';
import { formatDateShort } from '@/lib/format';

export const metadata = pageMeta({
  title: 'Blog: software, AI, QA, marketing and dispatch guides',
  description:
    'Practical notes from the desks doing the work: dispatch fee maths, AdSense density, conversion tracking rebuilds, QA coverage and the freight market outlook.',
  path: '/blog',
});

export default function BlogPage() {
  const items = INSIGHTS.map((i) => ({
    id: i.slug,
    title: i.title,
    description: i.excerpt,
    href: `/insights/${i.slug}`,
    category: i.kind,
    meta: `${formatDateShort(i.date)} · ${i.readingMinutes} min`,
    badge: i.gated ? 'Gated' : undefined,
    tags: i.tags,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Blog', href: '/blog' }])} />

      <PageHero
        eyebrow="Blog"
        title="What we have learned, written down"
        body="No thought leadership. These are the notes we would give a client on a call, with the arithmetic included so you can check it."
        trail={[{ label: 'Blog' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow={`${INSIGHTS.length} pieces`}
            title="Filter by what you are trying to solve"
            body="Guides and industry reports sit behind a three-field form. Everything else is open."
          />
          <div className="mt-10">
            <FilterGrid items={items} categories={[...INSIGHT_KINDS]} paramKey="kind" />
          </div>
        </Container>
      </Section>

      <NewsletterBlock />

      <CtaSection
        title="Want this applied to your account?"
        body="Reading about a tracking rebuild is useful. Having one done is more useful. Start with a range and a conversation."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Ask a question' }}
      />
    </>
  );
}
