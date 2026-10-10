'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Loader2, MessageCircle, X } from 'lucide-react';
import { WEB3FORMS_KEY } from '@/lib/forms';
import { cn } from '@/lib/utils';

/**
 * Website assistant. The site itself is static, so the widget talks to the
 * chat API on the Vercel deployment. The launcher only appears once
 * /api/chat/status reports the assistant is configured.
 */

const VERCEL_ORIGIN = 'https://texassolutions-main.vercel.app';
function apiBase() {
  if (process.env.NEXT_PUBLIC_CHAT_API) return process.env.NEXT_PUBLIC_CHAT_API;
  if (typeof window === 'undefined') return '';
  const h = window.location.hostname;
  return h === 'localhost' || h.endsWith('.vercel.app') ? '' : VERCEL_ORIGIN;
}

const STORE_KEY = 'ts_chat_session';
interface Session {
  leadId: string;
  token: string;
  name: string;
}
interface Msg {
  role: 'user' | 'assistant';
  content: string;
  links?: { label: string; href: string }[];
}

function loadSession(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    return s?.leadId && s?.token ? s : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(STORE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* storage blocked: the chat still works for this page view */
  }
}

async function post<T>(path: string, body: unknown, keepalive = false): Promise<{ status: number; data: T }> {
  const res = await fetch(`${apiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive,
  });
  return { status: res.status, data: (await res.json().catch(() => ({}))) as T };
}

/** Same inbox and service as every website form. */
function web3forms(subject: string, text: string, replyTo: string, keepalive = false) {
  // Local development never emails the real inbox.
  if (window.location.hostname === 'localhost') {
    console.info('[chat] email skipped on localhost:', subject);
    return Promise.resolve(true);
  }
  return fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: 'Texas Solutions website chatbot', email: replyTo, replyto: replyTo, message: text }),
    keepalive,
  }).then((r) => r.ok);
}

async function sendTranscript(s: Session, keepalive = false) {
  try {
    const { data } = await post<{ send?: boolean; count?: number; subject?: string; text?: string; replyTo?: string }>(
      '/api/chat/transcript',
      { leadId: s.leadId, token: s.token },
      keepalive,
    );
    if (data.send && data.subject && data.text && (await web3forms(data.subject, data.text, data.replyTo ?? '', keepalive))) {
      await post('/api/chat/transcript', { leadId: s.leadId, token: s.token, ack: data.count }, keepalive);
    }
  } catch {
    /* best effort; the transcript is always in the admin page */
  }
}

const STARTERS = ['What services do you offer?', 'Compare your development packages', 'Website banwane ka kitna kharcha hai?'];

export function ChatWidget() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(STARTERS);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [cookieBar, setCookieBar] = useState(false);

  // Sit above the cookie bar while it is on screen.
  useEffect(() => {
    const check = () => setCookieBar(Boolean(document.querySelector('[aria-label="Cookie preferences"]')));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // Ask the API whether the assistant is configured, after the page is idle.
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const run = () =>
      fetch(`${apiBase()}/api/chat/status`)
        .then((r) => r.json())
        .then((d) => setEnabled(Boolean(d.enabled)))
        .catch(() => setEnabled(false));
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const t = w.requestIdleCallback ? w.requestIdleCallback(run) : window.setTimeout(run, 1500);
    setSession(loadSession());
    return () => {
      if (!w.requestIdleCallback) clearTimeout(t);
    };
  }, [pathname]);

  // Resume an existing chat in this browser.
  useEffect(() => {
    if (!open || !session || messages.length) return;
    post<{ messages?: Msg[]; expired?: boolean }>('/api/chat/history', session).then(({ data }) => {
      if (data.expired) {
        saveSession(null);
        setSession(null);
      } else if (data.messages?.length) {
        setMessages(data.messages);
        setSuggestions([]);
      }
    });
  }, [open, session, messages.length]);

  // Email the transcript when the visitor leaves the page.
  useEffect(() => {
    if (!session) return;
    const onHide = () => {
      if (document.visibilityState === 'hidden') sendTranscript(session, true);
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [session]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || !session || busy) return;
      setInput('');
      setNotice('');
      setSuggestions([]);
      setMessages((m) => [...m, { role: 'user', content: t }]);
      setBusy(true);
      try {
        const { status, data } = await post<{ reply?: string; links?: Msg['links']; suggestions?: string[]; error?: string; expired?: boolean }>(
          '/api/chat/message',
          { ...session, message: t, page: pathname },
        );
        if (data.expired) {
          saveSession(null);
          setSession(null);
          setMessages([]);
          return;
        }
        if (status >= 400 || !data.reply) {
          setNotice(data.error || 'Something went wrong. Please try again.');
          return;
        }
        setMessages((m) => [...m, { role: 'assistant', content: data.reply!, links: data.links }]);
        setSuggestions(data.suggestions ?? []);
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => sendTranscript(session), 4 * 60_000);
      } catch {
        setNotice('Could not reach the assistant. Check your connection and try again.');
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [session, busy, pathname],
  );

  const endChat = async () => {
    if (!session) return;
    clearTimeout(idleTimer.current);
    setBusy(true);
    await sendTranscript(session);
    setBusy(false);
    saveSession(null);
    setSession(null);
    setMessages([]);
    setSuggestions(STARTERS);
    setNotice('Chat ended. A copy has been sent to the Texas Solutions team, who will follow up by email.');
  };

  if (!enabled) return null;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'fixed right-4 z-[70] inline-flex min-h-[48px] items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lift transition-[transform,bottom] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-6',
            cookieBar ? 'bottom-[132px] sm:bottom-[84px]' : 'bottom-4 sm:bottom-6',
          )}
          aria-haspopup="dialog"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Ask our assistant
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Texas Solutions assistant"
          className={cn(
            'fixed inset-x-2 top-[84px] z-[70] flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-elev shadow-lift sm:inset-x-auto sm:right-6 sm:top-auto sm:w-[400px]',
            cookieBar
              ? 'bottom-[132px] sm:bottom-[84px] sm:h-[min(600px,calc(100vh-180px))]'
              : 'bottom-2 sm:bottom-6 sm:h-[min(640px,calc(100vh-120px))]',
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">Texas Solutions assistant</p>
              <p className="text-xs text-fg-subtle">AI assistant · English, <bdi>اردو</bdi>, Roman Urdu</p>
            </div>
            <div className="flex items-center gap-1">
              {session && (
                <button type="button" onClick={endChat} disabled={busy} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-fg-muted hover:bg-bg-soft hover:text-fg">
                  End chat
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                className="grid h-10 w-10 place-items-center rounded-lg text-fg-muted hover:bg-bg-soft hover:text-fg"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          {!session ? (
            <LeadForm
              notice={notice}
              onDone={(s) => {
                saveSession(s);
                setSession(s);
                setNotice('');
                setMessages([
                  {
                    role: 'assistant',
                    content: `Hi ${s.name.split(' ')[0]}, I'm the Texas Solutions AI assistant. Ask me about any service, our prices and packages, or tell me what you need built. Aap Urdu ya Roman Urdu mein bhi pooch sakte hain.`,
                  },
                ]);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            />
          ) : (
            <>
              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                    <div
                      dir="auto"
                      className={cn(
                        'max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        m.role === 'user' ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md bg-bg-soft text-fg',
                      )}
                    >
                      {m.content}
                    </div>
                    {m.links && m.links.length > 0 && (
                      <div className="mt-1.5 flex max-w-[88%] flex-wrap gap-1.5">
                        {m.links.map((l) => (
                          <Link key={l.href} href={l.href} className="rounded-full border border-accent/40 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/10">
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 text-xs text-fg-subtle">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Thinking…
                  </div>
                )}
                {notice && <p className="rounded-lg bg-bg-soft px-3 py-2 text-xs text-fg-muted">{notice}</p>}
              </div>

              {suggestions.length > 0 && !busy && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                  {suggestions.map((s) => (
                    <button key={s} type="button" dir="auto" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-muted hover:border-accent hover:text-accent">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="flex items-end gap-2 border-t border-line p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <label htmlFor="ts-chat-input" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="ts-chat-input"
                  ref={inputRef}
                  dir="auto"
                  rows={1}
                  maxLength={2000}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Type your question…"
                  className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
                <button type="submit" disabled={busy || !input.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white disabled:opacity-40" aria-label="Send message">
                  <ArrowUp className="h-5 w-5" aria-hidden />
                </button>
              </form>
              <p className="px-4 pb-3 text-[11px] leading-snug text-fg-subtle">
                AI answers can be wrong. Prices are published rates or rough estimates; final pricing is confirmed in writing. Need a person?{' '}
                <Link href="/contact" className="underline underline-offset-2">
                  Contact us
                </Link>
                .
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}

function LeadForm({ onDone, notice }: { onDone: (s: Session) => void; notice: string }) {
  const pathname = usePathname();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get('name') || ''),
      email: String(f.get('email') || ''),
      phone: String(f.get('phone') || ''),
      company: String(f.get('company') || ''),
      website: String(f.get('website') || ''),
      privacyAck: f.get('privacyAck') === 'on',
      marketingConsent: f.get('marketingConsent') === 'on',
      company_website: String(f.get('company_website') || ''),
      page: pathname,
    };
    const local: Record<string, string> = {};
    if (body.name.trim().length < 2) local.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email.trim())) local.email = 'Please enter a valid email address.';
    if (!body.privacyAck) local.privacyAck = 'Please confirm you have read the privacy notice.';
    setErrors(local);
    if (Object.keys(local).length) return;

    setBusy(true);
    setFailure('');
    try {
      const { status, data } = await post<{ leadId?: string; token?: string; errors?: Record<string, string>; error?: string; email?: { subject: string; text: string } | null }>(
        '/api/chat/lead',
        body,
      );
      if (status === 422 && data.errors) return setErrors(data.errors);
      if (!data.leadId || !data.token) return setFailure(data.error || 'Could not start the chat. Please try again.');
      if (data.email) web3forms(data.email.subject, data.email.text, body.email.trim()).catch(() => undefined);
      onDone({ leadId: data.leadId, token: data.token, name: body.name.trim() });
    } catch {
      setFailure('Could not reach the assistant. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const input = 'mt-1 block min-h-[44px] w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent';
  return (
    <form onSubmit={submit} noValidate className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
      {notice && <p className="rounded-lg bg-bg-soft px-3 py-2 text-xs text-fg-muted">{notice}</p>}
      <p className="text-fg-muted">Tell us who you are and the assistant will answer questions about our services, prices and packages.</p>
      <div>
        <label htmlFor="ts-chat-name" className="font-medium">
          Full name <span className="text-accent">*</span>
        </label>
        <input id="ts-chat-name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ts-chat-name-err' : undefined} className={input} />
        {errors.name && <p id="ts-chat-name-err" className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="ts-chat-email" className="font-medium">
          Email <span className="text-accent">*</span>
        </label>
        <input id="ts-chat-email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ts-chat-email-err' : undefined} className={input} />
        {errors.email && <p id="ts-chat-email-err" className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <details className="rounded-xl border border-line px-3 py-2">
        <summary className="cursor-pointer text-xs font-medium text-fg-muted">Phone, company and website (optional)</summary>
        <div className="mt-2 space-y-2">
          <div>
            <label htmlFor="ts-chat-phone" className="text-xs">Phone</label>
            <input id="ts-chat-phone" name="phone" type="tel" autoComplete="tel" className={input} />
          </div>
          <div>
            <label htmlFor="ts-chat-company" className="text-xs">Company</label>
            <input id="ts-chat-company" name="company" autoComplete="organization" className={input} />
          </div>
          <div>
            <label htmlFor="ts-chat-website" className="text-xs">Website</label>
            <input id="ts-chat-website" name="website" type="url" inputMode="url" placeholder="https://" className={input} />
          </div>
        </div>
      </details>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="rounded-xl bg-bg-soft p-3 text-xs leading-relaxed text-fg-muted">
        This is an <strong className="text-fg">AI assistant</strong>, not a person. Your details and the conversation are stored and shared with the
        Texas Solutions team so we can follow up, and messages are processed by our AI provider (Google Gemini). Please do not share passwords or
        payment details. See our{' '}
        <Link href="/privacy#chat-assistant" className="text-accent underline underline-offset-2">
          privacy policy
        </Link>
        .
      </div>
      <label className="flex items-start gap-2.5 text-xs">
        <input type="checkbox" name="privacyAck" className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]" aria-invalid={!!errors.privacyAck} />
        <span>
          I have read the privacy notice and understand my enquiry is stored and shared with Texas Solutions. <span className="text-accent">*</span>
        </span>
      </label>
      {errors.privacyAck && <p className="-mt-1 text-xs text-red-600">{errors.privacyAck}</p>}
      <label className="flex items-start gap-2.5 text-xs">
        <input type="checkbox" name="marketingConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]" />
        <span>Optional: send me occasional emails about services and offers. You can unsubscribe at any time.</span>
      </label>
      {failure && <p className="text-xs text-red-600">{failure}</p>}
      <button type="submit" disabled={busy} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-semibold text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Start chat
      </button>
    </form>
  );
}
