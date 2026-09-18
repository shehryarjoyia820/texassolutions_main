'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, PlayCircle } from 'lucide-react';
import { SITE } from '@/data/site';
import { SplitText } from '@/components/motion';
import { ButtonLink } from '@/components/ui';
import { useRegion } from '@/components/providers';

// Lazy-loaded so the canvas never blocks first paint.
const RouteScene = dynamic(() => import('./route-scene').then((m) => m.RouteScene), {
  ssr: false,
  loading: () => null,
});

const HIGHLIGHTS = [
  'Dispatch desk answering in under 90 seconds, 24/7',
  'Five regions, five authored price tables',
  '30 days notice on every recurring service',
];

export function Hero() {
  const { region } = useRegion();

  return (
    <section className="relative isolate overflow-hidden">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute inset-0 accent-glow" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-[0.55]">
        <RouteScene className="h-full w-full" />
      </div>

      <div className="container-x relative py-[clamp(4rem,11vw,9rem)]">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-medium text-accent">
              Dispatch desk open now · prices shown in {region.currency}
            </span>
          </motion.div>

          <h1 className="text-display-xl">
            <SplitText text="Thirteen service lines." />
            <br />
            <span className="text-accent">
              <SplitText text="One accountable partner." delay={0.22} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            Web and app development, QA testing, lead generation and auto engines, plus AI, data, cloud, CRM
            and ERP, cybersecurity, dedicated teams, truck dispatch, paid ads and AdSense. Published pricing in your region, a named contact on every service, and thirty days
            notice if it stops working for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink
              href="/estimate"
              size="lg"
              icon={ArrowRight}
              magnetic
              trackLabel="Get a Rough Estimate"
              trackLocation="hero"
            >
              Get a Rough Estimate
            </ButtonLink>
            <ButtonLink
              href="/services"
              size="lg"
              variant="secondary"
              icon={PlayCircle}
              iconRight={false}
              trackLabel="Explore Services"
              trackLocation="hero"
            >
              Explore Services
            </ButtonLink>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-[3.25rem] items-center gap-2 px-2 text-[0.9375rem] font-medium text-fg-muted transition-colors hover:text-accent sm:ml-2"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {SITE.phone}
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-col gap-2.5 text-sm text-fg-subtle sm:flex-row sm:flex-wrap sm:gap-x-7"
          >
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                {h}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
