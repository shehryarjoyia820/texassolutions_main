import type { RegionCode } from './regions';

/**
 * CMS model: market — location landing pages for the target markets.
 * Tier 1 (US, UK, Canada, Australia and New Zealand, Western Europe),
 * the Gulf (GCC) and Asia.
 *
 * These pages target "[service] company in [place]" searches. They describe
 * how we serve each market honestly: which of our offices or delivery centre
 * covers it, the time-zone overlap, and the data rules that apply there.
 */

export interface Market {
  slug: string;
  name: string;
  /** H1 and title keyword phrase. */
  headline: string;
  metaTitle: string;
  metaDescription: string;
  region: RegionCode;
  flag: string;
  countries: string[];
  cities: string[];
  keywords: string[];
  quickAnswer: string;
  intro: string[];
  coverage: { label: string; value: string }[];
  compliance: { name: string; note: string }[];
  focusServices: string[];
  whyUs: string[];
  faqs: { q: string; a: string }[];
}

const CORE = ['web-development', 'ai-machine-learning', 'qa-testing', 'dedicated-teams', 'cloud-devops', 'data-analytics'];

export const MARKETS: Market[] = [
  {
    slug: 'united-states',
    name: 'United States',
    headline: 'Software Development, AI and QA Company for US Enterprises',
    metaTitle: 'Software Development Company in the USA | AI, QA & Truck Dispatch',
    metaDescription:
      'Custom software development, AI and machine learning, QA testing and dedicated development teams for US companies, plus truck dispatch for US owner-operators. Houston-based, transparent USD pricing.',
    region: 'US',
    flag: '🇺🇸',
    countries: ['United States'],
    cities: ['Houston', 'Dallas', 'Austin', 'New York', 'Chicago', 'Los Angeles', 'San Francisco', 'Miami', 'Atlanta', 'Seattle'],
    keywords: ['software development company USA', 'custom software development company Texas', 'AI development company USA', 'QA testing company USA', 'truck dispatch service USA', 'software development company Houston'],
    quickAnswer:
      'Texas Solutions is a Houston-based software development company serving US businesses with custom software, web and mobile app development, AI and machine learning, QA and software testing, and dedicated development teams, plus 24/7 truck dispatch for US owner-operators. Pricing is published in USD, and teams overlap US working hours.',
    intro: [
      'US companies come to us for two reasons: senior engineering at a lower blended cost than a local agency, and a partner that publishes its pricing. Our Houston team runs client relationships, dispatch and sales, while engineering and QA are delivered from our delivery centre with guaranteed overlap with US Central and Eastern time.',
      'We build custom software, SaaS platforms and mobile apps for US scale-ups and mid-market companies, add AI to existing products, and run QA and test automation for engineering teams that need to ship faster without breaking production.',
    ],
    coverage: [
      { label: 'Client team', value: 'Houston, Texas' },
      { label: 'Working hours', value: '4+ hours overlap with ET and CT; full overlap available' },
      { label: 'Currency', value: 'USD' },
      { label: 'Dispatch', value: 'All 48 contiguous states, 24/7 option' },
    ],
    compliance: [
      { name: 'CCPA / CPRA and state privacy laws', note: 'Privacy by design for California, Virginia, Colorado, Texas and other state laws.' },
      { name: 'HIPAA', note: 'Business associate agreements available for health data projects.' },
      { name: 'SOC 2', note: 'SOC 2 readiness support for SaaS vendors selling to US enterprises.' },
      { name: 'TCPA', note: 'Consent capture for any call or SMS workflow we build.' },
    ],
    focusServices: [...CORE, 'truck-dispatch'],
    whyUs: [
      'Published USD pricing for every service line.',
      'Named US-based account contact and a named delivery lead.',
      'Code, cloud accounts and IP in your name from day one.',
      '30 days notice, no long lock-in.',
    ],
    faqs: [
      { q: 'Is Texas Solutions a US company?', a: 'Yes. Texas Solutions LLC is headquartered in Houston, Texas, with client teams in London, Toronto and Sydney and an engineering and QA delivery centre in Lahore.' },
      { q: 'How much does custom software development cost in the US?', a: 'Published US ranges run from US$3,000 to US$10,000 for a business website, US$30,000 to US$150,000 for a web application and US$25,000 to US$60,000 for a mobile app MVP. Our calculator gives a range for your specific scope.' },
      { q: 'Do your developers work US hours?', a: 'Every engagement guarantees at least four hours of overlap with US Eastern or Central time, and full US-hours coverage is available.' },
    ],
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    headline: 'Software Development, AI and QA Partner for UK Companies',
    metaTitle: 'Software Development Company UK | AI Development & QA Testing Services',
    metaDescription:
      'Custom software, web and app development, AI and machine learning, QA testing and dedicated teams for UK businesses. London client team, GBP pricing, UK GDPR-ready delivery.',
    region: 'UK',
    flag: '🇬🇧',
    countries: ['United Kingdom', 'Ireland'],
    cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh', 'Bristol', 'Cambridge', 'Dublin'],
    keywords: ['software development company UK', 'software development company London', 'AI development company UK', 'QA testing services UK', 'hire developers UK', 'offshore development UK'],
    quickAnswer:
      'Texas Solutions serves UK and Irish businesses from its London client team, delivering custom software development, web and mobile apps, AI and machine learning, QA and test automation, and dedicated development teams. Pricing is published in GBP, delivery follows UK GDPR, and engineering hours overlap fully with UK working time.',
    intro: [
      'UK companies use us to extend engineering capacity without London day rates. Our London team handles accounts, while the delivery centre works four to five hours ahead of the UK, which gives a full working-day overlap and overnight progress on longer tasks.',
      'Typical engagements are SaaS product development, AI assistants for customer service, Playwright test automation for fintech and e-commerce teams, and dedicated squads for scale-ups.',
    ],
    coverage: [
      { label: 'Client team', value: 'London' },
      { label: 'Working hours', value: 'Full UK business-day overlap' },
      { label: 'Currency', value: 'GBP' },
    ],
    compliance: [
      { name: 'UK GDPR and Data Protection Act 2018', note: 'International Data Transfer Addendum and records of processing.' },
      { name: 'ISO 27001 aligned controls', note: 'Access control, encryption and incident response.' },
      { name: 'FCA-regulated clients', note: 'Audit trails and change control suited to financial services.' },
    ],
    focusServices: CORE,
    whyUs: ['GBP price tables, not converted dollars.', 'London account contact.', 'Full UK-hours overlap.', 'UK GDPR transfer mechanisms in place.'],
    faqs: [
      { q: 'How much do software developers cost in the UK compared with outsourcing?', a: 'UK developer rates run about £50 to £75 an hour, and £80 to £180 at London agencies. Dedicated engineers through us start from roughly £4,400 a month for mid-level engineers.' },
      { q: 'Is outsourcing software development UK GDPR compliant?', a: 'Yes, when transfers are covered by the UK International Data Transfer Addendum or equivalent safeguards, which we provide, together with encryption and least-privilege access.' },
    ],
  },
  {
    slug: 'europe',
    name: 'Europe',
    headline: 'Software Development and AI Partner for European Companies',
    metaTitle: 'Software Development Company Europe | Germany, Netherlands & Nordics',
    metaDescription:
      'Custom software development, AI and machine learning, QA testing and dedicated teams for companies in Germany, the Netherlands, the Nordics, Switzerland and across the EU. EUR pricing, GDPR-first delivery.',
    region: 'EU',
    flag: '🇪🇺',
    countries: ['Germany', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Switzerland', 'France', 'Belgium', 'Austria'],
    cities: ['Berlin', 'Munich', 'Amsterdam', 'Stockholm', 'Copenhagen', 'Oslo', 'Zurich', 'Paris', 'Brussels', 'Vienna'],
    keywords: ['software development company Germany', 'software outsourcing Netherlands', 'nearshore software development Europe', 'AI development company Europe', 'QA outsourcing Europe', 'GDPR compliant software development'],
    quickAnswer:
      'Texas Solutions delivers custom software development, AI and machine learning, QA and test automation, and dedicated development teams for companies in Germany, the Netherlands, the Nordics, Switzerland and across the EU. Pricing is published in EUR, delivery is GDPR-first, and engineering hours overlap with Central European Time.',
    intro: [
      'European companies face tight developer markets and strict data rules. We provide GDPR-ready engineering with Standard Contractual Clauses in place, EU-region hosting on AWS, Azure or Google Cloud, and three to four hours ahead of CET for a comfortable overlap.',
    ],
    coverage: [
      { label: 'Client team', value: 'London, covering the EU' },
      { label: 'Working hours', value: 'Full overlap with CET' },
      { label: 'Currency', value: 'EUR' },
    ],
    compliance: [
      { name: 'GDPR', note: 'Standard Contractual Clauses, data processing agreements and EU hosting.' },
      { name: 'EU AI Act', note: 'Risk classification and documentation for AI systems we build.' },
      { name: 'NIS2', note: 'Security controls for organisations in scope.' },
    ],
    focusServices: CORE,
    whyUs: ['EUR price tables.', 'GDPR and EU AI Act awareness built into delivery.', 'EU data residency by default.', 'Full CET overlap.'],
    faqs: [
      { q: 'Do you host data inside the EU?', a: 'Yes. By default we deploy to EU regions such as Frankfurt, Ireland, Amsterdam or Stockholm on AWS, Azure or Google Cloud.' },
      { q: 'Does the EU AI Act affect AI projects you build?', a: 'It can. We classify each AI system by risk under the Act, document training data and evaluation, and add human oversight where the Act requires it.' },
    ],
  },
  {
    slug: 'canada',
    name: 'Canada',
    headline: 'Software Development, QA and Dispatch for Canadian Companies',
    metaTitle: 'Software Development Company Canada | Toronto AI, QA & Dispatch',
    metaDescription:
      'Custom software development, AI, QA testing and dedicated teams for Canadian businesses, plus cross-border truck dispatch. Toronto client team, CAD pricing, PIPEDA-aware delivery.',
    region: 'CA',
    flag: '🇨🇦',
    countries: ['Canada'],
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
    keywords: ['software development company Canada', 'software development company Toronto', 'AI development Canada', 'QA testing Canada', 'truck dispatch Canada'],
    quickAnswer:
      'Texas Solutions serves Canadian companies from its Toronto team with custom software development, AI and machine learning, QA and test automation, dedicated development teams and cross-border truck dispatch. Pricing is published in CAD and delivery follows PIPEDA and provincial privacy rules.',
    intro: [
      'Canadian scale-ups and carriers use our Toronto team for software engineering capacity and for dispatching cross-border and domestic freight, with CAD pricing and Canadian data residency on request.',
    ],
    coverage: [
      { label: 'Client team', value: 'Toronto' },
      { label: 'Working hours', value: '4+ hours overlap with ET' },
      { label: 'Currency', value: 'CAD' },
    ],
    compliance: [
      { name: 'PIPEDA', note: 'Consent, safeguards and breach notification.' },
      { name: 'Quebec Law 25', note: 'Privacy impact assessments where Quebec residents are involved.' },
    ],
    focusServices: [...CORE, 'truck-dispatch'],
    whyUs: ['CAD price tables.', 'Toronto account contact.', 'Canadian data residency available.', 'Cross-border dispatch experience.'],
    faqs: [
      { q: 'Can data be hosted in Canada?', a: 'Yes. AWS, Azure and Google Cloud all operate Canadian regions, and we deploy there when PIPEDA, provincial rules or contracts require it.' },
    ],
  },
  {
    slug: 'australia-new-zealand',
    name: 'Australia and New Zealand',
    headline: 'Software Development, AI and QA for Australia and New Zealand',
    metaTitle: 'Software Development Company Australia | Sydney AI & QA Testing',
    metaDescription:
      'Custom software, web and mobile app development, AI, QA testing and dedicated teams for Australian and New Zealand businesses. Sydney client team, AUD pricing, Privacy Act-aware delivery.',
    region: 'AU',
    flag: '🇦🇺',
    countries: ['Australia', 'New Zealand'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington'],
    keywords: ['software development company Australia', 'software development company Sydney', 'app developers Melbourne', 'AI development Australia', 'QA testing services Australia'],
    quickAnswer:
      'Texas Solutions serves Australian and New Zealand businesses from its Sydney team with custom software, web and mobile app development, AI and machine learning, QA and testing, and dedicated development teams. Pricing is published in AUD and delivery follows the Australian Privacy Act and New Zealand Privacy Act.',
    intro: [
      'Australian companies face some of the highest developer rates in the world. Our Sydney team manages accounts, and delivery overlaps with the Australian morning, with overnight progress on longer work.',
    ],
    coverage: [
      { label: 'Client team', value: 'Sydney' },
      { label: 'Working hours', value: 'AEST morning overlap' },
      { label: 'Currency', value: 'AUD' },
    ],
    compliance: [
      { name: 'Australian Privacy Act 1988', note: 'Australian Privacy Principles and notifiable data breaches.' },
      { name: 'Essential Eight', note: 'Controls aligned with the ACSC Essential Eight.' },
      { name: 'New Zealand Privacy Act 2020', note: 'Cross-border disclosure safeguards.' },
    ],
    focusServices: CORE,
    whyUs: ['AUD price tables.', 'Sydney account contact.', 'Sydney-region hosting by default.', 'Essential Eight-aligned security.'],
    faqs: [
      { q: 'How much does app development cost in Australia?', a: 'Published Australian ranges run from about A$40,000 to A$90,000 for a mobile app MVP and A$80,000 to A$200,000 for a mid-complexity app. Our calculator shows AUD ranges for your scope.' },
    ],
  },
  {
    slug: 'uae-gulf',
    name: 'UAE and the Gulf',
    headline: 'Software Development, AI and QA Company for the UAE, Saudi Arabia and the Gulf',
    metaTitle: 'Software Development Company in Dubai, UAE & Saudi Arabia | AI & QA',
    metaDescription:
      'Custom software development, AI and machine learning, QA testing and dedicated development teams for companies in Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Kuwait, Bahrain and Muscat. Arabic-ready, PDPL-aware, USD pricing.',
    region: 'GCC',
    flag: '🇦🇪',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'],
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Jeddah', 'Dammam', 'Doha', 'Kuwait City', 'Manama', 'Muscat'],
    keywords: [
      'software development company in Dubai',
      'software development company in UAE',
      'software company in Saudi Arabia',
      'software development company Riyadh',
      'AI development company Dubai',
      'AI company Saudi Arabia',
      'mobile app development company Dubai',
      'QA testing company UAE',
      'software development company Qatar',
      'Arabic app development',
    ],
    quickAnswer:
      'Texas Solutions provides custom software development, web and mobile app development, AI and machine learning, QA and testing, and dedicated development teams for companies in the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. Our delivery centre is one hour behind Dubai, so teams share the full Gulf working day. We build Arabic and English interfaces, and our work accounts for UAE and Saudi PDPL. Pricing is in USD.',
    intro: [
      'Gulf enterprises and government-linked companies are investing heavily in digital transformation and AI, in line with UAE and Saudi national strategies. They need engineering partners who can work in their time zone, build bilingual Arabic and English products, and respect regional data residency rules.',
      'Our Lahore delivery centre is one hour behind the UAE and two hours behind Saudi Arabia, which gives Dubai, Abu Dhabi, Riyadh and Doha clients a full shared working day. We design right-to-left Arabic interfaces, integrate UAE Pass, local payment gateways and ZATCA e-invoicing, and deploy to in-region cloud where regulations require it.',
    ],
    coverage: [
      { label: 'Delivery', value: 'Lahore delivery centre, UTC+5' },
      { label: 'Working hours', value: 'Full overlap with UAE, Saudi Arabia and Qatar' },
      { label: 'Currency', value: 'USD (AED and SAR on request)' },
      { label: 'Languages', value: 'Arabic and English interfaces' },
    ],
    compliance: [
      { name: 'UAE Personal Data Protection Law (PDPL)', note: 'Consent, purpose limitation and cross-border transfer rules.' },
      { name: 'Saudi Personal Data Protection Law (PDPL)', note: 'Data localisation and transfer conditions set by SDAIA.' },
      { name: 'Saudi NCA Essential Cybersecurity Controls', note: 'Controls mapping for organisations in scope.' },
      { name: 'ZATCA e-invoicing (Fatoora)', note: 'Integration for Saudi e-invoicing phases.' },
      { name: 'DIFC and ADGM data protection', note: 'For clients in the Dubai and Abu Dhabi financial free zones.' },
    ],
    focusServices: CORE,
    whyUs: [
      'Full Gulf working-day overlap.',
      'Arabic right-to-left UI and bilingual content.',
      'UAE Pass, local payments and ZATCA integrations.',
      'In-region hosting on AWS or Azure where required.',
    ],
    faqs: [
      { q: 'How much does software development cost in Dubai and the UAE?', a: 'Our Gulf price table is in USD: a web application typically costs US$30,000 to US$150,000, a mobile app MVP US$25,000 to US$60,000, and dedicated mid-level engineers about US$5,500 to US$8,500 a month. The calculator gives a range for your scope.' },
      { q: 'Do you build Arabic mobile apps and websites?', a: 'Yes. We design right-to-left Arabic interfaces alongside English, handle Arabic typography and search, and test both languages on real devices.' },
      { q: 'Can you keep data inside the UAE or Saudi Arabia?', a: 'Yes. We deploy to in-region cloud where available and design data flows to meet UAE PDPL, Saudi PDPL and sector regulator requirements.' },
      { q: 'Do you work with Saudi Vision 2030 and UAE digital transformation projects?', a: 'We build the software, AI and QA capacity those programmes need, including portals, mobile apps, AI assistants and test automation, with bilingual delivery and local integrations.' },
    ],
  },
  {
    slug: 'singapore-asia',
    name: 'Singapore and Asia',
    headline: 'Software Development, AI and QA Partner for Singapore and Asia',
    metaTitle: 'Software Development Company Singapore | AI & QA for Japan, Hong Kong & Asia',
    metaDescription:
      'Custom software development, AI and machine learning, QA testing and dedicated teams for companies in Singapore, Japan, Hong Kong, South Korea and Malaysia. PDPA and APPI-aware delivery, USD pricing.',
    region: 'APAC',
    flag: '🇸🇬',
    countries: ['Singapore', 'Japan', 'Hong Kong', 'South Korea', 'Malaysia', 'Taiwan'],
    cities: ['Singapore', 'Tokyo', 'Osaka', 'Hong Kong', 'Seoul', 'Kuala Lumpur', 'Taipei'],
    keywords: [
      'software development company Singapore',
      'AI development company Singapore',
      'offshore development Japan',
      'software outsourcing Hong Kong',
      'QA testing services Singapore',
      'app development company Singapore',
    ],
    quickAnswer:
      'Texas Solutions provides custom software development, AI and machine learning, QA and test automation, and dedicated development teams for companies in Singapore, Japan, Hong Kong, South Korea and Malaysia. Our delivery centre is three hours behind Singapore, which gives a strong same-day overlap. Delivery follows Singapore PDPA and Japan APPI, and pricing is in USD.',
    intro: [
      'Asian technology hubs have deep demand for engineering capacity and AI talent. Our delivery centre overlaps with the Singapore, Hong Kong and Tokyo afternoon, and we host in Singapore, Tokyo or Hong Kong cloud regions to meet local data rules.',
    ],
    coverage: [
      { label: 'Delivery', value: 'Lahore delivery centre, UTC+5' },
      { label: 'Working hours', value: 'Afternoon overlap with SGT, HKT and JST' },
      { label: 'Currency', value: 'USD (SGD on request)' },
    ],
    compliance: [
      { name: 'Singapore PDPA', note: 'Consent, protection and transfer limitation obligations.' },
      { name: 'MAS Technology Risk Management guidelines', note: 'For financial institutions in Singapore.' },
      { name: 'Japan APPI', note: 'Cross-border transfer and consent requirements.' },
      { name: 'Hong Kong PDPO', note: 'Data protection principles.' },
    ],
    focusServices: CORE,
    whyUs: ['Same-day overlap with Singapore and Hong Kong.', 'In-region hosting in Singapore or Tokyo.', 'PDPA and APPI-aware delivery.', 'USD pricing, published.'],
    faqs: [
      { q: 'How much does it cost to hire developers for a Singapore company through you?', a: 'Our Asia table is in USD: mid-level dedicated engineers are about US$5,000 to US$7,700 a month and senior engineers about US$7,700 to US$11,700.' },
      { q: 'Do you work with Japanese companies?', a: 'Yes, with English-language delivery and Japan-region hosting. We account for APPI requirements on cross-border data transfer.' },
    ],
  },
];

export const MARKET_MAP: Record<string, Market> = MARKETS.reduce(
  (acc, m) => ({ ...acc, [m.slug]: m }),
  {} as Record<string, Market>,
);
