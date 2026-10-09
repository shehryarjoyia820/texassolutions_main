'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Web3Forms' free hCaptcha integration.
 *
 * https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha
 * The Web3Forms client script finds `<div class="h-captcha" data-captcha="true">`
 * and loads hCaptcha with Web3Forms' shared free site key. Because it only scans
 * the page once, widgets that mount later (React re-renders, the booking form
 * that appears after a time is picked) are rendered explicitly here with the
 * same site key. hCaptcha writes its token into a `h-captcha-response` field
 * inside the widget, which the form reads on submit.
 *
 * The owner must also select hCaptcha under the form's spam settings in the
 * Web3Forms dashboard, otherwise the token is simply ignored.
 */

export const WEB3FORMS_CLIENT_SCRIPT = 'https://web3forms.com/client/script.js';
const HCAPTCHA_API = 'https://js.hcaptcha.com/1/api.js?recaptchacompat=off';
/** Web3Forms' public free-plan hCaptcha site key (from their docs and client script). */
export const WEB3FORMS_HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
/** How long to wait for the widget before letting the visitor send without it. */
const LOAD_TIMEOUT_MS = 12000;

export type CaptchaStatus = 'loading' | 'ready' | 'failed';

interface HCaptchaApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove?: (id?: string) => void;
  getResponse: (id?: string) => string;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.addEventListener('load', () => {
      s.dataset.loaded = 'true';
      resolve();
    });
    s.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
    document.body.appendChild(s);
  });
}

/** Loads the Web3Forms client script once, plus hCaptcha's API if that script did not. */
function loadCaptchaScripts(): Promise<void> {
  if (!scriptPromise) {
    scriptPromise = injectScript(WEB3FORMS_CLIENT_SCRIPT)
      .then(() => {
        if (!document.querySelector('script[src*="hcaptcha.com"]')) return injectScript(HCAPTCHA_API);
      })
      .catch((err) => {
        scriptPromise = null; // allow a retry on the next mount
        throw err;
      });
  }
  return scriptPromise;
}

function waitForApi(timeoutMs: number): Promise<HCaptchaApi> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (window.hcaptcha?.render) return resolve(window.hcaptcha);
      if (Date.now() - started > timeoutMs) return reject(new Error('hCaptcha did not load'));
      window.setTimeout(tick, 200);
    };
    tick();
  });
}

export function useHCaptcha(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [status, setStatus] = useState<CaptchaStatus>('loading');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const started = Date.now();

    loadCaptchaScripts()
      .then(() => waitForApi(Math.max(1000, LOAD_TIMEOUT_MS - (Date.now() - started))))
      .then((api) => {
        const el = containerRef.current;
        if (cancelled || !el) return;
        // Give hCaptcha's own auto-render a moment, then render explicitly if it skipped us.
        window.setTimeout(() => {
          if (cancelled || !containerRef.current) return;
          if (!el.querySelector('iframe')) {
            try {
              widgetId.current = api.render(el, {
                sitekey: el.dataset.sitekey || WEB3FORMS_HCAPTCHA_SITEKEY,
                'error-callback': () => setStatus('failed'),
              });
            } catch {
              setStatus('failed');
              return;
            }
          } else {
            widgetId.current = el.querySelector('iframe')?.getAttribute('data-hcaptcha-widget-id') ?? null;
          }
          setStatus('ready');
        }, 300);
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      });

    return () => {
      cancelled = true;
      if (widgetId.current && window.hcaptcha?.remove) {
        try {
          window.hcaptcha.remove(widgetId.current);
        } catch {
          /* widget already gone */
        }
      }
      widgetId.current = null;
    };
  }, [enabled]);

  /** Clears a used or expired token so the visitor can solve a fresh challenge. */
  const reset = useCallback(() => {
    try {
      window.hcaptcha?.reset(widgetId.current ?? undefined);
    } catch {
      /* nothing to reset */
    }
  }, []);

  return { containerRef, status, reset };
}
