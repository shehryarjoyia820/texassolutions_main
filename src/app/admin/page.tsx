import Link from 'next/link';
import { adminConfigured, isAdmin } from '@/lib/chat/admin-auth';
import { aiConfigured, GEMINI_MODEL } from '@/lib/chat/assistant';
import { hasDatabase, listFlags, listKnowledge, listLeads } from '@/lib/chat/store';
import { LoginForm } from './login-form';

export default async function AdminHome() {
  if (!adminConfigured()) {
    return <p className="mx-auto mt-10 max-w-md text-sm text-fg-muted">The admin is closed. Set ADMIN_PASSWORD in the Vercel project settings and redeploy.</p>;
  }
  if (!(await isAdmin())) return <LoginForm />;

  const [leads, kb, flags] = await Promise.all([listLeads(500), listKnowledge(), listFlags()]);
  const today = new Date().toISOString().slice(0, 10);
  const cards = [
    ['Leads today', leads.filter((l) => l.createdAt.startsWith(today)).length, '/admin/leads'],
    ['Leads (all)', leads.length, '/admin/leads'],
    ['Waiting for a person', leads.filter((l) => l.needsHuman).length, '/admin/leads?filter=human'],
    ['Knowledge items', kb.filter((k) => k.status === 'active').length, '/admin/knowledge'],
    ['Flagged items', kb.filter((k) => k.status === 'flagged').length, '/admin/knowledge?status=flagged'],
    ['Open review flags', flags.length, '/admin/review'],
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, n, href]) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-bg-elev p-5 hover:border-accent">
            <p className="text-sm text-fg-muted">{label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{n}</p>
          </Link>
        ))}
      </div>
      <dl className="mt-8 grid gap-2 text-sm sm:grid-cols-[200px_1fr]">
        <dt className="text-fg-muted">AI model</dt>
        <dd>{aiConfigured ? GEMINI_MODEL : 'Not configured (set GEMINI_API_KEY)'}</dd>
        <dt className="text-fg-muted">Database</dt>
        <dd>{hasDatabase ? 'Connected' : 'Not connected (memory only)'}</dd>
        <dt className="text-fg-muted">Email</dt>
        <dd>{process.env.RESEND_API_KEY ? 'Sent by the server (Resend)' : 'Sent from the visitor’s browser via Web3Forms to info@texassolutions.co'}</dd>
      </dl>
    </div>
  );
}
