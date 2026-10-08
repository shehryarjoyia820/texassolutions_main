import type { PriceTable, Range } from './pricing';
import type { RegionCode } from './regions';

/**
 * Price tables for the enterprise IT services.
 *
 * US dollar figures set in October 2026 from a market review of offshore and
 * nearshore agency rates for US clients (Clutch, GoodFirms, vendor rate
 * guides): clearly below US onshore agencies, around professional South Asia
 * agency levels. The site shows the US row only; other rows are legacy.
 */

const REGION_FACTOR: Record<RegionCode, number> = {
  US: 1,
  UK: 0.8,
  CA: 1.3,
  AU: 1.4,
  EU: 0.9,
  // Authored in USD for the Gulf and Asia.
  GCC: 1.0,
  APAC: 0.9,
};

function tidy(n: number) {
  if (n >= 100000) return Math.round(n / 5000) * 5000;
  if (n >= 10000) return Math.round(n / 1000) * 1000;
  if (n >= 1000) return Math.round(n / 100) * 100;
  return Math.round(n / 5) * 5;
}

function regional([low, high]: Range): Record<RegionCode, Range> {
  const out = {} as Record<RegionCode, Range>;
  (Object.keys(REGION_FACTOR) as RegionCode[]).forEach((r) => {
    out[r] = [tidy(low * REGION_FACTOR[r]), tidy(high * REGION_FACTOR[r])];
  });
  return out;
}

const SCALED_NOTE =
  'Indicative ranges in US dollars. Your scope sets the final figure, confirmed in writing before work starts.';

