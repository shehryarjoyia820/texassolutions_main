'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { SITE, OFFICES, CERTIFICATIONS } from '@/data/site';
import { FOOTER_COLUMNS, FOOTER_MENUS } from '@/data/nav';
import { submitForm } from '@/lib/forms';
import { Logo } from './header';
import { Button } from './ui';

export function Footer() {
  // Offices are shown in the footer on the home page only.
  const showOffices = usePathname() === '/';

  return (
    <footer className="relative border-t border-line bg-bg-soft">
      <div className="container-x py-section-sm">
        {/* ---- newsletter ---- */}
        <div className="mb-14 grid gap-8 rounded-2xl border border-line bg-bg-elev p-7 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-10">
          <div>
            <h2 className="text-display-sm">One useful email, every other week</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-fg-muted">
              Rate movements, what we are seeing on the dispatch desk, and what actually moved a number for a
              client. No drip sequence, and one click to leave.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* ---- link columns ---- */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
              <Logo />
              <span className="font-display text-base font-semibold leading-tight">Texas Solutions</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{SITE.tagline}</p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-fg-muted transition-colors hover:text-accent">
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-fg-muted transition-colors hover:text-accent">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {SITE.email}
              </a>
              <p className="flex items-start gap-2 text-fg-subtle">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {SITE.hours}
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-3 text-sm">
              {SITE.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-subtle transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- company menus, moved here from the header ---- */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
          {FOOTER_MENUS.map((menu) => (
            <div key={menu.title}>
              <Link
                href={menu.href}
                className="group mb-4 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle transition-colors hover:text-accent"
              >
                {menu.title}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <ul className="space-y-2.5">
                {menu.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-fg-muted transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- offices (home page only) ---- */}
        {showOffices && (
        <div className="mt-14 border-t border-line pt-10">
          <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Offices
          </p>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
            {OFFICES.map((office) => (
              <div key={office.city}>
                <p className="font-display text-sm font-semibold">
                  {office.city}
                  <span className="ml-1.5 font-sans text-xs font-normal text-fg-subtle">{office.country}</span>
                </p>
                <address className="mt-1.5 text-xs not-italic leading-relaxed text-fg-muted">
                  {office.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-1.5 text-xs text-fg-subtle">{office.focus}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* ---- certifications ---- */}
        <div className="mt-10 border-t border-line pt-8">
          <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Certifications and partners
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {CERTIFICATIONS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-line bg-bg-elev px-3 py-2"
                title={c.note}
              >
                <span className="text-xs font-medium text-fg">{c.name}</span>
                <span className="ml-1.5 text-[0.6875rem] text-fg-subtle">{c.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.6875rem] text-fg-subtle">
            Badge artwork is added once each certification is verified. Status is shown on hover.
          </p>
        </div>

        {/* ---- legal row ---- */}
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-7 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-5">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-accent">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-accent">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-accent">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="transition-colors hover:text-accent">
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-5 max-w-3xl text-[0.6875rem] leading-relaxed text-fg-subtle">
          All prices shown on this site are ranges and estimates for guidance only. They are never a binding
          quote. Final pricing is confirmed in writing after a consultation.
        </p>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <form
      className="w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email) return;
        setState('sending');
        const res = await submitForm({ form: 'newsletter', fields: { email } });
        setState(res.ok ? 'done' : 'error');
        setMessage(res.message);
      }}
    >
      {state === 'done' ? (
        <p className="rounded-xl border border-success/35 bg-success/10 px-4 py-3.5 text-sm text-success">
          You are on the list. Check your inbox to confirm.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-12 flex-1 rounded-xl border border-line bg-bg px-4 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
            />
            <Button type="submit" size="md" className="h-12 shrink-0" disabled={state === 'sending'} icon={ArrowRight} iconRight>
              {state === 'sending' ? 'Sending' : 'Subscribe'}
            </Button>
          </div>
          {state === 'error' && <p className="mt-2 text-xs text-danger">{message}</p>}
          <p className="mt-2.5 text-xs leading-relaxed text-fg-subtle">
            We store your email to send the newsletter and nothing else. Unsubscribe in one click.
          </p>
        </>
      )}
    </form>
  );
}
