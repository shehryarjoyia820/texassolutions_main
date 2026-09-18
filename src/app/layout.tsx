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
    'truck dispatch service',
    'box truck dispatch',
    'web development agency',
    'lead generation agency',
    'google ads management',
    'adsense revenue management',
    'qa testing services',
    'used and remanufactured engines',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/og/default.svg', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  robots: { index: true, follow: true },
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
