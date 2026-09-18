import { notFound } from 'next/navigation';
import { MARKETPLACE_ITEMS, MARKETPLACE_MAP } from '@/data/catalog';
import { MarketplaceDetail } from '@/components/pages/marketplace-detail';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return MARKETPLACE_ITEMS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = MARKETPLACE_MAP[slug];
  if (!item) return {};
  return pageMeta({
    title: `${item.name} — Marketplace`,
    description: item.summary,
    path: `/marketplace/${item.slug}`,
  });
}

export default async function MarketplaceItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = MARKETPLACE_MAP[slug];
  if (!item) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Marketplace', href: '/marketplace' },
          { label: item.name, href: `/marketplace/${item.slug}` },
        ])}
      />
      <MarketplaceDetail item={item} />
    </>
  );
}
