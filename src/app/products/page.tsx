import { PRODUCTS } from '@/data/catalog';
import { PageHero, FilterGrid, ProofBlock, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Products',
  description:
    'Tools we build and run alongside the services: Dispatch Portal, Lead CRM, Ad Creative Library, AdSense Dashboard, Website Templates and the QA Test Suite.',
  path: '/products',
});

export default function ProductsPage() {
  const items = PRODUCTS.map((p) => ({
    id: p.slug,
    title: p.name,
    description: p.tagline,
    href: `/products/${p.slug}`,
    category: p.category,
    meta: p.status === 'live' ? 'Available now' : p.status === 'beta' ? 'In beta' : 'Planned',
    badge: p.status,
    accentHex: p.accentHex,
    tags: p.audience,
  }));

  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Products', href: '/products' }])} />

      <PageHero
        eyebrow="Products"
        title="The tools behind the services"
        body="These exist because clients kept asking for the same thing twice. Each one is built for a specific service line, and each says plainly whether it is live today."
        trail={[{ label: 'Products' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Six products"
            title="What we run today, and what is still in beta"
            body="We only build pages for things that exist. Status is on every card, and nothing here is described as shipping when it is not."
          />
          <div className="mt-10">
            <FilterGrid items={items} categories={categories} />
          </div>

          <NoteBox className="mt-10">
            Most of these are included with the service they support rather than sold separately. Where a
            product is standalone, its page says so and gives the terms.
          </NoteBox>
        </Container>
      </Section>

      <ProofBlock
        eyebrow="Why they exist"
        title="Built from the same complaint, twice"
        body="Every product started as a workaround. The Dispatch Portal replaced a group chat full of photographed paperwork. The AdSense Dashboard replaced a spreadsheet nobody could reconcile. If a tool is not solving something we hit weekly, we do not build it."
        metrics={[
          { label: 'Products live today', value: '4' },
          { label: 'In beta', value: '2' },
          { label: 'Included with a service', value: '5 of 6' },
        ]}
        href="/contact"
        cta="Ask about access"
      />

      <CtaSection
        title="Want a product without the service?"
        body="Some of these can be licensed on their own and some genuinely cannot. Ask and we will give you a straight answer."
        primary={{ href: '/contact', label: 'Ask about a product' }}
        secondary={{ href: '/marketplace', label: 'Browse the marketplace' }}
      />
    </>
  );
}
