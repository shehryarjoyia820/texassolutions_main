/**
 * ============================================================================
 *  HEADER CODES — paste your tracking, verification and ad codes here.
 * ============================================================================
 *
 *  This is the ONE file for everything that goes in the <head> of every page
 *  on texassolutions.co, plus the contents of /ads.txt.
 *
 *  How to edit
 *  - On GitHub: open this file, click the pencil icon, paste, "Commit changes".
 *    The site rebuilds and goes live automatically in about two minutes.
 *  - Locally: edit, save, then `git commit` and `git push`.
 *
 *  Leave a field as '' (empty) to switch that code off.
 *
 *  Privacy: Google Analytics, Tag Manager, Meta Pixel and Microsoft Clarity
 *  only start after the visitor clicks "Accept analytics" in the cookie
 *  banner (Google Consent Mode v2). AdSense and verification tags load on
 *  every page, because Google needs to see them to approve the site.
 * ============================================================================
 */

export const HEAD_CODES = {
  /* ------------------------------------------------------------------------
   * 1. GOOGLE SEARCH CONSOLE
   * Search Console → Add property → "HTML tag" method. Google gives you:
   *   <meta name="google-site-verification" content="abc123XYZ..." />
   * Paste ONLY the content value, e.g. 'abc123XYZ...'
   * ---------------------------------------------------------------------- */
  googleSiteVerification: '',

  /* ------------------------------------------------------------------------
   * 2. BING WEBMASTER TOOLS (also feeds ChatGPT search)
   *   <meta name="msvalidate.01" content="ABCDEF123..." />
   * Paste ONLY the content value.
   * ---------------------------------------------------------------------- */
  bingSiteVerification: '',

  /* ------------------------------------------------------------------------
   * 3. GOOGLE ANALYTICS 4
   * Analytics → Admin → Data streams → your stream → Measurement ID.
   * Looks like 'G-XXXXXXXXXX'.
   * ---------------------------------------------------------------------- */
  googleAnalyticsId: '',

  /* ------------------------------------------------------------------------
   * 4. GOOGLE TAG MANAGER (optional; use this OR GA4 above, not both
   *    unless GA4 is not also configured inside the GTM container)
   * Looks like 'GTM-XXXXXXX'.
   * ---------------------------------------------------------------------- */
  googleTagManagerId: '',

  /* ------------------------------------------------------------------------
   * 5. GOOGLE ADSENSE
   * AdSense gives you:
   *   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" ...>
   * Paste ONLY the client value, e.g. 'ca-pub-1234567890123456'.
   * The matching ads.txt line is added automatically (see adsTxt below).
   * ---------------------------------------------------------------------- */
  adsenseClientId: 'ca-pub-4507418978047945',
  /* ------------------------------------------------------------------------
   * 6. META (FACEBOOK) PIXEL — the numeric Pixel ID, e.g. '123456789012345'.
   * ---------------------------------------------------------------------- */
  metaPixelId: '',

  /* ------------------------------------------------------------------------
   * 7. MICROSOFT CLARITY — the project ID, e.g. 'abcd1234ef'.
   * ---------------------------------------------------------------------- */
  clarityId: '',

  /* ------------------------------------------------------------------------
   * 8. OTHER META TAGS
   * Any other <meta name="..." content="..."> verification tag, for example
   * Facebook domain verification, Pinterest, Yandex or Ahrefs.
   *   <meta name="facebook-domain-verification" content="xyz" />
   * becomes:
   *   { name: 'facebook-domain-verification', content: 'xyz' },
   * ---------------------------------------------------------------------- */
  extraMetaTags: [
    // { name: 'facebook-domain-verification', content: '' },
    // { name: 'p:domain_verify', content: '' },
    // { name: 'yandex-verification', content: '' },
  ] as { name: string; content: string }[],

  /* ------------------------------------------------------------------------
   * 9. ANY OTHER CODE (paste full snippets between the backticks)
   * For tools not listed above: chat widgets, LinkedIn Insight, TikTok
   * Pixel, Hotjar and so on. Paste the whole <script>...</script> exactly as
   * the provider gives it. It runs on every page.
   *
   * Do NOT put verification <meta> tags here — search engines read them
   * before scripts run, so use fields 1, 2 and 8 for those.
   * ---------------------------------------------------------------------- */
  customHeadHtml: `
`,

  /* ------------------------------------------------------------------------
   * 10. ADS.TXT — served at https://texassolutions.co/ads.txt
   * One line per authorised seller. Your AdSense line is added automatically
   * from adsenseClientId above, so only add OTHER ad networks here.
   * Lines starting with # are comments.
   * ---------------------------------------------------------------------- */
  adsTxt: `
# Add other authorised ad sellers below, one per line, for example:
# example-adnetwork.com, 12345, DIRECT, abc123def456
`,
};

/** Converts 'ca-pub-123' to the 'pub-123' form ads.txt expects. */
export function adsensePublisherId(): string {
  const id = HEAD_CODES.adsenseClientId.trim();
  return id ? id.replace(/^ca-/, '') : '';
}
