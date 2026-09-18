/**
 * Thin wrapper over GA4 / Tag Manager. Every call is a no-op until the
 * measurement IDs are set and cookie consent has been granted, so nothing
 * fires before the visitor agrees.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = 'ts-cookie-consent';

export type ConsentState = 'granted' | 'denied' | null;

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(state: Exclude<ConsentState, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, state);
  } catch {
    /* storage unavailable, analytics simply stays off */
  }
  window.dispatchEvent(new CustomEvent('ts-consent-change', { detail: state }));
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: state === 'granted' ? 'granted' : 'denied',
      ad_storage: state === 'granted' ? 'granted' : 'denied',
      ad_user_data: state === 'granted' ? 'granted' : 'denied',
      ad_personalization: state === 'granted' ? 'granted' : 'denied',
    });
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  if (getConsent() !== 'granted') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  if (window.gtag) window.gtag('event', event, params);
}

/** One event per calculator step so drop-off is measurable. Spec section 7. */
export function trackEstimateStep(step: number, name: string, params: Params = {}) {
  track('estimate_step', { step, step_name: name, ...params });
}

export function trackFormSubmit(form: string, params: Params = {}) {
  track('form_submit', { form_name: form, ...params });
}

export function trackRegionChange(region: string) {
  track('region_change', { region });
}

export function trackCta(label: string, location: string) {
  track('cta_click', { cta_label: label, cta_location: location });
}
