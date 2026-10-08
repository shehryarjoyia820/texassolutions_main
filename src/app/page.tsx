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
import { BlogTeaser } from '@/components/home/blog-teaser';
import { JsonLd, faqSchema, pageMeta, speakableSchema, websiteSchema } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Texas Solutions — Custom Software Development, AI & QA Company',
  description:
    'Custom software development company building web and mobile apps, SaaS and enterprise software, AI and machine learning solutions, and QA and test automation for growing businesses and enterprises. Plus truck dispatch for US carriers.',
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
      <BlogTeaser />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
