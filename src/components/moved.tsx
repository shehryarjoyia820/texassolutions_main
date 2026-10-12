/**
 * A page that has been retired. Static hosting (GitHub Pages) cannot send a
 * 301, so the old URL renders a page with a canonical link that forwards immediately.
 */
export function MovedPage({ to, label }: { to: string; label: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <h1 className="font-display text-2xl font-semibold">This page has moved</h1>
      <p className="mt-3 text-fg-muted">
        This page has moved. Continue to <a className="text-accent underline" href={to}>{label}</a>.
      </p>
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(to)})` }} />
    </div>
  );
}
