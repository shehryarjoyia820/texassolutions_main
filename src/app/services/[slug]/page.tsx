import { notFound } from 'next/navigation';
import { SERVICES, getService } from '@/data/services';
import { SERVICE_SEO } from '@/data/seo-content';
import { MARKETS } from '@/data/markets';
import { ServiceDetail } from '@/components/service-detail';
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  pageMeta,
  serviceSchema,
  speakableSchema,
} from '@/lib/seo';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const seo = SERVICE_SEO[slug];
  return pageMeta({
    title: seo?.metaTitle ?? `${service.name} — ${service.promise}`,
    description: seo?.metaDescription ?? service.summary,
    path: `/services/${service.slug}`,
    keywords: seo?.keywords,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const seo = SERVICE_SEO[slug];
  const path = `/services/${service.slug}`;

  // Truck dispatch is a US and Canada service; everything else serves every market.
  const markets = MARKETS.filter((m) =>
    slug === 'truck-dispatch' ? ['united-states', 'canada'].includes(m.slug) : true,
  ).map((m) => ({ slug: m.slug, name: m.name, flag: m.flag }));

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ ...service, keywords: seo?.keywords }),
          faqSchema([...service.faqs, ...(seo?.faqs ?? [])]),
          howToSchema(`How ${service.name.toLowerCase()} works at Texas Solutions`, service.process),
          speakableSchema(path, seo?.metaTitle ?? service.name),
          breadcrumbSchema([
            { label: 'Services', href: '/services' },
            { label: service.name, href: path },
          ]),
        ]}
      />
      <ServiceDetail service={service} seo={seo} markets={markets} />
    </>
  );
}
