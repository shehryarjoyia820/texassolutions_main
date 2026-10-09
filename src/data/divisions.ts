/**
 * The 13 service lines in three business divisions. Used by the header,
 * the homepage, the services index and the footer, so the grouping is the
 * same everywhere.
 */
export interface Division {
  id: string;
  name: string;
  /** One sentence on what the division does and how it relates to the others. */
  summary: string;
  services: string[];
}

export const DIVISIONS: Division[] = [
  {
    id: 'technology',
    name: 'Technology',
    summary: 'Software, AI, testing, data, cloud and the people to run them, delivered by our engineering team in Lahore.',
    services: [
      'web-development',
      'ai-machine-learning',
      'qa-testing',
      'data-analytics',
      'cloud-devops',
      'crm-erp',
      'cybersecurity',
      'dedicated-teams',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Publisher Services',
    summary: 'Lead generation, advertising and AdSense for businesses that need customers, often for the products the technology team builds.',
    services: ['lead-generation', 'ads-optimization', 'adsense-management'],
  },
  {
    id: 'logistics',
    name: 'Logistics & Automotive',
    summary: 'Truck dispatch for US owner-operators and engine supply for fleets, run from our Midland, Texas office.',
    services: ['truck-dispatch', 'auto-engines'],
  },
];

/** Shown first on the homepage; the rest sit behind "View all services". */
export const PRIORITY_SERVICES = [
  'web-development',
  'ai-machine-learning',
  'qa-testing',
  'dedicated-teams',
  'lead-generation',
  'truck-dispatch',
];

export const DIVISIONS_INTRO =
  'Texas Solutions is one company with three divisions. Each has its own specialists and price list; clients who use more than one keep a single point of contact.';
