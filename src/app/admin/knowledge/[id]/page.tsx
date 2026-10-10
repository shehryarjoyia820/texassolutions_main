import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/chat/admin-auth';
import { getKnowledgeItem } from '@/lib/chat/store';
import type { KbItem } from '@/lib/chat/knowledge';
import { saveItem, setStatus } from '../../actions';

const CATEGORIES = ['service', 'pricing', 'faq', 'process', 'policy', 'company', 'example', 'article'];

export default async function KnowledgeItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const item: KbItem | null = decoded === 'new' ? null : await getKnowledgeItem(decoded);
  if (decoded !== 'new' && !item) notFound();
  const editable = !item || item.origin === 'admin';
  const field = 'mt-1 block w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm disabled:opacity-70';

  return (
    <div className="max-w-3xl">
      <Link href="/admin/knowledge" className="text-sm text-accent">
        ← All knowledge
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold">{item ? item.title : 'New knowledge item'}</h1>
      {item && (
        <p className="mt-1 text-sm text-fg-muted">
          {item.origin === 'site' ? 'From the website' : 'Added by admin'} · status <strong>{item.status}</strong> · last updated {item.updatedAt.slice(0, 16).replace('T', ' ')} UTC ·
          source{' '}
          <a href={`https://texassolutions.co${item.sourcePage}`} className="text-accent" target="_blank" rel="noreferrer">
            {item.sourcePage}
          </a>
        </p>
      )}
      {item?.flagReason && <p className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">{item.flagReason}</p>}
      {!editable && (
        <p className="mt-3 rounded-xl bg-bg-soft p-3 text-sm text-fg-muted">
          This item is generated from the website data, so it always matches the published pages and calculators. Change it in the website files and
          deploy; you can disable it here if it should not be used.
        </p>
      )}

      <form action={saveItem} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={item?.id ?? ''} />
        <div>
          <label className="text-sm font-medium" htmlFor="kb-title">Title</label>
          <input id="kb-title" name="title" required defaultValue={item?.title} disabled={!editable} className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium" htmlFor="kb-cat">Category</label>
            <select id="kb-cat" name="category" defaultValue={item?.category ?? 'faq'} disabled={!editable} className={field}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="kb-src">Source page</label>
            <input id="kb-src" name="sourcePage" required placeholder="/services/qa-testing" defaultValue={item?.sourcePage} disabled={!editable} className={field} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="kb-svc">Service slug (optional)</label>
            <input id="kb-svc" name="service" defaultValue={item?.service} disabled={!editable} className={field} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="kb-body">Content</label>
          <textarea id="kb-body" name="body" required rows={16} defaultValue={item?.body} disabled={!editable} className={`${field} font-mono`} />
          {editable && (
            <p className="mt-1 text-xs text-fg-subtle">
              Dollar amounts must match the website price list, or the item is flagged for review and not used until fixed.
            </p>
          )}
        </div>
        {editable && <button className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white">Save</button>}
      </form>

      {item && (
        <form action={setStatus} className="mt-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="status" value={item.status === 'active' ? 'disabled' : 'active'} />
          <button className="rounded-xl border border-line px-4 py-2 text-sm">
            {item.status === 'active' ? 'Disable item' : item.status === 'flagged' ? 'Approve as is and activate' : 'Enable item'}
          </button>
        </form>
      )}
    </div>
  );
}
