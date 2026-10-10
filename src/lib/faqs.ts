type Faq = { q: string; a: string };

const STOP = new Set(
  'a an the do does we you your our is are of to for in on and or what how can who which with it this that us much'.split(' '),
);
const words = (q: string) => new Set(q.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w && !STOP.has(w)));

/** Service FAQs first, then search-guide FAQs that do not repeat a question already asked. */
export function mergeFaqs(primary: Faq[], extra: Faq[] = []): Faq[] {
  const seen = primary.map((f) => words(f.q));
  const fresh = extra.filter((f) => {
    const w = words(f.q);
    return !seen.some((s) => {
      const shared = [...w].filter((x) => s.has(x)).length;
      return shared / Math.min(w.size, s.size) >= 0.6;
    });
  });
  return [...primary, ...fresh];
}
