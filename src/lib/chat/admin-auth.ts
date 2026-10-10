import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Admin sign-in for /admin. Set ADMIN_PASSWORD in the Vercel project settings
 * (and optionally ADMIN_SESSION_SECRET). Without ADMIN_PASSWORD the admin is closed.
 */

const COOKIE = 'ts_admin';
const TTL_MS = 12 * 60 * 60_000;
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(input: string) {
  const want = process.env.ADMIN_PASSWORD || '';
  if (!want) return false;
  const a = createHmac('sha256', 'cmp').update(input).digest();
  const b = createHmac('sha256', 'cmp').update(want).digest();
  return timingSafeEqual(a, b);
}

export async function startSession() {
  const exp = String(Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: TTL_MS / 1000 });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? '';
  const [exp, sig] = v.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const want = sign(exp);
  return sig.length === want.length && timingSafeEqual(Buffer.from(sig), Buffer.from(want));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin');
}
