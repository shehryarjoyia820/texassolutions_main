import { SERVICES } from '@/data/services';
import { ServicesIndex } from '@/components/pages/services-index';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Services — thirteen lines, published pricing',
  description:
    'Truck dispatch, web and app development, lead generation, ads optimization, AdSense revenue management, QA testing and auto engines. Ranges published per region.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Services', href: '/services' }])} />
      <ServicesIndex services={SERVICES} />
    </>
  );
}
