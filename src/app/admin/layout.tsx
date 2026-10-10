import Link from 'next/link';
import type { Metadata } from 'next';
import { isAdmin } from '@/lib/chat/admin-auth';
import { hasDatabase } from '@/lib/chat/store';
import { logout } from './actions';

export const metadata: Metadata = { title: 'Chatbot admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="container-x py-10">
      {authed && (
        <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-sm">
          <span className="mr-3 font-display font-semibold">Chatbot admin</span>
          {[
            ['/admin', 'Overview'],
            ['/admin/leads', 'Leads'],
            ['/admin/knowledge', 'Knowledge'],
            ['/admin/review', 'Review'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-fg-muted hover:bg-bg-soft hover:text-fg">
              {label}
            </Link>
          ))}
          <form action={logout} className="ml-auto">
            <button className="rounded-lg px-3 py-2 text-fg-muted hover:bg-bg-soft">Sign out</button>
          </form>
        </nav>
      )}
      {authed && !hasDatabase && (
        <p className="mb-6 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm">
          No database is connected (DATABASE_URL is not set), so leads and edits are kept in memory and lost on restart.
        </p>
      )}
      {children}
    </div>
  );
}
