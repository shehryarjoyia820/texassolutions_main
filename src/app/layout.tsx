import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers, themeScript } from '@/components/providers';
import { SmoothScroll } from '@/components/motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CookieBanner } from '@/components/cookie-banner';
import { SITE } from '@/data/site';
import { JsonLd, organizationSchema, localBusinessSchema } from '@/lib/seo';
import { HeadCodes } from '@/components/head-codes';
import { HEAD_CODES } from '@/config/head-codes';

/** Verification meta tags from src/config/head-codes.ts. */
const verificationOther: Record<string, string> = {};
if (HEAD_CODES.bingSiteVerification.trim()) verificationOther['msvalidate.01'] = HEAD_CODES.bingSiteVerification.trim();
for (const tag of HEAD_CODES.extraMetaTags) {
  if (tag.name.trim() && tag.content.trim()) verificationOther[tag.name.trim()] = tag.content.trim();
}

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    'custom software development company',
    'software development services',
    'web and mobile app development',
    'SaaS development company',
    'AI development company',
    'machine learning development services',
    'generative AI development',
    'software testing services',
    'QA outsourcing',
    'test automation services',
    'hire dedicated developers',
    'truck dispatch service',
    'software development company in Dubai',
    'software development company Singapore',
    'software development company UK',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
  verification: {
    ...(HEAD_CODES.googleSiteVerification.trim() ? { google: HEAD_CODES.googleSiteVerification.trim() } : {}),
    ...(Object.keys(verificationOther).length ? { other: verificationOther } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070B18' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Applied before paint so the theme never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Scroll reveals start at zero opacity. Without JavaScript nothing
            would ever reveal them, so force every section visible instead. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <JsonLd data={[organizationSchema(), localBusinessSchema()]} />
        {/* Tracking, AdSense and custom codes: edit src/config/head-codes.ts */}
        <HeadCodes />
      </head>
      <body>
        <Providers>
          <SmoothScroll>
            <Header />
            <main id="main" className="pt-[76px]">
              {children}
            </main>
            <Footer />
            <CookieBanner />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
