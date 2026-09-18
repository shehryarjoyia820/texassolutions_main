'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Home, Phone } from 'lucide-react';
import { SITE } from '@/data/site';
import { SERVICES } from '@/data/services';
import { ButtonLink, Container } from '@/components/ui';

/** Playful animated 404: a truck that has taken a wrong turn. */
export function NotFoundScene() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-76px)] items-center overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute inset-0 accent-glow" />
      </div>

      <Container className="py-section-sm">
        <div className="mx-auto max-w-2xl text-center">
          {/* scene */}
          <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-md" role="img" aria-label="A truck driving off the end of a road">
            <defs>
              <linearGradient id="road" x1="0" x2="1">
                <stop offset="0%" stopColor="rgb(var(--line))" stopOpacity="0" />
                <stop offset="30%" stopColor="rgb(var(--line))" stopOpacity="1" />
                <stop offset="100%" stopColor="rgb(var(--line))" stopOpacity="1" />
              </linearGradient>
            </defs>

            <path d="M0 96 H210" stroke="url(#road)" strokeWidth="3" strokeLinecap="round" />
            <path d="M210 96 q22 2 34 16" stroke="rgb(var(--line))" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="6 7" />

            {[20, 60, 100, 140, 180].map((x) => (
              <rect key={x} x={x} y="94.5" width="14" height="2.5" rx="1.25" fill="rgb(var(--fg-subtle))" opacity="0.45" />
            ))}

            <motion.g
              initial={reduced ? undefined : { x: -70 }}
              animate={reduced ? undefined : { x: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.g
                animate={reduced ? undefined : { y: [0, -1.5, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '190px 88px' }}
              >
                <rect x="150" y="62" width="44" height="26" rx="3" fill="rgb(var(--bg-elev))" stroke="rgb(var(--line))" strokeWidth="2" />
                <path d="M194 70 h12 l8 10 v8 h-20 z" fill="rgb(var(--accent))" />
                <rect x="197" y="72" width="8" height="7" rx="1.5" fill="rgb(var(--bg))" opacity="0.7" />
                <circle cx="164" cy="90" r="6" fill="rgb(var(--bg))" stroke="rgb(var(--fg-subtle))" strokeWidth="2" />
                <circle cx="204" cy="90" r="6" fill="rgb(var(--bg))" stroke="rgb(var(--fg-subtle))" strokeWidth="2" />
              </motion.g>
            </motion.g>

            <motion.text
              x="252"
              y="52"
              fill="rgb(var(--accent))"
              fontSize="13"
              fontWeight="600"
              initial={reduced ? undefined : { opacity: 0, y: 58 }}
              animate={reduced ? undefined : { opacity: 1, y: 52 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              ?
            </motion.text>
          </svg>

          <p className="mt-8 font-mono text-sm text-accent">404</p>
          <h1 className="mt-3 text-display-md">This load never got booked</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-fg-muted">
            The page you wanted is not here. It may have moved, or the link may have been mistyped. Here are the
            three places people usually want.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg" icon={Home} iconRight={false} magnetic>
              Back to home
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">
              Browse services
            </ButtonLink>
            <ButtonLink href="/estimate" size="lg" variant="outline" icon={ArrowRight}>
              Get an estimate
            </ButtonLink>
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
              Or jump straight to a service
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="rounded-full border border-line px-3.5 py-2 text-sm text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href={SITE.phoneHref}
              className="mt-8 inline-flex items-center gap-2 text-sm text-fg-subtle transition-colors hover:text-accent"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Or just call us: {SITE.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
