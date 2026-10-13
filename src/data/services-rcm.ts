import type { Service } from './services';
import { RCM_EXTRA_NOTE, RCM_FEE_BASIS, RCM_INCLUDED_NOTE, RCM_SERVICES, RCM_SOFTWARE, RCM_SOFTWARE_NOTE, RCM_SPECIALTIES, RCM_TRANSACTIONS } from './rates';

/**
 * Dental revenue cycle management, run by the dental division Texas Solutions
 * RCM (rcm.texassolutions.co). Dental only; published per-location pricing
 * (flat $1,200 under $40k insurance collections, then 3.5%, 3% or 2.5%); a
 * Business Associate Agreement is signed before any patient data is accessed.
 * Keep in step with rcm.texassolutions.co/pricing and /technology.
 */
export const RCM_SERVICE: Service = {
  slug: 'revenue-cycle-management',
  name: 'Dental Revenue Cycle Management (RCM)',
  navLabel: 'Dental RCM and Billing',
  promise: 'Dental claims out clean, payments posted, and A/R that stops aging.',
  summary:
    'Dental RCM for US practices: insurance verification, dental claims, denials and appeals, payment posting, A/R, patient billing, credentialing and reporting.',
  description:
    'Texas Solutions RCM, our dental division, runs the revenue cycle for dental offices and groups in all 50 states, from benefit checks before the visit to posted payments and follow-up after it. The team works inside the dental software, clearinghouse and carrier portals you already use, and you can hand over the whole cycle or only the part your office needs help with.',
  icon: 'Stethoscope',
  accent: '20 160 133',
  accentHex: '#14A085',
  heroVisual: 'Dental claim moving from verification to posted payment',
  interactive: 'rcm-fee',
  interactiveTitle: 'Dental RCM fee calculator',
  startingPriceRow: 'rcm-flat',
  problem: {
    title: 'The dentistry gets done. The claims get stuck.',
    body: 'Benefits are checked in a rush between patients, claims go out without the x-ray or narrative the carrier wants, denials sit unworked, and insurance A/R quietly ages past 90 days.',
    points: [
      'Frequencies and annual maximums missed before treatment',
      'Claims rejected for missing attachments or CDT errors',
      'Denials and underpayments never appealed',
      'Insurance A/R over 90 days that nobody is working',
    ],
  },
  solution: {
    title: 'A dental RCM team inside your own software',
    body: 'A named point of contact and a remote team work your queues every business day: verification, claims, attachments, posting, denials and follow-up, with every note and posting recorded in your practice management system.',
    points: [
      'Benefits verified before the appointment',
      'Claims checked against the chart and sent with the right attachments',
      'Every denial worked, appealed where justified',
      'A/R followed by carrier and age bucket',
      'Regular reports and review calls on your own data',
    ],
  },
  subServices: RCM_SERVICES.map((s) => ({
    slug: s.slug,
    name: s.name,
    summary: s.summary,
    body: `${s.summary} Texas Solutions RCM handles this inside your dental software and carrier portals, alone or as part of the full revenue cycle. Details are on rcm.texassolutions.co${s.rcmPath}.`,
    deliverables: s.points,
    keyword: s.keyword,
  })),
  included: [
    'Named point of contact for your office',
    'Work done inside your own dental software',
    'Business Associate Agreement before any patient data',
    'Named, revocable user accounts with least access',
    'Every note and posting kept in your system',
    'PPO, DHMO, indemnity and Medicaid dental plans',
    'Regular reporting and review calls',
    'No setup fee; tier confirmed in a written proposal',
  ],
  packages: [
    {
      name: 'Starter',
      tagline: 'One location under $40,000 in monthly insurance collections.',
      priceRow: 'rcm-flat',
      anchor: 'low',
      priceLabel: { value: '$1,200', unit: 'per month, flat, per location' },
      features: ['Seven of the eight services included', 'Named point of contact', 'Work inside your software', 'No setup fee'],
    },
    {
      name: 'Growth',
      tagline: 'One location with $40,000 or more in monthly insurance collections.',
      priceRow: 'rcm-35',
      anchor: 'mid',
      popular: true,
      priceLabel: { value: '2.5-3.5%', unit: "of that month's insurance collections, per location" },
      features: ['3.5% from $40,000, 3% from $100,000, 2.5% from $150,000', 'Patient payments not in the fee base', 'Same seven services included', 'No setup fee'],
    },
    {
      name: 'Pro',
      tagline: 'Multi-location groups and DSOs.',
      priceRow: 'rcm-group',
      anchor: 'high',
      priceLabel: { value: 'Custom quote', unit: 'scoped per group' },
      features: ['Work organized across locations', 'Location and provider reporting', 'Agreed escalation channels', 'Credentialing quoted separately'],
    },
  ],
  process: [
    { title: 'Free consultation', body: 'A call about how billing runs today: your carriers, your software and the problems you want solved.', duration: 'Week 1' },
    { title: 'Billing review', body: 'With read access or standard reports, we look at A/R aging, denials and workflows and share what we find.', duration: 'Week 1-2' },
    { title: 'Proposal and onboarding', body: 'A written scope and price, then a BAA, named logins to your software and portals, and a documented handover plan.', duration: 'Week 2-3' },
    { title: 'Daily operations and reporting', body: 'Verification, claims, attachments, posting, denials and follow-up every business day, with regular reports and review calls.', duration: 'Ongoing' },
  ],
  tools: [...RCM_SOFTWARE, 'Clearinghouses', 'Carrier portals', 'ADA claim form', 'CDT', ...RCM_TRANSACTIONS.map((t) => `X12 ${t.code}`)],
  caseStudy: {
    slug: 'rcm-dental-office',
    client: 'Sample profile: two-dentist general practice',
    sector: 'Dental',
    challenge:
      'Benefits were checked the morning of the visit, claims went out without x-rays or narratives, and a large share of insurance A/R was older than 90 days.',
    work: [
      'Moved benefit checks to the days before each appointment',
      'Agreed which images and notes are saved to the chart for attachments',
      'Worked every denial by reason and appealed where justified',
      'Cleared aged insurance A/R oldest first with a weekly carrier list',
    ],
    results: [
      { label: 'Benefits verified before visit', before: 'Same day', after: 'Days ahead', delta: 'Target' },
      { label: 'Claims sent with attachments', before: 'Inconsistent', after: 'Every claim', delta: 'Target' },
      { label: 'Insurance A/R over 90 days', before: 'High', after: 'Reduced', delta: 'Target' },
      { label: 'Reporting', before: 'None', after: 'Monthly', delta: 'New' },
    ],
  },
  faqs: [
    { q: 'How much does dental RCM cost?', a: `Per location, per month, set by the insurance collections we post that month: a flat $1,200 under $40,000, 3.5% from $40,000 to $99,999, 3% from $100,000 to $149,999, and 2.5% at $150,000 and above. Groups and DSOs get a custom quote. No setup fee. ${RCM_FEE_BASIS}` },
    { q: 'What does the monthly fee include?', a: `${RCM_INCLUDED_NOTE} ${RCM_EXTRA_NOTE}` },
    { q: 'Do you do medical billing?', a: 'No. Texas Solutions RCM focuses on dental revenue cycle management only, because dental plans, CDT coding, attachments and dental remittances work differently from medical claims.' },
    { q: 'Which dental software do you work in?', a: `${RCM_SOFTWARE_NOTE} Claims go out as X12 837D and payments post from 835 ERAs through the clearinghouse connected to your system.` },
    { q: 'Can we outsource only one part, such as insurance verification or A/R?', a: 'Yes. Many offices start with one area and keep the rest in-house. The written proposal spells out which tasks are ours and which stay with your team.' },
    { q: 'How do you protect patient information?', a: 'We sign a Business Associate Agreement before accessing any patient data, work only inside your systems through named accounts with the least access each task needs, and never send patient details by ordinary email or chat. This website and its forms are for business enquiries only.' },
    { q: 'Which dental specialties do you support?', a: `${RCM_SPECIALTIES.join(', ')}.` },
  ],
  metrics: [
    { label: 'From', value: '$1,200 / month' },
    { label: 'Setup fee', value: 'None' },
    { label: 'Software', value: 'Open Dental, Dentrix, Eaglesoft' },
  ],
};
