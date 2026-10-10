import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/chat/admin-auth';
import { getLead, getMessages, otherLeadsForEmail } from '@/lib/chat/store';

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const lead = await getLead(decodeURIComponent(id));
  if (!lead) notFound();
  const [messages, earlier] = await Promise.all([getMessages(lead.id), otherLeadsForEmail(lead.email, lead.id)]);
  const p = lead.profile;
  const rows: [string, string][] = [
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Company', lead.company],
    ['Website', lead.website],
    ['Started on', `${lead.sourcePage} · ${lead.createdAt.slice(0, 16).replace('T', ' ')} UTC`],
    ['Privacy acknowledged', lead.privacyAck ? 'Yes' : 'No'],
    ['Marketing consent', lead.marketingConsent ? 'Yes' : 'No'],
    ['Services', p.services?.join(', ') ?? ''],
    ['Budget', p.budget ?? ''],
    ['Timeline', p.timeline ?? ''],
    ['Requirements', p.requirements ?? ''],
    ['Recommended', p.recommended ?? ''],
    ['Language', p.language ?? ''],
    ['Transcript emailed', `${lead.emailedCount} of ${messages.length} messages`],
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div>
        <Link href="/admin/leads" className="text-sm text-accent">
          ← All leads
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold">{lead.name}</h1>
        <p className="text-sm text-fg-muted">
          {lead.id}
          {lead.needsHuman && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">asked for a person</span>}
        </p>
        <dl className="mt-5 space-y-2 text-sm">
          {rows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-fg-subtle">{k}</dt>
                <dd className="whitespace-pre-wrap">{v}</dd>
              </div>
            ))}
        </dl>
        {earlier.length > 0 && (
          <p className="mt-5 text-sm">
            Earlier chats from this email:{' '}
            {earlier.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="mr-2 text-accent">
                {l.id}
              </Link>
            ))}
          </p>
        )}
        <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your enquiry ${lead.id}`)}`} className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
          Reply by email
        </a>
      </div>
      <div className="space-y-3 rounded-2xl border border-line p-5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'ml-auto max-w-[80%]' : 'max-w-[80%]'}>
            <p className="text-xs text-fg-subtle">
              {m.role === 'user' ? lead.name : 'Assistant'} · {m.createdAt.slice(0, 16).replace('T', ' ')}
            </p>
            <p dir="auto" className={`mt-1 whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-accent/10' : 'bg-bg-soft'}`}>
              {m.content}
            </p>
          </div>
        ))}
        {!messages.length && <p className="text-sm text-fg-muted">No messages yet.</p>}
      </div>
    </div>
  );
}
