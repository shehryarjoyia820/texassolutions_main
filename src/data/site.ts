export const SITE = {
  name: 'Texas Solutions',
  legalName: 'Texas Solutions LLC',
  tagline: 'Custom Web Platforms & Software Built for Modern Enterprises',
  description:
    'Texas Solutions is a custom software development company: web and mobile app development, SaaS, AI and machine learning, QA and software testing, and dedicated development teams for growing businesses and enterprises, plus truck dispatch for US carriers.',
  url: 'https://texassolutions.co',
  dispatchUrl: 'https://dispatch.texassolutions.co',
  phone: '(838) 910-3147',
  phoneHref: 'tel:+18389103147',
  email: 'info@texassolutions.co',
  salesEmail: 'info@texassolutions.co',
  supportEmail: 'info@texassolutions.co',
  contactName: 'Shehryar Joyia',
  /** Owner and CEO. */
  ceo: 'Shehryar Joyia',
  hours: 'Dispatch desk 24/7 · Software and marketing teams Mon–Fri, business hours (CT)',
  /** Unverified; kept only because src/lib/seo.tsx and src/lib/llms.ts still read it. */
  founded: 2019,
  /** Social handles are unconfirmed, so none are published. */
  social: [] as { label: string; href: string; icon: string }[],
} as const;

export interface Office {
  city: string;
  country: string;
  region: string;
  /** Empty when no street address is published. */
  address: string[];
  phone?: string;
  timezone: string;
  focus: string;
}

/** CMS model: office. US office in Midland, delivery office in Lahore. */
export const OFFICES: Office[] = [
  {
    city: 'Midland',
    country: 'United States',
    region: 'US',
    address: ['Texas Solutions LLC', '401 W Kentucky Ave', 'Midland, TX 79701'],
    phone: '(838) 910-3147',
    timezone: 'America/Chicago',
    focus: 'US office',
  },
  {
    city: 'Lahore',
    country: 'Pakistan',
    region: 'PK',
    address: ['297-C Block, PIA Main Boulevard', 'Lahore, Pakistan'],
    timezone: 'Asia/Karachi',
    focus: 'Delivery team (engineering, QA and after-hours dispatch support)',
  },
];

/**
 * CMS model: certification / partner badge.
 * No certifications or partner badges are confirmed, so none are published.
 */
export const CERTIFICATIONS: { name: string; detail: string; note: string }[] = [];

/** Internal working practices. These are not certifications. */
export const INTERNAL_PRACTICES = [
  { name: 'Written scope before work starts', detail: 'Scope, price and acceptance criteria agreed in writing' },
  { name: 'Code and accounts in your name', detail: 'Repositories, ad accounts and design files stay yours' },
  { name: 'Least-privilege access', detail: 'Access limited to what the work needs and removed at the end' },
  { name: 'Thirty days notice', detail: 'No long lock-in on recurring services' },
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
