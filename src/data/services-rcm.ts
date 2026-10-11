import type { Service } from './services';
import { RCM_MODELS } from './rates';

const pct = (p: [number, number]) => `${Math.round(p[0] * 100)}-${Math.round(p[1] * 100)}%`;
const [MED, DEN] = RCM_MODELS;
const ALL = pct([Math.min(MED.percent[0], DEN.percent[0]), Math.max(MED.percent[1], DEN.percent[1])]);
const usdK = (n: number) => n.toLocaleString('en-US');

/**
 * Medical and dental revenue cycle management. Owner-confirmed scope
 * (October 2026): billing, claims and AR; coding; eligibility and prior
 * authorization; credentialing. No HIPAA, BAA, certification or software
 * partnership claims are published until they are formally verified.
 */
export const RCM_SERVICE: Service = {
  slug: 'revenue-cycle-management',
  name: 'Medical and Dental Billing (RCM)',
  navLabel: 'Medical and Dental RCM',
  promise: 'Clean claims out, payments in, and an AR report you can actually read.',
  summary:
    'Revenue cycle management for medical and dental practices: eligibility checks, coding, claim submission, payment posting, denial management, AR follow-up and credentialing.',
  description:
    'We run the billing side of your practice in the systems you already use: verify coverage before the visit, code and submit claims, post payments, work every denial and follow up on aging AR, with a monthly report on what was billed, collected and still outstanding. Priced as a percentage of what you actually collect.',
  icon: 'Stethoscope',
  accent: '20 160 133',
  accentHex: '#14A085',
  heroVisual: 'Claim moving from submitted to paid',
  interactive: 'rcm-fee',
  interactiveTitle: 'RCM fee calculator',
  startingPriceRow: 'rcm-medical',
  problem: {
    title: 'The care gets delivered. The money gets stuck.',
    body: 'Front-desk staff juggle insurance checks between patients, claims go out with avoidable errors, denials sit in a folder and AR quietly ages past 90 days. The practice is busy and cash flow is still tight.',
    points: [
      'Eligibility not checked before the visit',
      'Claims rejected for avoidable coding or data errors',
      'Denials never appealed and written off',
      'AR over 90 days that nobody is working',
    ],
  },
  solution: {
    title: 'A billing team that works every claim to payment',
    body: 'A named billing lead and team learn your payers, your specialty and your system, check coverage ahead of appointments, submit clean claims, and follow every unpaid or denied claim until it is paid, appealed or properly closed.',
    points: [
      'Named billing lead and a team behind them',
      'Eligibility and benefits checked before appointments',
      'Claims scrubbed before submission',
      'Every denial worked, appealed where justified',
      'Monthly collections, denial and AR report',
    ],
  },
  subServices: [
    {
      slug: 'medical-billing',
      name: 'Medical billing',
      summary: 'End-to-end billing for physician practices and clinics.',
      body: 'Charge entry, claim submission to commercial payers, Medicare and Medicaid, payment posting from ERAs and EOBs, and follow-up on every unpaid claim, worked inside your existing EHR or practice management system.',
      deliverables: ['Charge entry and claim scrubbing', 'Electronic claim submission', 'ERA and EOB payment posting', 'Unpaid claim follow-up', 'Monthly billing report'],
      keyword: 'medical billing services',
    },
    {
      slug: 'dental-billing',
      name: 'Dental billing',
      summary: 'Dental insurance billing, from verification to payment.',
      body: 'Dental benefits verification and breakdowns, CDT-coded claims with the attachments payers ask for, payment posting, claim follow-up and patient balance statements, in the dental practice management system you already use.',
      deliverables: ['Dental benefits verification', 'CDT claim submission with attachments', 'Payment posting', 'Claim and narrative follow-up', 'Patient statements'],
      keyword: 'dental billing services',
    },
    {
      slug: 'medical-coding',
      name: 'Medical and dental coding',
      summary: 'ICD-10-CM, CPT, HCPCS and CDT coding and audits.',
      body: 'Coding from your documentation with modifier and bundling checks, plus coding audits that show where documentation or code selection is costing you money. Coding questions go back to the provider, never guessed.',
      deliverables: ['Diagnosis and procedure coding', 'Modifier and bundling review', 'Documentation queries to providers', 'Coding audit report', 'Common-error feedback'],
      keyword: 'medical coding services',
    },
    {
      slug: 'eligibility-verification',
      name: 'Insurance eligibility verification',
      summary: 'Coverage and benefits confirmed before the patient arrives.',
      body: 'We check active coverage, plan details, deductibles, co-pays, frequency limits and referral requirements ahead of scheduled appointments, so the front desk knows what to collect and claims are not denied for eligibility.',
      deliverables: ['Pre-appointment eligibility checks', 'Benefits breakdowns', 'Patient responsibility estimates', 'Referral requirement flags', 'Coverage change alerts'],
      keyword: 'insurance eligibility verification services',
    },
    {
      slug: 'prior-authorization',
      name: 'Prior authorization',
      summary: 'Authorizations requested, tracked and documented.',
      body: 'We identify which services need authorization, submit the request with the clinical documentation the payer requires, track it to a decision and record the authorization number against the visit.',
      deliverables: ['Authorization requirement checks', 'Request submission', 'Status tracking and follow-up', 'Authorization log', 'Peer-to-peer scheduling support'],
      keyword: 'prior authorization services',
    },
    {
      slug: 'denial-management',
      name: 'Denial management and appeals',
      summary: 'Every denial worked, root causes fixed.',
      body: 'Denials are categorised by reason, corrected and resubmitted or appealed with supporting documentation, and the root causes are reported back so the same denial stops recurring.',
      deliverables: ['Denial categorisation', 'Corrected claims and resubmission', 'Written appeals', 'Root-cause reporting', 'Payer trend tracking'],
      keyword: 'denial management services',
    },
    {
      slug: 'ar-follow-up',
      name: 'AR follow-up and recovery',
      summary: 'Aging accounts receivable worked down, oldest first.',
      body: 'We work your aging AR by payer and age bucket, call and portal-check payers, resolve what is holding each claim, and report what was recovered, what was appealed and what should be adjusted off.',
      deliverables: ['AR aging analysis', 'Payer follow-up by phone and portal', 'Underpayment identification', 'Recovery and write-off report', 'Patient balance follow-up'],
      keyword: 'medical accounts receivable services',
    },
    {
      slug: 'credentialing',
      name: 'Provider credentialing and payer enrollment',
      summary: 'Providers enrolled with the payers you need.',
      body: 'Payer enrollment applications, CAQH profile upkeep, re-credentialing reminders and contract follow-up for new and existing providers, so new hires can bill as soon as possible.',
      deliverables: ['Payer enrollment applications', 'CAQH profile maintenance', 'Application status follow-up', 'Re-credentialing calendar', 'Enrollment status report'],
      keyword: 'provider credentialing services',
    },
  ],
  included: [
    'Named billing lead for your practice',
    'Eligibility and benefits verification',
    'Claim scrubbing before submission',
    'Payment posting from ERAs and EOBs',
    'Denial management and appeals',
    'AR follow-up by payer and age',
    'Patient statements',
    'Monthly collections and AR report',
    'Work done in your existing system',
    'No setup fee, 30 days notice',
  ],
  packages: [
    {
      name: 'Starter',
      tagline: 'Claims and payments for a smaller practice.',
      priceRow: 'rcm-medical',
      anchor: 'low',
      priceLabel: { value: 'Quoted', unit: 'after a free billing review' },
      features: ['Eligibility verification', 'Charge entry and claim submission', 'Payment posting', 'Unpaid claim follow-up', 'Monthly billing report'],
    },
    {
      name: 'Growth',
      tagline: 'Full revenue cycle, medical or dental.',
      priceRow: 'rcm-medical',
      anchor: 'mid',
      popular: true,
      priceLabel: { value: ALL, unit: `of net monthly collections (medical ${pct(MED.percent)}, dental ${pct(DEN.percent)})` },
      features: ['Everything in Starter', 'Denial management and appeals', 'AR follow-up and recovery', 'Patient statements', 'Coding review', 'Named billing lead'],
    },
    {
      name: 'Pro',
      tagline: 'Multi-provider or multi-location practices.',
      priceRow: 'rcm-medical',
      anchor: 'high',
      priceLabel: { value: 'Quoted', unit: 'per practice, percentage of collections' },
      features: ['Everything in Growth', 'Prior authorization', 'Credentialing and payer enrollment', 'Coding audit each quarter', 'Provider-level reporting', 'Monthly review call'],
    },
  ],
  process: [
    { title: 'Billing review', body: 'A free review of your current claim, denial and AR position using summary reports, with no patient records needed.', duration: 'Week 1' },
    { title: 'Agreement and access', body: 'Scope, percentage and data-handling terms agreed in writing, then user access to your system and payer portals set up.', duration: 'Week 2' },
    { title: 'Transition', body: 'Payer list, fee schedule and workflows documented; current claims taken over and the oldest AR prioritised.', duration: 'Weeks 2-4' },
    { title: 'Run and report', body: 'Daily claims and posting, weekly denial work, and a monthly report on collections, denials and AR.', duration: 'Monthly' },
  ],
  tools: ['Your EHR or EMR', 'Your practice management system', 'Payer portals', 'Clearinghouses', 'CMS-1500', 'UB-04', 'ADA claim form', 'ICD-10-CM', 'CPT', 'HCPCS', 'CDT', 'ERA and EOB'],
  caseStudy: {
    slug: 'rcm-group-practice',
    client: 'Sample profile: three-provider family practice',
    sector: 'Healthcare',
    challenge:
      'Claims were submitted late by front-desk staff between patients, denials were rarely appealed and a large share of AR was older than 90 days.',
    work: [
      'Moved eligibility checks to the day before each appointment',
      'Scrubbed and submitted claims within two business days of the visit',
      'Worked every denial by reason code and appealed where justified',
      'Worked aged AR oldest first with a weekly payer follow-up list',
    ],
    results: [
      { label: 'Claims submitted within 2 days', before: 'Inconsistent', after: 'Every visit', delta: 'Target' },
      { label: 'Denials worked', before: 'Few', after: 'All', delta: 'Target' },
      { label: 'AR over 90 days', before: 'High', after: 'Reduced', delta: 'Target' },
      { label: 'Monthly reporting', before: 'None', after: 'Monthly', delta: 'New' },
    ],
  },
  faqs: [
    { q: 'How much does medical billing cost?', a: `We charge a percentage of net monthly collections: ${pct(MED.percent)} for medical practices and ${pct(DEN.percent)} for dental practices, depending on specialty, claim volume and payer mix. On USD ${usdK(MED.exampleCollections)} of monthly collections at ${pct(MED.percent)}, that is about USD ${usdK(MED.exampleCollections * MED.percent[0])}-${usdK(MED.exampleCollections * MED.percent[1])} a month. The final percentage is confirmed in writing after a free billing review.` },
    { q: 'Is the percentage taken from gross charges or collections?', a: 'From net collections: what your practice actually collects after adjustments. That keeps our fee tied to money you receive, not to what was billed.' },
    { q: 'Do you work with both medical and dental practices?', a: 'Yes. Medical and dental billing use different codes, claim forms and payer rules, so each practice is handled by people who work that side of billing.' },
    { q: 'Which software do you work in?', a: 'We work in your existing EHR, EMR or practice management system and your payer portals. Compatibility and access requirements for your specific system are confirmed during the consultation.' },
    { q: 'How do you handle patient information?', a: 'Patient information stays in your systems and is accessed through user accounts you control. Data-handling terms are agreed in writing during onboarding. Please do not send patient information through this website, its forms or its chat.' },
    { q: 'Can you guarantee higher collections?', a: 'No. Results depend on your payers, documentation and patient mix. We report claims, denials, collections and AR every month so you can judge the work on real numbers.' },
  ],
  metrics: [
    { label: 'Medical RCM', value: `${pct(MED.percent)} of collections` },
    { label: 'Dental RCM', value: `${pct(DEN.percent)} of collections` },
    { label: 'Notice period', value: '30 days' },
  ],
};
