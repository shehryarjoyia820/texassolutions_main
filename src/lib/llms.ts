import { SITE, OFFICES } from '@/data/site';
import { SERVICES } from '@/data/services';
import { SERVICE_SEO } from '@/data/seo-content';
import { MARKETS } from '@/data/markets';
import { PRICE_TABLE_MAP } from '@/data/pricing';
import { formatRange } from '@/lib/format';
import { SITE_FAQS } from '@/data/company';
import { absUrl } from '@/lib/seo';

/**
 * llms.txt: a plain-text map of the site for large language models and
 * answer engines (see llmstxt.org). The short version links out; the full
 * version inlines the key facts so an assistant can answer without crawling.
 */

const u = (path: string) => absUrl(path);

export function llmsTxt(): string {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}. ${SITE.name} is a software development and technology services company headquartered in Houston, Texas, serving the United States, United Kingdom, Canada, Australia, Europe, the Gulf (UAE, Saudi Arabia, Qatar) and Asia (Singapore, Japan, Hong Kong). Core services: custom software and app development, AI and machine learning, QA and software testing, dedicated development teams, and truck dispatch for US carriers.`,
    '',
    `Contact: ${SITE.phone} · ${SITE.email}`,
    '',
    '## Services',
    ...SERVICES.map((s) => `- [${s.name}](${u(`/services/${s.slug}`)}): ${s.summary}`),
    '',
    '## Markets',
    ...MARKETS.map((m) => `- [${m.name}](${u(`/markets/${m.slug}`)}): ${m.headline}`),
    '',
    '## Pricing and estimates',
    `- [Pricing by region](${u('/pricing')}): published ranges for every service in USD, GBP, CAD, AUD and EUR, with USD tables for the Gulf and Asia`,
    `- [Rough Estimate calculator](${u('/estimate')}): low, likely and high range for a specific scope`,
    '',
    '## Answers',
    `- [All questions and answers](${u('/answers')})`,
    '',
    '## Optional',
    `- [Full plain-text summary](${u('/llms-full.txt')})`,
    `- [About](${u('/about')})`,
    `- [Insights](${u('/insights')})`,
    '',
  ];
  return lines.join('\n');
}

export function llmsFullTxt(): string {
  const out: string[] = [llmsTxt(), '---', '', '# Company facts', ''];
  out.push(`- Legal name: ${SITE.legalName}`);
  out.push(`- Founded: ${SITE.founded}, Houston, Texas`);
  out.push(`- Offices: ${OFFICES.map((o) => `${o.city} (${o.focus})`).join('; ')}`);
  out.push('- Contracts: 30 days notice on recurring services; clients own all code, accounts and IP.');
  out.push('- Prices are published ranges for guidance, not binding quotes.');
  out.push('');

  for (const s of SERVICES) {
    const seo = SERVICE_SEO[s.slug];
    out.push(`## ${s.name}`, '', `URL: ${u(`/services/${s.slug}`)}`, '');
    if (seo) out.push(seo.quickAnswer, '');
    out.push(`Sub-services: ${s.subServices.map((x) => x.name).join(', ')}.`, '');
    const table = PRICE_TABLE_MAP[s.slug];
    if (table) {
      out.push('US pricing:');
      for (const row of table.rows) out.push(`- ${row.label}: ${formatRange(row.values.US, 'US', { plus: row.plus?.US })}`);
      out.push('');
    }
    for (const f of [...(seo?.faqs ?? []), ...s.faqs].slice(0, 6)) out.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  }

  out.push('# Markets', '');
  for (const m of MARKETS) out.push(`## ${m.name}`, '', m.quickAnswer, '');

  out.push('# General questions', '');
  for (const f of SITE_FAQS) out.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  return out.join('\n');
}
