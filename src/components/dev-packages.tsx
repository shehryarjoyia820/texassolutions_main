'use client';

import { ArrowRight, Check, Clock } from 'lucide-react';
import { DEV_PACKAGES, PACKAGE_EXCLUDES, PACKAGE_INCLUDES, PRICE_TERMS } from '@/data/rates';
import { ButtonLink } from './ui';
import { cn } from '@/lib/utils';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

/** Development packages from the rate card: exact roles, hours, inclusions and overage. */
export function DevPackageCards({ serviceSlug, compact = false }: { serviceSlug?: string; compact?: boolean }) {
  return (
    <div className={cn(compact ? 'mt-8' : 'mt-12')}>
      <div className="grid gap-5 lg:grid-cols-3">
        {DEV_PACKAGES.map((pkg, i) => {
          const totalHours = pkg.lines.reduce((s, l) => s + l.hours, 0);
          const popular = pkg.id === 'growth';
          return (
            <div
              key={pkg.id}
              className={cn(
                'relative flex h-full flex-col rounded-2xl border p-7',
                popular ? 'border-accent bg-bg-elev shadow-glow' : 'border-line bg-bg-elev',
              )}
            >
              {popular && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most chosen
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
              <p className="mt-4 font-display text-3xl font-semibold text-accent">
                {usd(pkg.price)}
                <span className="ml-1 text-sm font-normal text-fg-subtle">USD per month</span>
              </p>
              <p className="mt-1 text-xs text-fg-subtle">Monthly capacity allocation, billed monthly in advance</p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Included hours each month</p>
              <ul className="mt-2 space-y-1.5">
                {pkg.lines.map((l) => (
                  <li key={l.label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-fg-muted">
                      <Clock className="h-3.5 w-3.5 text-accent" aria-hidden />
                      {l.label}
                    </span>
                    <span className="font-medium tabular-nums">{l.hours} h</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-line pt-1.5 text-sm font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{totalHours} h</span>
                </li>
              </ul>

              <ul className="mt-5 flex-1 space-y-2">
                {PACKAGE_INCLUDES.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-fg-subtle">
                Extra hours, only with your written approval:{' '}
                {pkg.overage.map((o) => `${o.label} ${usd(o.rate[0])}-${usd(o.rate[1])}/h`).join(', ')}.
              </p>

              <ButtonLink
                href={`/contact?service=${serviceSlug ?? 'dedicated-teams'}&package=${pkg.id}`}
                variant={popular ? 'primary' : 'secondary'}
                className="mt-6 w-full"
                icon={ArrowRight}
              >
                Ask about {pkg.name}
              </ButtonLink>
            </div>
          );
        })}
      </div>
      <div className="mt-6 space-y-1.5 text-xs leading-relaxed text-fg-subtle">
        <p>{PACKAGE_EXCLUDES}</p>
        <p>{PRICE_TERMS.capacity}</p>
        <p>
          {PRICE_TERMS.thirdParty} {PRICE_TERMS.taxes}
        </p>
      </div>
    </div>
  );
}
