import { aiConfigured } from '@/lib/chat/assistant';
import { hasDatabase } from '@/lib/chat/store';
import { json, preflight } from '@/lib/chat/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const OPTIONS = preflight;

/** The widget only shows its launcher when this says the assistant is ready. */
export async function GET(request: Request) {
  const local = process.env.NODE_ENV !== 'production';
  return json(request, { enabled: aiConfigured && (hasDatabase || local), serverEmail: Boolean(process.env.RESEND_API_KEY) });
}
