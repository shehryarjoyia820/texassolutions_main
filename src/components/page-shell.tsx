'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { SplitText, Reveal } from './motion';
import { Breadcrumbs, ButtonLink, Container, Section, SectionHeading, Badge } from './ui';
import { cn } from '@/lib/utils';

/** Short hero used by every menu landing page and standalone page. */
export function PageHero({
  eyebrow,
  title,
  body,
  trail,
  children,
  align = 'left',
  accent,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  trail?: { label: string; href?: string }[];
  children?: ReactNode;
  align?: 'left' | 'center';
  accent?: string;
}) {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-line"
      style={accent ? ({ ['--svc' as string]: accent } as React.CSSProperties) : undefined}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-noise opacity-50" />
        <div className={cn('absolute inset-0', accent ? 'svc-glow' : 'accent-glow')} />
      </div>
      <Container className="py-[clamp(2.5rem,6.5vw,5.5rem)]">
        {trail && <Breadcrumbs trail={trail} />}
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-display-lg">
            <SplitText text={title} />
          </h1>
          {body && <p className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl">{body}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Filterable grid used by the menu landing pages                     */
/* ------------------------------------------------------------------ */

export interface GridItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  meta?: string;
  badge?: string;
  accentHex?: string;
  tags?: string[];
}

export function FilterGrid({
  items,
  categories,
  initialCategory = 'All',
  searchable = true,
  emptyMessage = 'Nothing matches that filter yet.',
  columns = 3,
}: {
  items: GridItem[];
  categories: string[];
  initialCategory?: string;
  searchable?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === 'All' || item.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                category === c
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-fg-muted hover:border-accent/40 hover:text-fg',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {searchable && (
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
            <label htmlFor="grid-search" className="sr-only">
              Search
            </label>
            <input
              id="grid-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-xl border border-line bg-bg-elev pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
            />
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-fg-subtle" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-fg-muted">
          {emptyMessage}
        </p>
      ) : (
        <motion.ul
          layout
          className={cn(
            'mt-6 grid gap-4',
            columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
          )}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={item.accentHex ? ({ ['--svc' as string]: hexToTriplet(item.accentHex) } as React.CSSProperties) : undefined}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-[border-color,transform,box-shadow] duration-400 hover:-translate-y-1 hover:border-svc/50 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      {item.category}
                    </span>
                    {item.badge && <Badge tone={item.badge === 'live' ? 'success' : 'default'}>{item.badge}</Badge>}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-svc">{item.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-muted">{item.description}</p>

                  {item.tags && item.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((t) => (
                        <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs text-fg-subtle">{item.meta}</span>
                    <ArrowRight
                      className="h-4 w-4 text-svc transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ProofBlock({
  eyebrow = 'Proof',
  title,
  body,
  metrics,
  href,
  cta,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  metrics: { label: string; value: string }[];
  href?: string;
  cta?: string;
}) {
  return (
    <Section tone="soft">
      <Container>
        <Reveal>
          <div className="grid gap-8 rounded-2xl border border-line bg-bg-elev p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">{eyebrow}</p>
              <h2 className="text-display-sm">{title}</h2>
              <p className="mt-4 leading-relaxed text-fg-muted">{body}</p>
              {href && cta && (
                <ButtonLink href={href} className="mt-7" icon={ArrowRight}>
                  {cta}
                </ButtonLink>
              )}
            </div>
            <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-line bg-bg-soft p-5">
                  <dt className="text-xs text-fg-subtle">{m.label}</dt>
                  <dd className="mt-1.5 font-display text-2xl font-semibold text-accent">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function CtaSection({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 accent-glow" />
      <Container className="relative py-section-sm">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primary.href} size="lg" icon={ArrowRight} magnetic>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export { SectionHeading };

function hexToTriplet(hex: string) {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)} ${parseInt(c.slice(2, 4), 16)} ${parseInt(c.slice(4, 6), 16)}`;
}
