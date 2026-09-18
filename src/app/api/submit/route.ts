import { NextResponse } from 'next/server';

/**
 * Form endpoint for the Vercel deployment.
 *
 * DreamHost shared hosting has no Node runtime, so the static build ships
 * public/api/submit.php instead and NEXT_PUBLIC_FORM_ENDPOINT points at it.
 * See DEPLOYMENT.md.
 *
 * Configure any of these and they are used; leave them unset and submissions
 * are logged and accepted so the site still works before integrations land.
 *   RESEND_API_KEY        send notification and auto-reply email
 *   NOTIFY_EMAIL          internal recipient, defaults to sales@texassolutions.co
 *   FROM_EMAIL            verified sender address
 *   CRM_WEBHOOK_URL       HubSpot, Zoho or GoHighLevel inbound webhook
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile verification
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HONEYPOT_FIELD = 'company_website';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'sales@texassolutions.co';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Texas Solutions <noreply@texassolutions.co>';

/** Simple in-memory rate limit. Swap for Upstash or KV for multi-instance deploys. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

interface Payload {
  form?: string;
  fields?: Record<string, unknown>;
  attribution?: Record<string, string>;
  token?: string;
  submittedAt?: string;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many submissions. Please wait a minute.' }, { status: 429 });
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { form, fields = {}, attribution = {} } = payload;

  if (!form || typeof form !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing form name.' }, { status: 400 });
  }

  // Honeypot: accept silently so a bot cannot tell it was rejected.
  if (fields[HONEYPOT_FIELD]) {
    return NextResponse.json({ ok: true });
  }

  // Optional bot challenge.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const verified = await verifyTurnstile(payload.token, ip);
    if (!verified) {
      return NextResponse.json({ ok: false, error: 'Verification failed. Please try again.' }, { status: 400 });
    }
  }

  const email = typeof fields.email === 'string' ? fields.email : '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'That email address does not look valid.' }, { status: 400 });
  }

  const record = {
    form,
    fields,
    attribution,
    ip,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? '',
  };

  const results = await Promise.allSettled([
    forwardToCrm(record),
    sendNotification(record),
    email ? sendAutoReply(form, email, fields) : Promise.resolve(),
  ]);

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length) {
    // The submission is still accepted; the operator sees the failure in logs.
    console.error('[submit] integration failures', failures.map((f) => (f as PromiseRejectedResult).reason));
  }

  if (!process.env.CRM_WEBHOOK_URL && !process.env.RESEND_API_KEY) {
    console.warn('[submit] no integrations configured; submission logged only:', JSON.stringify(record));
  }

  return NextResponse.json({ ok: true });
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: token,
    remoteip: ip,
  });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

async function forwardToCrm(record: unknown) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`CRM webhook returned ${res.status}`);
}

async function sendNotification(record: { form: string; fields: Record<string, unknown> }) {
  if (!process.env.RESEND_API_KEY) return;
  const rows = Object.entries(record.fields)
    .filter(([k]) => k !== HONEYPOT_FIELD)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(
      typeof v === 'object' ? JSON.stringify(v) : String(v),
    )}</strong></td></tr>`)
    .join('');

  await resendSend({
    to: NOTIFY_EMAIL,
    subject: `New ${record.form} submission`,
    html: `<h2 style="font-family:sans-serif">New ${escapeHtml(record.form)} submission</h2>
           <table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
  });
}

async function sendAutoReply(form: string, to: string, fields: Record<string, unknown>) {
  if (!process.env.RESEND_API_KEY) return;
  const name = typeof fields.name === 'string' ? fields.name.split(' ')[0] : 'there';
  const subject =
    form === 'estimate'
      ? 'Your rough estimate from Texas Solutions'
      : form === 'booking'
        ? 'Your consultation is booked'
        : 'We received your enquiry';

  await resendSend({
    to,
    subject,
    html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#12182a">
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thanks for getting in touch with Texas Solutions. A named person on the relevant team has your
      message and will reply within four business hours on a working day.</p>
      <p>If it is urgent, call us on (838) 910-3147. The dispatch desk is staffed around the clock.</p>
      <p style="color:#667;font-size:13px">Any figures we have shown you are ranges for guidance only and are
      not a binding quote. Final pricing is confirmed after a consultation.</p>
      <p>Texas Solutions</p>
    </div>`,
  });
}

async function resendSend({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend returned ${res.status}`);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}
