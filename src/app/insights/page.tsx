import { MovedPage } from '@/components/moved';

// The article index now lives at /blog. Individual articles keep their /insights/<slug> URLs.
export const metadata = { title: 'Blog', alternates: { canonical: '/blog' } };

export default function InsightsMoved() {
  return <MovedPage to="/blog" label="the blog" />;
}
