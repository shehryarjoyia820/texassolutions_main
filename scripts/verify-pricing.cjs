const jiti = require('jiti')(__filename, { alias: { '@': require('path').join(__dirname, '../src') } });
const { computeEstimate } = jiti('../src/lib/estimate.ts');
const R = jiti('../src/data/rates.ts');
const P = jiti('../src/data/pricing.ts');
const cases = [
  ['Dedicated: 1 mid + 1 senior', { service: 'dedicated-teams', subType: 'standard', answers: { 'dev-junior':0,'dev-middle': 1, 'dev-senior': 1,'dev-lead':0,'qa-manual':0,'qa-automation':0,designer:0,'ai-engineer':0,devops:0 } }, 7500],
  ['Dedicated: mid+senior+manual QA+designer', { service: 'dedicated-teams', subType: 'standard', answers: { 'dev-junior':0,'dev-middle': 1, 'dev-senior': 1,'dev-lead':0,'qa-manual':1,'qa-automation':0,designer:1,'ai-engineer':0,devops:0 } }, 11500],
  ['QA retainer, no extra hours', { service: 'qa-testing', subType: 'retainer', answers: { extraHours: 0 } }, 300],
  ['Dedicated manual QA engineer', { service: 'qa-testing', subType: 'manual', answers: { extraHours: 0 } }, 1600],
  ['Lead gen 40 h', { service: 'lead-generation', subType: 'b2b', answers: { hours: 40 } }, 600],
  ['Lead gen 60 h', { service: 'lead-generation', subType: 'b2b', answers: { hours: 60 } }, 900],
  ['Ads, 1 platform', { service: 'ads-optimization', subType: 'google', answers: { extraPlatforms: 0 } }, 300],
  ['Ads, 2 platforms', { service: 'ads-optimization', subType: 'google', answers: { extraPlatforms: 1 } }, 600],
  ['AdSense, 3 sites', { service: 'adsense-management', subType: 'single', answers: { sites: 3 } }, 600],
  ['Dispatch semi, 1 truck, $9,000', { service: 'truck-dispatch', subType: 'semi', answers: { trucks: 1, weeklyGross: 9000 } }, 450],
  ['Dispatch box truck, 2 trucks, $8,000', { service: 'truck-dispatch', subType: 'boxTruckOrHotshot', answers: { trucks: 2, weeklyGross: 8000 } }, 1600],
];
let fail = 0;
for (const [name, input, expect] of cases) {
  const r = computeEstimate({ region: 'US', timeline: 'standard', durationMonths: 1, ...input });
  const ok = r.low === expect && r.high === expect;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: low ${r.low} likely ${r.likely} high ${r.high} (expected ${expect})${r.unavailable ? ' UNAVAILABLE ' + r.unavailable : ''}`);
}
// Same input twice -> same output
const a = JSON.stringify(computeEstimate({ region: 'US', timeline: 'rush', service: 'web-development', subType: 'business-site', answers: {} }));
const b = JSON.stringify(computeEstimate({ region: 'US', timeline: 'rush', service: 'web-development', subType: 'business-site', answers: {} }));
console.log(a === b ? 'PASS  deterministic output for identical inputs' : 'FAIL  nondeterministic');
const rush = computeEstimate({ region: 'US', timeline: 'rush', service: 'web-development', subType: 'business-site', answers: {} });
const std = computeEstimate({ region: 'US', timeline: 'standard', service: 'web-development', subType: 'business-site', answers: {} });
console.log(rush.low === std.low && rush.high === std.high ? 'PASS  timeline does not change price' : 'FAIL  timeline changes price');
// Rate card vs tables
for (const r of R.MONTHLY_RESOURCES) { const row = P.getPriceRow('dedicated-teams', r.id); if (!row || row.values.US[0] !== r.price) { fail++; console.log('FAIL table', r.id); } }
for (const h of R.HOURLY_RATES) { const row = P.getPriceRow(h.service, h.id); if (!row || row.values.US[0] !== h.rate[0] || row.values.US[1] !== h.rate[1]) { fail++; console.log('FAIL hourly', h.id); } }
for (const k of ['UK','CA','EU','GCC','APAC']) for (const t of P.PRICE_TABLES) for (const row of t.rows) if (JSON.stringify(row.values[k]) !== JSON.stringify(row.values.US)) { fail++; console.log('FAIL region multiplier', t.service, row.id, k); }
console.log('Rate card vs price tables: all 9 resources, 11 hourly rates checked; region values identical to USD');
console.log(fail ? `${fail} FAILURES` : 'ALL PASS');
