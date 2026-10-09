'use client';

import { PRICE_TABLE_MAP, UNIT_LABEL, type PriceRow, type PriceTable, type RowKind } from '@/data/pricing';
import { PRICE_TERMS } from '@/data/rates';
import { useRegion } from './providers';
import { formatMoney, formatRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import { NoteBox } from './ui';

const GROUPS: { kind: RowKind; title: string }[] = [
  { kind: 'project', title: 'Fixed-scope projects (one-time, confirmed in a written proposal)' },
  { kind: 'hourly', title: 'Hourly rates' },
  { kind: 'resource', title: 'Dedicated monthly resources (up to 160 working hours each)' },
  { kind: 'support', title: 'Monthly plans (starting price and starting scope)' },
  { kind: 'example', title: 'Worked examples (not a price list)' },
  { kind: 'unit', title: 'Supplied and installed' },
];

export function PriceCell({ row, code }: { row: PriceRow; code: Parameters<typeof formatRange>[1] }) {
  const value = row.values[code];
  const plus = Boolean(row.plus?.[code]);
  if (!value) return <>Quoted per scope</>;
  if (row.from) return <>from {formatMoney(value[0], code)}</>;
  if (value[0] === value[1]) return <>{formatMoney(value[0], code)}{plus ? '+' : ''}</>;
  return <>{formatRange(value, code, { plus })}</>;
}

function billedLabel(row: PriceRow) {
  if (row.kind === 'example') return 'per truck, per week';
  return UNIT_LABEL[row.unit];
}

/** One service table: every row from the authoritative rate card, grouped by billing type. */
export function ServicePriceTable({
  service,
  accent = 'accent',
  className,
}: {
  service: string;
  accent?: 'accent' | 'svc';
  className?: string;
}) {
  const { code } = useRegion();
  const table = PRICE_TABLE_MAP[service];
  if (!table) return null;
  const groups = GROUPS.map((g) => ({ ...g, rows: table.rows.filter((r) => (r.kind ?? 'project') === g.kind) })).filter(
    (g) => g.rows.length,
  );

  return (
    <div className={className}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm text-fg-muted">{table.intro}</p>
        <span className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-fg-subtle">All prices in USD</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{table.title} pricing in US dollars</caption>
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Item and scope
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Price (USD)
              </th>
              <th scope="col" className="hidden px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-fg-subtle sm:table-cell">
                Billed
              </th>
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.kind} className="divide-y divide-line">
              {groups.length > 1 && (
                <tr className="bg-bg-soft/60">
                  <th colSpan={3} scope="colgroup" className="px-5 py-2 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-fg-subtle">
                    {g.title}
                  </th>
                </tr>
              )}
              {g.rows.map((row) => (
                <tr key={row.id} className="bg-bg-elev">
                  <th scope="row" className="px-5 py-4 text-left font-normal">
                    <span className="block text-sm font-medium text-fg">{row.label}</span>
                    {row.note && <span className="mt-0.5 block text-xs text-fg-subtle">{row.note}</span>}
                  </th>
                  <td
                    className={cn(
                      'whitespace-nowrap px-5 py-4 text-right font-display text-sm font-semibold',
                      accent === 'svc' ? 'text-svc' : 'text-accent',
                    )}
                  >
                    <PriceCell row={row} code={code} />
                    <span className="block text-[0.6875rem] font-normal text-fg-subtle sm:hidden">{billedLabel(row)}</span>
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-4 text-right text-xs text-fg-subtle sm:table-cell">
                    {billedLabel(row)}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <NoteBox tone="warn" className="mt-4">
        {table.disclaimer ? `${table.disclaimer} ` : ''}
        {table.service !== 'truck-dispatch' && table.service !== 'auto-engines'
          ? `${PRICE_TERMS.overage} ${PRICE_TERMS.taxes}`
          : PRICE_TERMS.taxes}
      </NoteBox>
    </div>
  );
}

/** Pricing-page variant: same rows and grouping as the service pages. */
export function FullPriceTable({ table }: { table: PriceTable }) {
  return <ServicePriceTable service={table.service} />;
}
