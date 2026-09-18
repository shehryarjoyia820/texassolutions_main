import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MARKETS } from '@/data/markets';
import { Container, Section, SectionHeading } from '@/components/ui';
import { QuickAnswer, MarketLinks } from '@/components/seo-blocks';

const FOCUS = [
  {
    href: '/services/web-development',
    title: 'Custom software development',
    body: 'Web applications, SaaS platforms, enterprise portals and iOS and Android apps built with React, Next.js, Node.js, .NET, Python and Flutter. Fixed-scope or agile delivery, code you own.',
    links: [
      { label: 'Custom software', href: '/services/web-development/custom-software-development' },
      { label: 'SaaS development', href: '/services/web-development/saas-development' },
      { label: 'Mobile apps', href: '/services/web-development/mobile-apps' },
    ],
  },
  {
    href: '/services/ai-machine-learning',
    title: 'AI and machine learning',
    body: 'Generative AI, LLM and RAG applications, AI chatbots, AI agents, computer vision and machine learning models, each measured against an evaluation set built from your data.',
    links: [
      { label: 'AI chatbots', href: '/services/ai-machine-learning/chatbot-development' },
      { label: 'AI agents', href: '/services/ai-machine-learning/ai-agents' },
      { label: 'Machine learning', href: '/services/ai-machine-learning/machine-learning' },
    ],
  },
  {
    href: '/services/qa-testing',
    title: 'QA and software testing',
    body: 'Test automation with Playwright, Cypress and Selenium, manual and exploratory testing, performance and load testing, API and mobile app testing, and QA staff augmentation.',
    links: [
      { label: 'Test automation', href: '/services/qa-testing/test-automation' },
      { label: 'Performance testing', href: '/services/qa-testing/performance-load' },
      { label: 'Mobile testing', href: '/services/qa-testing/mobile-testing' },
    ],
  },
  {
    href: '/services/truck-dispatch',
    title: 'Truck dispatch',
    body: 'Box truck, hotshot and semi dispatch for US and Canadian owner-operators and fleets: load booking, rate negotiation, broker packets, invoicing and detention claims.',
    links: [
      { label: 'Box truck dispatch', href: '/services/truck-dispatch/box-truck-hotshot' },
      { label: 'Semi dispatch', href: '/services/truck-dispatch/semi-dispatch' },
      { label: 'After-hours', href: '/services/truck-dispatch/after-hours' },
    ],
  },
];

const ANSWER =
  'Texas Solutions is a custom software development company that builds web and mobile applications, SaaS platforms and enterprise software, develops AI and machine learning solutions, and provides QA and software testing and dedicated development teams. It serves enterprises in the United States, United Kingdom, Europe, Canada, Australia, the UAE, Saudi Arabia, Qatar, Singapore and Japan, and runs truck dispatch for US carriers.';

export function HomeSeoSection() {
  return (
    <Section id="what-we-do">
      <Container>
        <QuickAnswer question="What is Texas Solutions?" answer={ANSWER} className="mb-16" />

        <SectionHeading
          eyebrow="Software, AI, QA and dispatch"
          title="Software development, AI and QA for enterprises worldwide"
          body="Four practices carry most of our work. Each has its own engineers, its own published pricing and its own named lead."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FOCUS.map((f) => (
            <article key={f.href} className="flex flex-col rounded-2xl border border-line bg-bg-elev p-7">
              <h3 className="font-display text-xl font-semibold">
                <Link href={f.href} className="hover:text-accent">
                  {f.title}
                </Link>
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-fg-muted">{f.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {f.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={f.href} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Explore {f.title.toLowerCase()}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-bg-soft p-7">
          <h3 className="font-display text-lg font-semibold">Serving Tier 1 markets, the Gulf and Asia</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">
            Clients in the United States, United Kingdom, Canada, Australia, Germany, the Netherlands, the UAE,
            Saudi Arabia, Qatar, Singapore and Japan work with us in their own time zone and currency.
          </p>
          <div className="mt-5">
            <MarketLinks markets={MARKETS.map((m) => ({ slug: m.slug, name: m.name, flag: m.flag }))} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
