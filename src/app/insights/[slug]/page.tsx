import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag } from 'lucide-react';
import { INSIGHTS, getInsight, type Block } from '@/data/insights';
import { SERVICES } from '@/data/services';
import { ScrollProgress } from '@/components/motion';
import { ArrowLink, Badge, Breadcrumbs, ButtonLink, Container, Section } from '@/components/ui';
import { GatedDownloadForm } from '@/components/forms';
import { CtaSection } from '@/components/page-shell';
import { formatDate } from '@/lib/format';
import { JsonLd, articleSchema, breadcrumbSchema, pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return pageMeta({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    type: 'article',
    publishedTime: article.date,
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const service = SERVICES.find((s) => s.slug === article.service);
  const related = INSIGHTS.filter((i) => i.slug !== article.slug && i.service === article.service).slice(0, 3);

  return (
    <div style={service ? ({ ['--svc' as string]: service.accent } as React.CSSProperties) : undefined}>
      <ScrollProgress />
      <JsonLd
        data={[
          articleSchema({
            title: article.title,
            excerpt: article.excerpt,
            slug: article.slug,
            date: article.date,
            author: article.author,
          }),
          breadcrumbSchema([
            { label: 'Insights', href: '/insights' },
            { label: article.title, href: `/insights/${article.slug}` },
          ]),
        ]}
      />

      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 accent-glow" />
        <Container className="py-[clamp(2.5rem,6vw,4.5rem)]">
          <Breadcrumbs trail={[{ label: 'Insights', href: '/insights' }, { label: article.kind }]} />

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{article.kind}</Badge>
              {article.gated && <Badge tone="warn">Gated resource</Badge>}
              {service && (
                <Link href={`/services/${service.slug}`} className="text-sm text-fg-muted hover:text-accent">
                  {service.navLabel}
                </Link>
              )}
            </div>

            <h1 className="mt-5 text-display-lg">{article.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">{article.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-subtle">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden />
                {article.readingMinutes} min read
              </span>
              <span>
                {article.author} · {article.authorRole}
              </span>
            </div>

            {article.eventDetails && (
              <div className="mt-7 rounded-xl border border-accent/25 bg-accent/5 p-5 text-sm">
                <p className="font-medium">
                  {formatDate(article.eventDetails.starts)} · {article.eventDetails.location}
                </p>
                <p className="mt-1 text-fg-muted">{article.eventDetails.format}</p>
                <ButtonLink href="/contact?subject=event" size="sm" className="mt-4">
                  Register your interest
                </ButtonLink>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="prose-ts">
              {article.body.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}

              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-8">
                <Tag className="h-4 w-4 text-fg-subtle" aria-hidden />
                {article.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-fg-subtle">
                    {t}
                  </span>
                ))}
              </div>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {article.gated ? (
                <GatedDownloadForm title={`Download: ${article.title}`} resource={article.slug} />
              ) : service ? (
                <div className="rounded-2xl border border-svc/25 bg-svc/5 p-6">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                    Related service
                  </p>
                  <h2 className="mt-3 font-display text-lg font-semibold">{service.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{service.summary}</p>
                  <ButtonLink
                    href={`/estimate?service=${service.slug}`}
                    variant="service"
                    className="mt-5 w-full"
                  >
                    Price this service
                  </ButtonLink>
                </div>
              ) : null}

              {related.length > 0 && (
                <div className="mt-5 rounded-2xl border border-line bg-bg-elev p-6">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                    Related reading
                  </p>
                  <ul className="mt-4 space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/insights/${r.slug}`} className="group block">
                          <span className="text-[0.6875rem] uppercase tracking-wider text-fg-subtle">{r.kind}</span>
                          <span className="mt-1 block text-sm font-medium leading-snug group-hover:text-accent">
                            {r.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5">
                <ArrowLink href="/insights">Back to all insights</ArrowLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CtaSection
        title="Turn the reading into a number"
        body="The calculator uses the same published ranges referenced in these articles. Seven questions and you have a figure in your own currency."
        primary={{ href: '/estimate', label: 'Get a Rough Estimate' }}
        secondary={{ href: '/contact', label: 'Talk to someone' }}
      />
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.t) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'p':
      return <p>{block.text}</p>;
    case 'ul':
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-5 space-y-2 pl-5">
          {block.items.map((i) => (
            <li key={i} className="list-decimal marker:text-accent">
              {i}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-accent pl-5">
          <p className="italic text-fg">“{block.text}”</p>
          {block.cite && <footer className="mt-2 text-sm text-fg-subtle">{block.cite}</footer>}
        </blockquote>
      );
    case 'table':
      return (
        <div className="my-8 overflow-x-auto rounded-xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-bg-soft">
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {block.rows.map((row, i) => (
                <tr key={i} className="bg-bg-elev">
                  {row.map((cell, j) => (
                    <td key={j} className={j === 0 ? 'px-4 py-3 font-medium text-fg' : 'px-4 py-3 text-fg-muted'}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
