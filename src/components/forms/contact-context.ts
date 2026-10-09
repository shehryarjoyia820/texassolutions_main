/**
 * Context carried into /contact from other pages, e.g.
 * /contact?service=truck-dispatch&package=growth&estimate_low=1200&estimate_billing=monthly
 */

export const CONTEXT_PARAMS = [
  'service',
  'sub',
  'package',
  'model',
  'people',
  'months',
  'roles',
  'estimate_low',
  'estimate_likely',
  'estimate_high',
  'estimate_billing',
  'subject',
] as const;

export type ContextKey = (typeof CONTEXT_PARAMS)[number];
export type ContactContext = Partial<Record<ContextKey, string>>;

const MAX_LEN = 120;

function clean(v: string | null): string {
  if (!v) return '';
  // Plain text only, single line, bounded length. React escapes on render.
  return v.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN);
}

export function parseContactContext(search: string): ContactContext {
  const params = new URLSearchParams(search);
  const out: ContactContext = {};
  for (const key of CONTEXT_PARAMS) {
    const v = clean(params.get(key));
    if (v) out[key] = v;
  }
  return out;
}

function humanise(slug: string): string {
  const s = slug.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function money(v: string | undefined): string | null {
  if (!v) return null;
  const n = Number(v.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n <= 0 || !/^[\s$US0-9.,]+$/i.test(v)) return v;
  return `US$${Math.round(n).toLocaleString('en-US')}`;
}

/** Human-readable summary lines, e.g. "Package: Growth". */
export function describeContext(ctx: ContactContext, serviceName?: (slug: string) => string | undefined): string[] {
  const lines: string[] = [];
  if (ctx.service) lines.push(`Service: ${serviceName?.(ctx.service) ?? humanise(ctx.service)}`);
  if (ctx.sub) lines.push(`Area: ${humanise(ctx.sub)}`);
  if (ctx.package) lines.push(`Package: ${humanise(ctx.package)}`);
  if (ctx.model) lines.push(`Model: ${humanise(ctx.model)}`);
  if (ctx.people) lines.push(`People: ${ctx.people}`);
  if (ctx.months) lines.push(`Duration: ${ctx.months} month${ctx.months === '1' ? '' : 's'}`);
  if (ctx.roles) lines.push(`Roles: ${ctx.roles.replace(/,/g, ', ')}`);
  const low = money(ctx.estimate_low);
  const likely = money(ctx.estimate_likely);
  const high = money(ctx.estimate_high);
  if (low || likely || high) {
    const range = low && high ? `${low} – ${high}` : (low ?? high ?? '');
    const parts = [range, likely ? `likely ${likely}` : ''].filter(Boolean).join(', ');
    const billing = ctx.estimate_billing ? ` (${humanise(ctx.estimate_billing).toLowerCase()})` : '';
    lines.push(`Estimate: ${parts}${billing}`);
  } else if (ctx.estimate_billing) {
    lines.push(`Billing: ${humanise(ctx.estimate_billing).toLowerCase()}`);
  }
  if (ctx.subject) lines.push(`Subject: ${humanise(ctx.subject)}`);
  return lines;
}

/** Context as fields for the submission: context_service, context_package, ... */
export function contextFields(ctx: ContactContext): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(ctx)) if (v) out[`context_${k}`] = v;
  return out;
}
