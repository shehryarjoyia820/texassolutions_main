import { authLead, getMessages } from '@/lib/chat/store';
import { field, json, preflight, readJson } from '@/lib/chat/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const OPTIONS = preflight;

/** Resumes a chat in the same browser. Requires the token issued at lead creation. */
export async function POST(request: Request) {
  const b = await readJson(request);
  const lead = await authLead(field(b.leadId, 40), field(b.token, 80));
  if (!lead) return json(request, { expired: true }, 401);
  const messages = (await getMessages(lead.id)).map((m) => ({ role: m.role, content: m.content }));
  return json(request, { name: lead.name, messages });
}
