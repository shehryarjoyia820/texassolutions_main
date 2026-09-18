'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { PRICE_TABLE_MAP, UNIT_LABEL, DERIVED_REGIONS, type PriceTable } from '@/data/pricing';
import { REGIONS, type RegionCode } from '@/data/regions';
import { useRegion } from './providers';
import { formatRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import { NoteBox } from './ui';

/** One service table, showing only the visitor's region. */
export function ServicePriceTable({
  service,
  accent = 'accent',
  className,
}: {
  service: string;
  accent?: 'accent' | 'svc';
  className?: string;
}) {
  const { code, region } = useRegion();
  const table = PRICE_TABLE_MAP[service];
  if (!table) return null;

  return (
    <div className={className}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">{table.intro}</p>
        <span className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-fg-subtle">
          {region.flag} {region.label} · {region.currency}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{table.title} pricing for {region.label}</caption>
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Deliverable
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {region.currency} range
              </th>
              <th scope="col" className="hidden px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-fg-subtle sm:table-cell">
                Billed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {table.rows.map((row, i) => {
              const value = row.values[code];
              const plus = row.plus?.[code];
              const footnote = row.footnotes?.[code];
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-bg-elev transition-colors hover:bg-bg-soft"
                >
                  <th scope="row" className="px-5 py-4 text-left font-normal">
                    <span className="block text-sm font-medium text-fg">{row.label}</span>
                    {row.note && <span className="mt-0.5 block text-xs text-fg-subtle">{row.note}</span>}
                    {footnote && (
                      <span className="mt-1 flex items-start gap-1.5 text-xs text-warn">
                        <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                        {footnote}
                      </span>
                    )}
                  </th>
                  <td
                    className={cn(
                      'whitespace-nowrap px-5 py-4 text-right font-display text-sm font-semibold',
                      accent === 'svc' ? 'text-svc' : 'text-accent',
                    )}
                  >
                    {formatRange(value, code, { plus })}
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-4 text-right text-xs text-fg-subtle sm:table-cell">
                    {UNIT_LABEL[row.unit]}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {table.disclaimer && (
        <NoteBox tone="warn" className="mt-4">
          {table.disclaimer}
        </NoteBox>
      )}

      {DERIVED_REGIONS.includes(code) && (
        <NoteBox tone="warn" className="mt-3">
          {region.label} figures are scaled from US and UK benchmarks rather than measured locally. Treat them
          as indicative until we confirm on a call.
        </NoteBox>
      )}
    </div>
  );
}

/** All five regions side by side, used on the pricing page. */
export function FullPriceTable({ table }: { table: PriceTable }) {
  const { code } = useRegion();

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-fg-muted">{table.intro}</p>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
          <caption className="sr-only">{table.title} pricing across all regions</caption>
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Deliverable
              </th>
              {REGIONS.map((r) => (
                <th
                  key={r.code}
                  scope="col"
                  className={cn(
                    'whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider',
                    r.code === code ? 'text-accent' : 'text-fg-subtle',
                  )}
                >
                  {r.short}
                  <span className="ml-1 font-normal normal-case">({r.currency})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {table.rows.map((row) => (
              <tr key={row.id} className="bg-bg-elev">
                <th scope="row" className="px-4 py-3.5 text-left font-normal">
                  <span className="block text-sm font-medium text-fg">{row.label}</span>
                  {row.note && <span className="mt-0.5 block text-xs text-fg-subtle">{row.note}</span>}
                </th>
                {REGIONS.map((r) => (
                  <td
                    key={r.code}
                    className={cn(
                      'whitespace-nowrap px-4 py-3.5 text-right',
                      r.code === code ? 'font-semibold text-accent' : 'text-fg-muted',
                    )}
                  >
                    {formatRange(row.values[r.code as RegionCode], r.code as RegionCode, {
                      plus: row.plus?.[r.code as RegionCode],
                      compact: true,
                    })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.disclaimer && (
        <NoteBox tone="warn" className="mt-4">
          {table.disclaimer}
        </NoteBox>
      )}
    </div>
  );
}
