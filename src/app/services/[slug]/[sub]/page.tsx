import { notFound } from 'next/navigation';
import { ALL_SUB_SERVICE_PATHS, getSubService } from '@/data/services';
import { SubServiceDetail } from '@/components/service-detail';
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return ALL_SUB_SERVICE_PATHS;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const found = getSubService(slug, sub);
  if (!found) return {};
  return pageMeta({
    title: `${found.sub.name} Services | ${found.service.navLabel} Company`,
    description: `${found.sub.summary} ${found.sub.name} for companies in the US, UK, Europe, the UAE, Saudi Arabia and Singapore, with published pricing.`,
    path: `/services/${slug}/${sub}`,
    keywords: [found.sub.keyword, `${found.sub.name.toLowerCase()} company`, `${found.sub.name.toLowerCase()} services`],
  });
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const found = getSubService(slug, sub);
  if (!found) notFound();

  return (
    <>
      <JsonLd
        data={[
          faqSchema(found.service.faqs.slice(0, 4)),
          breadcrumbSchema([
            { label: 'Services', href: '/services' },
            { label: found.service.navLabel, href: `/services/${slug}` },
            { label: found.sub.name, href: `/services/${slug}/${sub}` },
          ]),
        ]}
      />
      <SubServiceDetail service={found.service} sub={found.sub} />
    </>
  );
}
