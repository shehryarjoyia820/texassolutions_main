import { NextResponse } from 'next/server';
import type { ChatMessage, Lead } from './store';

/** texassolutions.co is static (GitHub Pages), so the widget calls these routes cross-origin on Vercel. */
const ALLOWED_ORIGINS = [
  'https://texassolutions.co',
  'https://www.texassolutions.co',
  'https://shehryarjoyia820.github.io',
  'http://localhost:3000',
  'http://localhost:3100',
];

export function cors(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '';
  const ok = ALLOWED_ORIGINS.includes(origin) || /^https:\/\/texassolutions-main[a-z0-9-]*\.vercel\.app$/.test(origin);
  return ok
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      }
    : { Vary: 'Origin' };
}

export const preflight = (request: Request) => new NextResponse(null, { status: 204, headers: cors(request) });

export function json(request: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { ...cors(request), 'Cache-Control': 'no-store' } });
}

const hits = new Map<string, { count: number; resetAt: number }>();
/** Per-instance limiter; enough to stop a script hammering the AI key from one address. */
export function rateLimited(request: Request, bucket: string, max: number, windowMs: number) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  h.count += 1;
  return h.count > max;
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (text.length > 20_000) return {};
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export const field = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export function leadSummary(lead: Lead) {
  const p = lead.profile;
  return [
    `Lead ID: ${lead.id}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone && `Phone: ${lead.phone}`,
    lead.company && `Company: ${lead.company}`,
    lead.website && `Website: ${lead.website}`,
    `Started on: ${lead.sourcePage || 'unknown'} at ${lead.createdAt}`,
    `Privacy notice acknowledged: ${lead.privacyAck ? 'yes' : 'no'}`,
    `Marketing consent: ${lead.marketingConsent ? 'yes' : 'no'}`,
    p.services?.length && `Services: ${p.services.join(', ')}`,
    p.budget && `Budget: ${p.budget}`,
    p.timeline && `Timeline: ${p.timeline}`,
    p.requirements && `Requirements: ${p.requirements}`,
    p.recommended && `Recommended: ${p.recommended}`,
    p.language && `Language: ${p.language}`,
    lead.needsHuman && 'ASKED FOR A PERSON / FORMAL QUOTE - please follow up',
  ]
    .filter(Boolean)
    .join('\n');
}

export function transcriptText(lead: Lead, messages: ChatMessage[]) {
  const lines = messages.map((m) => `[${m.createdAt.slice(0, 16).replace('T', ' ')} UTC] ${m.role === 'user' ? lead.name : 'Assistant'}: ${m.content}`);
  return `${leadSummary(lead)}\n\n--- Conversation ---\n${lines.join('\n\n')}`;
}

/**
 * Optional server-side email through Resend. Without RESEND_API_KEY the widget
 * sends the email from the browser through Web3Forms instead (the same inbox
 * every website form uses), so this returns false.
 */
export async function serverEmail(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Texas Solutions <noreply@texassolutions.co>',
        to: [process.env.NOTIFY_EMAIL || 'info@texassolutions.co'],
        reply_to: replyTo,
        subject,
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
