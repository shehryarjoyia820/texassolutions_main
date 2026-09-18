export const SITE = {
  name: 'Texas Solutions',
  legalName: 'Texas Solutions LLC',
  tagline: 'Custom Web Platforms & Software Built for Modern Enterprises',
  description:
    'Texas Solutions runs truck dispatch, web and app development, lead generation, ads, AdSense revenue management, QA testing and auto engines for clients across the US, UK, Canada, Australia and Europe.',
  url: 'https://texassolutions.co',
  dispatchUrl: 'https://dispatch.texassolutions.co',
  phone: '(838) 910-3147',
  phoneHref: 'tel:+18389103147',
  email: 'hello@texassolutions.co',
  salesEmail: 'sales@texassolutions.co',
  supportEmail: 'support@texassolutions.co',
  contactName: 'Peter',
  hours: 'Dispatch desk 24/7 · Offices Mon–Fri, 8am–7pm CT',
  founded: 2019,
  /** Swap these for the real handles before launch. */
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/texassolutions', icon: 'linkedin' },
    { label: 'Facebook', href: 'https://facebook.com/texassolutions', icon: 'facebook' },
    { label: 'X', href: 'https://x.com/texassolutions', icon: 'twitter' },
    { label: 'YouTube', href: 'https://youtube.com/@texassolutions', icon: 'youtube' },
  ],
} as const;

export interface Office {
  city: string;
  country: string;
  region: string;
  address: string[];
  phone?: string;
  timezone: string;
  focus: string;
}

/** CMS model: office */
export const OFFICES: Office[] = [
  {
    city: 'Houston',
    country: 'United States',
    region: 'US',
    address: ['Texas Solutions LLC', '1201 Fannin Street, Suite 260', 'Houston, TX 77002'],
    phone: '(838) 910-3147',
    timezone: 'America/Chicago',
    focus: 'Head office · dispatch desk · sales',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    region: 'UK',
    address: ['Texas Solutions UK', '86-90 Paul Street', 'London EC2A 4NE'],
    timezone: 'Europe/London',
    focus: 'EMEA accounts · ads and lead generation',
  },
  {
    city: 'Toronto',
    country: 'Canada',
    region: 'CA',
    address: ['Texas Solutions Canada', '120 Adelaide Street West', 'Toronto, ON M5H 1T1'],
    timezone: 'America/Toronto',
    focus: 'Carrier accounts · cross-border freight',
  },
  {
    city: 'Sydney',
    country: 'Australia',
    region: 'AU',
    address: ['Texas Solutions AU', '1 Sussex Street', 'Sydney NSW 2000'],
    timezone: 'Australia/Sydney',
    focus: 'APAC web and QA delivery',
  },
  {
    city: 'Lahore',
    country: 'Pakistan',
    region: 'EU',
    address: ['Texas Solutions Delivery Centre', 'Arfa Software Technology Park', 'Ferozepur Road, Lahore'],
    timezone: 'Asia/Karachi',
    focus: 'Engineering · QA · 24/7 after-hours dispatch',
  },
];

/** CMS model: certification / partner badge */
export const CERTIFICATIONS = [
  { name: 'Google Partner', detail: 'Ads and AdSense', note: 'Verify badge before launch' },
  { name: 'Meta Business Partner', detail: 'Paid social', note: 'Verify badge before launch' },
  { name: 'ISO 27001 aligned', detail: 'Information security', note: 'Certification in progress' },
  { name: 'SOC 2 controls', detail: 'Data handling', note: 'Readiness assessment' },
  { name: 'MC / DOT compliant', detail: 'Broker packets', note: 'Dispatch operations' },
  { name: 'Clutch verified', detail: 'Client reviews', note: 'Profile live' },
];

export interface NavChild {
  label: string;
  href: string;
  description: string;
  children?: { label: string; href: string }[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Renders as an "Overview" link at the top of the mega-menu column set. */
  overview: string;
  columns: { title: string; items: NavChild[] }[];
  featured?: { eyebrow: string; title: string; body: string; href: string; cta: string };
}
