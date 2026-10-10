import Link from 'next/link';
import { requireAdmin } from '@/lib/chat/admin-auth';
import { listKnowledge } from '@/lib/chat/store';

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status, q } = await searchParams;
  let items = await listKnowledge();
  if (status) items = items.filter((i) => i.status === status);
  if (q) {
    const s = q.toLowerCase();
    items = items.filter((i) => `${i.id} ${i.title} ${i.body}`.toLowerCase().includes(s));
  }
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Knowledge</h1>
          <p className="mt-1 max-w-2xl text-sm text-fg-muted">
            Website items are generated from the same data as the website and calculators and refresh on every deploy. To change a price, edit the
            rate card (src/data/rates.ts) so the site and chatbot stay identical. Admin items add approved extra information and take effect within a minute.
          </p>
        </div>
        <Link href="/admin/knowledge/new" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
          Add item
        </Link>
      </div>
      <form className="mt-5 flex flex-wrap gap-2 text-sm">
        <input name="q" defaultValue={q} placeholder="Search" className="min-h-[40px] rounded-xl border border-line bg-bg px-3" />
        <select name="status" defaultValue={status ?? ''} className="min-h-[40px] rounded-xl border border-line bg-bg px-3">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
          <option value="disabled">Disabled</option>
        </select>
        <button className="rounded-xl border border-line px-3">Filter</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-bg-soft text-xs uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Source page</th>
              <th className="p-3">Origin</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-line align-top">
                <td className="p-3">
                  <Link href={`/admin/knowledge/${encodeURIComponent(i.id)}`} className="font-medium text-accent">
                    {i.title}
                  </Link>
                  <p className="text-xs text-fg-subtle">
                    {i.id} · {i.category}
                  </p>
                </td>
                <td className="p-3 text-fg-muted">{i.sourcePage}</td>
                <td className="p-3">{i.origin === 'site' ? 'Website' : 'Admin'}</td>
                <td className="p-3">
                  <span className={i.status === 'active' ? 'text-emerald-600' : i.status === 'flagged' ? 'text-accent' : 'text-fg-subtle'}>{i.status}</span>
                  {i.flagReason && <p className="text-xs text-fg-subtle">{i.flagReason}</p>}
                </td>
                <td className="p-3 text-fg-muted">{i.updatedAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
