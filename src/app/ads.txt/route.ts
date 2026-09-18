import { HEAD_CODES, adsensePublisherId } from '@/config/head-codes';

export const dynamic = 'force-static';

/**
 * https://texassolutions.co/ads.txt
 * Content comes from src/config/head-codes.ts. The AdSense line is generated
 * from adsenseClientId; other sellers come from the adsTxt field.
 * f08c47fec0942fa0 is Google's published certification authority ID.
 */
export function GET() {
  const lines = ['# ads.txt for texassolutions.co', '# Edit src/config/head-codes.ts to change this file.'];
  const pub = adsensePublisherId(pub-4507418978047945);
  if (pub) lines.push(`google.com, ${pub}, DIRECT, f08c47fec0942fa0`);
  const extra = HEAD_CODES.adsTxt
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !(pub && l.includes(pub)));
  lines.push(...extra);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
