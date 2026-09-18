import { NotFoundScene } from '@/components/pages/not-found-scene';

export const metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Here is the way back.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundScene />;
}
