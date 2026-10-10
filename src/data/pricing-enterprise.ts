import { project, rateCardRows, resourceRows, type PriceTable } from './price-rows';
import { MONTHLY_RESOURCES, SPECIALIST_QUOTE_NOTE } from './rates';

/**
 * Price tables for the enterprise IT services, built from the owner rate card
 * in ./rates.ts (hourly rates, dedicated resources, support plans). Fixed-scope
 * project ranges are indicative and confirmed in a written proposal.
 * US dollars only; no region multipliers.
 */

export const ENTERPRISE_PRICE_TABLES: PriceTable[] = [
  {
    service: 'ai-machine-learning',
    title: 'AI and machine learning',
    intro: 'Discovery and pilots are fixed-price. Production builds are quoted from the pilot results. Ongoing work is hourly, a dedicated AI engineer, or a maintenance plan.',
    rows: [
      project('ai-consulting', 'AI consulting and pilot', 'Use-case scoring plus one pilot on real data', [5000, 15000]),
      project('ai-chatbot', 'Grounded chatbot or assistant', 'Retrieval over your documents, guardrails, one channel', [10000, 40000]),
      project('ai-genai', 'Generative AI workflow', 'Drafting, summarising or extraction inside your tools', [15000, 60000]),
      project('ai-agents', 'AI agent system', 'Multi-step actions, approvals and audit trail', [25000, 100000], true),
      project('ai-ml-model', 'Custom machine learning model', 'Forecasting, scoring or recommendation', [20000, 80000]),
      project('ai-vision', 'Computer vision solution', 'Inspection, counting or document capture', [30000, 120000]),
      ...rateCardRows('ai-machine-learning'),
      ...resourceRows(['ai-engineer']),
    ],
    disclaimer: 'AI model and API usage fees are billed at cost by the provider and are not included.',
  },
  {
    service: 'data-analytics',
    title: 'Data and analytics',
    intro: 'Projects are fixed-price per phase. Ongoing work is hourly or a monthly dashboard support plan.',
    rows: [
      project('bi-dashboards', 'BI dashboard set', 'Up to three sources, five to eight dashboards', [4000, 15000]),
      project('data-pipelines', 'Data engineering pipelines', 'Automated ingestion with quality tests', [10000, 50000]),
      project('data-warehouse', 'Cloud data warehouse', 'Design, build and semantic layer', [20000, 100000]),
      project('predictive', 'Predictive analytics model', 'Demand, churn or cash forecasting', [15000, 60000]),
      ...rateCardRows('data-analytics'),
    ],
    disclaimer: 'BI, warehouse and cloud licences are billed separately by the vendor.',
  },
  {
    service: 'cloud-devops',
    title: 'Cloud and DevOps',
    intro: 'Assessments and migrations are fixed-price per wave. Ongoing work is hourly, a dedicated DevOps engineer, or a business-hours support plan.',
    rows: [
      project('cloud-assessment', 'Cloud readiness assessment', 'Inventory, target architecture, cost model', [2500, 8000]),
      project('devops-setup', 'DevOps and CI/CD setup', 'Pipelines, infrastructure as code, monitoring', [5000, 25000]),
      project('cloud-migration', 'Cloud migration', 'AWS or Azure, in waves', [10000, 100000]),
      project('app-modernization', 'Application modernisation', 'Legacy to maintainable architecture', [20000, 150000]),
      ...rateCardRows('cloud-devops').map((r) => (r.id === 'cloud-support' ? { ...r, id: 'managed-cloud' } : r)),
      ...resourceRows(['devops']),
    ],
    disclaimer: 'Cloud provider charges are billed directly to your account. Support is business hours; out-of-hours cover is quoted separately.',
  },
  {
    service: 'crm-erp',
    title: 'CRM and ERP',
    intro: 'Implementations are quoted per phase after process mapping. Configuration and integration work is hourly; support is a monthly plan.',
    rows: [
      project('crm-implementation', 'CRM implementation', 'Salesforce, Dynamics 365 or HubSpot', [5000, 50000]),
      project('custom-crm', 'Custom CRM', 'Built for processes packages cannot fit', [20000, 100000]),
      project('odoo-implementation', 'Odoo or Business Central ERP', 'Small and mid-sized companies', [8000, 60000]),
      project('erp-implementation', 'Enterprise ERP implementation', 'Midsized company, excluding licences', [40000, 400000]),
      ...rateCardRows('crm-erp'),
    ],
    disclaimer: 'Platform licence fees are paid to the vendor and are not included.',
  },
  {
    service: 'cybersecurity',
    title: 'Cybersecurity',
    intro: `Specialist work is hourly. ${SPECIALIST_QUOTE_NOTE}`,
    rows: [
      ...rateCardRows('cybersecurity'),
      project('security-assessment', 'Security assessment', 'Cloud, identity, applications and process. Quoted per scope', null),
      project('pen-test', 'Penetration test, accredited partner', 'Delivered with a specialist partner. Quoted per scope', null),
      project('compliance-readiness', 'SOC 2 or ISO 27001 readiness', 'Readiness preparation, not certification. Quoted per scope', null),
      { ...project('managed-security', 'Ongoing security support', 'Quoted per scope; not 24/7 monitoring', null), unit: 'monthly' },
    ],
    disclaimer: 'Audit and certification fees charged by the certifying firm, and partner penetration-test fees, are separate.',
  },
  {
    service: 'dedicated-teams',
    title: 'Dedicated teams',
    intro:
      'Each person is dedicated to your work for up to 160 working hours a month. Monthly rates reflect reserved capacity and may be lower than ad-hoc hourly billing.',
    rows: resourceRows(MONTHLY_RESOURCES.map((r) => r.id)),
    disclaimer:
      'A project manager is not included and is quoted separately if needed.',
  },
];

/** Roles for the team builder, straight from the rate card. */
export const TEAM_ROLES = MONTHLY_RESOURCES.map((r) => ({ id: r.id, label: r.label }));
