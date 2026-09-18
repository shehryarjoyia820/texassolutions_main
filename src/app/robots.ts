import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export const dynamic = 'force-static';

/**
 * Search engines and AI answer engines are explicitly welcome: being cited by
 * ChatGPT, Claude, Perplexity, Gemini and Copilot is part of the AEO strategy.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
