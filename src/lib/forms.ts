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

  const attribution = payload.attribution ?? captureAttribution();

  // Preferred path: Web3Forms emails the submission straight to info@texassolutions.co.
  if (WEB3FORMS_KEY) return submitToWeb3Forms(payload, attribution);

  const body = JSON.stringify({
    ...payload,
    attribution,
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

/**
 * Web3Forms access key. It is created for info@texassolutions.co at
 * https://web3forms.com and is meant to be public (it can only send mail to
 * that one inbox). Leave it empty to fall back to FORM_ENDPOINT.
 */
export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

const FORM_TITLES: Record<FormName, string> = {
  contact: 'Contact form',
  estimate: 'Rough estimate',
  newsletter: 'Newsletter signup',
  'job-application': 'Job application',
  'investor-enquiry': 'Investor enquiry',
  'media-kit': 'Media kit request',
  'gated-download': 'Download request',
  'marketplace-enquiry': 'Marketplace enquiry',
  booking: 'Consultation booking',
};

function flatten(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 1);
  return String(value);
}

async function submitToWeb3Forms(payload: SubmitPayload, attribution: Record<string, string>): Promise<SubmitResult> {
  const f = payload.fields;
  const name = flatten(f.name || f.fullName || '');
  const data: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject: `${FORM_TITLES[payload.form] ?? 'Website form'}${name ? ` from ${name}` : ''} | texassolutions.co`,
    from_name: 'Texas Solutions website',
    form: FORM_TITLES[payload.form] ?? payload.form,
    submitted_at: new Date().toISOString(),
  };
  if (typeof f.email === 'string' && f.email) data.replyto = f.email;
  for (const [k, v] of Object.entries(f)) {
    if (k === HONEYPOT_FIELD) continue;
    const text = flatten(v);
    if (text) data[k] = text;
  }
  for (const [k, v] of Object.entries(attribution)) data[`source_${k}`] = v;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!res.ok || !json.success) {
      return { ok: false, message: 'We could not send that. Please call us or email info@texassolutions.co.', fallback: true };
    }
    trackFormSubmit(payload.form);
    return { ok: true, message: 'Thank you. We will be in touch shortly.' };
  } catch {
    return { ok: false, message: 'We could not reach the server. Please call us or email info@texassolutions.co.', fallback: true };
  }
}

export const CONSENT_WORDING =
  'By submitting this form you agree to be contacted about your enquiry by phone, text message and email. Message and data rates may apply. Consent is not a condition of purchase and you can opt out at any time.';

export const PRIVACY_WORDING =
  'We use the details you provide to respond to your enquiry and, where you have agreed, to send occasional updates. See our privacy policy for how we store and delete this data.';
