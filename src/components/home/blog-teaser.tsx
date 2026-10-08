import Link from 'next/link';
import { INSIGHTS } from '@/data/insights';
import { formatDateShort } from '@/lib/format';
import { ArrowLink, Container, Section, SectionHeading } from '@/components/ui';

/** Home page: the three newest open (non-gated) blog posts. */
export function BlogTeaser() {
  const posts = [...INSIGHTS]
    .filter((i) => !i.gated && i.kind !== 'Event')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  if (!posts.length) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="From the blog"
            title="Guides with the arithmetic included"
            body="Costs, timelines and how-tos from the teams doing the work."
          />
          <ArrowLink href="/blog">All blog posts</ArrowLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/insights/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent/50"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-accent">{p.kind}</span>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-accent">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{p.excerpt}</p>
              <span className="mt-auto pt-5 text-xs text-fg-subtle">
                {formatDateShort(p.date)} · {p.readingMinutes} min read
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
