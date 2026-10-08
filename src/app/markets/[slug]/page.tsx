import { MovedPage } from '@/components/moved';

// Country market pages were retired; old links forward to the services overview.
const OLD_SLUGS = ['united-states', 'united-kingdom', 'europe', 'canada', 'australia-new-zealand', 'uae-gulf', 'singapore-asia'];

export function generateStaticParams() {
  return OLD_SLUGS.map((slug) => ({ slug }));
}

export const metadata = { title: 'Moved', robots: { index: false, follow: true }, alternates: { canonical: '/services' } };

export default function MarketMoved() {
  return <MovedPage to="/services" label="our services" />;
}
