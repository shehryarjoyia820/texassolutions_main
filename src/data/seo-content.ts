/**
 * Search (SEO) and answer-engine (AEO) content for every service page.
 *
 * - metaTitle / metaDescription target the primary commercial keyword.
 * - quickAnswer is a 40-70 word direct answer, the block answer engines and
 *   featured snippets lift verbatim. It is marked speakable in JSON-LD.
 * - guide sections use question-style headings, which is how people phrase
 *   queries to Google, ChatGPT, Perplexity and Gemini.
 * - faqs add to the service's own FAQs and feed FAQPage schema.
 *
 * Target markets: Tier 1 (US, UK, Canada, Australia, New Zealand, Western
 * Europe), the Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman) and
 * Asia (Singapore, Japan, Hong Kong, South Korea, Malaysia).
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ServiceSeo {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  quickAnswer: string;
  guideTitle: string;
  guide: GuideSection[];
  faqs: { q: string; a: string }[];
}

export const TARGET_MARKETS_LINE =
  'the United States, United Kingdom, Canada, Australia, New Zealand, Germany, the Netherlands, the Nordics, the UAE, Saudi Arabia, Qatar, Singapore, Japan and Hong Kong';

export const SERVICE_SEO: Record<string, ServiceSeo> = {
  /* ================================================================ */
  'web-development': {
    slug: 'web-development',
    metaTitle: 'Custom Software Development Company | Web, SaaS & Mobile App Development',
    metaDescription:
      'Custom software development, web application, SaaS and mobile app development for enterprises in the US, UK, Europe, UAE, Saudi Arabia and Singapore. Transparent pricing, senior engineers, code you own.',
    keywords: [
      'custom software development company',
      'software development services',
      'enterprise software development',
      'web application development company',
      'SaaS development company',
      'mobile app development company',
      'iOS and Android app development',
      'offshore software development',
      'software outsourcing company',
      'Next.js development agency',
      'React development company',
      'software development company in Dubai',
      'software development company in Singapore',
    ],
    quickAnswer:
      'Texas Solutions is a custom software development company that designs and builds web applications, SaaS platforms, enterprise portals and iOS and Android apps. Projects start at around US$3,000 for a business website, US$25,000 for a mobile app MVP and US$30,000 for a web application, with senior engineers, fixed-scope pricing and full ownership of the source code.',
    guideTitle: 'Custom software development: a practical guide for enterprise buyers',
    guide: [
      {
        heading: 'What does a custom software development company do?',
        paragraphs: [
          'A custom software development company plans, designs, builds, tests and maintains software made for one organisation rather than sold off the shelf. That covers customer-facing web applications, internal tools that replace spreadsheets, SaaS products sold by subscription, mobile apps, and the integrations that connect them to CRM, ERP, payment and data systems.',
          'We run the full software development life cycle: discovery and requirements, UX and UI design, architecture, front-end and back-end development, quality assurance, cloud deployment and ongoing support. Every project ships with automated tests, documentation and a repository that belongs to you.',
        ],
      },
      {
        heading: 'Which types of software do we build?',
        paragraphs: [
          'Most enterprise buyers need one of six things, and each has a different cost and timeline profile.',
        ],
        bullets: [
          'Web application development: portals, dashboards and workflow tools built with React, Next.js, Node.js, .NET or Python.',
          'SaaS development: multi-tenant platforms with subscription billing, roles, audit trails and usage analytics.',
          'Enterprise software development: systems of record that integrate with Salesforce, Dynamics 365, SAP or Odoo.',
          'Mobile app development: iOS and Android apps in React Native or Flutter, or native Swift and Kotlin where hardware demands it.',
          'E-commerce development: Shopify, WooCommerce and headless commerce with server-side conversion tracking.',
          'Legacy modernisation: moving monoliths to maintainable, cloud-native architecture without stopping the business.',
        ],
      },
      {
        heading: 'How much does custom software development cost in 2026?',
        paragraphs: [
          'Published market ranges put a small business website at US$3,000 to US$10,000, a web application or portal at US$30,000 to US$150,000, a mobile app MVP at US$25,000 to US$60,000 and a mid-complexity app at US$60,000 to US$150,000. Enterprise and AI-enabled platforms usually start above US$150,000.',
          'Cost is driven by scope, number of integrations, compliance requirements, design complexity and how quickly you need it. Our Rough Estimate calculator applies those factors to the price table for your region, including the UK, Europe, the Gulf and Asia, and returns a low, likely and high range in minutes.',
        ],
      },
      {
        heading: 'How long does it take to build custom software?',
        paragraphs: [
          'A landing page takes one to two weeks, a business website four to eight weeks, an e-commerce store six to twelve weeks and a mobile app MVP three to four months. Web applications and SaaS products are usually delivered in phased releases, with a usable first version in eight to sixteen weeks.',
        ],
      },
      {
        heading: 'Why outsource software development to Texas Solutions?',
        paragraphs: [
          'Offshore and nearshore software development lowers cost, but only if quality, communication and ownership hold up. We work in your time zone for the core of the day, publish our pricing, assign a named delivery lead, and put the code, cloud accounts and design files in your name from day one.',
          `We deliver software projects for clients across ${'the United States, United Kingdom, Europe, the UAE, Saudi Arabia, Qatar, Singapore and Australia'}, with engineering and QA centred in our Lahore delivery centre and client teams in Houston, London, Toronto and Sydney.`,
        ],
        bullets: [
          'Senior engineers who have shipped production systems, not trainees learning on your budget.',
          'Lighthouse 90+ performance and WCAG 2.1 AA accessibility as acceptance criteria.',
          'Automated testing in CI from the first sprint, run by our own QA practice.',
          'GDPR, UK GDPR, UAE and Saudi PDPL, and Singapore PDPA considered at design time.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the difference between custom software and off-the-shelf software?', a: 'Off-the-shelf software is built for many companies and configured to fit. Custom software is built around one company’s processes, integrates with its existing systems and is owned outright. It costs more up front but removes licence fees and workarounds over time.' },
      { q: 'Which technologies do you use for web and app development?', a: 'Mostly React, Next.js and TypeScript on the front end; Node.js, .NET, Python and Go on the back end; React Native and Flutter for mobile; PostgreSQL, MongoDB and Redis for data; and AWS, Azure or Google Cloud for hosting. We stay in your existing stack where one exists.' },
      { q: 'Do you build SaaS products from scratch?', a: 'Yes. We build multi-tenant SaaS platforms with authentication, roles and permissions, subscription billing through Stripe or Paddle, audit logging, usage analytics and an admin console, delivered in phased releases so you can sell before everything is finished.' },
      { q: 'Can you work with clients in the UAE, Saudi Arabia and Singapore?', a: 'Yes. Our Lahore delivery centre is one hour behind Dubai and three hours behind Singapore, so there is a full working-day overlap. We account for UAE and Saudi PDPL and Singapore PDPA data rules and can host in-region on AWS or Azure.' },
      { q: 'Do you sign NDAs and assign intellectual property?', a: 'Yes. We sign your NDA before discovery, and our contract assigns all intellectual property in the deliverables to you on payment. Repositories and cloud accounts sit in your organisation from the start.' },
    ],
  },

  /* ================================================================ */
  'ai-machine-learning': {
    slug: 'ai-machine-learning',
    metaTitle: 'AI Development Company | Machine Learning, Generative AI & AI Agent Development',
    metaDescription:
      'AI and machine learning development services: generative AI, LLM and RAG applications, AI chatbots, AI agents, computer vision and ML models. For enterprises in the US, UK, Europe, UAE, Saudi Arabia and Singapore.',
    keywords: [
      'AI development company',
      'AI development services',
      'machine learning development services',
      'generative AI development company',
      'LLM application development',
      'RAG development',
      'AI chatbot development company',
      'AI agent development',
      'computer vision development',
      'AI consulting services',
      'MLOps services',
      'AI development company in UAE',
      'AI development company in Singapore',
    ],
    quickAnswer:
      'Texas Solutions is an AI development company that builds generative AI applications, retrieval-augmented (RAG) chatbots, AI agents, machine learning models and computer vision systems for enterprises. AI pilots start at around US$8,000, production AI assistants at US$20,000 and custom machine learning models at US$40,000, each measured against an evaluation set built from your own data.',
    guideTitle: 'AI and machine learning development: what enterprises need to know',
    guide: [
      {
        heading: 'What does an AI development company do?',
        paragraphs: [
          'An AI development company identifies where artificial intelligence can do measurable work in a business, then designs, builds, evaluates and operates that system in production. In 2026 that usually means large language model (LLM) applications, retrieval-augmented generation over company documents, AI agents that act inside business systems, and classic machine learning for forecasting, scoring and recommendations.',
          'We handle the whole path: AI consulting and use-case scoring, data preparation, model selection across Claude, OpenAI, Gemini and open-source models, prompt and retrieval engineering, evaluation, integration, security review and MLOps monitoring.',
        ],
      },
      {
        heading: 'Which AI solutions deliver the fastest return?',
        paragraphs: ['In our experience the first profitable AI projects are narrow, frequent and measurable.'],
        bullets: [
          'AI customer support chatbots grounded in your help centre, with citations and human hand-off.',
          'Document processing: extracting data from invoices, contracts, bills of lading and forms.',
          'Internal knowledge assistants in Slack or Microsoft Teams that answer policy and product questions.',
          'AI agents that prepare quotes, research leads or reconcile records, with approval before any irreversible action.',
          'Demand forecasting, churn prediction and lead scoring models built on your historical data.',
          'Computer vision for defect detection, damage assessment and automated counting.',
        ],
      },
      {
        heading: 'How much does AI development cost?',
        paragraphs: [
          'An AI consulting engagement with a working pilot typically costs US$8,000 to US$30,000. A production chatbot or assistant runs US$20,000 to US$80,000, a generative AI workflow US$30,000 to US$120,000, and an AI agent system from US$50,000. Custom machine learning models range from US$40,000 to US$200,000 depending on data readiness.',
          'Model usage fees are billed separately by the provider. We model the cost per task at your real volume before launch, so running costs are known rather than discovered.',
        ],
      },
      {
        heading: 'How do you make sure an AI system is accurate and safe?',
        paragraphs: [
          'Every project starts with an evaluation set of real examples from your business. We report accuracy against it before launch and track it monthly afterwards. Retrieval systems cite their sources, low-confidence answers route to a person, and agents need approval for anything that cannot be undone.',
          'Data stays under enterprise API terms that exclude training on your content, or inside your own AWS, Azure or Google Cloud account when regulations such as GDPR, UAE PDPL, Saudi PDPL or Singapore PDPA require it.',
        ],
      },
    ],
    faqs: [
      { q: 'What is RAG and why does it matter for enterprise AI?', a: 'Retrieval-augmented generation (RAG) lets a language model answer from your own documents instead of only its training data. It reduces made-up answers, keeps information current and lets every answer cite its source, which is why most enterprise chatbots and assistants are built this way.' },
      { q: 'What is the difference between an AI chatbot and an AI agent?', a: 'A chatbot answers questions. An AI agent takes actions across several steps, such as reading a request, looking up data in your CRM, drafting a quote and submitting it for approval. Agents need scoped permissions, approvals and audit logs, which is why they cost more to build.' },
      { q: 'Which AI models do you work with?', a: 'Anthropic Claude, OpenAI GPT models, Google Gemini, Azure OpenAI and AWS Bedrock, plus open-source models such as Llama and Mistral when data must stay on your own infrastructure. We choose by measured quality and cost on your evaluation set.' },
      { q: 'How long does an AI project take?', a: 'A discovery and pilot phase takes three to six weeks. A production assistant or generative AI workflow takes two to four months, and a custom machine learning model three to six months, mostly depending on how ready the data is.' },
      { q: 'Do you build Arabic-language AI assistants for the Gulf?', a: 'Yes. Current models handle Arabic and English well, and we evaluate on Arabic examples from your own content before launch. Assistants can switch language per conversation and cite Arabic or English sources.' },
    ],
  },

  /* ================================================================ */
  'qa-testing': {
    slug: 'qa-testing',
    metaTitle: 'Software Testing & QA Services | Test Automation, Performance & Mobile App Testing',
    metaDescription:
      'Software testing and QA outsourcing: test automation with Playwright, Selenium and Cypress, manual testing, performance and load testing, API testing, mobile app testing and QA staff augmentation. From US$70 an hour.',
    keywords: [
      'software testing services',
      'QA testing services',
      'QA outsourcing company',
      'test automation services',
      'Playwright test automation',
      'Selenium testing services',
      'Cypress testing',
      'performance testing services',
      'load testing services',
      'mobile app testing services',
      'API testing services',
      'QA staff augmentation',
      'software QA company',
    ],
    quickAnswer:
      'Texas Solutions provides software testing and QA services including test automation with Playwright, Selenium and Cypress, manual and exploratory testing, performance and load testing, API testing, mobile app testing and QA staff augmentation. QA engineers start at US$70 an hour in the US, and managed QA teams at US$4,000 a month, with the test suite built in your repository.',
    guideTitle: 'Software QA and testing: how to choose a QA partner',
    guide: [
      {
        heading: 'What do software testing and QA services include?',
        paragraphs: [
          'Quality assurance (QA) is the discipline of preventing and catching defects before customers find them. Software testing services put that into practice: writing test plans, automating regression tests, testing performance under load, checking APIs and mobile devices, and reporting defects with the evidence developers need to fix them.',
        ],
        bullets: [
          'Test automation: Playwright, Cypress and Selenium suites that run on every pull request in CI.',
          'Manual and exploratory testing on the journeys that earn revenue.',
          'Regression testing so nothing that worked last release breaks this release.',
          'Performance and load testing with k6 or JMeter, including soak and spike tests.',
          'API testing and contract testing between services.',
          'Mobile app testing on real iOS and Android devices.',
          'Accessibility testing to WCAG 2.1 AA.',
        ],
      },
      {
        heading: 'Manual testing or test automation: which do you need?',
        paragraphs: [
          'You need both. Test automation is best for regression paths that run every release, because it is fast, repeatable and cheap per run. Manual and exploratory testing is best for new features, usability and edge cases a script would not think to try. We automate the journeys where failure is expensive, such as checkout, sign-up and permissions, and keep skilled testers on everything else.',
        ],
      },
      {
        heading: 'How much does QA outsourcing cost?',
        paragraphs: [
          'Hourly QA rates run about US$70 to US$120 in the United States, £50 to £90 in the UK and €35 to €85 in Eastern Europe. A managed QA team costs roughly US$4,000 to US$8,000 a month. Building an automation framework with the first ten to thirty journeys usually lands in the managed range for one to three months.',
        ],
      },
      {
        heading: 'How do you measure test coverage?',
        paragraphs: [
          'We measure coverage by user journey rather than code lines, because line coverage can be high while checkout still breaks. We list the revenue-critical journeys, track which are automated, which are manual and which are untested, and report escaped defects and mean time to detect every release.',
        ],
      },
    ],
    faqs: [
      { q: 'Which test automation framework is best in 2026?', a: 'Playwright is our default for new web projects because it is fast, reliable across Chromium, Firefox and WebKit, and has strong tooling. Cypress suits teams already invested in it, and Selenium remains useful for legacy suites and wide browser grids. We build in whatever your team already maintains.' },
      { q: 'Can your QA engineers join our sprints?', a: 'Yes. With QA staff augmentation, named testers join your standups, work your Jira board and use your tools. They can ramp up for a release and back down afterwards with thirty days notice.' },
      { q: 'Do you do penetration testing?', a: 'We test application security against the OWASP Top 10 as part of QA. Formal penetration tests with a certificate for compliance are run through accredited partners and coordinated by our cybersecurity team.' },
      { q: 'How quickly can you start testing?', a: 'A test strategy and first manual regression run usually start within one to two weeks. The automation framework is typically running in your CI within three to six weeks.' },
    ],
  },

  /* ================================================================ */
  'truck-dispatch': {
    slug: 'truck-dispatch',
    metaTitle: 'Truck Dispatch Service | Box Truck, Hotshot & Semi Dispatch for Owner-Operators',
    metaDescription:
      'Truck dispatch service for owner-operators and small fleets: semi trucks 5%, hotshots 8% and box trucks 10% of weekly gross, OTR. No flat rate, no setup fee. Load booking, rate negotiation and broker packets.',
    keywords: [
      'truck dispatch service',
      'truck dispatching company',
      'box truck dispatch service',
      'hotshot dispatch service',
      'owner operator dispatch service',
      'semi truck dispatch',
      'dry van dispatch',
      'flatbed dispatch service',
      'reefer dispatch service',
      'freight dispatch services',
      '24/7 truck dispatch',
      'independent truck dispatcher',
    ],
    quickAnswer:
      'Texas Solutions is a truck dispatch service for owner-operators and small fleets in the United States. Dispatchers book and negotiate loads, complete broker packets and handle paperwork. Semi dispatch (dry van, reefer, flatbed, step deck, power only) costs 5% of weekly gross, hotshot dispatch 8%, and box truck and straight truck dispatch 10%, for OTR operations, with no flat rate. The final percentage is discussed with each carrier.',
    guideTitle: 'Truck dispatch services explained for owner-operators',
    guide: [
      {
        heading: 'What does a truck dispatch service do?',
        paragraphs: [
          'A truck dispatcher finds and books freight for your truck, negotiates the rate with the broker, handles carrier setup paperwork, plans the next load before the current one delivers and keeps the paperwork moving so you get paid. A full-service dispatch company also invoices, submits to your factoring company and files detention, layover and truck-order-not-used claims.',
        ],
        bullets: [
          'Load booking on DAT, Truckstop and direct broker relationships.',
          'Rate negotiation on every load, benchmarked against current lane rates.',
          'Broker packets, W-9s, certificates of insurance and carrier setups.',
          'Same-day invoicing and factoring submission.',
          'Detention and layover documentation and claims.',
          'After-hours and weekend coverage for breakdowns and next-day booking.',
        ],
      },
      {
        heading: 'How much does a truck dispatcher cost?',
        paragraphs: [
          'US truck dispatch fees range from 3% to 10% of gross. We charge 5% of weekly gross for OTR semi trucks (dry van, reefer, flatbed, step deck, power only), 8% for OTR hotshots and 10% for OTR box trucks and straight trucks. On a semi grossing US$8,000 to US$10,000 a week, that is about US$400 to US$500 a week.',
          'There is no flat rate, no setup fee and no long-term contract. Local and regional work is quoted separately, and the final percentage is discussed with each carrier before service begins.',
        ],
      },
      {
        heading: 'What do loads pay per mile?',
        paragraphs: [
          'As a rough guide, flatbed and step deck loads often pay US$5 to US$7 a mile, reefer US$4 to US$6, hotshot US$4 to US$5, dry van and power only US$3 to US$5 depending on local or OTR lanes, and box trucks US$1.80 to US$3.20. Rates move with lane, season and market and are not guaranteed.',
        ],
      },
      {
        heading: 'Box truck and hotshot dispatch versus semi dispatch',
        paragraphs: [
          'Box truck and hotshot loads are smaller and more frequent, so each truck needs more calls, setups and paperwork per dollar of gross. That is why box truck dispatch usually costs a higher percentage. Semi dispatch involves equipment-specific rules: temperature logs for reefers, securement for flatbeds and permits for oversize step-deck freight.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need my own MC and DOT number to use a dispatch service?', a: 'Yes. A dispatch service books freight under your own operating authority. We help with broker setups using your MC number, insurance certificate and W-9, and every setup stays in your carrier name.' },
      { q: 'Is a truck dispatcher worth it for an owner-operator?', a: 'For most owner-operators, yes, if the dispatcher raises weekly gross, cuts deadhead and recovers detention by more than the fee. Our sample owner-operator profile moved from about US$4,900 to US$7,150 weekly gross after three months.' },
      { q: 'Can you dispatch in Canada?', a: 'Yes, for Canadian carriers running cross-border and domestic lanes from our Toronto team, alongside US dispatch from Houston.' },
      { q: 'What hours is the dispatch desk staffed?', a: 'Weekday coverage is standard. Evening, weekend and full 24/7 coverage is available as an add-on, staffed across Houston and our overnight team.' },
    ],
  },

  /* ================================================================ */
  'dedicated-teams': {
    slug: 'dedicated-teams',
    metaTitle: 'Hire Dedicated Developers | Dedicated Development Team & IT Staff Augmentation',
    metaDescription:
      'Hire dedicated developers and full software teams: React, Next.js, Node.js, .NET, Python, Java, Flutter and QA engineers. Offshore development team with US, UK, EU, Gulf and Asia time-zone overlap. Start in 1-2 weeks.',
    keywords: [
      'hire dedicated developers',
      'dedicated development team',
      'IT staff augmentation services',
      'offshore development center',
      'offshore development team',
      'hire remote developers',
      'hire React developers',
      'hire Node.js developers',
      'hire Python developers',
      'hire .NET developers',
      'hire Flutter developers',
      'software team augmentation',
    ],
    quickAnswer:
      'Texas Solutions provides dedicated development teams and IT staff augmentation: named software engineers, QA engineers, DevOps engineers and designers who work only on your product, in your tools and time zone. Mid-level engineers start at about US$5,500 a month and senior engineers at US$8,500, with the first engineers starting in one to two weeks.',
    guideTitle: 'Hiring a dedicated development team: costs, models and pitfalls',
    guide: [
      {
        heading: 'What is a dedicated development team?',
        paragraphs: [
          'A dedicated development team is a group of engineers employed by a partner company but working full time on your product, under your direction. Unlike fixed-price outsourcing, you control the backlog and priorities; unlike hiring, you skip recruitment, payroll and notice periods. It is the model most scale-ups and enterprises use to add capacity quickly.',
        ],
      },
      {
        heading: 'Dedicated team, staff augmentation or fixed-price project?',
        paragraphs: ['Each model suits a different situation.'],
        bullets: [
          'Dedicated team: long-running product work where the roadmap keeps changing.',
          'IT staff augmentation: specific skills for a defined stretch, such as a migration or a release.',
          'Fixed-price project: a well-defined scope with a clear finish line, such as a website or an MVP.',
        ],
      },
      {
        heading: 'How much does it cost to hire dedicated developers?',
        paragraphs: [
          'Monthly rates for full-time dedicated engineers run from about US$3,500 to US$5,500 for junior, US$5,500 to US$8,500 for mid-level, US$8,500 to US$13,000 for senior and US$12,000 to US$17,000 for tech leads and architects. Full working-hours overlap with US, UK or EU clients adds around 10% to 15%.',
        ],
      },
      {
        heading: 'How do you avoid the usual outsourcing problems?',
        paragraphs: [
          'The common failures are high turnover, weak communication and knowledge that leaves with the engineer. You interview and approve every engineer, a delivery manager tracks velocity and quality, knowledge is documented continuously, and any engineer who is not working out is replaced at no cost.',
        ],
      },
    ],
    faqs: [
      { q: 'How fast can a dedicated developer start?', a: 'Usually within one to two weeks: a shortlist in three to seven days, your interviews, then onboarding. A full squad of four to six engineers typically takes three to four weeks.' },
      { q: 'Which time zones do your developers cover?', a: 'Core hours overlap with the UK and Europe, the Gulf and Asia. For US clients we guarantee at least four hours of overlap, and full US hours are available at a small premium.' },
      { q: 'Who owns the code a dedicated team writes?', a: 'You do. Intellectual property is assigned to you in the contract and all code is committed to your repositories.' },
      { q: 'Can we scale the team up or down?', a: 'Yes, with thirty days notice. Most clients start with two or three engineers and grow once velocity and quality are proven.' },
    ],
  },

  /* ================================================================ */
  'cloud-devops': {
    slug: 'cloud-devops',
    metaTitle: 'Cloud & DevOps Services | AWS & Azure Migration, CI/CD and Managed Cloud',
    metaDescription:
      'Cloud consulting, AWS and Azure migration, DevOps and CI/CD, Kubernetes, application modernisation and 24/7 managed cloud. For enterprises in the US, UK, Europe, the Gulf and Asia.',
    keywords: ['cloud consulting services', 'AWS migration services', 'Azure migration', 'DevOps consulting services', 'CI/CD pipeline setup', 'Kubernetes consulting', 'managed cloud services', 'cloud cost optimization', 'application modernization services'],
    quickAnswer:
      'Texas Solutions provides cloud and DevOps services: cloud readiness assessments, AWS and Azure migration, CI/CD pipelines, infrastructure as code with Terraform, Kubernetes, application modernisation and 24/7 managed cloud. Assessments start at about US$5,000, DevOps setups at US$10,000 and managed cloud at US$2,500 a month.',
    guideTitle: 'Cloud migration and DevOps: a buyer’s guide',
    guide: [
      {
        heading: 'What do cloud and DevOps services include?',
        paragraphs: [
          'Cloud services cover choosing the right platform, migrating workloads safely and running them efficiently. DevOps covers how software gets from a developer’s laptop to production: automated builds, tests, deployments and rollbacks, with infrastructure defined as code and monitoring that alerts the right person.',
        ],
      },
      {
        heading: 'How much does cloud migration cost?',
        paragraphs: [
          'A cloud readiness assessment typically costs US$5,000 to US$20,000. Migrating a set of workloads to AWS or Azure runs US$25,000 to US$250,000 depending on the number of applications, data volume and compliance needs. Cloud provider charges are billed directly to your account.',
        ],
      },
      {
        heading: 'Can data stay in the Gulf or in Asia?',
        paragraphs: [
          'Yes. AWS and Azure both operate regions in the UAE, Saudi Arabia (announced and live regions vary by provider), Singapore, Japan and Hong Kong. We design landing zones to keep regulated data in-region for UAE and Saudi PDPL, Saudi NCA controls and Singapore PDPA.',
        ],
      },
    ],
    faqs: [
      { q: 'AWS or Azure: which should we choose?', a: 'Azure suits organisations built on Microsoft 365 and Active Directory; AWS offers the broadest service catalogue for most SaaS workloads. We recommend on cost, skills and compliance fit.' },
      { q: 'Will a cloud migration cause downtime?', a: 'Cutovers are rehearsed and scheduled in low-traffic windows, usually with minutes of downtime, and every migration wave has a rollback plan.' },
    ],
  },

  /* ================================================================ */
  'data-analytics': {
    slug: 'data-analytics',
    metaTitle: 'Data Analytics & BI Services | Power BI, Data Engineering & Data Warehousing',
    metaDescription:
      'Data analytics and business intelligence services: Power BI and Tableau dashboards, data engineering, Snowflake and BigQuery data warehouses, and predictive analytics for enterprises worldwide.',
    keywords: ['data analytics services', 'business intelligence consulting', 'Power BI consulting services', 'data engineering services', 'data warehouse consulting', 'Snowflake consulting', 'predictive analytics services', 'Tableau consulting'],
    quickAnswer:
      'Texas Solutions provides data analytics and business intelligence services: Power BI, Tableau and Looker dashboards, data engineering pipelines, cloud data warehouses on Snowflake, BigQuery or Microsoft Fabric, and predictive analytics. Dashboard projects start at about US$10,000 and data warehouses at US$50,000.',
    guideTitle: 'Business intelligence and data engineering explained',
    guide: [
      {
        heading: 'What is the difference between BI, data engineering and data science?',
        paragraphs: [
          'Data engineering moves and cleans data from source systems into a warehouse. Business intelligence turns that data into dashboards and reports that people use to make decisions. Data science and predictive analytics use statistical and machine learning models to forecast what happens next. Most companies need them in that order.',
        ],
      },
      {
        heading: 'How much does a Power BI or data warehouse project cost?',
        paragraphs: [
          'A set of five to eight Power BI or Tableau dashboards on up to three data sources typically costs US$10,000 to US$40,000. A cloud data warehouse with a semantic layer runs US$50,000 to US$250,000. Licences are billed by the vendor.',
        ],
      },
    ],
    faqs: [
      { q: 'Power BI or Tableau?', a: 'Power BI is usually the better value for Microsoft-centric organisations; Tableau suits complex visual analysis and existing Tableau estates. We work in both.' },
      { q: 'Do we need a data warehouse?', a: 'Once you have more than two or three data sources or need reliable history, usually yes. Below that, a well-modelled dataset directly on the sources can be enough.' },
    ],
  },

  /* ================================================================ */
  'crm-erp': {
    slug: 'crm-erp',
    metaTitle: 'CRM & ERP Implementation | Salesforce, Dynamics 365, Odoo & Custom CRM',
    metaDescription:
      'CRM and ERP consulting, implementation, integration and support: Salesforce, Microsoft Dynamics 365, Business Central, Odoo, HubSpot and custom CRM development for companies in the US, UK, Europe and the Gulf.',
    keywords: ['CRM implementation services', 'ERP implementation services', 'Salesforce consulting partner', 'Dynamics 365 implementation', 'Odoo implementation partner', 'custom CRM development', 'ERP integration services', 'Business Central implementation'],
    quickAnswer:
      'Texas Solutions implements and customises CRM and ERP systems, including Salesforce, Microsoft Dynamics 365, Business Central, Odoo and HubSpot, and builds custom CRM where packages do not fit. CRM implementations start at about US$10,000, Odoo or Business Central ERP at US$15,000, and enterprise ERP from US$50,000 excluding licences.',
    guideTitle: 'CRM and ERP implementation: planning, cost and adoption',
    guide: [
      {
        heading: 'How much does ERP implementation cost?',
        paragraphs: [
          'For a midsized company, platform-based ERP implementation commonly ranges from US$50,000 to around US$1,000,000 excluding licences, depending on modules, entities, integrations and data migration. Mid-market systems such as Odoo and Business Central often come in at US$15,000 to US$120,000.',
        ],
      },
      {
        heading: 'Why do CRM projects fail, and how do you prevent it?',
        paragraphs: [
          'Most CRM failures are adoption failures: too many fields, a pipeline that does not match how the team sells, and manual data entry. We map the real process first, configure before customising, automate data capture and measure adoption after go-live.',
        ],
      },
    ],
    faqs: [
      { q: 'Salesforce, Dynamics 365 or Odoo?', a: 'Salesforce suits sales-led organisations with complex pipelines, Dynamics 365 suits Microsoft-centric businesses, and Odoo or Business Central are strong, cost-effective ERP choices for small and mid-sized companies.' },
      { q: 'Do you support Arabic and multi-currency ERP for the Gulf?', a: 'Yes. Odoo, Dynamics 365 and Business Central support Arabic, right-to-left layouts, multi-currency and VAT for the UAE and Saudi Arabia, including ZATCA e-invoicing requirements in Saudi Arabia.' },
    ],
  },

  /* ================================================================ */
  cybersecurity: {
    slug: 'cybersecurity',
    metaTitle: 'Cybersecurity Services | Security Assessment, Penetration Testing & SOC 2 Readiness',
    metaDescription:
      'Cybersecurity services: security assessments, application security, penetration testing via accredited partners, SOC 2 and ISO 27001 readiness and managed security for SaaS and enterprises.',
    keywords: ['cybersecurity services', 'security assessment services', 'penetration testing services', 'SOC 2 readiness consulting', 'ISO 27001 consulting', 'application security services', 'managed security services', 'vulnerability assessment'],
    quickAnswer:
      'Texas Solutions provides cybersecurity services including security assessments, application security testing, penetration testing through accredited partners, SOC 2 and ISO 27001 readiness, and managed security. Assessments start at about US$8,000 and compliance readiness programmes at US$20,000.',
    guideTitle: 'Cybersecurity for growing software companies',
    guide: [
      {
        heading: 'What should a first security assessment cover?',
        paragraphs: [
          'A useful first assessment reviews cloud configuration, identity and access, endpoints, your main applications and security processes against a recognised framework such as CIS, NIST or ISO 27001, then ranks findings by business risk so the most dangerous gaps are fixed first.',
        ],
      },
      {
        heading: 'Which regulations apply in the Gulf and Asia?',
        paragraphs: [
          'The UAE and Saudi Arabia both have Personal Data Protection Laws (PDPL), and Saudi Arabia’s National Cybersecurity Authority (NCA) publishes Essential Cybersecurity Controls. Singapore has the PDPA and Japan the APPI. We map your controls to the rules that apply where your customers and data are.',
        ],
      },
    ],
    faqs: [
      { q: 'Do you issue penetration test certificates?', a: 'Certified penetration tests are delivered by accredited partners, with scoping, remediation and retesting managed by us.' },
      { q: 'How long does SOC 2 readiness take?', a: 'Typically two to four months to be ready for a SOC 2 Type I audit, depending on how many controls already exist.' },
    ],
  },

  /* ================================================================ */
  'lead-generation': {
    slug: 'lead-generation',
    metaTitle: 'B2B Lead Generation Services | Outbound, Cold Email & Appointment Setting',
    metaDescription:
      'B2B lead generation agency: outbound campaigns, cold email, LinkedIn outreach, appointment setting and verified data. Retainers from US$2,500 a month, or pay per qualified lead.',
    keywords: ['B2B lead generation services', 'lead generation agency', 'cold email agency', 'appointment setting services', 'LinkedIn lead generation', 'outbound sales agency', 'pay per lead'],
    quickAnswer:
      'Texas Solutions runs B2B lead generation: outbound campaigns across cold email, LinkedIn and phone, appointment setting and verified contact data. Retainers start at about US$2,500 a month in the US, with per-qualified-lead pricing from US$150 once volume is proven.',
    guideTitle: 'B2B lead generation that produces meetings, not lists',
    guide: [
      {
        heading: 'How does outbound B2B lead generation work?',
        paragraphs: [
          'We agree an ideal customer profile and qualification criteria, build and verify a contact list, send from warmed dedicated domains, run multi-touch sequences across email and LinkedIn, handle replies and book meetings on your calendar with reminders to cut no-shows.',
        ],
      },
    ],
    faqs: [
      { q: 'How much does B2B lead generation cost?', a: 'Retainers typically run US$2,500 to US$15,000 a month in the US. Per qualified lead pricing runs about US$150 to US$600, and per booked appointment US$300 to US$900.' },
    ],
  },

  /* ================================================================ */
  'ads-optimization': {
    slug: 'ads-optimization',
    metaTitle: 'PPC Management & Ad Creative | Google Ads, Meta Ads, LinkedIn & TikTok',
    metaDescription:
      'PPC and paid social management: Google Ads, Meta, LinkedIn and TikTok campaigns, account audits, conversion tracking and ad creative design. From US$500 a month or 10-20% of spend.',
    keywords: ['PPC management services', 'Google Ads management agency', 'Meta ads agency', 'LinkedIn ads agency', 'ad creative design services', 'conversion tracking setup', 'PPC audit'],
    quickAnswer:
      'Texas Solutions manages paid advertising on Google Ads, Meta, LinkedIn and TikTok, with account audits, server-side conversion tracking and monthly ad creative. Management costs about US$500 to US$3,000 a month or 10% to 20% of ad spend, whichever is lower for you.',
    guideTitle: 'Paid advertising management: fix measurement first',
    guide: [
      {
        heading: 'Why fix conversion tracking before spending more?',
        paragraphs: [
          'Ad platforms optimise toward the conversions you send them. When tracking is broken or double-counting, more budget just scales the error. Server-side tagging, the Meta Conversions API and offline conversion import let bidding target real revenue.',
        ],
      },
    ],
    faqs: [
      { q: 'How much does PPC management cost?', a: 'Typically US$500 to US$3,000 a month, or 10% to 20% of ad spend. Setup and tracking is usually a one-time US$500 to US$2,000.' },
    ],
  },

  /* ================================================================ */
  'adsense-management': {
    slug: 'adsense-management',
    metaTitle: 'Google AdSense Management | RPM Optimisation & Policy Compliance for Publishers',
    metaDescription:
      'Google AdSense revenue management for publishers: approval, ad placement optimisation, RPM and CTR tuning, policy compliance, Core Web Vitals and header bidding advice.',
    keywords: ['AdSense management service', 'increase AdSense RPM', 'AdSense optimization', 'AdSense approval service', 'AdSense policy compliance', 'publisher ad revenue optimization'],
    quickAnswer:
      'Texas Solutions manages Google AdSense revenue for publishers: policy compliance, ad placement and density tuning, RPM optimisation, Core Web Vitals and header bidding advice. Management costs US$500 to US$2,500 per site a month, or 15% to 30% of the revenue uplift above an agreed baseline.',
    guideTitle: 'How to raise AdSense revenue without hurting your readers',
    guide: [
      {
        heading: 'Does adding more ad units increase AdSense revenue?',
        paragraphs: [
          'Past a point, no. Extra units lower viewability, cause layout shift that hurts Core Web Vitals and search traffic, and shorten sessions. Measuring revenue per unit and removing the weak ones usually raises revenue per session.',
        ],
      },
    ],
    faqs: [
      { q: 'How can I increase my AdSense RPM?', a: 'Audit policy risk first, instrument revenue per ad unit, remove low-earning units that cause layout shift, reserve ad slot space, and test placement changes against a held-back control group.' },
    ],
  },

  /* ================================================================ */
  'auto-engines': {
    slug: 'auto-engines',
    metaTitle: 'Used & Remanufactured Engines | Engine Replacement, Sourcing & Installation',
    metaDescription:
      'Used, remanufactured and crate engines sourced by VIN, verified with compression data and installed by vetted shops, with warranty and core returns handled. From US$2,600 installed.',
    keywords: ['used engines for sale', 'remanufactured engines', 'engine replacement cost', 'crate engines', 'used engine with warranty', 'engine installation service'],
    quickAnswer:
      'Texas Solutions sources used, remanufactured and crate engines matched by VIN, verifies them with compression and leak-down data, arranges installation through vetted shops, and handles warranty registration and core returns. Used engines installed start at about US$2,600 and remanufactured engines at US$4,000 in the US.',
    guideTitle: 'Engine replacement: used, remanufactured or crate?',
    guide: [
      {
        heading: 'Used, remanufactured or crate engine: which should you choose?',
        paragraphs: [
          'A used engine is the lowest-cost option and suits vehicles with limited remaining life. A remanufactured engine is rebuilt to OEM specification with new wear parts and a longer warranty. A crate engine is new and suits high-value vehicles or performance builds.',
        ],
      },
    ],
    faqs: [
      { q: 'How much does an engine replacement cost?', a: 'In the US, a used engine supplied and installed typically costs US$2,600 to US$4,500, a remanufactured engine US$4,000 to US$6,500, and a truck or European engine US$6,000 to US$12,000.' },
    ],
  },
};
