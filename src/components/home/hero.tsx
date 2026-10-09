'use client';

import dynamic from 'next/dynamic';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { ButtonLink } from '@/components/ui';

// Lazy-loaded so the canvas never blocks first paint. It respects reduced motion.
const RouteScene = dynamic(() => import('./route-scene').then((m) => m.RouteScene), {
  ssr: false,
  loading: () => null,
});

const HIGHLIGHTS = ['Prices published in US dollars', 'One point of contact', '30 days notice, no lock-in'];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute inset-0 accent-glow" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.45]">
        <RouteScene className="h-full w-full" />
      </div>

      <div className="container-x relative pb-[clamp(2.5rem,6vw,4.5rem)] pt-[clamp(2rem,5vw,3.75rem)]">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 text-xs font-medium text-accent">
            Technology · Marketing &amp; Publisher Services · Logistics &amp; Automotive
          </p>

          <h1 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
            Custom Web Platforms &amp; Software <span className="text-accent">Built for Modern Enterprises</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
            Software, AI and QA from our engineering team, marketing and lead generation, and truck dispatch for US
            carriers. One published price list and one point of contact.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/estimate" size="lg" icon={ArrowRight} trackLabel="Get an Estimate" trackLocation="hero">
              Get an Estimate
            </ButtonLink>
            <ButtonLink
              href="/contact"
              size="lg"
              variant="secondary"
              icon={MessageSquare}
              iconRight={false}
              trackLabel="Talk to a Specialist"
              trackLocation="hero"
            >
              Talk to a Specialist
            </ButtonLink>
          </div>

          <ul className="mt-7 flex flex-col gap-2 text-sm text-fg-subtle sm:flex-row sm:flex-wrap sm:gap-x-6">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
