'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Globe,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MEGA_MENUS, type MegaMenu } from '@/data/nav';
import { SITE } from '@/data/site';
import { REGIONS, type RegionCode } from '@/data/regions';
import { cn } from '@/lib/utils';
import { useRegion, useTheme } from './providers';
import { ButtonLink } from './ui';

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, toggle } = useTheme();
  const { region, setRegion } = useRegion();

  // Shrink on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setRegionOpen(false);
  }, [pathname]);

  // Escape closes the open menu and returns focus to its trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openMenu) {
        const trigger = document.getElementById(`menu-trigger-${slug(openMenu)}`);
        setOpenMenu(null);
        trigger?.focus();
      }
      setRegionOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu]);

  // Click outside closes the mega-menu.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color,backdrop-filter] duration-300',
          scrolled
            ? 'h-16 border-b border-line bg-bg/[0.88] backdrop-blur-xl'
            : 'h-[76px] border-b border-transparent bg-bg/40 backdrop-blur-sm',
        )}
      >
        <div ref={navRef} className="container-x flex h-full items-center gap-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${SITE.name} home`}
          >
            <Logo />
            <span className="hidden font-display text-[0.9375rem] font-semibold leading-tight tracking-tight sm:block">
              Texas
              <br />
              Solutions
            </span>
          </Link>

          {/* ---- desktop nav ---- */}
          <nav className="ml-2 hidden min-w-0 flex-1 2xl:block" aria-label="Main">
            <ul className="flex items-center">
              {MEGA_MENUS.map((menu) => (
                <li
                  key={menu.label}
                  className="static"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(menu.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    id={`menu-trigger-${slug(menu.label)}`}
                    aria-expanded={openMenu === menu.label}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
                    className={cn(
                      'flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-2 text-[0.8125rem] font-medium transition-colors 3xl:px-2.5 3xl:text-sm',
                      pathname.startsWith(menu.href) || openMenu === menu.label
                        ? 'text-accent'
                        : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    <span className="3xl:hidden">{menu.short ?? menu.label}</span>
                    <span className="hidden 3xl:inline">{menu.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-300',
                        openMenu === menu.label && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- right side ---- */}
          <div className="ml-auto flex items-center gap-1.5 2xl:gap-2">
            <div className="relative hidden md:block">
              <button
                onClick={() => setRegionOpen((v) => !v)}
                aria-expanded={regionOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden />
                <span className="3xl:hidden">{region.currency}</span>
                <span className="hidden 3xl:inline">
                  {region.short} · {region.currency}
                </span>
                <ChevronDown className={cn('h-3 w-3 transition-transform', regionOpen && 'rotate-180')} aria-hidden />
              </button>
              <AnimatePresence>
                {regionOpen && (
                  <motion.ul
                    role="listbox"
                    aria-label="Choose your region"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-bg-elev p-1.5 shadow-lift"
                  >
                    {REGIONS.map((r) => (
                      <li key={r.code}>
                        <button
                          role="option"
                          aria-selected={r.code === region.code}
                          onClick={() => {
                            setRegion(r.code as RegionCode);
                            setRegionOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                            r.code === region.code ? 'bg-accent/10 text-accent' : 'text-fg-muted hover:bg-bg-soft hover:text-fg',
                          )}
                        >
                          <span aria-hidden>{r.flag}</span>
                          <span className="flex-1 text-left">{r.label}</span>
                          <span className="text-xs text-fg-subtle">{r.currency}</span>
                          {r.code === region.code && <Check className="h-3.5 w-3.5" aria-hidden />}
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-line px-3 pb-1 pt-2 text-[0.6875rem] leading-relaxed text-fg-subtle">
                      Each region has its own price table. Currency is never converted live.
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="rounded-lg border border-line p-2 text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent/50 hover:text-fg 3xl:flex"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {SITE.phone}
            </a>

            <ButtonLink
              href="/estimate"
              size="sm"
              icon={ArrowRight}
              className="hidden sm:inline-flex"
              trackLabel="Get a Rough Estimate"
              trackLocation="header"
            >
              <span className="3xl:hidden">Get an Estimate</span>
              <span className="hidden 3xl:inline">Get a Rough Estimate</span>
            </ButtonLink>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-line p-2 text-fg 2xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ---- mega-menu panel ---- */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-bg-elev/[0.97] backdrop-blur-xl 2xl:block"
            >
              <MegaPanel menu={MEGA_MENUS.find((m) => m.label === openMenu)!} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function MegaPanel({ menu }: { menu: MegaMenu }) {
  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_auto]">
      <div>
        <Link
          href={menu.href}
          className="group mb-6 inline-flex items-baseline gap-2 border-b border-line pb-4 text-sm"
        >
          <span className="font-display font-semibold text-accent">{menu.overviewLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
          <span className="ml-2 text-fg-subtle">{menu.overviewDescription}</span>
        </Link>

        <div
          className={cn(
            'grid gap-x-8 gap-y-6',
            menu.columns.length === 1 && 'md:grid-cols-2',
            menu.columns.length === 2 && 'lg:grid-cols-2',
            menu.columns.length === 3 && 'lg:grid-cols-3',
          )}
        >
          {menu.columns.map((col, i) => (
            <div key={col.title ?? i}>
              {col.title && (
                <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  {col.title}
                </p>
              )}
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group block rounded-lg px-3 py-2 transition-colors hover:bg-bg-soft"
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium text-fg group-hover:text-accent">
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="mt-0.5 block text-xs leading-relaxed text-fg-subtle">
                          {link.description}
                        </span>
                      )}
                      {link.children && (
                        <span className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
                          {link.children.slice(0, 4).map((child) => (
                            <span key={child.href} className="text-[0.6875rem] text-fg-subtle/80">
                              {child.label}
                            </span>
                          ))}
                          {link.children.length > 4 && (
                            <span className="text-[0.6875rem] text-accent/80">
                              +{link.children.length - 4} more
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {menu.featured && (
        <aside className="w-full max-w-sm rounded-2xl border border-accent/25 bg-accent/5 p-6 lg:w-80">
          <p className="eyebrow mb-3">{menu.featured.eyebrow}</p>
          <p className="font-display text-xl font-semibold">{menu.featured.title}</p>
          <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{menu.featured.body}</p>
          <Link
            href={menu.featured.href}
            className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            {menu.featured.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </aside>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { region, setRegion } = useRegion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-bg 2xl:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <Logo />
              <span className="font-display text-sm font-semibold">Texas Solutions</span>
            </Link>
            <button onClick={onClose} aria-label="Close menu" className="rounded-lg border border-line p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-5 pb-28 pt-4">
            <div className="mb-5 flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code as RegionCode)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    r.code === region.code
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-fg-muted',
                  )}
                >
                  {r.flag} {r.short} · {r.currency}
                </button>
              ))}
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {MEGA_MENUS.map((menu) => (
                <li key={menu.label}>
                  <button
                    onClick={() => setExpanded(expanded === menu.label ? null : menu.label)}
                    aria-expanded={expanded === menu.label}
                    className="flex w-full items-center justify-between py-4 text-left font-display text-base font-medium"
                  >
                    {menu.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-fg-subtle transition-transform',
                        expanded === menu.label && 'rotate-180 text-accent',
                      )}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded === menu.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4">
                          <Link
                            href={menu.href}
                            onClick={onClose}
                            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-accent"
                          >
                            {menu.overviewLabel}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                          <ul className="space-y-0.5">
                            {menu.columns.flatMap((c) => c.links).map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={onClose}
                                  className="block rounded-lg py-2 text-sm text-fg-muted"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2.5">
              <ButtonLink href="/estimate" size="lg" icon={ArrowRight} className="w-full">
                Get a Rough Estimate
              </ButtonLink>
              <a
                href={SITE.phoneHref}
                className="flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl border border-line text-[0.9375rem] font-medium"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.phone}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-accent',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
        <path
          d="M16 3 L28 9.5 V22.5 L16 29 L4 22.5 V9.5 Z"
          stroke="rgb(var(--accent-ink))"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M11 13 H21 M16 13 V22" stroke="rgb(var(--accent-ink))" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