export const ENTERPRISE_PRICE_TABLES: PriceTable[] = [
  {
    service: 'ai-machine-learning',
    title: 'AI and machine learning',
    intro: 'Discovery and pilots are fixed-price. Production builds are quoted from the pilot results.',
    rows: [
      { id: 'ai-consulting', label: 'AI consulting and pilot', note: 'Use-case scoring plus one pilot on real data', unit: 'one-time', values: regional([5000, 15000]) },
      { id: 'ai-chatbot', label: 'Grounded chatbot or assistant', note: 'Retrieval over your documents, guardrails, one channel', unit: 'one-time', values: regional([10000, 40000]) },
      { id: 'ai-genai', label: 'Generative AI workflow', note: 'Drafting, summarising or extraction inside your tools', unit: 'one-time', values: regional([15000, 60000]) },
      { id: 'ai-agents', label: 'AI agent system', note: 'Multi-step actions, approvals and audit trail', unit: 'one-time', plus: { US: true, UK: true, CA: true, AU: true, EU: true }, values: regional([25000, 100000]) },
      { id: 'ai-ml-model', label: 'Custom machine learning model', note: 'Forecasting, scoring or recommendation', unit: 'one-time', values: regional([20000, 80000]) },
      { id: 'ai-vision', label: 'Computer vision solution', note: 'Inspection, counting or document capture', unit: 'one-time', values: regional([30000, 120000]) },
      { id: 'ai-retainer', label: 'AI engineering retainer', note: 'Tuning, monitoring and new use cases', unit: 'monthly', values: regional([3000, 8000]) },
    ],
    disclaimer: `${SCALED_NOTE} Model usage fees are billed at cost by the provider and are not included.`,
  },
  {
    service: 'data-analytics',
    title: 'Data and analytics',
    intro: 'Projects are fixed-price per phase. Managed analytics runs monthly.',
    rows: [
      { id: 'bi-dashboards', label: 'BI dashboard set', note: 'Up to three sources, five to eight dashboards', unit: 'one-time', values: regional([4000, 15000]) },
      { id: 'data-pipelines', label: 'Data engineering pipelines', note: 'Automated ingestion with quality tests', unit: 'one-time', values: regional([10000, 50000]) },
      { id: 'data-warehouse', label: 'Cloud data warehouse', note: 'Design, build and semantic layer', unit: 'one-time', values: regional([20000, 100000]) },
      { id: 'predictive', label: 'Predictive analytics model', note: 'Demand, churn or cash forecasting', unit: 'one-time', values: regional([15000, 60000]) },
      { id: 'managed-analytics', label: 'Managed analytics', note: 'Pipelines, dashboards and requests', unit: 'monthly', values: regional([1500, 5000]) },
    ],
    disclaimer: `${SCALED_NOTE} BI and warehouse licences are billed separately by the vendor.`,
  },
  {
    service: 'cloud-devops',
    title: 'Cloud and DevOps',
    intro: 'Assessments and migrations are fixed-price per wave. Managed operations run monthly.',
    rows: [
      { id: 'cloud-assessment', label: 'Cloud readiness assessment', note: 'Inventory, target architecture, cost model', unit: 'one-time', values: regional([2500, 8000]) },
      { id: 'devops-setup', label: 'DevOps and CI/CD setup', note: 'Pipelines, infrastructure as code, monitoring', unit: 'one-time', values: regional([5000, 25000]) },
      { id: 'cloud-migration', label: 'Cloud migration', note: 'AWS or Azure, in waves', unit: 'one-time', values: regional([10000, 100000]) },
      { id: 'app-modernization', label: 'Application modernisation', note: 'Legacy to maintainable architecture', unit: 'one-time', values: regional([20000, 150000]) },
      { id: 'managed-cloud', label: 'Managed cloud and DevOps', note: '24/7 monitoring, patching, backups', unit: 'monthly', values: regional([1000, 6000]) },
    ],
    disclaimer: `${SCALED_NOTE} Cloud provider charges are billed directly to your account.`,
  },
  {
    service: 'crm-erp',
    title: 'CRM and ERP',
    intro: 'Implementations are quoted per phase after process mapping. Licences are separate.',
    rows: [
      { id: 'crm-implementation', label: 'CRM implementation', note: 'Salesforce, Dynamics 365 or HubSpot', unit: 'one-time', values: regional([5000, 50000]) },
      { id: 'custom-crm', label: 'Custom CRM', note: 'Built for processes packages cannot fit', unit: 'one-time', values: regional([20000, 100000]) },
      { id: 'odoo-implementation', label: 'Odoo or Business Central ERP', note: 'Small and mid-sized companies', unit: 'one-time', values: regional([8000, 60000]) },
      { id: 'erp-implementation', label: 'Enterprise ERP implementation', note: 'Midsized company, excluding licences', unit: 'one-time', values: regional([40000, 400000]) },
      { id: 'crm-erp-support', label: 'CRM and ERP support', note: 'Admin, fixes and enhancements', unit: 'monthly', values: regional([1000, 5000]) },
    ],
    disclaimer: `${SCALED_NOTE} Platform licence fees are paid to the vendor and are not included.`,
  },
  {
    service: 'cybersecurity',
    title: 'Cybersecurity',
    intro: 'Assessments and readiness are fixed-price. Managed security runs monthly.',
    rows: [
      { id: 'security-assessment', label: 'Security assessment', note: 'Cloud, identity, applications and process', unit: 'one-time', values: regional([3000, 15000]) },
      { id: 'pen-test', label: 'Penetration test, accredited partner', note: 'Scoping, test, remediation and retest', unit: 'one-time', values: regional([6000, 25000]) },
      { id: 'compliance-readiness', label: 'SOC 2 or ISO 27001 readiness', note: 'Policies, controls and evidence', unit: 'one-time', values: regional([8000, 30000]) },
      { id: 'managed-security', label: 'Managed security', note: 'Monitoring, vulnerability management, response', unit: 'monthly', values: regional([1500, 6000]) },
    ],
    disclaimer: `${SCALED_NOTE} Audit fees charged by the certifying firm are separate.`,
  },
  {
    service: 'dedicated-teams',
    title: 'Dedicated teams',
    intro: 'Billed monthly per full-time engineer. Rates depend on seniority, stack and time-zone overlap.',
    rows: [
      { id: 'dev-junior', label: 'Junior engineer', note: '1-2 years experience', unit: 'monthly', values: regional([2500, 3500]) },
      { id: 'dev-middle', label: 'Mid-level engineer', note: '3-5 years experience', unit: 'monthly', values: regional([3500, 5000]) },
      { id: 'dev-senior', label: 'Senior engineer', note: '5+ years, owns features end to end', unit: 'monthly', values: regional([5000, 7000]) },
      { id: 'dev-lead', label: 'Tech lead or architect', note: 'Design, reviews and technical direction', unit: 'monthly', values: regional([6500, 9000]) },
      { id: 'team-qa', label: 'QA engineer', note: 'Manual and automation', unit: 'monthly', values: regional([2500, 4000]) },
      { id: 'team-devops', label: 'DevOps engineer', note: 'Pipelines and infrastructure', unit: 'monthly', values: regional([4500, 6500]) },
      { id: 'team-designer', label: 'Product designer', note: 'UX, UI and design systems', unit: 'monthly', values: regional([3500, 5500]) },
      { id: 'team-pm', label: 'Delivery or project manager', note: 'Included free on teams of four or more', unit: 'monthly', values: regional([3500, 5500]) },
    ],
    disclaimer: `${SCALED_NOTE} Full overlap with US business hours adds 10-15%.`,
  },
];

/** Monthly rate lookup used by the team builder. */
export const TEAM_ROLES = [
  { id: 'dev-junior', label: 'Junior engineer' },
  { id: 'dev-middle', label: 'Mid-level engineer' },
  { id: 'dev-senior', label: 'Senior engineer' },
  { id: 'dev-lead', label: 'Tech lead / architect' },
  { id: 'team-qa', label: 'QA engineer' },
  { id: 'team-devops', label: 'DevOps engineer' },
  { id: 'team-designer', label: 'Product designer' },
  { id: 'team-pm', label: 'Delivery manager' },
] as const;
