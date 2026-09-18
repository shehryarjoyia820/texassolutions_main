import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';
import { SERVICES, ALL_SUB_SERVICE_PATHS } from '@/data/services';
import { SOLUTIONS } from '@/data/solutions';
import { PRODUCTS, MARKETPLACE_ITEMS } from '@/data/catalog';
import { INSIGHTS } from '@/data/insights';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, freq: 'weekly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'weekly' },
    { path: '/products', priority: 0.8, freq: 'monthly' },
    { path: '/marketplace', priority: 0.8, freq: 'weekly' },
    { path: '/estimate', priority: 0.95, freq: 'monthly' },
    { path: '/pricing', priority: 0.9, freq: 'monthly' },
    { path: '/why-texas-solutions', priority: 0.7, freq: 'monthly' },
    { path: '/insights', priority: 0.8, freq: 'weekly' },
    { path: '/investors', priority: 0.6, freq: 'monthly' },
    { path: '/look-inside', priority: 0.6, freq: 'monthly' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/contact', priority: 0.85, freq: 'monthly' },
    { path: '/portfolio', priority: 0.7, freq: 'monthly' },
    { path: '/advertise', priority: 0.5, freq: 'monthly' },
    { path: '/privacy', priority: 0.3, freq: 'yearly' },
    { path: '/terms', priority: 0.3, freq: 'yearly' },
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE.url}${p.path === '/' ? '' : p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...ALL_SUB_SERVICE_PATHS.map((p) => ({
      url: `${SITE.url}/services/${p.slug}/${p.sub}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...SOLUTIONS.map((s) => ({
      url: `${SITE.url}/solutions/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...MARKETPLACE_ITEMS.map((m) => ({
      url: `${SITE.url}/marketplace/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...INSIGHTS.map((i) => ({
      url: `${SITE.url}/insights/${i.slug}`,
      lastModified: new Date(i.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
