import type { Metadata } from 'next';
import { SITE, OFFICES } from '@/data/site';

export function pageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  image,
  publishedTime,
  noIndex,
}: {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE.url}${path === '/' ? '' : path}`;
  const ogImage = image ?? `/og/default.svg`;

  return {
    title,
    description,
    alternates: { canonical: url },
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

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    foundingDate: String(SITE.founded),
    telephone: SITE.phone,
    email: SITE.email,
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
        areaServed: ['US', 'GB', 'CA', 'AU', 'EU'],
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
    image: `${SITE.url}/og/default.svg`,
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${SITE.url}/services/${service.slug}`,
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Europe'],
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
    mainEntityOfPage: `${SITE.url}/insights/${a.slug}`,
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
      item: `${SITE.url}${c.href === '/' ? '' : c.href}`,
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
