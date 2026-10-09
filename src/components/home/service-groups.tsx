import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronDown, type LucideIcon } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { DIVISIONS, DIVISIONS_INTRO, PRIORITY_SERVICES } from '@/data/divisions';
import { PRICE_TABLE_MAP, UNIT_LABEL, type PriceRow } from '@/data/pricing';
import { TRUST_STATS } from '@/data/company';
import { formatMoney } from '@/lib/format';
import { Container, Section, SectionHeading } from '@/components/ui';
import { DevPackageCards } from '@/components/dev-packages';

function startPrice(slug: string): string {
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return '';
  if (slug === 'truck-dispatch') return '5-10% of weekly gross';
  const row: PriceRow | undefined = PRICE_TABLE_MAP[slug]?.rows.find((r) => r.id === svc.startingPriceRow);
  const v = row?.values.US;
  if (!row || !v) return 'Quoted per scope';
  return `From ${formatMoney(v[0], 'US')} USD ${row.kind === 'support' ? 'per month' : UNIT_LABEL[row.unit]}`;
}

function ServiceCard({ slug }: { slug: string }) {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return null;
  const Icon = (Icons[s.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
  return (
    <Link
      href={`/services/${s.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50 focus-visible:border-accent"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-accent">{s.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-fg-muted">{s.summary}</p>
      <p className="mt-auto pt-4 text-sm font-medium text-fg">{startPrice(s.slug)}</p>
    </Link>
  );
}

/** Verified figures only (owner-confirmed, October 2026). */
export function TrustFacts() {
  return (
    <section className="border-y border-line bg-bg-soft py-8">
      <Container>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm font-medium">{stat.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">
                {stat.value.toLocaleString('en-US')}
                {stat.suffix}
              </dd>
              <dd className="mt-0.5 text-xs text-fg-subtle">{stat.note}, to date (October 2026)</dd>
            </div>
          ))}
          <div>
            <dt className="text-sm font-medium">Service lines</dt>
            <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">13</dd>
            <dd className="mt-0.5 text-xs text-fg-subtle">In three divisions</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">Notice period</dt>
            <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">30 days</dd>
            <dd className="mt-0.5 text-xs text-fg-subtle">No long-term lock-in</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}

export function ServiceGroups() {
  const others = DIVISIONS.map((d) => ({ ...d, services: d.services.filter((s) => !PRIORITY_SERVICES.includes(s)) }));
  return (
    <Section id="services">
      <Container>
        <SectionHeading eyebrow="What we do" title="Three divisions, one point of contact" body={DIVISIONS_INTRO} />

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {DIVISIONS.map((d) => (
            <li key={d.id} className="rounded-xl border border-line p-5">
              <p className="font-display text-base font-semibold">{d.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{d.summary}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 font-display text-xl font-semibold">Most requested services</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRIORITY_SERVICES.map((slug) => (
            <ServiceCard key={slug} slug={slug} />
          ))}
        </div>

        <details className="group mt-8 rounded-2xl border border-line">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            View all services (13)
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="grid gap-6 border-t border-line p-5 md:grid-cols-3">
            {others.map((d) => (
              <div key={d.id}>
                <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{d.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {d.services.map((slug) => {
                    const s = SERVICES.find((x) => x.slug === slug)!;
                    return (
                      <li key={slug}>
                        <Link href={`/services/${slug}`} className="text-sm text-fg-muted hover:text-accent">
                          {s.name}
                          <span className="ml-1.5 text-xs text-fg-subtle">{startPrice(slug)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-4">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Services overview <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </details>
      </Container>
    </Section>
  );
}

export function PackagesTeaser() {
  return (
    <Section tone="soft" id="packages">
      <Container>
        <SectionHeading
          eyebrow="Development packages"
          title="Monthly capacity, with the hours written down"
          body="Roles and hours are fixed for each package, so you know exactly what a month buys. Need a different mix? Build a team on the Dedicated Teams page."
        />
        <DevPackageCards compact />
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="font-semibold text-accent">
            See the full price list
          </Link>
          <span className="text-fg-muted"> · </span>
          <Link href="/services/dedicated-teams#interactive" className="font-semibold text-accent">
            Build a dedicated team
          </Link>
        </p>
      </Container>
    </Section>
  );
}
