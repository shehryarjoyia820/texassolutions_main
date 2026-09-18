import { HEAD_CODES } from '@/config/head-codes';
import { CONSENT_KEY } from '@/lib/analytics';

/**
 * Renders the codes from src/config/head-codes.ts into <head>.
 * Edit that file, not this one.
 *
 * - Verification meta tags are emitted through Next metadata in layout.tsx.
 * - AdSense loads on every page (needed for approval and ads).
 * - GA4, GTM, Meta Pixel, Clarity and custom snippets wait for consent.
 */

const safe = (v: string) => v.trim().replace(/[^A-Za-z0-9_\-]/g, '');

export function HeadCodes() {
  const ga = safe(HEAD_CODES.googleAnalyticsId);
  const gtm = safe(HEAD_CODES.googleTagManagerId);
  const adsense = safe(HEAD_CODES.adsenseClientId);
  const pixel = safe(HEAD_CODES.metaPixelId);
  const clarity = safe(HEAD_CODES.clarityId);
  const custom = HEAD_CODES.customHeadHtml.trim();

  const anyTracking = ga || gtm || pixel || clarity || custom;

  // Consent Mode v2 defaults to denied; the cookie banner updates it.
  const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', wait_for_update: 500
});
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }
} catch (e) {}`;

  // Loaders that must not run until the visitor accepts analytics.
  const afterConsent = `
(function () {
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    ${gtm ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');` : ''}
    ${pixel ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');` : ''}
    ${clarity ? `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarity}');` : ''}
    ${custom ? `var tpl = document.getElementById('ts-custom-head');
    if (tpl) {
      var frag = tpl.content.cloneNode(true);
      Array.prototype.forEach.call(frag.querySelectorAll('script'), function (old) {
        var s = document.createElement('script');
        Array.prototype.forEach.call(old.attributes, function (a) { s.setAttribute(a.name, a.value); });
        s.text = old.text;
        old.parentNode.replaceChild(s, old);
      });
      document.head.appendChild(frag);
    }` : ''}
  }
  try { if (localStorage.getItem('${CONSENT_KEY}') === 'granted') load(); } catch (e) {}
  window.addEventListener('ts-consent-change', function (e) { if (e.detail === 'granted') load(); });
})();`;

  return (
    <>
      {/* ---- Google consent defaults (always first) ---- */}
      {(ga || gtm) && <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />}

      {/* ---- Google Analytics 4 (collects only after consent) ---- */}
      {ga && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `gtag('js', new Date()); gtag('config', '${ga}', { anonymize_ip: true });`,
            }}
          />
        </>
      )}

      {/* ---- Google AdSense ---- */}
      {adsense && (
        <>
          <meta name="google-adsense-account" content={adsense} />
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`}
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* ---- Custom snippets, held inert until consent ---- */}
      {custom && <template id="ts-custom-head" dangerouslySetInnerHTML={{ __html: custom }} />}

      {/* ---- GTM, Meta Pixel, Clarity, custom: after consent ---- */}
      {anyTracking && <script dangerouslySetInnerHTML={{ __html: afterConsent }} />}
    </>
  );
}
