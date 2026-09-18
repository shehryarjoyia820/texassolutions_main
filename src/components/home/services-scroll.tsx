'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SERVICES } from '@/data/services';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { useRegion } from '@/components/providers';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Container, SectionHeading } from '@/components/ui';

/**
 * Pinned horizontal scroll of the thirteen service cards.
 * Pinning is disabled under 768px and under prefers-reduced-motion; the cards
 * then stack vertically, which is what the spec asks for.
 */
export function ServicesScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { code } = useRegion();

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    let cleanup = () => {};
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const ctx = gsap.context(() => {
          const distance = () => track.scrollWidth - window.innerWidth + 96;

          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        }, section);

        cleanup = () => ctx.revert();
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-bg-soft py-section md:h-screen md:py-0">
      <div className="md:flex md:h-full md:flex-col md:justify-center">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Thirteen service lines, priced in the open"
            body="Each one stands alone with its own agreement and its own published ranges. Clients who use several get one contact across all of them."
            className="mb-10 md:mb-12"
          />
        </Container>

        <div className="relative">
          <div
            ref={trackRef}
            className={cn(
              // Phones: a swipeable row with snap points. Desktop: pinned horizontal scroll.
              'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-6',
              'md:snap-none md:overflow-visible md:pb-0',
              'md:w-max md:flex-row md:gap-6 md:pl-[max(1.25rem,calc((100vw-1440px)/2+2.5rem))] md:pr-24',
            )}
          >
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} regionCode={code} />
            ))}
            <Link
              href="/services"
              className="group flex w-[82vw] max-w-[22rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-7 transition-colors hover:bg-accent/10 md:w-[22rem]"
            >
              <div>
                <p className="eyebrow mb-3">All services</p>
                <p className="font-display text-2xl font-semibold">Compare every line side by side</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  Ranges, packages and what is included, for all thirteen, in one place.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Open the services hub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </div>
        </div>

        <Container>
          <p className="mt-6 text-xs text-fg-subtle md:mt-8">
            <span className="md:hidden">Swipe to see all thirteen service lines.</span>
            <span className="hidden md:inline">Scroll to move through the service lines.</span>
          </p>
        </Container>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  regionCode,
}: {
  service: (typeof SERVICES)[number];
  index: number;
  regionCode: ReturnType<typeof useRegion>['code'];
}) {
  const Icon = (Icons[service.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
  const row = PRICE_TABLE_MAP[service.slug]?.rows.find((r) => r.id === service.startingPriceRow);
  const value = row?.values[regionCode];
  const unit = row?.unit;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex w-[82vw] max-w-[22rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-bg-elev p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-lift sm:p-7 md:w-[22rem]"
      style={{ ['--svc' as string]: service.accent }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100 svc-glow"
      />
      <span
        aria-hidden
        className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-svc transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-svc/30 bg-svc/10 text-svc">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-semibold">{service.name}</h3>
      <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-fg-muted">{service.summary}</p>

      <ul className="relative mt-5 flex flex-wrap gap-1.5">
        {service.subServices.slice(0, 3).map((sub) => (
          <li key={sub.slug} className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
            {sub.name}
          </li>
        ))}
        {service.subServices.length > 3 && (
          <li className="rounded-full border border-svc/30 px-2.5 py-1 text-[0.6875rem] text-svc">
            +{service.subServices.length - 3}
          </li>
        )}
      </ul>

      <div className="relative mt-6 flex items-end justify-between border-t border-line pt-5">
        <div>
          <p className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">From</p>
          <p className="font-display text-lg font-semibold text-fg">
            {value ? formatMoney(value[0], regionCode, { compact: true }) : 'Per job'}
            {unit && value && (
              <span className="ml-1 text-xs font-normal text-fg-subtle">
                {unit === 'monthly' ? '/mo' : unit === 'weekly' ? '/wk' : unit === 'hourly' ? '/hr' : ''}
              </span>
            )}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-svc">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
