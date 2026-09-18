import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { SITE_FAQS } from '@/data/company';
import { SERVICES } from '@/data/services';
import { SERVICE_SEO } from '@/data/seo-content';
import { MARKETS } from '@/data/markets';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Container, Section } from '@/components/ui';
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Answers | Software Development, AI, QA & Dispatch Questions Answered',
  description:
    'Straight answers on custom software development cost, AI and machine learning, QA and test automation, dedicated teams, truck dispatch fees and working with us from the US, UK, Europe, the Gulf and Asia.',
  path: '/answers',
  keywords: [
    'how much does custom software development cost',
    'how much does AI development cost',
    'what does a truck dispatcher cost',
    'QA outsourcing cost',
    'how to hire dedicated developers',
  ],
});

interface Group {
  id: string;
  title: string;
  href?: string;
  items: { q: string; a: string }[];
}

function buildGroups(): Group[] {
  const groups: Group[] = [{ id: 'company', title: 'About Texas Solutions', href: '/about', items: SITE_FAQS }];
  for (const s of SERVICES) {
    groups.push({
      id: s.slug,
      title: s.name,
      href: `/services/${s.slug}`,
      items: [...(SERVICE_SEO[s.slug]?.faqs ?? []), ...s.faqs],
    });
  }
  groups.push({
    id: 'markets',
    title: 'Working with us by country',
    href: '/markets',
    items: MARKETS.flatMap((m) => m.faqs),
  });
  return groups;
}

export default function AnswersPage() {
  const groups = buildGroups();
  const all = groups.flatMap((g) => g.items);

  return (
    <>
      <JsonLd data={[faqSchema(all), breadcrumbSchema([{ label: 'Answers', href: '/answers' }])]} />

      <PageHero
        eyebrow="Answers"
        title="Straight answers to the questions buyers ask"
        body={`${all.length} answers on cost, timelines, technology and how we work, grouped by service. Each one is written to stand on its own.`}
        trail={[{ label: 'Answers' }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <nav aria-label="Topics" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">Topics</p>
              <ul className="mt-4 space-y-2 border-l border-line pl-4">
                {groups.map((g) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} className="text-sm text-fg-muted transition-colors hover:text-accent">
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 space-y-14">
              {groups.map((g) => (
                <section key={g.id} id={g.id} className="scroll-mt-28">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="text-display-sm">{g.title}</h2>
                    {g.href && (
                      <Link href={g.href} className="text-sm text-accent hover:underline">
                        Go to page
                      </Link>
                    )}
                  </div>
                  <div className="mt-6 divide-y divide-line border-y border-line">
                    {g.items.map((item) => (
                      <details key={item.q} className="group py-4">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                          <h3 className="font-display text-base font-medium sm:text-lg">{item.q}</h3>
                          <ChevronDown
                            className="mt-1 h-5 w-5 shrink-0 text-fg-subtle transition-transform group-open:rotate-180"
                            aria-hidden
                          />
                        </summary>
                        <p className="mt-3 max-w-prose leading-relaxed text-fg-muted">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Your question not here?"
        body="Ask it on the contact form and a named person replies within four business hours."
        primary={{ href: '/contact', label: 'Ask a question' }}
        secondary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
      />
    </>
  );
}
