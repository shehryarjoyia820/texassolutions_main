'use client';

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Smooth inertia scrolling (Lenis)                                   */
/* ------------------------------------------------------------------ */

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    // Lazy-loaded so it never blocks first paint.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, [reduced]);

  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/*  Reveal on scroll                                                   */
/* ------------------------------------------------------------------ */

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  // Sideways slides push content past the screen edge on phones, and the
  // start position is fixed at first render, so these rise and fade instead.
  left: { x: 0, y: 22 },
  right: { x: 0, y: 22 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const { x, y } = offsets[direction];
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      data-reveal=""
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/** Staggers direct children as they enter the viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger } },
  };

  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div data-reveal="" variants={revealItem} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Split-text headline stagger                                        */
/* ------------------------------------------------------------------ */

export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const words = text.split(' ');

  // Server-render plain text, then animate after hydration. Headlines are the
  // first thing a visitor reads, so they must never depend on JavaScript.
  useEffect(() => setMounted(true), []);

  if (reduced || !mounted) return <span className={className}>{text}</span>;

  // CSS keyframes rather than a JS-driven animation: they still complete when
  // the tab is backgrounded and the rAF loop is throttled, so a headline can
  // never be left stranded at zero opacity.
  return (
    <span className={cn('inline', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn('inline-block animate-word-rise', wordClassName)}
            style={{ animationDelay: `${delay + i * 0.055}s` }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

export function Counter({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  // Never render 0 before animating, which the spec calls out as a mistake to avoid.
  const [display, setDisplay] = useState(() => formatValue(value, decimals));

  useEffect(() => {
    if (!inView || reduced) return;
    const start = performance.now();
    const from = value * 0.35;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatValue(from + (value - from) * eased, decimals));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, decimals, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function formatValue(n: number, decimals: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ------------------------------------------------------------------ */
/*  Magnetic button                                                    */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tilt card                                                          */
/* ------------------------------------------------------------------ */

export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn('[transform-style:preserve-3d]', className)}
      style={{ rotateX: srx, rotateY: sry, perspective: 900 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Parallax layer                                                     */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll progress bar                                                */
/* ------------------------------------------------------------------ */

export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className={cn('fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-accent', className)}
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee                                                            */
/* ------------------------------------------------------------------ */

export function Marquee({
  children,
  className,
  slow = false,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  slow?: boolean;
  reverse?: boolean;
}) {
  return (
    <div className={cn('mask-fade-x relative flex w-full min-w-0 max-w-full overflow-hidden', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center gap-10 pr-10',
          slow ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page transition                                                    */
/* ------------------------------------------------------------------ */

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
