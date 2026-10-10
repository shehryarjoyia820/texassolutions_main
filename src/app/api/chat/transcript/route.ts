import { authLead, getLead, getMessages, setEmailedCount } from '@/lib/chat/store';
import { field, json, preflight, readJson, serverEmail, transcriptText } from '@/lib/chat/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const OPTIONS = preflight;

/**
 * Called when a chat ends or the visitor leaves the page.
 * - With RESEND_API_KEY, the server emails the transcript itself.
 * - Otherwise it returns the transcript for the widget to send through
 *   Web3Forms, and the widget confirms with { ack: count } once sent.
 * Only sends when there are messages not yet emailed.
 */
export async function POST(request: Request) {
  const b = await readJson(request);
  const auth = await authLead(field(b.leadId, 40), field(b.token, 80));
  if (!auth) return json(request, { expired: true }, 401);

  if (typeof b.ack === 'number') {
    await setEmailedCount(auth.id, Math.floor(b.ack));
    return json(request, { ok: true });
  }

  const lead = (await getLead(auth.id))!;
  const messages = await getMessages(lead.id);
  if (messages.length === 0 || messages.length <= lead.emailedCount) return json(request, { send: false });

  const subject = `Chat transcript ${lead.id}: ${lead.name}${lead.needsHuman ? ' (follow-up requested)' : ''}`;
  const text = transcriptText(lead, messages);
  if (await serverEmail(subject, text, lead.email)) {
    await setEmailedCount(lead.id, messages.length);
    return json(request, { send: false, emailed: true });
  }
  return json(request, { send: true, count: messages.length, subject, text, replyTo: lead.email });
}
