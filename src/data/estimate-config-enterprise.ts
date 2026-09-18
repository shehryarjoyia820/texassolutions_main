import type { EstimateServiceConfig, QuestionOption } from './estimate-config';

/**
 * Calculator configuration for the enterprise IT services.
 *
 * Large engineering firms such as Itransition price by project type, scope,
 * integrations, compliance needs and, for teams, role mix, seniority and
 * duration. The questions below mirror those drivers.
 */

const ALL_REGIONS: EstimateServiceConfig['regions'] = ['US', 'UK', 'CA', 'AU', 'EU', 'GCC', 'APAC'];

const COMPLEXITY: QuestionOption[] = [
  { value: 'simple', label: 'Simple', hint: 'Well-defined, few edge cases', factor: 0.7 },
  { value: 'standard', label: 'Standard', hint: 'Typical business requirements', factor: 1 },
  { value: 'complex', label: 'Complex', hint: 'Many rules, high scale or strict SLAs', factor: 1.45 },
];

const COMPLIANCE: QuestionOption[] = [
  { value: 'none', label: 'No special requirements', factor: 1 },
  { value: 'gdpr', label: 'Personal data: GDPR, CCPA, UAE/Saudi PDPL or Singapore PDPA', factor: 1.08 },
  { value: 'regulated', label: 'Regulated: HIPAA, PCI or financial', factor: 1.2 },
];

const SIZE: QuestionOption[] = [
  { value: 'small', label: 'Up to 50 staff', factor: 0.8 },
  { value: 'mid', label: '50 to 500 staff', factor: 1 },
  { value: 'large', label: 'Over 500 staff', factor: 1.35 },
];

