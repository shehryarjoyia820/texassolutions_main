/** CMS model: solution — audience-led pages that bundle services by industry. */
export interface Solution {
  slug: string;
  name: string;
  navLabel: string;
  summary: string;
  promise: string;
  description: string;
  icon: string;
  accentHex: string;
  /** Service slugs bundled into this solution. */
  services: string[];
  painPoints: string[];
  outcomes: { label: string; value: string; note: string }[];
  playbook: { title: string; body: string }[];
  proof: { headline: string; body: string; metrics: { label: string; value: string }[] };
  faqs: { q: string; a: string }[];
  keyword: string;
}

export const SOLUTIONS: Solution[] = [
  {
    slug: 'trucking-logistics',
    name: 'Trucking and Logistics',
    navLabel: 'Trucking and Logistics',
    summary: 'Dispatch, back office and carrier marketing for owner-operators, fleets and brokerages.',
    promise: 'Keep the trucks loaded and the paperwork off the owner desk.',
    description:
      'Carriers lose margin in two places: empty miles and unbilled time. We run the dispatch desk, file the claims and build the carrier-facing marketing that recruits drivers and wins direct shippers.',
    icon: 'Truck',
    accentHex: '#FF7A1A',
    services: ['truck-dispatch', 'web-development', 'lead-generation', 'auto-engines', 'crm-erp', 'data-analytics'],
    painPoints: [
      'Owners on load boards until midnight',
      'Detention and layover never claimed',
      'Driver recruiting pages that nobody applies through',
      'Downtime waiting on an engine with no verified history',
    ],
    outcomes: [
      { label: 'Weekly gross lift', value: '+30-45%', note: 'Typical after 90 days of managed dispatch' },
      { label: 'Deadhead reduction', value: '-8 to -12pts', note: 'From next-load-booked planning' },
      { label: 'Invoice turnaround', value: 'Same day', note: 'Paperwork assembled and submitted on delivery' },
    ],
    playbook: [
      { title: 'Take the desk', body: 'A named dispatcher picks up load booking, rate negotiation, broker setups and packets from day three.' },
      { title: 'Bill everything billable', body: 'Detention, layover and truck-order-not-used claims filed as standard, with arrival and departure documented.' },
      { title: 'Recruit and win direct', body: 'Carrier site, driver application flow and outbound to direct shippers so you depend less on brokers.' },
      { title: 'Keep them rolling', body: 'VIN-matched engine sourcing and installation when a unit goes down, so downtime is days rather than weeks.' },
    ],
    proof: {
      headline: 'One dry van, three months',
      body: 'Moved from self-dispatch to a named dispatcher with next-load-booked planning and same-day invoicing.',
      metrics: [
        { label: 'Weekly gross', value: '$4,900 to $7,150' },
        { label: 'Deadhead', value: '19% to 8%' },
        { label: 'Detention recovered', value: '$2,340 per quarter' },
      ],
    },
    faqs: [
      { q: 'Do you dispatch box trucks as well as semis?', a: 'Yes. Box trucks, straight trucks and hotshots run at 8-10% of weekly gross; semis run at 5-6%. Both apply to OTR operations, with no flat rate.' },
      { q: 'Can you help us win direct shippers?', a: 'That is the lead generation side. We build the carrier-facing site and run outbound to shippers in your lanes so broker freight stops being the only option.' },
    ],
    keyword: 'trucking and logistics back office solutions',
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    navLabel: 'E-commerce',
    summary: 'Storefront builds, paid acquisition and the tracking that ties spend to revenue.',
    promise: 'A store that converts and an ad account that can prove it.',
    description:
      'Most stores have a traffic problem and a measurement problem at the same time, and fixing acquisition before measurement wastes the budget. We rebuild the tracking, then the store, then scale the spend.',
    icon: 'ShoppingCart',
    accentHex: '#4F8CFF',
    services: ['web-development', 'ads-optimization', 'qa-testing', 'lead-generation', 'data-analytics', 'crm-erp', 'cloud-devops'],
    painPoints: [
      'Checkout abandonment nobody has diagnosed',
      'Attribution broken since the last browser update',
      'Creative that has been running past fatigue for months',
      'Peak season outages with no load testing behind them',
    ],
    outcomes: [
      { label: 'Return on ad spend', value: '2x to 5x', note: 'After tracking rebuild and creative cadence' },
      { label: 'Checkout completion', value: '+15-30%', note: 'From friction removal and speed work' },
      { label: 'Peak readiness', value: 'Load tested', note: 'Budgets enforced before the season' },
    ],
    playbook: [
      { title: 'Fix measurement', body: 'Server-side tagging and the Conversions API so revenue attribution survives cookie loss.' },
      { title: 'Remove friction', body: 'Checkout, speed and mobile layout work driven by session recordings and funnel data.' },
      { title: 'Feed the machine', body: 'Monthly creative packs and a documented test roadmap on Meta, Google and TikTok.' },
      { title: 'Survive peak', body: 'Load and soak testing before the season, with performance budgets in the pipeline.' },
    ],
    proof: {
      headline: 'Multi-location retailer',
      body: 'Tracking rebuild plus creative cadence moved the account from reporting well to performing well.',
      metrics: [
        { label: 'Return on ad spend', value: '2.1x to 5.4x' },
        { label: 'Wasted spend', value: '31% to 6%' },
        { label: 'Cost per order', value: 'Down 59%' },
      ],
    },
    faqs: [
      { q: 'Which platforms do you build on?', a: 'Shopify and WooCommerce for most stores, headless commerce on Next.js where catalogue size or performance demands it.' },
      { q: 'Can you fix attribution without rebuilding the store?', a: 'Usually yes. Server-side tagging and the Conversions API are a separate workstream and often the highest-return thing to do first.' },
    ],
    keyword: 'ecommerce growth agency',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    navLabel: 'Healthcare',
    summary: 'Patient-facing sites, compliant intake and careful paid acquisition.',
    promise: 'More booked appointments, without a compliance headache.',
    description:
      'Healthcare marketing lives inside rules that most agencies learn the hard way. We build intake flows that handle patient data properly and run acquisition inside platform health policy.',
    icon: 'HeartPulse',
    accentHex: '#22C55E',
    services: ['web-development', 'cybersecurity', 'data-analytics', 'ai-machine-learning', 'ads-optimization', 'lead-generation', 'qa-testing'],
    painPoints: [
      'Intake forms emailing patient data in the clear',
      'Ad accounts flagged under health advertising policy',
      'Booking journeys that lose people on mobile',
      'No audit trail for who accessed what',
    ],
    outcomes: [
      { label: 'Booked appointments', value: '+25-60%', note: 'From intake and speed work' },
      { label: 'Form abandonment', value: '-20-35%', note: 'Shorter, staged intake' },
      { label: 'Policy standing', value: 'Clean', note: 'Reviewed against platform health policy' },
    ],
    playbook: [
      { title: 'Handle data properly', body: 'Encrypted transport and storage, role-based access, retention rules and an audit trail on intake.' },
      { title: 'Stage the intake', body: 'Split long forms into short steps with save-and-resume, which is where most mobile abandonment comes from.' },
      { title: 'Advertise inside the rules', body: 'Campaigns reviewed against health advertising policy before launch, with restricted audience handling.' },
      { title: 'Test the journey', body: 'Automated coverage on booking and intake so a release never breaks the thing that earns appointments.' },
    ],
    proof: {
      headline: 'Multi-site clinic group',
      body: 'Rebuilt intake as a staged mobile-first flow with encrypted handling and a proper audit trail.',
      metrics: [
        { label: 'Form completion', value: 'Up 34%' },
        { label: 'Mobile bookings', value: 'Up 61%' },
        { label: 'Ad policy flags', value: 'Zero since launch' },
      ],
    },
    faqs: [
      { q: 'Are you a HIPAA business associate?', a: 'We can sign a business associate agreement for engagements that touch protected health information, and we scope those projects so the minimum necessary data passes through systems we control. Your counsel should review the agreement.' },
      { q: 'Can we advertise health services on Meta and Google?', a: 'Within their health policies, yes. Targeting restrictions apply and some claims are prohibited outright. We review campaigns against current policy before launch.' },
    ],
    keyword: 'healthcare digital marketing agency',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    navLabel: 'Real Estate',
    summary: 'Listing sites, lead capture and follow-up that beats the speed-to-lead problem.',
    promise: 'Every enquiry answered before the competition wakes up.',
    description:
      'In real estate the first responder usually wins. We build the listing experience, capture the enquiry properly and automate the follow-up so leads are worked in minutes rather than days.',
    icon: 'Building2',
    accentHex: '#A855F7',
    services: ['web-development', 'lead-generation', 'crm-erp', 'ai-machine-learning', 'ads-optimization'],
    painPoints: [
      'Enquiries sitting unworked for a day or more',
      'Listing pages that load slowly on mobile',
      'Portal leads with no routing or scoring',
      'No idea which campaign produced which closing',
    ],
    outcomes: [
      { label: 'Speed to first contact', value: 'Under 5 min', note: 'Automated routing and alerting' },
      { label: 'Enquiry volume', value: '+40-90%', note: 'From listing page and paid work' },
      { label: 'Attribution', value: 'Closing level', note: 'Offline conversion import' },
    ],
    playbook: [
      { title: 'Build the listing experience', body: 'Fast, filterable listing pages with saved searches and an enquiry form that works one-handed.' },
      { title: 'Route in seconds', body: 'Scoring and routing rules that alert the right agent immediately, with a response time service level.' },
      { title: 'Work the follow-up', body: 'Sequenced follow-up across email and SMS with TCPA-compliant consent captured at the form.' },
      { title: 'Attribute to closings', body: 'Closed deals imported back into the ad platforms so budget follows revenue, not form fills.' },
    ],
    proof: {
      headline: 'Regional brokerage',
      body: 'Listing rebuild plus instant routing changed how fast enquiries were worked.',
      metrics: [
        { label: 'Time to first contact', value: '19 hrs to 4 min' },
        { label: 'Enquiries per month', value: 'Up 76%' },
        { label: 'Cost per closing', value: 'Down 41%' },
      ],
    },
    faqs: [
      { q: 'Can you integrate with our MLS or IDX feed?', a: 'Yes. We ingest IDX and MLS feeds into the site with the display rules your board requires, and cache them so listing pages stay fast.' },
      { q: 'What about SMS follow-up rules?', a: 'Any form that leads to a call or text carries TCPA-compliant express written consent wording, captured and stored with the lead record.' },
    ],
    keyword: 'real estate lead generation website',
  },
  {
    slug: 'publishers-media',
    name: 'Publishers and Media',
    navLabel: 'Publishers and Media',
    summary: 'AdSense revenue management, site performance and direct ad sales support.',
    promise: 'Earn more per session without losing the reader.',
    description:
      'Publisher revenue is a layout problem as much as a demand problem. We instrument every unit, tune density against session depth, and keep Core Web Vitals healthy so traffic does not fall while revenue rises.',
    icon: 'Newspaper',
    accentHex: '#F59E0B',
    services: ['web-development', 'data-analytics', 'ads-optimization', 'adsense-management'],
    painPoints: [
      'Session RPM flat while traffic grows',
      'Layout shift from ad units hurting Core Web Vitals',
      'Policy warnings with no clear remediation',
      'No per-unit revenue data to act on',
    ],
    outcomes: [
      { label: 'Session RPM', value: '+35-80%', note: 'From density and placement tuning' },
      { label: 'Layout shift', value: 'Under 0.1', note: 'Reserved slots and lazy loading' },
      { label: 'Policy risk', value: 'Audited', note: 'Remediation list before any change' },
    ],
    playbook: [
      { title: 'Audit the policy risk first', body: 'A suspended account earns nothing, so compliance is remediated before any revenue work starts.' },
      { title: 'Instrument every unit', body: 'Per-unit revenue reporting so decisions are made on data rather than on habit.' },
      { title: 'Tune density, not count', body: 'Fewer, better-placed units usually raise revenue per session while improving the reading experience.' },
      { title: 'Add demand where it pays', body: 'Header bidding modelled before it is built, because complexity has to earn its place.' },
    ],
    proof: {
      headline: 'Niche publisher, 1.4M monthly pageviews',
      body: 'Policy remediation plus a reduction from eleven units to six per article.',
      metrics: [
        { label: 'Session RPM', value: '$4.10 to $7.35' },
        { label: 'Layout shift', value: '0.31 to 0.04' },
        { label: 'Policy warnings', value: 'Resolved' },
      ],
    },
    faqs: [
      { q: 'Do we need header bidding?', a: 'Usually only above roughly half a million monthly pageviews. Below that the added latency and complexity tend to cost more than the extra demand earns. We model it before recommending it.' },
      { q: 'Will removing ad units cut our revenue?', a: 'Not typically. Removing low-earning units that cause layout shift usually raises revenue per session, because impressions get more valuable and readers stay longer.' },
    ],
    keyword: 'publisher adsense revenue optimization',
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    navLabel: 'Automotive',
    summary: 'Engine supply and installation, plus the web and lead work that fills the bays.',
    promise: 'Parts sourced right and bays kept full.',
    description:
      'For repair shops and fleets we handle the hard sourcing and the customer acquisition at once: verified engines delivered and installed, and a booking flow that turns a search into an appointment.',
    icon: 'Wrench',
    accentHex: '#EF4444',
    services: ['auto-engines', 'web-development', 'lead-generation', 'crm-erp', 'ads-optimization'],
    painPoints: [
      'Wrong casting numbers arriving and jobs stalling',
      'Core charges surfacing weeks after the work',
      'Booking by phone only, so after-hours enquiries are lost',
      'Local search presence weaker than the shop down the road',
    ],
    outcomes: [
      { label: 'Vehicle downtime', value: '-50-70%', note: 'Verified sourcing and coordinated install' },
      { label: 'Online bookings', value: 'New channel', note: 'Round-the-clock appointment capture' },
      { label: 'Core charges', value: 'Cleared', note: 'Collection and reconciliation handled' },
    ],
    playbook: [
      { title: 'Source by VIN', body: 'Engine code, casting number and emissions region confirmed before anything is ordered.' },
      { title: 'Verify before dispatch', body: 'Compression and leak-down data plus photographs, so no surprises arrive on the pallet.' },
      { title: 'Capture the booking', body: 'A booking flow that works at 11pm on a phone, with the enquiry routed straight to the service desk.' },
      { title: 'Win local search', body: 'Local landing pages, schema and paid coverage on the services with the best margin.' },
    ],
    proof: {
      headline: 'Regional delivery fleet, 22 vans',
      body: 'Two vans off the road, sourced and installed through vetted partners with core returns handled.',
      metrics: [
        { label: 'Downtime', value: '18 days to 6' },
        { label: 'Cost per replacement', value: 'Down 32%' },
        { label: 'Core charges outstanding', value: 'Cleared' },
      ],
    },
    faqs: [
      { q: 'Do you supply to trade as well as retail?', a: 'Yes. Repair shops and fleets get trade terms and a named contact for sourcing, with condition reports on every unit before dispatch.' },
      { q: 'Can you handle European or heavy-duty diesel?', a: 'Yes, through our wider sourcing network. Those are quoted per vehicle because availability and landed cost vary too much to publish a range honestly.' },
    ],
    keyword: 'automotive engine supply and marketing',
  },
  {
    slug: 'saas-startups',
    name: 'SaaS and Startups',
    navLabel: 'SaaS and Startups',
    summary: 'Product build, QA and the outbound motion that finds the first hundred customers.',
    promise: 'Ship it, test it, then go and sell it.',
    description:
      'Early teams need three things at once and can usually only afford two. We cover the build, the release confidence and the outbound motion, sized so a seed-stage budget can carry it.',
    icon: 'Rocket',
    accentHex: '#06B6D4',
    services: ['web-development', 'qa-testing', 'dedicated-teams', 'cloud-devops', 'ai-machine-learning', 'cybersecurity', 'lead-generation'],
    painPoints: [
      'Every release needing a held breath',
      'Founder-led sales that does not scale past the founder',
      'Marketing site that cannot keep pace with the roadmap',
      'No repeatable source of qualified demos',
    ],
    outcomes: [
      { label: 'Release testing time', value: '-90%+', note: 'Automated regression in CI' },
      { label: 'Qualified demos', value: 'Predictable', note: 'Outbound with agreed criteria' },
      { label: 'Site iteration', value: 'Same day', note: 'Every block editable in the CMS' },
    ],
    playbook: [
      { title: 'Make releases boring', body: 'Playwright regression in CI so shipping stops being an event.' },
      { title: 'Build the marketing surface', body: 'A block-based site your team edits without a deploy, with campaign pages on demand.' },
      { title: 'Start the outbound motion', body: 'Ideal customer profile, warmed domains, sequences and setters, with cost per demo measured from week one.' },
      { title: 'Layer paid on proof', body: 'Paid acquisition once outbound has proved which message converts, not before.' },
    ],
    proof: {
      headline: 'B2B SaaS, 60 engineers',
      body: 'Test strategy plus a Playwright suite in CI changed the economics of shipping.',
      metrics: [
        { label: 'Release testing', value: '2 days to 35 min' },
        { label: 'Production hotfixes', value: '9 to 1 per month' },
        { label: 'Journey coverage', value: '0% to 84%' },
      ],
    },
    faqs: [
      { q: 'Can you work alongside our in-house engineers?', a: 'Yes, that is the common case. We deliver a design system and component library your team builds on, or embed QA engineers directly into your sprints.' },
      { q: 'Is outbound viable pre-product-market-fit?', a: 'It is the fastest way to test a message at volume, but expect to learn more than you book at first. We set that expectation before launch rather than after.' },
    ],
    keyword: 'saas startup development and growth partner',
  },
];

export const SOLUTION_MAP: Record<string, Solution> = SOLUTIONS.reduce(
  (acc, s) => ({ ...acc, [s.slug]: s }),
  {} as Record<string, Solution>,
);

export function getSolution(slug: string) {
  return SOLUTION_MAP[slug];
}
