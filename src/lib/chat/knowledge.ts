import { createHash } from 'node:crypto';
import { SERVICES } from '@/data/services';
import { SERVICE_SEO } from '@/data/seo-content';
import { PRICE_TABLE_MAP, UNIT_LABEL, DISPATCH_MODELS, DISPATCH_DISCLAIMER, dispatchPercentLabel, type PriceRow } from '@/data/pricing';
import {
  HOURLY_RATES,
  MONTHLY_RESOURCES,
  DEV_PACKAGES,
  PACKAGE_INCLUDES,
  PACKAGE_EXCLUDES,
  SUPPORT_PLANS,
  PRICE_TERMS,
  PREMIUMS_NOTE,
  SPECIALIST_QUOTE_NOTE,
  RESOURCE_NOTE,
  HOURS_PER_ALLOCATION,
} from '@/data/rates';
import { SITE, OFFICES } from '@/data/site';
import { SITE_FAQS, HOW_IT_WORKS, GUARANTEES, TRUST_STATS } from '@/data/company';
import { DIVISIONS, DIVISIONS_INTRO } from '@/data/divisions';
import { INSIGHTS } from '@/data/insights';
import { SOLUTIONS } from '@/data/solutions';
import { ESTIMATE_DISCLAIMER } from '@/data/estimate-config';

/**
 * The chatbot's knowledge, generated from the same data files the website and
 * the calculators render. Nothing here is typed twice: change rates.ts or a
 * service file, deploy, and the next chat request syncs the new text into the
 * knowledge table (see store.syncSiteKnowledge).
 */

export type KbCategory = 'pricing' | 'service' | 'faq' | 'process' | 'company' | 'policy' | 'example' | 'article';

