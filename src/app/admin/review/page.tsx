import Link from 'next/link';
import { requireAdmin } from '@/lib/chat/admin-auth';
import { listFlags } from '@/lib/chat/store';
import { resolve } from '../actions';

const LABEL = {
  conflict: 'Conflicting information',
  incomplete: 'Incomplete item',
  unanswered: 'Question the assistant could not answer',
  handoff: 'Visitor asked for a person or quote',
};

export default async function ReviewPage() {
  await requireAdmin();
  const flags = await listFlags();
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Review</h1>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        Knowledge conflicts, incomplete items, unanswered questions and hand-off requests. Add missing answers as knowledge items, then resolve.
      </p>
      <ul className="mt-6 space-y-3">
        {flags.map((f) => {
          const href = f.ref.startsWith('TS-') ? `/admin/leads/${f.ref}` : `/admin/knowledge/${encodeURIComponent(f.ref)}`;
          return (
            <li key={f.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-line p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{LABEL[f.kind]}</p>
                <p dir="auto" className="mt-1 text-sm">{f.detail}</p>
                <p className="mt-1 text-xs text-fg-subtle">
                  <Link href={href} className="text-accent">
                    {f.ref}
                  </Link>{' '}
                  · {f.createdAt.slice(0, 16).replace('T', ' ')} UTC
                </p>
              </div>
              <form action={resolve}>
                <input type="hidden" name="id" value={f.id} />
                <button className="rounded-xl border border-line px-3 py-2 text-sm">Resolve</button>
              </form>
            </li>
          );
        })}
        {!flags.length && <li className="text-sm text-fg-muted">Nothing to review.</li>}
      </ul>
    </div>
  );
}
