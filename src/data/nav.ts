import { SERVICES } from './services';
import { SOLUTIONS } from './solutions';
import { PRODUCTS, MARKETPLACE_CATEGORIES } from './catalog';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** Third-level links, used for service sub-services. */
  children?: { label: string; href: string }[];
}

export interface NavColumn {
  title?: string;
  links: NavLink[];
}

export interface MegaMenu {
  label: string;
  /** Compact label used in the desktop bar, where ten items must fit. */
  short?: string;
  href: string;
  /** Every column set opens with an Overview link, per the spec. */
  overviewLabel: string;
  overviewDescription: string;
  columns: NavColumn[];
  featured?: { eyebrow: string; title: string; body: string; href: string; cta: string };
  /** Wide menus get more horizontal room. */
  wide?: boolean;
}

export const MEGA_MENUS: MegaMenu[] = [
  {
    label: 'Products',
    href: '/products',
    overviewLabel: 'Products overview',
    overviewDescription: 'Tools we build and run alongside the services.',
    columns: [
      {
        title: 'Our products',
        links: PRODUCTS.map((p) => ({
          label: p.name,
          href: `/products/${p.slug}`,
          description: p.tagline,
        })),
      },
    ],
    featured: {
      eyebrow: 'Built for carriers',
      title: 'Dispatch Portal',
      body: 'Loads, documents, settlements and claims in one timeline per truck. Included with every dispatch agreement.',
      href: '/products/dispatch-portal',
      cta: 'See the portal',
    },
  },
  {
    label: 'Marketplace',
    short: 'Market',
    href: '/marketplace',
    overviewLabel: 'Marketplace overview',
    overviewDescription: 'Templates, creative packs, engine listings and add-ons. Enquiry-only in this release.',
    columns: [
      {
        title: 'Browse by category',
        links: MARKETPLACE_CATEGORIES.map((c) => ({
          label: c,
          href: `/marketplace?category=${encodeURIComponent(c)}`,
          description: marketplaceBlurb(c),
        })),
      },
    ],
    featured: {
      eyebrow: 'Enquiry only',
      title: 'No checkout yet',
      body: 'Marketplace items are priced from the same regional tables as our services. Tell us what you need and we confirm availability.',
      href: '/marketplace',
      cta: 'Browse the marketplace',
    },
  },
  {
    label: 'Services',
    href: '/services',
    overviewLabel: 'All services',
    overviewDescription: 'Seven service lines, each with its own pricing and sub-services.',
    wide: true,
    columns: [
      {
        title: 'Operations and freight',
        links: SERVICES.filter((s) => ['truck-dispatch', 'auto-engines'].includes(s.slug)).map(serviceLink),
      },
      {
        title: 'Growth and marketing',
        links: SERVICES.filter((s) =>
          ['lead-generation', 'ads-optimization', 'adsense-management'].includes(s.slug),
        ).map(serviceLink),
      },
      {
        title: 'Build and quality',
        links: SERVICES.filter((s) => ['web-development', 'qa-testing'].includes(s.slug)).map(serviceLink),
      },
    ],
    featured: {
      eyebrow: 'Not sure where to start',
      title: 'Get a rough estimate',
      body: 'Seven steps, a real range in your currency and a breakdown of how we got there. No call required first.',
      href: '/estimate',
      cta: 'Start an estimate',
    },
  },
  {
    label: 'Solutions',
    href: '/solutions',
    overviewLabel: 'Solutions overview',
    overviewDescription: 'Services bundled the way each industry actually buys them.',
    columns: [
      {
        title: 'By industry',
        links: SOLUTIONS.slice(0, 4).map((s) => ({
          label: s.navLabel,
          href: `/solutions/${s.slug}`,
          description: s.summary,
        })),
      },
      {
        links: SOLUTIONS.slice(4).map((s) => ({
          label: s.navLabel,
          href: `/solutions/${s.slug}`,
          description: s.summary,
        })),
      },
    ],
  },
  {
    label: 'Why Texas Solutions',
    short: 'Why Us',
    href: '/why-texas-solutions',
    overviewLabel: 'Why Texas Solutions',
    overviewDescription: 'What we do differently, and what we commit to in writing.',
    columns: [
      {
        links: [
          { label: 'Our difference', href: '/why-texas-solutions#difference', description: 'Seven service lines, one accountable contact.' },
          { label: 'Process', href: '/why-texas-solutions#process', description: 'From first enquiry to reporting cadence.' },
          { label: 'Guarantees and SLAs', href: '/why-texas-solutions#guarantees', description: 'Response times, reporting and notice periods.' },
          { label: 'Security and compliance', href: '/why-texas-solutions#security', description: 'How we handle and retain your data.' },
          { label: 'Pricing philosophy', href: '/why-texas-solutions#pricing', description: 'Why our ranges are published, not hidden.' },
          { label: 'Compare us', href: '/why-texas-solutions#compare', description: 'Against a typical agency and against in-house.' },
        ],
      },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
    overviewLabel: 'Insights hub',
    overviewDescription: 'What we have learned, written down.',
    columns: [
      {
        links: [
          { label: 'Blog', href: '/insights?kind=Blog', description: 'Practical notes from the desks doing the work.' },
          { label: 'Case studies', href: '/insights?kind=Case+study', description: 'Before and after, with the numbers.' },
          { label: 'Guides and whitepapers', href: '/insights?kind=Guide', description: 'Longer operational playbooks.' },
          { label: 'Industry reports', href: '/insights?kind=Industry+report', description: 'What we see across our own book.' },
          { label: 'Events', href: '/insights?kind=Event', description: 'Open sessions and live desk walkthroughs.' },
          { label: 'Newsletter', href: '/insights#newsletter', description: 'One email, every other week.' },
        ],
      },
    ],
  },
  {
    label: 'Investors',
    href: '/investors',
    overviewLabel: 'Investors overview',
    overviewDescription: 'Company structure, growth metrics and how to reach us.',
    columns: [
      {
        links: [
          { label: 'Company overview', href: '/investors#overview', description: 'Business model and service mix.' },
          { label: 'Growth metrics', href: '/investors#metrics', description: 'Revenue mix, retention and headcount.' },
          { label: 'Leadership', href: '/investors#leadership', description: 'Who runs each part of the business.' },
          { label: 'Reports', href: '/investors#reports', description: 'Downloadable overviews and research.' },
          { label: 'Press and news', href: '/investors#press', description: 'Company announcements.' },
          { label: 'Investment enquiry', href: '/investors#enquiry', description: 'Talk to us directly.' },
        ],
      },
    ],
  },
  {
    label: 'Look Inside',
    short: 'Inside',
    href: '/look-inside',
    overviewLabel: 'Look inside',
    overviewDescription: 'How the company actually runs, and who runs it.',
    columns: [
      {
        links: [
          { label: 'Life at Texas Solutions', href: '/look-inside#life', description: 'How we work across five locations.' },
          { label: 'Our team', href: '/look-inside#team', description: 'The people behind each service line.' },
          { label: 'Culture and values', href: '/look-inside#values', description: 'Six things we hold to.' },
          { label: 'Office tour', href: '/look-inside#offices', description: 'Houston, London, Toronto, Sydney, Lahore.' },
          { label: 'Careers', href: '/look-inside#careers', description: 'Open roles across dispatch and engineering.' },
          { label: 'A day on dispatch', href: '/look-inside#dispatch-day', description: 'From the 4:30am board sweep to handover.' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
    short: 'About',
    href: '/about',
    overviewLabel: 'About Texas Solutions',
    overviewDescription: 'Where the company came from and where it operates.',
    columns: [
      {
        links: [
          { label: 'Story', href: '/about#story', description: 'From a two-person dispatch desk in 2019.' },
          { label: 'Timeline', href: '/about#timeline', description: 'How seven service lines came together.' },
          { label: 'Leadership', href: '/about#leadership', description: 'Who is accountable for what.' },
          { label: 'Certifications and partners', href: '/about#certifications', description: 'Badges, and their current status.' },
          { label: 'Offices', href: '/about#offices', description: 'Five locations across four time zones.' },
          { label: 'Corporate responsibility', href: '/about#csr', description: 'Driver welfare, apprenticeships, recycling.' },
        ],
      },
    ],
  },
  {
    label: 'Contact Us',
    short: 'Contact',
    href: '/contact',
    overviewLabel: 'Contact us',
    overviewDescription: 'Talk to a person, not a queue.',
    columns: [
      {
        links: [
          { label: 'Contact form', href: '/contact#form', description: 'Tell us what you need.' },
          { label: 'Book a consultation', href: '/contact#booking', description: 'Pick a slot in your own time zone.' },
          { label: 'Offices', href: '/contact#offices', description: 'Addresses and hours per location.' },
          { label: 'Support', href: '/contact#support', description: 'Existing clients and urgent issues.' },
          { label: 'Advertise with us', href: '/advertise', description: 'Placements, rates and the media kit.' },
          { label: 'Partner with us', href: '/contact#partner', description: 'Referral and delivery partnerships.' },
        ],
      },
    ],
  },
];

function serviceLink(s: (typeof SERVICES)[number]): NavLink {
  return {
    label: s.navLabel,
    href: `/services/${s.slug}`,
    description: s.summary,
    children: s.subServices.map((sub) => ({
      label: sub.name,
      href: `/services/${s.slug}/${sub.slug}`,
    })),
  };
}

function marketplaceBlurb(category: string): string {
  switch (category) {
    case 'Website templates':
      return 'Industry templates on our design system, live in days.';
    case 'Landing pages':
      return 'Campaign pages with variants and tracking.';
    case 'Ad creative packs':
      return 'Statics and short-form video in every placement size.';
    case 'Engine listings':
      return 'Verified used and remanufactured engines.';
    case 'Add-ons':
      return 'Tracking rebuilds and automation starters.';
    default:
      return 'Factoring, load boards and vetted partners.';
  }
}

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: SERVICES.map((s) => ({ label: s.navLabel, href: `/services/${s.slug}` })),
  },
  {
    title: 'Solutions',
    links: SOLUTIONS.map((s) => ({ label: s.navLabel, href: `/solutions/${s.slug}` })),
  },
  {
    title: 'Products',
    links: [
      ...PRODUCTS.map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
      { label: 'Marketplace', href: '/marketplace' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Why Texas Solutions', href: '/why-texas-solutions' },
      { label: 'Look inside', href: '/look-inside' },
      { label: 'Investors', href: '/investors' },
      { label: 'Careers', href: '/look-inside#careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights', href: '/insights' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Rough estimate', href: '/estimate' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Advertise with us', href: '/advertise' },
    ],
  },
];
