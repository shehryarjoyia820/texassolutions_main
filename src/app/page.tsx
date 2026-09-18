import { Hero } from '@/components/home/hero';
import { ServicesScroll } from '@/components/home/services-scroll';
import {
  TrustBar,
  IndustrySwitcher,
  EngagementModels,
  MiniEstimate,
  HowItWorks,
  CaseStudiesCarousel,
  TestimonialsBlock,
  HomeFaq,
  CtaBand,
} from '@/components/home/sections';
import { SITE_FAQS } from '@/data/company';
import { HomeSeoSection } from '@/components/home/seo-section';
import { JsonLd, faqSchema, pageMeta, speakableSchema, websiteSchema } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Texas Solutions — Custom Software Development, AI & QA Company | US, UK, UAE, Singapore',
  description:
    'Custom software development company building web and mobile apps, SaaS and enterprise software, AI and machine learning solutions, and QA and test automation for enterprises in the US, UK, Europe, the UAE, Saudi Arabia and Singapore. Plus truck dispatch for US carriers.',
  path: '/',
  keywords: [
    'custom software development company',
    'software development company',
    'AI development company',
    'machine learning development',
    'software testing services',
    'QA outsourcing company',
    'mobile app development company',
    'hire dedicated developers',
    'truck dispatch service',
    'software development company in Dubai',
    'software development company Saudi Arabia',
    'software development company Singapore',
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteSchema(), faqSchema(SITE_FAQS), speakableSchema('/', 'Texas Solutions')]} />
      <Hero />
      <TrustBar />
      <ServicesScroll />
      <IndustrySwitcher />
      <EngagementModels />
      <MiniEstimate />
      <HomeSeoSection />
      <HowItWorks />
      <CaseStudiesCarousel />
      <TestimonialsBlock />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