export interface KbItem {
  id: string;
  title: string;
  body: string;
  category: KbCategory;
  /** Page on texassolutions.co that publishes this information. */
  sourcePage: string;
  /** Service slug, when the item belongs to one service. */
  service?: string;
  origin: 'site' | 'admin';
  status: 'active' | 'flagged' | 'disabled';
  flagReason?: string | null;
  hash: string;
  updatedAt: string;
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const range = (r: readonly [number, number]) => (r[0] === r[1] ? usd(r[0]) : `${usd(r[0])}-${usd(r[1])}`);
export const hashText = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

function rowText(row: PriceRow): string {
  const v = row.values.US;
  const unit = row.kind === 'support' ? 'per month' : UNIT_LABEL[row.unit];
  const price = !v ? 'quoted per scope' : `${row.from ? 'from ' : ''}${range(v)}${row.plus?.US ? '+' : ''} USD ${unit}`;
  const scope = row.scope ? ` (${row.scope})` : '';
  const note = row.note ? ` - ${row.note}` : '';
  return `- ${row.label}: ${price}${scope}${note}`;
}

type Draft = Omit<KbItem, 'hash' | 'updatedAt' | 'origin' | 'status'>;

export function buildSiteKnowledge(): Draft[] {
  const items: Draft[] = [];
  const add = (d: Draft) => items.push({ ...d, body: d.body.trim() });

  /* ---------------- Company ---------------- */
  add({
    id: 'company-overview',
    title: 'About Texas Solutions',
    category: 'company',
    sourcePage: '/about',
    body: [
      SITE.description,
      DIVISIONS_INTRO,
      ...DIVISIONS.map((d) => `${d.name}: ${d.summary} Services: ${d.services.join(', ')}.`),
      `Verified figures: ${TRUST_STATS.map((s) => `${s.value.toLocaleString('en-US')}${s.suffix} ${s.label.toLowerCase()}`).join('; ')} (to date, October 2026).`,
      'Case studies on service pages are illustrative examples, not client results. Do not present them as real clients. Client names and testimonials are not published without permission.',
    ].join('\n'),
  });
  add({
    id: 'company-contact',
    title: 'Contact details, offices and hours',
    category: 'company',
    sourcePage: '/contact',
    body: [
      `Email: ${SITE.email}. Phone: ${SITE.phone}. Owner and CEO: ${SITE.ceo}.`,
      ...OFFICES.map((o) => `${o.city}, ${o.country}: ${o.address.length ? o.address.join(', ') : 'no public street address'} - ${o.focus}.`),
      `Hours: ${SITE.hours}.`,
      'First reply to any enquiry: within one business day.',
      'Consultations are requested through the booking form on /contact and confirmed by a person by email.',
      `Truck dispatch has its own site: ${SITE.dispatchUrl}.`,
    ].join('\n'),
  });
  add({
    id: 'policy-commitments',
    title: 'Service commitments, notice period, ownership and handover',
    category: 'policy',
    sourcePage: '/why-texas-solutions',
    body: GUARANTEES.map((g) => `- ${g.item}: ${g.standard}.`).join('\n'),
  });
  add({
    id: 'policy-price-terms',
    title: 'Pricing terms: currency, billing, payment, exclusions, taxes',
    category: 'policy',
    sourcePage: '/pricing',
    body: [...Object.values(PRICE_TERMS), PREMIUMS_NOTE, SPECIALIST_QUOTE_NOTE, ESTIMATE_DISCLAIMER].map((t) => `- ${t}`).join('\n'),
  });
  add({
    id: 'process-how-it-works',
    title: 'How engagements start (onboarding steps and timelines)',
    category: 'process',
    sourcePage: '/',
    body: HOW_IT_WORKS.map((s) => `${s.step}. ${s.title} (${s.duration}): ${s.body}`).join('\n'),
  });
  add({
    id: 'faq-site',
    title: 'General questions about Texas Solutions',
    category: 'faq',
    sourcePage: '/answers',
    body: SITE_FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n'),
  });

  /* ---------------- Rate card ---------------- */
  add({
    id: 'pricing-hourly',
    title: 'Hourly rates (USD)',
    category: 'pricing',
    sourcePage: '/pricing',
    body: [...HOURLY_RATES.map((r) => `- ${r.label}: ${range(r.rate)} per hour (service page /services/${r.service})`), SPECIALIST_QUOTE_NOTE].join('\n'),
  });
  add({
    id: 'pricing-resources',
    title: 'Dedicated monthly resources (USD per month)',
    category: 'pricing',
    sourcePage: '/services/dedicated-teams',
    service: 'dedicated-teams',
    body: [
      ...MONTHLY_RESOURCES.map((r) => `- ${r.label}: ${usd(r.price)} per month, up to ${HOURS_PER_ALLOCATION} hours; approved extra hours ${range(r.overageHourly)}/h`),
      RESOURCE_NOTE,
      'A project manager is not included and is quoted separately if needed.',
    ].join('\n'),
  });
  add({
    id: 'pricing-packages',
    title: 'Development packages: Starter, Growth, Product Team',
    category: 'pricing',
    sourcePage: '/pricing',
    body: [
      ...DEV_PACKAGES.map(
        (p) =>
          `${p.name}: ${usd(p.price)} per month. Includes ${p.lines.map((l) => `${l.hours} ${l.label.toLowerCase()}`).join(' + ')}. ` +
          `Extra hours only with written approval: ${p.overage.map((o) => `${o.label} ${range(o.rate)}/h`).join(', ')}.`,
      ),
      `Every package includes: ${PACKAGE_INCLUDES.join(', ').toLowerCase()}.`,
      PACKAGE_EXCLUDES,
      PRICE_TERMS.capacity,
      'Packages are monthly capacity allocations with the hours listed. Never describe them as multiple squads or a set number of engineers.',
      'Guidance: Starter suits small, steady changes or an MVP side project; Growth gives roughly one full-time mid-level developer plus QA; Product Team adds a senior developer for larger roadmaps. For a custom mix, use the team builder on /services/dedicated-teams.',
    ].join('\n'),
  });
  add({
    id: 'pricing-support-plans',
    title: 'Monthly support plans and retainers (starting prices)',
    category: 'pricing',
    sourcePage: '/pricing',
    body: [
      ...SUPPORT_PLANS.map(
        (p) => `- ${p.label}: from ${usd(p.from)} per month - ${p.scope}${p.overageHourly ? `; approved extra hours ${range(p.overageHourly)}/h` : ''} (/services/${p.service})`,
      ),
      PRICE_TERMS.support,
    ].join('\n'),
  });
  add({
    id: 'pricing-dispatch',
    title: 'Truck dispatch fees (percentage of weekly gross)',
    category: 'pricing',
    sourcePage: '/services/truck-dispatch',
    service: 'truck-dispatch',
    body: [
      ...DISPATCH_MODELS.map((m) => `- ${m.label}: ${dispatchPercentLabel(m.percent)} of weekly gross (typical weekly gross ${range(m.typicalGross)}, not guaranteed)`),
      DISPATCH_DISCLAIMER,
      'Dispatch pricing is separate from software and marketing pricing. The dispatch desk is available 24/7; free trial is one load.',
    ].join('\n'),
  });

  /* ---------------- Services ---------------- */
  for (const s of SERVICES) {
    const page = `/services/${s.slug}`;
    const seo = SERVICE_SEO[s.slug];
    add({
      id: `svc-${s.slug}`,
      title: `${s.name}: overview`,
      category: 'service',
      sourcePage: page,
      service: s.slug,
      body: [
        `${s.name} - ${s.summary}`,
        s.description,
        seo?.quickAnswer ?? '',
        `Always included: ${s.included.join('; ')}.`,
        `Sub-services: ${s.subServices.map((x) => `${x.name} (${page}/${x.slug}): ${x.summary}`).join(' | ')}`,
        `Tools: ${s.tools.join(', ')}.`,
      ].join('\n'),
    });
    const table = PRICE_TABLE_MAP[s.slug];
    if (table) {
      add({
        id: `price-${s.slug}`,
        title: `${s.name}: price table (USD)`,
        category: 'pricing',
        sourcePage: `${page}#pricing`,
        service: s.slug,
        body: [table.intro, ...table.rows.map(rowText), table.disclaimer ?? ''].join('\n'),
      });
    }
    add({
      id: `deliver-${s.slug}`,
      title: `${s.name}: deliverables by sub-service`,
      category: 'service',
      sourcePage: page,
      service: s.slug,
      body: s.subServices.map((x) => `${x.name} (${page}/${x.slug}): ${x.body} Deliverables: ${x.deliverables.join('; ')}.`).join('\n'),
    });
    add({
      id: `process-${s.slug}`,
      title: `${s.name}: process and timeline`,
      category: 'process',
      sourcePage: page,
      service: s.slug,
      body: s.process.map((p) => `- ${p.title} (${p.duration}): ${p.body}`).join('\n'),
    });
    const faqs = [...s.faqs, ...(seo?.faqs ?? [])];
    add({
      id: `faq-${s.slug}`,
      title: `${s.name}: frequently asked questions`,
      category: 'faq',
      sourcePage: page,
      service: s.slug,
      body: [
        ...faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`),
        ...(seo?.guide ?? []).map((g) => `${g.heading}\n${g.paragraphs.join(' ')}${g.bullets ? `\n- ${g.bullets.join('\n- ')}` : ''}`),
      ].join('\n\n'),
    });
    add({
      id: `example-${s.slug}`,
      title: `${s.name}: illustrative example (not a client result)`,
      category: 'example',
      sourcePage: page,
      service: s.slug,
      body:
        `ILLUSTRATIVE EXAMPLE - not a client result; figures are targets. Profile: ${s.caseStudy.client}, ${s.caseStudy.sector}. ` +
        `Challenge: ${s.caseStudy.challenge} Approach: ${s.caseStudy.work.join('; ')}.`,
    });
  }

  /* ---------------- Industry solutions and articles ---------------- */
  add({
    id: 'solutions',
    title: 'Industry solutions',
    category: 'service',
    sourcePage: '/solutions',
    body: SOLUTIONS.map((x) => `${x.name} (/solutions/${x.slug}): ${x.summary} Services: ${x.services.join(', ')}.`).join('\n'),
  });
  add({
    id: 'articles',
    title: 'Blog articles and guides',
    category: 'article',
    sourcePage: '/blog',
    body:
      'Articles may quote general market ranges; Texas Solutions prices are only those in the rate card.\n' +
      INSIGHTS.map((a) => `${a.title} (/insights/${a.slug}): ${a.excerpt}`).join('\n'),
  });

  return items;
}

/** Every path the bot may link to. Anything else is dropped from replies. */
export function allowedPaths(): Set<string> {
  const paths = new Set<string>(['/', '/pricing', '/estimate', '/contact', '/services', '/about', '/blog', '/answers', '/portfolio', '/solutions', '/privacy', '/terms']);
  for (const s of SERVICES) {
    paths.add(`/services/${s.slug}`);
    for (const x of s.subServices) paths.add(`/services/${s.slug}/${x.slug}`);
  }
  for (const x of SOLUTIONS) paths.add(`/solutions/${x.slug}`);
  for (const a of INSIGHTS) paths.add(`/insights/${a.slug}`);
  return paths;
}

/** Every dollar figure the website publishes; admin items quoting anything else are flagged. */
export function publishedAmounts(items: { body: string }[]): Set<number> {
  const set = new Set<number>();
  for (const it of items) for (const n of dollarAmounts(it.body)) set.add(n);
  return set;
}

export function dollarAmounts(text: string): number[] {
  return [...text.matchAll(/(?:US)?\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s?(k\b)?/gi)].map((m) => {
    const n = Number(m[1].replace(/,/g, ''));
    return m[2] ? n * 1000 : n;
  });
}
