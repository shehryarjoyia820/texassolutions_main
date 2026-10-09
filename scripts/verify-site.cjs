// Static checks over the built ./out folder: internal links, one H1, canonical, title/description, sitemap coverage.
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'out');
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]); }
const pages = walk(OUT).filter((f) => f.endsWith('.html') && !f.includes(`${path.sep}_next${path.sep}`));
const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(OUT, 'index.html'));
  const p = path.join(OUT, clean);
  return fs.existsSync(p) || fs.existsSync(p + '.html') || fs.existsSync(path.join(p, 'index.html'));
};
let broken = [], h1 = [], meta = [], noindex = [];
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = '/' + path.relative(OUT, f).split(path.sep).join('/');
  if (/<meta name="robots" content="noindex/.test(html)) { noindex.push(rel); continue; }
  for (const m of html.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) { const h = m[1]; if (h.startsWith('/_next') || /\.(png|ico|svg|jpg|xml|txt|webmanifest)$/.test(h)) continue; if (!exists(h)) broken.push(`${rel} -> ${h}`); }
  const n = (html.match(/<h1[\s>]/g) || []).length; if (rel !== '/404.html' && n !== 1) h1.push(`${rel}: ${n} h1`);
  if (rel !== '/404.html' && (!/<link rel="canonical"/.test(html) || !/<title>[^<]{10,}/.test(html) || !/<meta name="description" content="[^"]{50,}/.test(html))) meta.push(rel);
}
const sm = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://texassolutions.co', '') || '/');
const missingFromBuild = locs.filter((l) => !exists(l));
const smNoindex = locs.filter((l) => noindex.includes(l.replace(/\/?$/, '/index.html').replace('//', '/')) || noindex.includes(l + '.html'));
console.log(`pages: ${pages.length}, noindex: ${noindex.length}, sitemap URLs: ${locs.length}`);
console.log(`broken internal links: ${[...new Set(broken)].length}`); [...new Set(broken)].slice(0, 20).forEach((b) => console.log('  ' + b));
console.log(`pages without exactly one h1: ${h1.length}`); h1.slice(0, 10).forEach((b) => console.log('  ' + b));
console.log(`pages missing canonical/title/description: ${meta.length}`); meta.slice(0, 10).forEach((b) => console.log('  ' + b));
console.log(`sitemap URLs with no built page: ${missingFromBuild.length}`); missingFromBuild.slice(0, 10).forEach((b) => console.log('  ' + b));
console.log(`noindex pages listed in sitemap: ${smNoindex.length}`); smNoindex.forEach((b) => console.log('  ' + b));
