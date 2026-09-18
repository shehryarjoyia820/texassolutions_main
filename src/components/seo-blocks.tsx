import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { GuideSection } from '@/data/seo-content';
import { cn } from '@/lib/utils';

/**
 * The direct answer at the top of a page. Answer engines (Google AI Overviews,
 * ChatGPT, Perplexity, Gemini) and featured snippets favour a short,
 * self-contained answer placed high on the page; data-speakable ties it to
 * the SpeakableSpecification in JSON-LD.
 */
export function QuickAnswer({
  question,
  answer,
  className,
}: {
  question: string;
  answer: string;
  className?: string;
}) {
  return (
    <aside
      className={cn('rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:p-7', className)}
      aria-labelledby="quick-answer-heading"
    >
      <p className="eyebrow mb-3">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Quick answer
      </p>
      <h2 id="quick-answer-heading" className="font-display text-lg font-semibold">
        {question}
      </h2>
      <p data-speakable className="mt-3 leading-relaxed text-fg">
        {answer}
      </p>
    </aside>
  );
}

/** Long-form, question-led guide content for search and answer engines. */
export function SeoGuide({
  title,
  sections,
  keywords,
  className,
  accent = 'accent',
}: {
  title: string;
  sections: GuideSection[];
  keywords?: string[];
  className?: string;
  accent?: 'accent' | 'svc';
}) {
  return (
    <div className={cn('grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]', className)}>
      <nav aria-label="Guide contents" className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">In this guide</p>
        <ol className="mt-4 space-y-2.5 border-l border-line pl-4">
          {sections.map((s, i) => (
            <li key={s.heading}>
              <a
                href={`#guide-${i + 1}`}
                className={cn('text-sm leading-snug text-fg-muted transition-colors', accent === 'svc' ? 'hover:text-svc' : 'hover:text-accent')}
              >
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
      <article className="prose-ts max-w-none">
        <h2 className="!mt-0 text-display-sm">{title}</h2>
        {sections.map((s, i) => (
          <section key={s.heading} id={`guide-${i + 1}`} className="scroll-mt-28">
            <h3 className="!text-xl sm:!text-2xl">{s.heading}</h3>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

        {keywords && keywords.length > 0 && (
          <div className="mt-10 border-t border-line pt-6">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">Related searches</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {keywords.map((k) => (
                <li key={k} className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
                  {k}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** Links to the market landing pages, used across service and home pages. */
export function MarketLinks({
  markets,
  serviceName,
}: {
  markets: { slug: string; name: string; flag: string }[];
  serviceName?: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {markets.map((m) => (
        <li key={m.slug}>
          <Link
            href={`/markets/${m.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elev px-3.5 py-2 text-sm text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <span aria-hidden>{m.flag}</span>
            {serviceName ? `${serviceName} in ${m.name}` : m.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
