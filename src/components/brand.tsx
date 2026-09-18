'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Texas Solutions brand mark: the Texas lone star held inside code brackets,
 * for "Texas-built software". Drawn as inline SVG so it stays sharp at every
 * size and needs no image request.
 *
 * The same geometry is used for public/favicon.svg and the Open Graph image.
 */

// Five-point star centred at (20, 20), outer radius 6.5, inner 2.6.
export const STAR_PATH =
  'M20 13.5 L21.53 17.9 L26.18 17.99 L22.47 20.8 L23.82 25.26 L20 22.6 L16.18 25.26 L17.53 20.8 L13.82 17.99 L18.47 17.9 Z';
export const BRACKET_LEFT = 'M11.2 13 L6.2 20 L11.2 27';
export const BRACKET_RIGHT = 'M28.8 13 L33.8 20 L28.8 27';

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-10 w-10 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`ts-g-${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9A3C" />
          <stop offset="0.55" stopColor="#FF7A1A" />
          <stop offset="1" stopColor="#E0520A" />
        </linearGradient>
        <linearGradient id={`ts-s-${id}`} x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#ts-g-${id})`} />
      <rect width="40" height="40" rx="11" fill={`url(#ts-s-${id})`} />
      <path
        d={BRACKET_LEFT}
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={BRACKET_RIGHT}
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={STAR_PATH} fill="#fff" />
    </svg>
  );
}

/** Mark plus wordmark, laid out on one baseline. */
export function Logo({
  className,
  size = 'md',
  showWordmark = true,
  wordmarkClassName,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  wordmarkClassName?: string;
}) {
  const mark = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'sm' ? 'text-[0.95rem]' : size === 'lg' ? 'text-xl' : 'text-[1.0625rem]';
  const sub = size === 'lg' ? 'text-[0.6875rem]' : 'text-[0.5625rem]';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={mark} />
      {showWordmark && (
        <span className={cn('flex flex-col justify-center leading-none', wordmarkClassName)}>
          <span className={cn('font-display font-bold tracking-tight text-fg', text)}>
            Texas<span className="text-accent">Solutions</span>
          </span>
          <span className={cn('mt-1 font-sans font-medium uppercase tracking-[0.22em] text-fg-subtle', sub)}>
            Web · Software · Enterprise
          </span>
        </span>
      )}
    </span>
  );
}
