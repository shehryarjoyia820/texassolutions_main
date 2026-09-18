import type { Metadata } from 'next';
import { SITE, OFFICES } from '@/data/site';

/**
 * Absolute canonical URL. The public site on GitHub Pages serves every page
 * with a trailing slash, so canonicals, the sitemap and schema use it too and
 * search engines never have to follow a redirect.
 */
export function absUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE.url}/`;
  const [base, hash] = path.split('#');
  const withSlash = base.endsWith('/') || /\.[a-z0-9]+$/i.test(base) ? base : `${base}/`;
  return `${SITE.url}${withSlash}${hash ? `#${hash}` : ''}`;
}

export function pageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  image,
  publishedTime,
  noIndex,
  keywords,
}: {
  keywords?: string[];
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absUrl(path);
  const ogImage = image ?? `/og/default.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(keywords?.length ? { keywords } : {}),
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD                                                            */
/* ------------------------------------------------------------------ */

/** Countries we actively serve, used for areaServed across the schema. */
export const AREA_SERVED = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand', 'Ireland',
  'Germany', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Switzerland', 'France',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Singapore', 'Japan', 'Hong Kong', 'South Korea', 'Malaysia',
].map((name) => ({ '@type': 'Country', name }));

export const KNOWS_ABOUT = [
  'Custom software development', 'Web application development', 'SaaS development',
  'Mobile app development', 'Artificial intelligence', 'Machine learning', 'Generative AI',
  'AI agents', 'Retrieval-augmented generation', 'Computer vision', 'Software testing',
  'Quality assurance', 'Test automation', 'Playwright', 'Performance testing', 'DevOps',
  'Cloud migration', 'AWS', 'Microsoft Azure', 'Data engineering', 'Business intelligence',
  'Salesforce', 'Microsoft Dynamics 365', 'Odoo', 'Cybersecurity', 'SOC 2',
  'Truck dispatch', 'Freight dispatch', 'Lead generation', 'PPC management', 'Google AdSense',
];

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

/** Marks the quick-answer block as speakable for voice and answer engines. */
export function speakableSchema(path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: absUrl(path),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[data-speakable]'] },
  };
}

export function howToSchema(name: string, steps: { title: string; body: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((st, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: st.title,
      text: st.body,
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    slogan: SITE.tagline,
    logo: `${SITE.url}/icon-512.png`,
    knowsAbout: KNOWS_ABOUT,
    areaServed: AREA_SERVED,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    foundingDate: String(SITE.founded),
    telephone: SITE.phone,
    email: SITE.email,
    founder: { '@type': 'Person', name: SITE.ceo, jobTitle: 'Owner and CEO' },
    sameAs: SITE.social.map((s) => s.href),
    address: OFFICES.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.address.slice(1).join(', '),
      addressLocality: o.city,
      addressCountry: o.country,
    })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phone,
        contactType: 'sales',
        areaServed: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'DE', 'NL', 'SE', 'CH', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'SG', 'JP', 'HK', 'KR', 'MY'],
        availableLanguage: ['English'],
      },
    ],
  };
}

export function localBusinessSchema() {
  const hq = OFFICES[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    image: `${SITE.url}/og/default.png`,
    url: SITE.url,
    telephone: SITE.phone,
    priceRange: '$$-$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: hq.address.slice(1).join(', '),
      addressLocality: hq.city,
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '19:00',
      },
    ],
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
  subServices: { name: string }[];
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absUrl(`/services/${service.slug}`),
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: AREA_SERVED,
    serviceType: service.name,
    ...(service.keywords ? { keywords: service.keywords.join(', ') } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} options`,
      itemListElement: service.subServices.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    },
  };
}

export function productSchema(product: { name: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `${SITE.url}/products/${product.slug}`,
    brand: { '@type': 'Brand', name: SITE.name },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Organization', name: a.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: absUrl(`/insights/${a.slug}`),
  };
}

export function breadcrumbSchema(trail: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', href: '/' }, ...trail].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absUrl(c.href),
    })),
  };
}

/** Renders a JSON-LD script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
