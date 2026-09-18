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
import { JsonLd, faqSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Texas Solutions — Truck dispatch, web builds, leads, ads and QA',
  description:
    'Thirteen service lines under one accountable partner: truck dispatch, web and app development, lead generation, ads, AdSense revenue management, QA testing and auto engines. Published pricing across the US, UK, Canada, Australia and Europe.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(SITE_FAQS)} />
      <Hero />
      <TrustBar />
      <ServicesScroll />
      <IndustrySwitcher />
      <EngagementModels />
      <MiniEstimate />
      <HowItWorks />
      <CaseStudiesCarousel />
      <TestimonialsBlock />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
