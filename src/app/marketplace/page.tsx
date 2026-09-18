import { MARKETPLACE_ITEMS, MARKETPLACE_CATEGORIES } from '@/data/catalog';
import { PageHero, FilterGrid, ProofBlock, CtaSection } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { TemplatePreview } from '@/components/template-preview';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Marketplace',
  description:
    'Website and landing page templates, AI kits, dashboards, cloud and security kits, ad creative packs, engine listings, add-ons and partner tools. Enquiry-only in this release, priced from the same regional tables as our services.',
  path: '/marketplace',
});

export default function MarketplacePage() {
  const items = MARKETPLACE_ITEMS.map((m) => ({
    id: m.slug,
    title: m.name,
    description: m.summary,
    href: `/marketplace/${m.slug}`,
    category: m.category,
    meta: m.priceLabel ?? 'Priced per region',
    accentHex: m.accentHex,
    tags: m.tags,
    thumbnail: m.preview ? <TemplatePreview config={m.preview} accent={m.accentHex} /> : undefined,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Marketplace', href: '/marketplace' }])} />

      <PageHero
        eyebrow="Marketplace"
        title="Packaged work you can point at"
        body="Templates, creative packs, verified engine stock and add-ons. Everything here is priced from the same regional tables as our services, and everything here is real stock or real capacity."
        trail={[{ label: 'Marketplace' }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title={`${MARKETPLACE_ITEMS.length} packages across ${MARKETPLACE_CATEGORIES.length} categories`}
            body="Filter by what you need, or search by platform and use case."
          />
          <div className="mt-10">
            <FilterGrid items={items} categories={[...MARKETPLACE_CATEGORIES]} paramKey="category" />
          </div>

          <NoteBox tone="warn" className="mt-10">
            There is no checkout in this release. Every item is enquiry-only: you tell us what you need, we
            confirm availability and price for your region, then we invoice. A transactional marketplace is a
            decision for a later phase.
          </NoteBox>
        </Container>
      </Section>

      <ProofBlock
        eyebrow="How pricing works here"
        title="Same tables, no marketplace markup"
        body="A template priced from the business-site row costs what that row says for your region. We do not run a separate marketplace price list, because two prices for the same work is how trust goes missing."
        metrics={[
          { label: 'Regions priced', value: '5' },
          { label: 'Categories', value: String(MARKETPLACE_CATEGORIES.length) },
          { label: 'Hidden fees', value: 'None' },
        ]}
        href="/pricing"
        cta="See the price tables"
      />

      <CtaSection
        title="Found something close but not exact?"
        body="Most of these started as a custom build for one client. Tell us what is different about your case and we will scope the delta."
        primary={{ href: '/contact', label: 'Send an enquiry' }}
        secondary={{ href: '/estimate', label: 'Run the calculator' }}
      />
    </>
  );
}