export const ENTERPRISE_ESTIMATE_CONFIG: EstimateServiceConfig[] = [
  {
    service: 'ai-machine-learning',
    billing: 'one-time',
    regions: ALL_REGIONS,
    subTypeLabel: 'What kind of AI project?',
    subTypes: [
      { id: 'consulting', label: 'AI consulting and pilot', description: 'Find and prove the use case', priceRow: 'ai-consulting' },
      { id: 'chatbot', label: 'Chatbot or assistant', description: 'Grounded in your documents', priceRow: 'ai-chatbot' },
      { id: 'genai', label: 'Generative AI workflow', description: 'Drafting, summarising, extraction', priceRow: 'ai-genai' },
      { id: 'agents', label: 'AI agents', description: 'Multi-step actions with approvals', priceRow: 'ai-agents' },
      { id: 'ml', label: 'Custom ML model', description: 'Forecasting, scoring, recommendations', priceRow: 'ai-ml-model' },
      { id: 'vision', label: 'Computer vision', description: 'Inspection, counting, capture', priceRow: 'ai-vision' },
    ],
    questions: [
      { id: 'complexity', type: 'select', label: 'How complex is the task?', defaultValue: 'standard', options: COMPLEXITY },
      {
        id: 'dataReadiness',
        type: 'select',
        label: 'How ready is your data?',
        help: 'Cleaning and labelling data is often the biggest hidden cost.',
        defaultValue: 'partial',
        options: [
          { value: 'ready', label: 'Clean and accessible', factor: 0.9 },
          { value: 'partial', label: 'Scattered but usable', factor: 1 },
          { value: 'raw', label: 'Needs cleaning or labelling', add: [8000, 40000] },
        ],
      },
      { id: 'integrations', type: 'number', label: 'Systems it must connect to', min: 0, max: 12, step: 1, defaultValue: 1, unit: 'systems', freeUnits: 1, perUnit: [3000, 12000] },
      { id: 'compliance', type: 'select', label: 'Data sensitivity', defaultValue: 'none', options: COMPLIANCE },
    ],
    disclaimer: 'Model usage fees are billed by the provider at cost and are not included in this range.',
    outputNotes: [
      'Includes use-case scoring, an evaluation set from your data, build, guardrails and monitoring.',
      'Production builds are re-quoted from pilot results, so the range narrows after week five.',
    ],
  },
  {
    service: 'data-analytics',
    billing: 'one-time',
    regions: ALL_REGIONS,
    subTypeLabel: 'What do you need?',
    subTypes: [
      { id: 'dashboards', label: 'BI dashboards', description: 'Power BI, Tableau or Looker', priceRow: 'bi-dashboards' },
      { id: 'pipelines', label: 'Data pipelines', description: 'Automated ingestion and quality tests', priceRow: 'data-pipelines' },
      { id: 'warehouse', label: 'Data warehouse', description: 'Snowflake, BigQuery or Fabric', priceRow: 'data-warehouse' },
      { id: 'predictive', label: 'Predictive analytics', description: 'Forecasting and scoring', priceRow: 'predictive' },
    ],
    questions: [
      { id: 'sources', type: 'number', label: 'Number of data sources', help: 'CRM, ERP, ad platforms, databases, spreadsheets.', min: 1, max: 30, step: 1, defaultValue: 4, unit: 'sources', freeUnits: 3, perUnit: [2000, 7000] },
      { id: 'dashboards', type: 'number', label: 'Dashboards needed', min: 1, max: 40, step: 1, defaultValue: 6, unit: 'dashboards', freeUnits: 6, perUnit: [800, 2500] },
      {
        id: 'dataQuality',
        type: 'select',
        label: 'Data quality today',
        defaultValue: 'mixed',
        options: [
          { value: 'good', label: 'Mostly clean', factor: 0.9 },
          { value: 'mixed', label: 'Mixed', factor: 1 },
          { value: 'poor', label: 'Messy and inconsistent', factor: 1.3 },
        ],
      },
      { id: 'size', type: 'select', label: 'Company size', defaultValue: 'mid', options: SIZE },
    ],
    disclaimer: 'BI and warehouse licences are billed by the vendor and are not included.',
    outputNotes: [
      'Includes metric definitions, automated refresh, data quality tests and training.',
      'Everything is built in your own cloud account.',
    ],
  },
  {
    service: 'cloud-devops',
    billing: 'one-time',
    regions: ALL_REGIONS,
    subTypeLabel: 'What is the project?',
    subTypes: [
      { id: 'assessment', label: 'Cloud assessment', description: 'Inventory, architecture, cost model', priceRow: 'cloud-assessment' },
      { id: 'devops', label: 'DevOps and CI/CD', description: 'Pipelines and infrastructure as code', priceRow: 'devops-setup' },
      { id: 'migration', label: 'Cloud migration', description: 'AWS or Azure, in waves', priceRow: 'cloud-migration' },
      { id: 'modernization', label: 'App modernisation', description: 'Legacy to modern architecture', priceRow: 'app-modernization' },
      { id: 'managed', label: 'Managed cloud', description: '24/7 operations', priceRow: 'managed-cloud', billingOverride: 'monthly' },
    ],
    defaultDurationMonths: 12,
    durationOptions: [3, 6, 12],
    questions: [
      { id: 'workloads', type: 'number', label: 'Applications or workloads', min: 1, max: 60, step: 1, defaultValue: 5, unit: 'workloads', freeUnits: 3, perUnit: [1500, 9000] },
      {
        id: 'target',
        type: 'select',
        label: 'Target platform',
        defaultValue: 'aws',
        options: [
          { value: 'aws', label: 'AWS', factor: 1 },
          { value: 'azure', label: 'Microsoft Azure', factor: 1 },
          { value: 'hybrid', label: 'Hybrid or multi-cloud', factor: 1.3 },
        ],
      },
      { id: 'complexity', type: 'select', label: 'Architecture complexity', defaultValue: 'standard', options: COMPLEXITY },
      { id: 'compliance', type: 'select', label: 'Compliance needs', defaultValue: 'none', options: COMPLIANCE },
    ],
    disclaimer: 'Cloud provider charges are billed directly to your account and are not included.',
    outputNotes: [
      'Includes infrastructure as code, monitoring, backups with tested restores and runbooks.',
      'Migrations run in waves with rehearsed cutovers and rollback plans.',
    ],
  },
  {
    service: 'crm-erp',
    billing: 'one-time',
    regions: ALL_REGIONS,
    subTypeLabel: 'Which system?',
    subTypes: [
      { id: 'crm', label: 'CRM implementation', description: 'Salesforce, Dynamics 365, HubSpot', priceRow: 'crm-implementation' },
      { id: 'custom-crm', label: 'Custom CRM', description: 'Built around your process', priceRow: 'custom-crm' },
      { id: 'odoo', label: 'Odoo or Business Central', description: 'Mid-market ERP', priceRow: 'odoo-implementation' },
      { id: 'erp', label: 'Enterprise ERP', description: 'Multi-entity, midsized and up', priceRow: 'erp-implementation' },
    ],
    questions: [
      { id: 'users', type: 'number', label: 'Number of users', min: 3, max: 2000, step: 1, defaultValue: 25, unit: 'users', freeUnits: 25, perUnit: [60, 180] },
      { id: 'modules', type: 'number', label: 'Modules or departments', help: 'Sales, service, inventory, finance, HR and so on.', min: 1, max: 12, step: 1, defaultValue: 3, unit: 'modules', freeUnits: 2, perUnit: [3000, 12000] },
      { id: 'integrations', type: 'number', label: 'Integrations with other systems', min: 0, max: 15, step: 1, defaultValue: 2, unit: 'integrations', freeUnits: 1, perUnit: [2500, 9000] },
      {
        id: 'migration',
        type: 'select',
        label: 'Data migration',
        defaultValue: 'some',
        options: [
          { value: 'none', label: 'Starting fresh', factor: 0.9 },
          { value: 'some', label: 'Migrate current records', factor: 1 },
          { value: 'heavy', label: 'Years of history from legacy systems', add: [8000, 40000] },
        ],
      },
    ],
    disclaimer: 'Platform licence fees are paid to the vendor and are not included in this range.',
    outputNotes: [
      'Includes process mapping, configuration, data migration, training and hypercare.',
      'Standard platform features are used before any custom code.',
    ],
  },
  {
    service: 'cybersecurity',
    billing: 'one-time',
    regions: ALL_REGIONS,
    subTypeLabel: 'What do you need?',
    subTypes: [
      { id: 'assessment', label: 'Security assessment', description: 'Where you are exposed', priceRow: 'security-assessment' },
      { id: 'pentest', label: 'Penetration test', description: 'Via accredited partner', priceRow: 'pen-test' },
      { id: 'compliance', label: 'SOC 2 or ISO 27001 readiness', description: 'Policies, controls, evidence', priceRow: 'compliance-readiness' },
      { id: 'managed', label: 'Managed security', description: 'Monitoring and response', priceRow: 'managed-security', billingOverride: 'monthly' },
    ],
    defaultDurationMonths: 12,
    durationOptions: [3, 6, 12],
    questions: [
      { id: 'assets', type: 'number', label: 'Applications and cloud accounts in scope', min: 1, max: 50, step: 1, defaultValue: 3, unit: 'assets', freeUnits: 2, perUnit: [1500, 6000] },
      { id: 'size', type: 'select', label: 'Company size', defaultValue: 'small', options: SIZE },
      { id: 'compliance', type: 'select', label: 'Regulatory pressure', defaultValue: 'gdpr', options: COMPLIANCE },
    ],
    disclaimer: 'Fees charged by the certifying audit firm are separate.',
    outputNotes: [
      'Includes a risk-ranked report, remediation support and an evidence pack.',
      'Formal penetration tests are delivered by accredited partners.',
    ],
  },
  {
    service: 'dedicated-teams',
    billing: 'monthly',
    regions: ALL_REGIONS,
    subTypeLabel: 'How much time-zone overlap do you need?',
    defaultDurationMonths: 6,
    durationOptions: [3, 6, 12, 24],
    subTypes: [
      { id: 'partial', label: 'Four hours of overlap', description: 'Standard, lowest cost', priceRow: 'dev-middle' },
      { id: 'full', label: 'Full working-hours overlap', description: 'US, UK or EU hours, adds about 12%', priceRow: 'dev-middle' },
    ],
    // Role counts are priced from the regional rate card in the engine, not from per-unit adders.
    questions: [
      { id: 'dev-junior', type: 'number', label: 'Junior engineers', min: 0, max: 20, step: 1, defaultValue: 0, unit: 'people' },
      { id: 'dev-middle', type: 'number', label: 'Mid-level engineers', min: 0, max: 20, step: 1, defaultValue: 2, unit: 'people' },
      { id: 'dev-senior', type: 'number', label: 'Senior engineers', min: 0, max: 20, step: 1, defaultValue: 1, unit: 'people' },
      { id: 'dev-lead', type: 'number', label: 'Tech leads or architects', min: 0, max: 5, step: 1, defaultValue: 0, unit: 'people' },
      { id: 'team-qa', type: 'number', label: 'QA engineers', min: 0, max: 10, step: 1, defaultValue: 1, unit: 'people' },
      { id: 'team-devops', type: 'number', label: 'DevOps engineers', min: 0, max: 5, step: 1, defaultValue: 0, unit: 'people' },
      { id: 'team-designer', type: 'number', label: 'Product designers', min: 0, max: 5, step: 1, defaultValue: 0, unit: 'people' },
    ],
    disclaimer: 'A delivery manager is included free on teams of four or more. Notice period is 30 days.',
    outputNotes: [
      'Monthly figure is for the whole team at full time.',
      'You interview and approve every engineer before they start.',
    ],
  },
];
