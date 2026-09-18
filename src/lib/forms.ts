import { trackFormSubmit } from './analytics';

/**
 * Every form on the site posts here.
 *
 * On Vercel the default endpoint is the Next.js route handler at /api/submit.
 * On DreamHost shared hosting there is no Node runtime, so the static build
 * ships public/api/submit.php instead and NEXT_PUBLIC_FORM_ENDPOINT points at it.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '/api/submit';

export type FormName =
  | 'contact'
  | 'estimate'
  | 'newsletter'
  | 'job-application'
  | 'investor-enquiry'
  | 'media-kit'
  | 'gated-download'
  | 'marketplace-enquiry'
  | 'booking';

export interface SubmitPayload {
  form: FormName;
  /** Everything the visitor entered. */
  fields: Record<string, unknown>;
  /** Marketing attribution captured from the URL and referrer. */
  attribution?: Record<string, string>;
  /** Anti-spam token from Turnstile or reCAPTCHA, when configured. */
  token?: string;
}

export interface SubmitResult {
  ok: boolean;
  message: string;
  /** True when no backend is configured, so the UI can offer an email fallback. */
  fallback?: boolean;
}

/** Reads UTM parameters and referrer so leads arrive attributed. */
export function captureAttribution(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {
    page: window.location.pathname,
    referrer: document.referrer || 'direct',
  };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

/** Honeypot field name, checked server-side and client-side. */
export const HONEYPOT_FIELD = 'company_website';

export async function submitForm(payload: SubmitPayload): Promise<SubmitResult> {
  // Honeypot: real people never fill this hidden field.
  if (payload.fields[HONEYPOT_FIELD]) {
    return { ok: true, message: 'Thank you.' };
  }

  const body = JSON.stringify({
    ...payload,
    attribution: payload.attribution ?? captureAttribution(),
    submittedAt: new Date().toISOString(),
  });

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!res.ok) {
      return {
        ok: false,
        message: `We could not send that (${res.status}). Please call us or email instead.`,
        fallback: true,
      };
    }

    trackFormSubmit(payload.form);
    return { ok: true, message: 'Thank you. We will be in touch shortly.' };
  } catch {
    return {
      ok: false,
      message: 'We could not reach the server. Please call us or email instead.',
      fallback: true,
    };
  }
}

export const CONSENT_WORDING =
  'By submitting this form you agree to be contacted about your enquiry by phone, text message and email. Message and data rates may apply. Consent is not a condition of purchase and you can opt out at any time.';

export const PRIVACY_WORDING =
  'We use the details you provide to respond to your enquiry and, where you have agreed, to send occasional updates. See our privacy policy for how we store and delete this data.';
