'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ArrowRight, type LucideIcon } from 'lucide-react';
import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Magnetic } from './motion';
import { trackCta } from '@/lib/analytics';

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'service';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink hover:brightness-110 shadow-[0_10px_30px_-12px_rgb(var(--accent)/0.8)] font-semibold',
  service:
    'bg-svc text-bg hover:brightness-110 shadow-[0_10px_30px_-12px_rgb(var(--svc)/0.8)] font-semibold',
  secondary: 'bg-bg-elev text-fg border border-line hover:border-accent/50 hover:bg-bg-soft',
  outline: 'border border-fg/25 text-fg hover:border-accent hover:text-accent',
  ghost: 'text-fg-muted hover:text-fg hover:bg-bg-soft',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-md gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] rounded-lg gap-2',
  lg: 'h-[3.25rem] px-7 text-base rounded-xl gap-2.5',
};

interface ButtonBase {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: LucideIcon;
  iconRight?: boolean;
  magnetic?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon: Icon,
  iconRight,
  ...props
}: ButtonBase & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {Icon && !iconRight && <Icon className="h-[1.1em] w-[1.1em]" aria-hidden />}
      {children}
      {Icon && iconRight && <Icon className="h-[1.1em] w-[1.1em]" aria-hidden />}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconRight = true,
  magnetic = false,
  trackLabel,
  trackLocation,
  external,
  arrow,
}: ButtonBase & {
  href: string;
  trackLabel?: string;
  trackLocation?: string;
  external?: boolean;
  /**
   * Server components cannot pass an icon component across the boundary, so
   * they set `arrow` instead and this component supplies the icon itself.
   */
  arrow?: boolean;
}) {
  const Icon = icon ?? (arrow ? ArrowRight : undefined);
  const content = (
    <Link
      href={href}
      onClick={() => trackLabel && trackCta(trackLabel, trackLocation ?? 'unknown')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {Icon && !iconRight && <Icon className="h-[1.1em] w-[1.1em]" aria-hidden />}
      {children}
      {Icon && iconRight && (
        <Icon className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
      )}
    </Link>
  );

  return magnetic ? <Magnetic>{content}</Magnetic> : content;
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export function Section({
  children,
  className,
  id,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'default' | 'soft' | 'elevated';
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-section',
        tone === 'soft' && 'bg-bg-soft',
        tone === 'elevated' && 'bg-bg-elev',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('container-x', className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag className={cn(Tag === 'h1' ? 'text-display-lg' : 'text-display-md')}>{title}</Tag>
      {body && <p className="mt-5 text-lg leading-relaxed text-fg-muted text-pretty">{body}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card and badge                                                     */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className,
  hover = true,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'li';
}) {
  return (
    <Tag className={cn('card', hover && 'card-hover', className)}>{children}</Tag>
  );
}

export function Badge({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'accent' | 'success' | 'warn' | 'service';
}) {
  const tones = {
    default: 'border-line bg-bg-soft text-fg-muted',
    accent: 'border-accent/35 bg-accent/10 text-accent',
    service: 'border-svc/35 bg-svc/10 text-svc',
    success: 'border-success/35 bg-success/10 text-success',
    warn: 'border-warn/35 bg-warn/10 text-warn',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatTile({
  value,
  label,
  note,
  className,
}: {
  value: ReactNode;
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-line bg-bg-elev/60 p-5', className)}>
      <div className="font-display text-3xl font-semibold tracking-tight text-fg">{value}</div>
      <div className="mt-1.5 text-sm font-medium text-fg">{label}</div>
      {note && <div className="mt-1 text-xs leading-relaxed text-fg-subtle">{note}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion                                                          */
/* ------------------------------------------------------------------ */

export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: { q: string; a: string }[];
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel-${i}`}
                id={`${baseId}-trigger-${i}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-accent"
              >
                <span className="font-display text-base font-medium sm:text-lg">{item.q}</span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0 text-fg-subtle transition-transform duration-300',
                    isOpen && 'rotate-180 text-accent',
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${baseId}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${baseId}-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-6 pr-10 leading-relaxed text-fg-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  active,
  onChange,
  className,
  size = 'md',
}: {
  tabs: { id: string; label: string; icon?: LucideIcon }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const layoutId = useId();
  return (
    <div
      role="tablist"
      className={cn(
        'no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-bg-soft p-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative whitespace-nowrap rounded-lg font-medium transition-colors',
              size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-sm',
              isActive ? 'text-accent-ink' : 'text-fg-muted hover:text-fg',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {tab.icon && <tab.icon className="h-4 w-4" aria-hidden />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumbs                                                        */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-subtle">
        <li>
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-accent">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-fg-muted" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Range bar — low, likely, high                                      */
/* ------------------------------------------------------------------ */

export function RangeBar({
  low,
  likely,
  high,
  formatValue,
  accent = 'accent',
}: {
  low: number;
  likely: number;
  high: number;
  formatValue: (n: number) => string;
  accent?: 'accent' | 'svc';
}) {
  const span = Math.max(1, high - low);
  const likelyPct = ((likely - low) / span) * 100;

  return (
    <div className="w-full">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-soft">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute inset-0 origin-left rounded-full',
            accent === 'accent'
              ? 'bg-gradient-to-r from-accent/35 via-accent to-accent/35'
              : 'bg-gradient-to-r from-svc/35 via-svc to-svc/35',
          )}
        />
      </div>
      <div className="relative mt-3 h-6">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: `${Math.min(88, Math.max(12, likelyPct))}%` }}
        >
          <span className={cn('text-xs font-semibold', accent === 'accent' ? 'text-accent' : 'text-svc')}>
            ▲ Likely {formatValue(likely)}
          </span>
        </motion.div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>
          <div className="text-xs uppercase tracking-wider text-fg-subtle">Low</div>
          <div className="font-display text-lg font-semibold">{formatValue(low)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-fg-subtle">High</div>
          <div className="font-display text-lg font-semibold">{formatValue(high)}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Misc                                                               */
/* ------------------------------------------------------------------ */

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-soft',
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

export function Hairline({ className }: { className?: string }) {
  return <div className={cn('hairline', className)} aria-hidden />;
}

export function NoteBox({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'warn' | 'accent';
  className?: string;
}) {
  const tones = {
    default: 'border-line bg-bg-soft text-fg-muted',
    warn: 'border-warn/30 bg-warn/5 text-fg-muted',
    accent: 'border-accent/30 bg-accent/5 text-fg-muted',
  };
  return (
    <div className={cn('rounded-lg border p-4 text-sm leading-relaxed', tones[tone], className)}>
      {children}
    </div>
  );
}
