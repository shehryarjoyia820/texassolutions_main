import { MovedPage } from '@/components/moved';

// Country market pages were retired: the site serves every client from one price list in US dollars.
export const metadata = { title: 'Moved', robots: { index: false, follow: true }, alternates: { canonical: '/services' } };

export default function MarketsMoved() {
  return <MovedPage to="/services" label="our services" />;
}
