import type { RegionCode } from '@/data/regions';
import { getRegion } from '@/data/regions';
import { SITE } from '@/data/site';
import { ESTIMATE_DISCLAIMER } from '@/data/estimate-config';
import type { Answers, EstimateResult } from '@/lib/estimate';
import { formatMoney, formatRange } from '@/lib/format';

/**
 * Builds a printable estimate summary and opens the browser print dialog,
 * where the visitor saves it as a PDF. This avoids shipping a PDF library
 * (roughly 300 KB) for a document most people print once.
 *
 * For a server-generated PDF attached to the confirmation email, generate it
 * in the form handler from the same payload the wizard already submits.
 */
export function buildEstimateDocument({
  result,
  region,
  contact,
  answers,
  serviceName,
  subTypeLabel,
  outputNotes,
}: {
  result: EstimateResult;
  region: RegionCode;
  contact: { name: string; email: string; company: string };
  answers: Answers;
  serviceName: string;
  subTypeLabel: string;
  outputNotes: string[];
}) {
  const r = getRegion(region);
  const today = new Date().toLocaleDateString(r.locale, { year: 'numeric', month: 'long', day: 'numeric' });

  const unit =
    result.billing === 'monthly' ? 'per month' : result.billing === 'weekly' ? 'per week' : 'one-time project';

  const rows = result.lineItems
    .map(
      (li) => `<tr>
        <td>${escapeHtml(li.label)}${li.detail ? `<span class="detail">${escapeHtml(li.detail)}</span>` : ''}</td>
        <td class="num">${
          li.range
            ? escapeHtml(formatRange([Math.round(li.range[0]), Math.round(li.range[1])], region))
            : '&mdash;'
        }</td>
      </tr>`,
    )
    .join('');

  const answerRows = Object.entries(answers)
    .filter(([, v]) => v !== '' && v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(
      ([k, v]) =>
        `<tr><td>${escapeHtml(humanise(k))}</td><td class="num">${escapeHtml(
          Array.isArray(v) ? v.join(', ') : String(v),
        )}</td></tr>`,
    )
    .join('');

  const assumptions = [...result.assumptions, ...outputNotes]
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join('');

  const dispatchBlock = result.dispatch
    ? `<h2>Both fee models</h2>
       <table>
         <tr><td>${(result.dispatch.percentRate * 100).toFixed(0)}% of linehaul</td><td class="num">${escapeHtml(
           formatMoney(result.dispatch.percentWeekly[0], region),
         )} per week</td></tr>
         <tr><td>Flat weekly</td><td class="num">${escapeHtml(
           formatRange(result.dispatch.flatWeekly, region),
         )} per week</td></tr>
         <tr><td><strong>Break-even weekly gross, per truck</strong></td><td class="num"><strong>${escapeHtml(
           formatMoney(result.dispatch.breakEvenWeeklyGross, region),
         )}</strong></td></tr>
       </table>
       <p class="note">Fee applies to linehaul only, not fuel surcharge or detention. Below the break-even figure the percentage costs less; above it the flat weekly fee costs less.</p>`
    : '';

  const totalBlock =
    result.totalLow !== undefined && result.durationMonths && result.durationMonths > 1
      ? `<p class="total">Across ${result.durationMonths} months: <strong>${escapeHtml(
          formatRange([result.totalLow, result.totalHigh ?? result.totalLow], region),
        )}</strong></p>`
      : '';

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Rough estimate — ${escapeHtml(serviceName)} — ${SITE.name}</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body { font: 13px/1.6 -apple-system, "Segoe UI", Roboto, sans-serif; color: #12182a; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: flex-start;
           border-bottom: 3px solid #FF7A1A; padding-bottom: 14px; margin-bottom: 26px; }
  .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
  .brand span { color: #FF7A1A; }
  .meta { text-align: right; font-size: 11px; color: #5a6480; }
  h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: -0.02em; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em;
       color: #5a6480; margin: 28px 0 10px; }
  .headline { background: #FFF4EC; border: 1px solid #FFD5B8; border-radius: 10px;
              padding: 20px; margin: 20px 0; }
  .range { font-size: 30px; font-weight: 700; color: #C4560A; letter-spacing: -0.02em; }
  .unit { font-size: 13px; color: #5a6480; font-weight: 400; margin-left: 8px; }
  .likely { font-size: 12px; color: #5a6480; margin-top: 6px; }
  .total { font-size: 13px; margin-top: 10px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  td { padding: 7px 0; border-bottom: 1px solid #e6e9f0; vertical-align: top; }
  td.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .detail { display: block; font-size: 11px; color: #7a839c; }
  ul { padding-left: 18px; margin: 8px 0; }
  li { margin-bottom: 5px; }
  .note { font-size: 11px; color: #5a6480; margin-top: 8px; }
  footer { margin-top: 32px; border-top: 1px solid #e6e9f0; padding-top: 14px;
           font-size: 10.5px; color: #7a839c; }
  .disclaimer { background: #FFF8E6; border: 1px solid #F0D68A; border-radius: 8px;
                padding: 12px; font-size: 11px; margin-top: 20px; }
  @media print { .noprint { display: none; } }
  .noprint { margin-bottom: 20px; }
  button { font: inherit; padding: 9px 16px; border-radius: 8px; border: 0;
           background: #FF7A1A; color: #fff; cursor: pointer; font-weight: 600; }
</style></head>
<body>
  <div class="noprint">
    <button onclick="window.print()">Save as PDF</button>
  </div>

  <header>
    <div>
      <div class="brand">Texas<span>Solutions</span></div>
      <div class="meta" style="text-align:left">${SITE.phone} &middot; ${SITE.email}</div>
    </div>
    <div class="meta">
      ${today}<br>
      ${escapeHtml(r.label)} &middot; ${r.currency}
      ${contact.name ? `<br>Prepared for ${escapeHtml(contact.name)}` : ''}
      ${contact.company ? `<br>${escapeHtml(contact.company)}` : ''}
    </div>
  </header>

  <h1>Rough estimate</h1>
  <p style="color:#5a6480;margin:0">${escapeHtml(serviceName)} &middot; ${escapeHtml(subTypeLabel)}</p>

  <div class="headline">
    <div class="range">${escapeHtml(formatRange([result.low, result.high], region))}<span class="unit">${unit}</span></div>
    <div class="likely">Most likely: ${escapeHtml(formatMoney(result.likely, region))}</div>
    ${totalBlock}
  </div>

  ${dispatchBlock}

  <h2>How we got there</h2>
  <table>${rows}</table>

  <h2>Your answers</h2>
  <table>${answerRows}</table>

  <h2>Assumptions</h2>
  <ul>${assumptions}</ul>

  <div class="disclaimer"><strong>${ESTIMATE_DISCLAIMER}</strong> All figures are ranges for guidance and are
  not a binding quote. Pricing is confirmed in writing after a consultation.</div>

  <footer>
    ${SITE.legalName} &middot; ${SITE.url} &middot; ${SITE.phone}<br>
    Generated ${today}. Valid for guidance for 30 days.
  </footer>

  <script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 350); });</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) {
    // Popup blocked: fall back to downloading the same document as an HTML file.
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `texas-solutions-estimate-${result.service}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  win.document.write(html);
  win.document.close();
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

function humanise(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
