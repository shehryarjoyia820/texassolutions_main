/** CMS models: article, caseStudy, guide, report, event */

export type Block =
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'quote'; text: string; cite?: string }
  | { t: 'table'; head: string[]; rows: string[][] };

export type InsightKind = 'Blog' | 'Case study' | 'Guide' | 'Industry report' | 'Event';

export interface Insight {
  slug: string;
  kind: InsightKind;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  author: string;
  authorRole: string;
  service?: string;
  tags: string[];
  /** Guides and reports sit behind a short form. */
  gated?: boolean;
  eventDetails?: { starts: string; location: string; format: string };
  body: Block[];
}

export const INSIGHTS: Insight[] = [
  {
    slug: 'custom-software-development-cost-2026',
    kind: 'Guide',
    title: 'How much does custom software development cost in 2026? Websites, web apps, SaaS and mobile apps',
    excerpt:
      'Published price ranges for websites, web applications, SaaS platforms and mobile apps, what drives the number, and how to budget without overpaying.',
    date: '2026-09-15',
    readingMinutes: 12,
    author: 'Texas Solutions engineering',
    authorRole: 'Software development',
    service: 'web-development',
    tags: ['Software development cost', 'App development cost', 'SaaS', 'Budgeting'],
    body: [
      { t: 'p', text: 'Short answer: with an experienced offshore team, a business website costs about US$2,000 to US$5,000, a web application or portal US$15,000 to US$75,000, a mobile app MVP US$15,000 to US$35,000, a mid-complexity app US$35,000 to US$80,000, and enterprise or AI-enabled platforms usually start around US$80,000. US onshore agencies typically charge two to three times these figures. The rest of this guide explains why the range is so wide and how to budget for it.' },
      { t: 'h2', text: 'Custom software development cost by project type' },
      { t: 'table', head: ['Project', 'Typical range (USD)', 'Typical timeline'], rows: [
        ['Landing page', 'US$500 - 1,500', '1-2 weeks'],
        ['Business website, 5-10 pages', 'US$2,000 - 5,000', '4-8 weeks'],
        ['E-commerce store', 'US$5,000 - 20,000+', '6-12 weeks'],
        ['Web application or portal', 'US$15,000 - 75,000', '3-6 months'],
        ['Mobile app MVP', 'US$15,000 - 35,000', '3-4 months'],
        ['Mid-complexity app', 'US$35,000 - 80,000', '4-8 months'],
        ['Enterprise or AI platform', 'US$80,000+', '6-12 months'],
      ] },
      { t: 'h2', text: 'Does offshore or hybrid delivery lower the cost?' },
      { t: 'p', text: 'Offshore and hybrid delivery lowers the blended rate without lowering the standard, provided the partner uses senior engineers, overlaps your working hours and puts the code in your name.' },
      { t: 'h2', text: 'What drives the cost of a software project?' },
      { t: 'ul', items: [
        'Scope: the number of screens, user roles and workflows.',
        'Integrations: each connection to a CRM, ERP, payment provider or data source adds build and test time.',
        'Design: a template restyled to your brand costs far less than a bespoke design system.',
        'Compliance: HIPAA, PCI DSS and GDPR add security and documentation work.',
        'Timeline: rushed work costs more because it displaces other work; flexible timing costs less.',
        'Data migration: moving years of records from legacy systems is often underestimated.',
      ] },
      { t: 'h2', text: 'Fixed price, time and materials, or a dedicated team?' },
      { t: 'p', text: 'Fixed price suits well-defined scopes such as a website or an MVP. Time and materials suits evolving products. A dedicated team suits long-running product development, with our published rates at US$3,000 a month for a mid-level developer and US$4,500 for a senior developer (up to 160 hours each).' },
      { t: 'h2', text: 'How to avoid overpaying' },
      { t: 'ol', items: [
        'Write down the outcome you need, not a feature list.',
        'Build an MVP first and let real usage decide phase two.',
        'Insist on automated testing from the first sprint; bugs found late cost the most.',
        'Make sure repositories and cloud accounts are in your name from day one.',
        'Compare total cost of ownership, including hosting, licences and maintenance, not just the build.',
      ] },
      { t: 'p', text: 'Our Estimate calculator applies these factors to our published US-dollar price list and returns a low, likely and high range for your scope.' },
    ],
  },
  {
    slug: 'ai-development-cost-2026',
    kind: 'Guide',
    title: 'How much does AI development cost in 2026? Chatbots, AI agents and machine learning models',
    excerpt:
      'What enterprises pay for AI pilots, RAG chatbots, generative AI workflows, AI agents and custom machine learning, plus the running costs nobody mentions.',
    date: '2026-09-12',
    readingMinutes: 10,
    author: 'Texas Solutions AI practice',
    authorRole: 'AI and machine learning',
    service: 'ai-machine-learning',
    tags: ['AI development cost', 'Generative AI', 'AI agents', 'Machine learning'],
    body: [
      { t: 'p', text: 'Short answer: an AI consulting engagement with a working pilot costs about US$5,000 to US$15,000; a production chatbot or assistant US$10,000 to US$40,000; a generative AI workflow US$15,000 to US$60,000; an AI agent system from US$25,000; and a custom machine learning model US$20,000 to US$80,000. Model usage fees are extra.' },
      { t: 'h2', text: 'AI development cost by solution type' },
      { t: 'table', head: ['Solution', 'Typical range (USD)', 'Timeline'], rows: [
        ['AI consulting and pilot', 'US$5,000 - 15,000', '3-6 weeks'],
        ['RAG chatbot or assistant', 'US$10,000 - 40,000', '6-12 weeks'],
        ['Generative AI workflow', 'US$15,000 - 60,000', '2-4 months'],
        ['AI agent system', 'US$25,000 - 100,000+', '3-6 months'],
        ['Custom ML model', 'US$20,000 - 80,000', '3-6 months'],
        ['Computer vision', 'US$30,000 - 120,000', '3-9 months'],
      ] },
      { t: 'h2', text: 'What makes AI projects expensive?' },
      { t: 'ul', items: [
        'Data readiness: cleaning, labelling and structuring data is often the largest cost.',
        'Evaluation: building a test set from real examples and measuring accuracy properly.',
        'Integration: connecting the model to CRMs, ERPs, help desks and document stores.',
        'Guardrails: permissions, approvals, human hand-off and audit logs, especially for agents.',
        'Compliance: data residency, consent and AI governance requirements such as GDPR and the EU AI Act.',
      ] },
      { t: 'h2', text: 'The running cost of AI' },
      { t: 'p', text: 'Every request to a large language model has a usage cost. For most assistants that is cents per conversation, but at scale it matters. Model the cost per task at your real volume before launch, cache repeated answers, use smaller models for simple steps and set budgets with alerts.' },
      { t: 'h2', text: 'Where to start' },
      { t: 'p', text: 'Pick one frequent, measurable process such as support questions, document extraction or lead research. Prove it with a pilot on real data, compare it with the current process, and only then build for production.' },
    ],
  },
  {
    slug: 'qa-outsourcing-guide-2026',
    kind: 'Guide',
    title: 'Software QA outsourcing in 2026: costs, engagement models and how to choose a testing partner',
    excerpt:
      'Hourly and monthly QA rates, manual versus automated testing, Playwright versus Selenium, and the questions that separate good QA partners from bad ones.',
    date: '2026-09-08',
    readingMinutes: 9,
    author: 'Texas Solutions QA practice',
    authorRole: 'Quality assurance',
    service: 'qa-testing',
    tags: ['QA outsourcing', 'Test automation', 'Software testing cost'],
    body: [
      { t: 'p', text: 'Short answer: outsourced QA engineers cost about US$25 to US$45 an hour with an offshore team, depending on seniority and specialism. A managed QA team costs roughly US$2,500 to US$6,000 a month. The best value usually comes from automating regression tests and keeping skilled manual testers for new features.' },
      { t: 'h2', text: 'Which QA engagement model fits?' },
      { t: 'ul', items: [
        'Project-based testing: a defined release or product launch.',
        'Managed QA: a partner owns the test strategy, automation and reporting.',
        'QA staff augmentation: named testers join your sprints and tools.',
      ] },
      { t: 'h2', text: 'Playwright, Cypress or Selenium?' },
      { t: 'p', text: 'Playwright is the strongest default for new web projects: fast, reliable and cross-browser. Cypress suits teams already invested in it. Selenium remains useful for legacy suites and large browser grids. Choose the tool your team can maintain.' },
      { t: 'h2', text: 'Questions to ask a QA partner' },
      { t: 'ol', items: [
        'How do you measure coverage: by code line or by user journey?',
        'How do you handle flaky tests?',
        'Will the test suite live in our repository and CI?',
        'What does a defect report include?',
        'How quickly can testers join our sprints, and how do you handle turnover?',
      ] },
    ],
  },
  {
    slug: 'hire-dedicated-developers-guide',
    kind: 'Guide',
    title: 'How to hire dedicated developers: rates, time-zone overlap and contracts',
    excerpt:
      'Monthly rates by seniority, how much time-zone overlap you really need, and the contract terms that protect your code and your roadmap.',
    date: '2026-09-04',
    readingMinutes: 8,
    author: 'Texas Solutions delivery',
    authorRole: 'Dedicated teams',
    service: 'dedicated-teams',
    tags: ['Hire developers', 'Dedicated team', 'Staff augmentation', 'Offshore development'],
    body: [
      { t: 'p', text: 'Short answer: our published monthly rates for a dedicated engineer (up to 160 hours a month) are US$2,000 for a junior developer, US$3,000 for mid-level, US$4,500 for senior and US$5,500 for a tech lead or architect. Extended time-zone overlap can carry a premium, which we explain and confirm in a written quote before work starts.' },
      { t: 'h2', text: 'How much time-zone overlap do you need?' },
      { t: 'p', text: 'Four hours of overlap is enough for most product teams: standup, planning and a review window. Extended overlap is available when a team needs it, and any premium is confirmed in a written quote first.' },
      { t: 'h2', text: 'Contract terms that matter' },
      { t: 'ul', items: [
        'Intellectual property assigned to you on payment.',
        'Code committed to your repositories, not the vendor’s.',
        'Right to interview and approve every engineer.',
        'Free replacement if an engineer is not a fit.',
        'A notice period of around 30 days rather than a long lock-in.',
      ] },
    ],
  },

  {
    slug: 'percentage-vs-flat-weekly-dispatch',
    kind: 'Blog',
    title: 'Percentage or flat weekly: how to work out which dispatch fee actually costs you less',
    excerpt:
      'The honest answer is a break-even number, not a sales pitch. Here is the arithmetic, and the point at which each model wins.',
    date: '2026-09-02',
    readingMinutes: 7,
    author: 'Texas Solutions dispatch desk',
    authorRole: 'Operations',
    service: 'truck-dispatch',
    tags: ['Dispatch', 'Pricing', 'Owner-operators'],
    body: [
      { t: 'p', text: 'Every dispatch company offers one of two things: a percentage of what your truck grosses, or a flat weekly fee per truck. Both are defensible. Which one costs you less is a question with an exact answer, and it takes about a minute to work out.' },
      { t: 'h2', text: 'The break-even calculation' },
      { t: 'p', text: 'Divide the flat weekly fee by the percentage rate. That gives you the weekly gross at which the two models cost exactly the same. Below that number, the percentage is cheaper. Above it, the flat fee is cheaper.' },
      { t: 'p', text: 'A semi at 7 percent against a flat 300 dollars a week breaks even at roughly 4,286 dollars of weekly gross. Gross 6,000 a week and the percentage costs 420 while the flat costs 300, so the flat fee saves you 120 a week. Gross 3,000 and the percentage costs 210, so the percentage wins.' },
      { t: 'h2', text: 'The part people get wrong' },
      { t: 'p', text: 'Know exactly what the percentage is calculated on. At Texas Solutions it is weekly gross: the total your truck earns hauling loads that week. Whatever the base, it should be written into the agreement before you start.' },
      { t: 'p', text: 'Ask the question directly before you sign: what exactly is the percentage calculated on? A clear answer is a good sign about the rest of the relationship.' },
      { t: 'h2', text: 'Why box truck rates run higher' },
      { t: 'p', text: 'The US market sits between 3 and 10 percent of gross, with 5 to 7 percent typical for semi freight. Box truck, hotshot and sprinter work usually carries a higher percentage, often 10 percent, for a straightforward reason: the loads are smaller, so the same amount of back-office work is spread across a lower gross.' },
      { t: 'p', text: 'That only makes sense if the fee buys the back office. Load-finding alone at 10 percent is expensive. Load-finding plus broker setups, carrier packets, same-day invoicing, factoring submission and detention claims is a different product at the same number.' },
      { t: 'h2', text: 'A fair comparison checklist' },
      { t: 'ul', items: [
        'What is the percentage calculated on, linehaul only or total gross?',
        'Are broker setups and carrier packets included, or billed separately?',
        'Who assembles and submits the invoice, and how fast?',
        'Does anyone file detention, layover and truck-order-not-used claims?',
        'What is the notice period, and is there a termination fee?',
        'Is your dispatcher a named person or a rotating pool?',
      ] },
      { t: 'h2', text: 'The number to hold on to' },
      { t: 'p', text: 'Work out your average weekly gross over the last three months, not your best week. Compare both models at that number. Then ask what happens to the fee in a slow week, because a flat fee does not care that the market softened and a percentage does.' },
      { t: 'p', text: 'We do not offer a flat rate. Our own dispatch fee is a percentage of weekly gross for OTR carriers: 5 percent for semi trucks, 8 percent for hotshots and 10 percent for box trucks and straight trucks, with the final percentage discussed with each carrier. The calculator on the dispatch page shows the fee against your actual gross.' },
    ],
  },
  {
    slug: 'adsense-fewer-units-more-revenue',
    kind: 'Blog',
    title: 'Why removing ad units usually raises AdSense revenue',
    excerpt:
      'Density and earnings are not linear. Past a point, each extra unit lowers the value of every other one and costs you sessions.',
    date: '2026-08-19',
    readingMinutes: 6,
    author: 'Texas Solutions publisher team',
    authorRole: 'AdSense management',
    service: 'adsense-management',
    tags: ['AdSense', 'Publishing', 'Core Web Vitals'],
    body: [
      { t: 'p', text: 'The instinct is understandable. Revenue per impression is roughly fixed, so more impressions should mean more revenue. In practice publishers who cut ad units on article pages usually see revenue per session go up, not down.' },
      { t: 'h2', text: 'Three things happen when density climbs' },
      { t: 'p', text: 'First, viewability falls. Units stacked below the fold in a long article get scrolled past, and low-viewability inventory earns less per impression because buyers bid less for it.' },
      { t: 'p', text: 'Second, layout shift rises. Units that load late and push content down damage Cumulative Layout Shift, which is a Core Web Vitals signal. Worse vitals mean worse rankings, which means fewer sessions to monetise at all.' },
      { t: 'p', text: 'Third, readers leave. Session depth falls when the reading experience degrades, and shorter sessions mean fewer impressions per visitor, which is the opposite of what adding units was supposed to achieve.' },
      { t: 'h2', text: 'Measure per unit before you touch anything' },
      { t: 'p', text: 'AdSense reports at site level by default, which is not granular enough to make layout decisions. Instrument each placement so you can see what it earns individually. In most audits we run, two or three units produce the large majority of revenue and the rest mainly produce layout shift.' },
      { t: 'h2', text: 'Change one thing, keep a control' },
      { t: 'p', text: 'Hold back a slice of traffic on the existing layout while the new one runs. Seasonality and traffic mix move revenue enough on their own that a before-and-after comparison across two different weeks tells you very little.' },
      { t: 'p', text: 'One publisher we worked with went from eleven units per article to six. Session RPM rose from 4.10 to 7.35 dollars and Cumulative Layout Shift fell from 0.31 to 0.04. The traffic did not change during the test window; the layout did.' },
      { t: 'h2', text: 'The policy point that comes first' },
      { t: 'p', text: 'None of this matters if the account is at risk. Audit against Google publisher policy before optimising anything, because a suspended account earns nothing regardless of how well its units are placed.' },
    ],
  },
  {
    slug: 'conversion-tracking-after-cookies',
    kind: 'Blog',
    title: 'Your ad account is optimising on numbers that are wrong',
    excerpt:
      'Browser restrictions broke client-side attribution years ago. Most accounts have never been rebuilt, and they are bidding on fiction.',
    date: '2026-08-05',
    readingMinutes: 8,
    author: 'Texas Solutions performance team',
    authorRole: 'Ads optimization',
    service: 'ads-optimization',
    tags: ['Attribution', 'GA4', 'Server-side'],
    body: [
      { t: 'p', text: 'Ad platforms bid using the conversion data you send them. When that data is incomplete, the algorithm does not stop, it just optimises toward whatever it can still see. That is how accounts end up spending confidently in the wrong places.' },
      { t: 'h2', text: 'What actually broke' },
      { t: 'ul', items: [
        'Intelligent Tracking Prevention caps script-set cookie lifetimes, so returning-visitor conversions get attributed to the wrong source or to nothing.',
        'Ad blockers and consent tools stop the client-side tag firing at all for a meaningful share of traffic.',
        'Long consideration windows mean the conversion happens after the attribution window has already expired.',
        'Form fills get counted as conversions when the thing you actually care about is a closed sale weeks later.',
      ] },
      { t: 'h2', text: 'The rebuild, in order' },
      { t: 'ol', items: [
        'Audit what is firing today, including duplicates. Double-counted conversions are more common than missing ones and they skew bidding harder.',
        'Move to server-side tagging so conversions are sent from your server rather than from a browser that may block them.',
        'Wire the Conversions API on Meta and enhanced conversions on Google, with hashed identifiers so matching survives cookie loss.',
        'Import offline conversions. Send closed revenue back to the platforms so bidding targets money rather than form submissions.',
        'Verify end to end with test conversions before trusting a single reported number.',
      ] },
      { t: 'h2', text: 'What the fix is worth' },
      { t: 'p', text: 'On one home services account, tracking had been double-counting for months. Reported cost per lead looked healthy while cost per booked job climbed. After the rebuild and offline import, cost per booked job fell from 412 to 168 dollars, and 31 percent of spend that had been going to campaigns with no real revenue attached was reallocated.' },
      { t: 'p', text: 'Nothing about the creative or the budget changed in that first month. The account simply started optimising against the truth.' },
      { t: 'h2', text: 'Do this before you scale spend' },
      { t: 'p', text: 'Increasing budget on an account with broken measurement scales the error, not the result. Fix measurement first. It is usually two to three weeks of work and it changes every decision that follows.' },
    ],
  },
  {
    slug: 'lighthouse-90-with-motion',
    kind: 'Blog',
    title: 'How to keep Lighthouse above 90 on a site full of animation',
    excerpt:
      'Motion and performance are not opposites. They conflict when you animate the wrong properties and load everything at once.',
    date: '2026-07-22',
    readingMinutes: 7,
    author: 'Texas Solutions engineering',
    authorRole: 'Web development',
    service: 'web-development',
    tags: ['Performance', 'Motion', 'Core Web Vitals'],
    body: [
      { t: 'p', text: 'Clients ask for scroll-driven animation and a 90-plus mobile Lighthouse score in the same sentence, and the two are usually presented as a trade-off. They are not, as long as a handful of rules hold from the first commit.' },
      { t: 'h2', text: 'Animate transform and opacity only' },
      { t: 'p', text: 'Those two properties can be handled by the compositor without triggering layout or paint. Animating width, height, top or box-shadow forces the browser to recalculate layout on every frame, which is where dropped frames on mid-range Android phones come from.' },
      { t: 'h2', text: 'Budget the motion bundle' },
      { t: 'p', text: 'A scroll library, an animation library and a 3D renderer together can easily exceed 300 KB gzipped, which is most of your JavaScript budget spent before any application code loads. We hold motion code to roughly 80 KB gzipped and lazy-load anything below the fold.' },
      { t: 'h2', text: 'Reserve space for everything' },
      { t: 'p', text: 'Cumulative Layout Shift is the metric animation damages most easily. Every image, video and embed needs explicit dimensions or an aspect ratio so nothing reflows when it arrives.' },
      { t: 'h2', text: 'Turn it off when asked' },
      { t: 'p', text: 'Respect prefers-reduced-motion properly, which means disabling scroll hijacking and pinning, not just shortening durations. It is an accessibility requirement and it is also a good test: if the page is unusable without motion, the motion was carrying content it should not have been.' },
      { t: 'h2', text: 'Simplify below 768 pixels' },
      { t: 'p', text: 'Pinned horizontal scroll sections and parallax layers should stack vertically on phones. Mobile is where Lighthouse is measured and where the weakest hardware lives, so it is the wrong place to spend your frame budget on an effect.' },
      { t: 'h2', text: 'Make the budget fail the build' },
      { t: 'p', text: 'A performance budget that is only checked before launch will be exceeded within a quarter. Wire it into continuous integration so a regression fails the pull request that caused it, while the person who caused it still remembers why.' },
    ],
  },
  {
    slug: 'cold-email-deliverability-2026',
    kind: 'Guide',
    title: 'The cold email deliverability guide for 2026',
    excerpt:
      'Domain setup, authentication, warming schedules and the sending rules that keep outbound landing in the inbox.',
    date: '2026-07-08',
    readingMinutes: 14,
    author: 'Texas Solutions outbound team',
    authorRole: 'Lead generation',
    service: 'lead-generation',
    tags: ['Cold email', 'Deliverability', 'Outbound'],
    gated: true,
    body: [
      { t: 'p', text: 'Deliverability is the whole game in outbound. A brilliant message that lands in spam performs worse than a mediocre one that reaches the inbox, and most programmes fail on infrastructure rather than copy.' },
      { t: 'h2', text: 'Never send from your primary domain' },
      { t: 'p', text: 'Buy separate sending domains that resemble your main one. If the reputation of a sending domain is damaged, you lose that domain rather than the one your invoices and support email depend on.' },
      { t: 'h2', text: 'Authenticate all three records' },
      { t: 'ul', items: [
        'SPF, listing every service permitted to send on the domain.',
        'DKIM, so each message carries a signature the receiver can verify.',
        'DMARC, which tells receivers what to do when the first two fail, and gives you reporting.',
      ] },
      { t: 'p', text: 'Google and Yahoo now enforce these for bulk senders. Missing records are no longer a subtle reputation penalty, they are a hard filter.' },
      { t: 'h2', text: 'Warm for three weeks before volume' },
      { t: 'p', text: 'Start at five to ten messages a day per inbox and increase gradually over about three weeks. Warming tools that generate artificial replies help, but genuine conversations help more. Do not skip this to hit a launch date; the domain will carry the damage for months.' },
      { t: 'h2', text: 'Sending rules that hold up' },
      { t: 'ul', items: [
        'Thirty to fifty messages per inbox per day, maximum. Add inboxes rather than volume per inbox.',
        'No links in the first message. Links in a cold first touch depress inbox placement noticeably.',
        'Plain text formatting. Heavy HTML reads as bulk mail to filters and to people.',
        'Genuine personalisation in the opening line, not a merge field wearing a costume.',
        'A visible, working opt-out, honoured immediately and permanently.',
      ] },
      { t: 'h2', text: 'Monitor the right signals' },
      { t: 'p', text: 'Open rates are unreliable now that privacy features pre-fetch images. Watch reply rate, bounce rate and spam complaint rate instead. Keep bounces under 3 percent and complaints under 0.1 percent, and pause the moment either climbs.' },
      { t: 'h2', text: 'Legal basis, briefly' },
      { t: 'p', text: 'CAN-SPAM requires accurate headers, a physical address and a working opt-out. Under GDPR, B2B outreach generally runs on legitimate interest, which requires a documented assessment, relevance to the recipient role and an easy objection route. Keep records of why each contact was approached.' },
      { t: 'p', text: 'This guide is operational advice, not legal advice. Have your counsel review your programme before launch.' },
    ],
  },
  {
    slug: 'qa-coverage-that-means-something',
    kind: 'Guide',
    title: 'Measuring QA coverage in a way that predicts escaped defects',
    excerpt:
      'Line coverage can be high while checkout is broken. Journey coverage is the number worth reporting.',
    date: '2026-06-24',
    readingMinutes: 11,
    author: 'Texas Solutions QA practice',
    authorRole: 'Quality assurance',
    service: 'qa-testing',
    tags: ['QA', 'Automation', 'Metrics'],
    gated: true,
    body: [
      { t: 'p', text: 'Most teams report code coverage because it is easy to generate. It is also weakly correlated with whether customers hit bugs, which makes it a poor thing to manage by.' },
      { t: 'h2', text: 'Count journeys, not lines' },
      { t: 'p', text: 'List the user journeys that produce revenue or that would cause a support incident if they broke. Usually there are fifteen to forty. For each one record whether it is automated, manually tested or untested. That ratio is your coverage number, and it moves in step with escaped defects.' },
      { t: 'h2', text: 'Rank by cost of failure' },
      { t: 'p', text: 'Automate in order of what failure costs, not in order of what is easy to automate. Checkout, signup, payment and permission boundaries come before settings pages, however tempting the easy wins look on a burndown.' },
      { t: 'h2', text: 'Protect the suite from flakiness' },
      { t: 'p', text: 'A suite that fails randomly gets ignored, and an ignored suite is worse than none because it creates false confidence. Track flake rate per test, quarantine anything unreliable and fix it as a defect rather than rerunning until it passes.' },
      { t: 'h2', text: 'Keep the feedback loop short' },
      { t: 'p', text: 'A regression pack that takes four hours will not run on every pull request. Parallelise, shard and keep the critical path under an hour. Speed is what makes coverage get used.' },
      { t: 'h2', text: 'Report three numbers' },
      { t: 'table', head: ['Metric', 'Why it matters'], rows: [
        ['Journey coverage', 'Share of revenue-critical paths under automation'],
        ['Escaped defects per release', 'The outcome measure that actually matters'],
        ['Mean time to detect', 'How long a regression survives before anyone notices'],
      ] },
      { t: 'p', text: 'If those three move in the right direction, the testing is working, whatever the line coverage percentage says.' },
    ],
  },
  {
    slug: 'freight-market-outlook-2026',
    kind: 'Industry report',
    title: 'Freight market outlook 2026: what carriers should plan for',
    excerpt:
      'Capacity, rate direction and the operational habits that protect margin when the spot market softens.',
    date: '2026-06-03',
    readingMinutes: 16,
    author: 'Texas Solutions dispatch desk',
    authorRole: 'Operations',
    service: 'truck-dispatch',
    tags: ['Freight', 'Market', 'Carriers'],
    gated: true,
    body: [
      { t: 'p', text: 'This report is drawn from the loads our own desk booked over the last four quarters, alongside public rate indices. It describes what we see across our book, not the whole market, and we would rather say that plainly than present it as something broader.' },
      { t: 'h2', text: 'What we observe' },
      { t: 'ul', items: [
        'Spot rates remain sensitive to fuel movement, so a percentage-of-gross fee, which falls when gross falls, shares the downside with the carrier in soft weeks.',
        'Detention time is rising at large distribution facilities, which makes documented claims a bigger share of recoverable revenue than they were.',
        'Box truck and hotshot demand holds up better than semi freight in softer weeks, which matters for mixed fleets deciding what to run.',
        'Broker payment terms are lengthening, so same-day invoicing and factoring discipline have a larger effect on working capital.',
      ] },
      { t: 'h2', text: 'The habits that protect margin' },
      { t: 'ol', items: [
        'Book the next load before the current one delivers. Deadhead is the largest controllable cost in a soft market.',
        'File detention every single time it qualifies. Unclaimed waiting time is the most commonly abandoned revenue we see.',
        'Invoice the day of delivery with the complete paperwork pack, because incomplete submissions are the main cause of ageing.',
        'Check broker credit before accepting, not after chasing.',
        'Review lane performance monthly and drop lanes that only look good on gross.',
      ] },
      { t: 'h2', text: 'What this means for fee structure' },
      { t: 'p', text: 'In a softening market a flat weekly fee becomes riskier for the carrier, because it does not fall when gross falls. A percentage model shares the downside. In a strong market the reverse is true. Carriers with predictable volume usually prefer flat; carriers with seasonal swings usually prefer percentage.' },
      { t: 'p', text: 'Figures in this report describe our own book of business. They are not a market-wide index and should not be used as one.' },
    ],
  },
  {
    slug: 'dispatch-open-house',
    kind: 'Event',
    title: 'Dispatch desk open house: watch a real day on the boards',
    excerpt:
      'A two-hour online session where our dispatchers work live loads, negotiate rates and answer questions from carriers.',
    date: '2026-10-15',
    readingMinutes: 2,
    author: 'Texas Solutions',
    authorRole: 'Events',
    service: 'truck-dispatch',
    tags: ['Event', 'Dispatch', 'Carriers'],
    eventDetails: { starts: '2026-10-15T15:00:00Z', location: 'Online', format: 'Live session, 2 hours' },
    body: [
      { t: 'p', text: 'Most carriers have never watched a dispatcher work. This session is a screen share of a live desk: boards open, brokers on the phone, rates being negotiated in real time.' },
      { t: 'h2', text: 'What we cover' },
      { t: 'ul', items: [
        'How a load is evaluated before anyone calls about it',
        'A live rate negotiation, including one that does not work out',
        'Building a broker packet from scratch',
        'Filing a detention claim with the documentation that gets it paid',
        'Open questions from carriers on the call',
      ] },
      { t: 'h2', text: 'Who it is for' },
      { t: 'p', text: 'Owner-operators and small fleet owners deciding whether to dispatch in-house or outsource. There is no pitch at the end and no obligation to talk to anyone afterwards.' },
    ],
  },
  {
    slug: 'regional-logistics-site-rebuild',
    kind: 'Case study',
    title: 'Example: rebuilding a slow carrier site that paid traffic abandons',
    excerpt:
      'Illustrative example — not a client result. How we would approach a logistics site that takes nine seconds to render, and the metrics a rebuild would target.',
    date: '2026-05-20',
    readingMinutes: 6,
    author: 'Texas Solutions engineering',
    authorRole: 'Web development',
    service: 'web-development',
    tags: ['Case study', 'Illustrative example', 'Performance', 'Logistics'],
    body: [
      { t: 'p', text: 'Illustrative example — not a client result. This is a hypothetical scenario written to show our approach. The figures are example targets, not results achieved for a client.' },
      { t: 'h2', text: 'The scenario' },
      { t: 'p', text: 'Imagine a regional logistics operator running 40 vehicles with a site that takes nine seconds to render on a mid-range phone. They spend on paid search, and a large share of those clicks bounce before the hero image appears. Enquiries go to a shared mailbox with no CRM behind them, and no content change can happen without a developer.' },
      { t: 'h2', text: 'What we would do' },
      { t: 'ul', items: [
        'Rebuild on Next.js with a token-driven design system and a performance budget enforced in continuous integration.',
        'Model every page block in the CMS, including service pricing, so the marketing team can publish without a deploy.',
        'Wire enquiry forms into the CRM with campaign, source and page attribution attached to each lead.',
        'Add a quote calculator to the carrier landing page so visitors can get a number before committing to a conversation.',
      ] },
      { t: 'h2', text: 'Example targets after 90 days' },
      { t: 'table', head: ['Example metric', 'Example starting point', 'Example target'], rows: [
        ['Mobile Lighthouse', '41', '96'],
        ['Largest Contentful Paint', '8.9s', '1.6s'],
        ['Enquiries per month', '11', '38'],
        ['Cost per enquiry', '$187', '$61'],
      ] },
      { t: 'h2', text: 'What would matter most' },
      { t: 'p', text: 'Speed work drives enquiry volume, but CRM attribution drives cost. Once every enquiry carries its source, the paid budget can move toward the campaigns that produce booked work rather than the ones that produce form fills.' },
    ],
  },
  {
    slug: 'saas-release-stability',
    kind: 'Case study',
    title: 'Example: cutting release testing from days to minutes for a 60-person engineering team',
    excerpt:
      'Illustrative example — not a client result. How we would approach a team whose manual regression takes two days per release and still lets hotfixes through.',
    date: '2026-04-28',
    readingMinutes: 6,
    author: 'Texas Solutions QA practice',
    authorRole: 'Quality assurance',
    service: 'qa-testing',
    tags: ['Case study', 'Illustrative example', 'QA', 'SaaS'],
    body: [
      { t: 'p', text: 'Illustrative example — not a client result. This is a hypothetical scenario written to show our approach. The figures are example targets, not results achieved for a client.' },
      { t: 'h2', text: 'The scenario' },
      { t: 'p', text: 'Imagine a B2B SaaS platform with 60 engineers spending two days of manual testing per release and still producing around nine production hotfixes a month. Nobody can state what is covered, so release scope negotiations are guesswork.' },
      { t: 'h2', text: 'What we would do' },
      { t: 'ul', items: [
        'Write a test strategy and map the journeys that produce revenue or support load.',
        'Build a Playwright regression suite in the client repository, running on every pull request.',
        'Add k6 load tests with budgets that fail the build rather than warn.',
        'Introduce defect templates requiring reproduction steps and evidence, to cut triage time.',
      ] },
      { t: 'h2', text: 'Example targets after two quarters' },
      { t: 'table', head: ['Example metric', 'Example starting point', 'Example target'], rows: [
        ['Release testing time', '2 days', '35 minutes'],
        ['Production hotfixes per month', '9', '1'],
        ['Automated journey coverage', '0%', '84%'],
        ['Escaped defects per release', '14', '2'],
      ] },
      { t: 'h2', text: 'What would matter most' },
      { t: 'p', text: 'Ordering the automation by cost of failure rather than ease of implementation. Automating the journeys responsible for most past incidents first moves the defect curve before the coverage number looks impressive.' },
    ],
  },
];

export const INSIGHT_MAP: Record<string, Insight> = INSIGHTS.reduce(
  (acc, i) => ({ ...acc, [i.slug]: i }),
  {} as Record<string, Insight>,
);

export const INSIGHT_KINDS: InsightKind[] = ['Blog', 'Case study', 'Guide', 'Industry report', 'Event'];

export function getInsight(slug: string) {
  return INSIGHT_MAP[slug];
}

export function insightsByKind(kind: InsightKind) {
  return INSIGHTS.filter((i) => i.kind === kind);
}

export const CASE_STUDIES = INSIGHTS.filter((i) => i.kind === 'Case study');
