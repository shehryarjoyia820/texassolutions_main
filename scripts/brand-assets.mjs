// Generates favicon, app icons and the Open Graph image from the logo geometry.
// Run: node scripts/brand-assets.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const STAR = 'M20 13.5 L21.53 17.9 L26.18 17.99 L22.47 20.8 L23.82 25.26 L20 22.6 L16.18 25.26 L17.53 20.8 L13.82 17.99 L18.47 17.9 Z';
const L = 'M11.2 13 L6.2 20 L11.2 27';
const R = 'M28.8 13 L33.8 20 L28.8 27';

const mark = (x = 0, y = 0, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect width="40" height="40" rx="11" fill="url(#g)"/>
    <rect width="40" height="40" rx="11" fill="url(#sh)"/>
    <path d="${L}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${R}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${STAR}" fill="#fff"/>
  </g>`;

const defs = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FF9A3C"/><stop offset="0.55" stop-color="#FF7A1A"/><stop offset="1" stop-color="#E0520A"/>
    </linearGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${defs}${mark()}</svg>`;
writeFileSync('public/favicon.svg', favicon);

for (const [file, size] of [['public/apple-touch-icon.png', 180], ['public/icon-192.png', 192], ['public/icon-512.png', 512], ['public/favicon-32.png', 32]]) {
  await sharp(Buffer.from(favicon)).resize(size, size).png().toFile(file);
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${defs}
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0" r="0.9">
      <stop offset="0" stop-color="#FF7A1A" stop-opacity="0.35"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0 H0 V48" fill="none" stroke="#1C2640" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#070B18"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.6"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${mark(80, 80, 2.4)}
  <text x="200" y="128" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#F0F4FF">Texas<tspan fill="#FF7A1A">Solutions</tspan></text>
  <text x="202" y="162" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="17" font-weight="600" letter-spacing="4" fill="#7884A3">WEB · SOFTWARE · ENTERPRISE</text>
  <text x="80" y="340" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="60" font-weight="700" fill="#F0F4FF">Custom Web Platforms &amp; Software</text>
  <text x="80" y="420" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="60" font-weight="700" fill="#FF7A1A">Built for Modern Enterprises</text>
  <text x="80" y="530" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="#A5B0CC">texassolutions.co  ·  Published pricing in 5 regions  ·  (838) 910-3147</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og/default.png');
console.log('brand assets written');
