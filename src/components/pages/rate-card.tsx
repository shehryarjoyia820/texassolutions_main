import { HOURLY_RATES, MONTHLY_RESOURCES, SUPPORT_PLANS, PRICE_TERMS, PREMIUMS_NOTE, RESOURCE_NOTE, SPECIALIST_QUOTE_NOTE } from '@/data/rates';
import { DevPackageCards } from '@/components/dev-packages';
import { Container, Section, SectionHeading } from '@/components/ui';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-bg-soft">
            {head.map((h, i) => (
              <th key={h} scope="col" className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle ${i > 0 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={String(r[0])} className="bg-bg-elev">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-5 py-3.5 font-medium text-fg">
                    {c}
                  </th>
                ) : (
                  <td key={i} className={`px-5 py-3.5 text-right ${i === 1 ? 'font-display font-semibold text-accent' : 'text-fg-muted'}`}>
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The owner rate card, rendered from src/data/rates.ts (the single price source). */
export function RateCard() {
  return (
    <>
      <Section id="rate-card">
        <Container>
          <SectionHeading
            eyebrow="Rate card"
            title="How we charge"
            body="Four ways to buy, all in US dollars. Fixed-scope projects for each service are listed further down."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-display text-lg font-semibold">Hourly rates</h3>
              <Table
                caption="Hourly rates in US dollars"
                head={['Service or role', 'USD per hour']}
                rows={HOURLY_RATES.map((r) => [r.label, `${usd(r.rate[0])}-${usd(r.rate[1])}`])}
              />
              <p className="mt-3 text-xs leading-relaxed text-fg-subtle">{SPECIALIST_QUOTE_NOTE}</p>
            </div>
            <div>
              <h3 className="mb-3 font-display text-lg font-semibold">Dedicated monthly resources</h3>
              <Table
                caption="Dedicated monthly resources in US dollars"
                head={['Role', 'USD per month', 'Included']}
                rows={MONTHLY_RESOURCES.map((r) => [r.label, usd(r.price), 'up to 160 h'])}
              />
              <p className="mt-3 text-xs leading-relaxed text-fg-subtle">{RESOURCE_NOTE}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft" id="packages">
        <Container>
          <SectionHeading
            eyebrow="Development packages"
            title="Monthly capacity, with the hours written down"
            body="Each package is a fixed number of hours by role each month, not unlimited work."
          />
          <DevPackageCards compact />
        </Container>
      </Section>

      <Section id="support-plans">
        <Container>
          <SectionHeading eyebrow="Monthly plans" title="Support and marketing plans" body="Starting monthly price and the scope it includes." />
          <div className="mt-8">
            <Table
              caption="Monthly plans in US dollars"
              head={['Plan', 'From (USD per month)', 'Starting scope']}
              rows={SUPPORT_PLANS.map((p) => [p.label, usd(p.from), p.scope])}
            />
          </div>
        </Container>
      </Section>

      <Section tone="soft" id="terms">
        <Container>
          <SectionHeading eyebrow="What the prices include" title="Inclusions, exclusions and billing" />
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ['Currency', PRICE_TERMS.currency],
              ['Billing', PRICE_TERMS.billing],
              ['Capacity, not unlimited work', PRICE_TERMS.capacity],
              ['Extra hours', PRICE_TERMS.overage],
              ['Support hours', PRICE_TERMS.support],
              ['Third-party costs (not included)', PRICE_TERMS.thirdParty],
              ['Taxes', PRICE_TERMS.taxes],
              ['No guarantees', PRICE_TERMS.noGuarantees],
              ['Premiums', PREMIUMS_NOTE],
              ['Truck dispatch and engines', 'Truck dispatch is a percentage of weekly gross and engine supply is priced per engine. Neither uses the hourly or monthly rates above.'],
            ].map(([t, b]) => (
              <div key={t} className="rounded-xl border border-line bg-bg-elev p-5">
                <dt className="font-display text-sm font-semibold">{t}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fg-muted">{b}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
