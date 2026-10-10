import { askAssistant, aiConfigured } from '@/lib/chat/assistant';
import { activeKnowledge, addFlag, addMessage, authLead, getMessages, updateLeadAfterTurn, userMessagesToday } from '@/lib/chat/store';
import { field, json, preflight, rateLimited, readJson } from '@/lib/chat/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const OPTIONS = preflight;

const DAILY_LIMIT = 60;

export async function POST(request: Request) {
  if (!aiConfigured) return json(request, { error: 'The assistant is not available right now.' }, 503);
  if (rateLimited(request, 'msg', 15, 60_000)) return json(request, { error: 'You are sending messages very quickly. Please wait a moment.' }, 429);

  const b = await readJson(request);
  const lead = await authLead(field(b.leadId, 40), field(b.token, 80));
  if (!lead) return json(request, { error: 'Your chat session has expired. Please start a new chat.', expired: true }, 401);

  const text = field(b.message, 2000);
  if (!text) return json(request, { error: 'Please type a message.' }, 422);
  if ((await userMessagesToday(lead.id)) >= DAILY_LIMIT) {
    return json(request, { error: 'This chat has reached its daily limit. The team has your details and will follow up by email.' }, 429);
  }

  const alreadyHandedOff = lead.needsHuman;
  await addMessage(lead.id, 'user', text);
  const history = await getMessages(lead.id);

  try {
    const r = await askAssistant({ lead, history, knowledge: await activeKnowledge(), page: field(b.page, 200) });
    await addMessage(lead.id, 'assistant', r.reply);
    await updateLeadAfterTurn(lead.id, r.profile, r.needsHuman);
    if (r.unansweredQuestion) await addFlag('unanswered', lead.id, r.unansweredQuestion);
    if (r.needsHuman && !alreadyHandedOff) await addFlag('handoff', lead.id, `Asked for a person or formal quote: "${text.slice(0, 300)}"`);
    return json(request, { reply: r.reply, links: r.links, suggestions: r.suggestions, needsHuman: r.needsHuman });
  } catch (e) {
    console.error('[chat] assistant failed', e);
    const fallback =
      'Sorry, I am having trouble answering right now. Your message is saved and the team will reply by email within one business day. You can also call (838) 910-3147.';
    await addMessage(lead.id, 'assistant', fallback);
    await addFlag('unanswered', lead.id, `Assistant error on: "${text.slice(0, 300)}"`);
    return json(request, { reply: fallback, links: [{ label: 'Contact us', href: '/contact' }], suggestions: [], needsHuman: true });
  }
}
