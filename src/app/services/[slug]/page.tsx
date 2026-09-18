import { notFound } from 'next/navigation';
import { SERVICES, getService } from '@/data/services';
import { ServiceDetail } from '@/components/service-detail';
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from '@/lib/seo';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.name} — ${service.promise}`,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { label: 'Services', href: '/services' },
            { label: service.name, href: `/services/${service.slug}` },
          ]),
        ]}
      />
      <ServiceDetail service={service} />
    </>
  );
}
