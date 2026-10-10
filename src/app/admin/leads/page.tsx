import Link from 'next/link';
import { requireAdmin } from '@/lib/chat/admin-auth';
import { listLeads } from '@/lib/chat/store';

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string }> }) {
  await requireAdmin();
  const { filter, q } = await searchParams;
  let leads = await listLeads(500);
  if (filter === 'human') leads = leads.filter((l) => l.needsHuman);
  if (q) {
    const s = q.toLowerCase();
    leads = leads.filter((l) => `${l.id} ${l.name} ${l.email} ${l.company}`.toLowerCase().includes(s));
  }
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Leads</h1>
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search name, email, ID" className="min-h-[40px] rounded-xl border border-line bg-bg px-3 text-sm" />
          <button className="rounded-xl border border-line px-3 text-sm">Search</button>
        </form>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-bg-soft text-xs uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="p-3">Lead</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Interested in</th>
              <th className="p-3">Messages</th>
              <th className="p-3">Started</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-line align-top">
                <td className="p-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-medium text-accent">
                    {l.id}
                  </Link>
                  {l.needsHuman && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">follow up</span>}
                </td>
                <td className="p-3">
                  {l.name}
                  <br />
                  <span className="text-fg-muted">{l.email}</span>
                </td>
                <td className="p-3 text-fg-muted">{l.profile.services?.join(', ') || '-'}</td>
                <td className="p-3">{l.messageCount}</td>
                <td className="p-3 text-fg-muted">{l.createdAt.slice(0, 16).replace('T', ' ')} UTC</td>
              </tr>
            ))}
            {!leads.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-fg-muted">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
