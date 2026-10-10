import { createLead, getLead, otherLeadsForEmail, setEmailedCount } from '@/lib/chat/store';
import { field, isEmail, json, leadSummary, preflight, rateLimited, readJson, serverEmail } from '@/lib/chat/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const OPTIONS = preflight;

/** Creates the lead before the chat opens. Name, email and the privacy acknowledgement are required. */
export async function POST(request: Request) {
  if (rateLimited(request, 'lead', 6, 60 * 60_000)) return json(request, { error: 'Too many attempts. Please try again later.' }, 429);
  const b = await readJson(request);
  if (field(b.company_website)) return json(request, { error: 'Rejected' }, 400); // honeypot

  const name = field(b.name, 120);
  const email = field(b.email, 160).toLowerCase();
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (!isEmail(email)) errors.email = 'Please enter a valid email address.';
  if (b.privacyAck !== true) errors.privacyAck = 'Please confirm you have read the privacy notice.';
  if (Object.keys(errors).length) return json(request, { errors }, 422);

  const { id, token } = await createLead({
    name,
    email,
    phone: field(b.phone, 40),
    company: field(b.company, 120),
    website: field(b.website, 200),
    privacyAck: true,
    marketingConsent: b.marketingConsent === true,
    sourcePage: field(b.page, 200),
  });

  const lead = (await getLead(id))!;
  const earlier = await otherLeadsForEmail(email, id);
  const subject = `New chatbot lead ${id}: ${name}`;
  const text =
    `${leadSummary(lead)}${earlier.length ? `\nEarlier chats from this email: ${earlier.map((l) => l.id).join(', ')}` : ''}\n\n` +
    'The full conversation is saved in the admin page and emailed when the chat ends.';
  const emailed = await serverEmail(subject, text, email);
  if (emailed) await setEmailedCount(id, 0);

  return json(request, { leadId: id, token, emailed, email: emailed ? null : { subject, text } });
}
