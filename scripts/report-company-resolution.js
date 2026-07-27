#!/usr/bin/env node
/**
 * report-company-resolution.js
 *
 * Answers one question, with a number instead of a guess: **when a shopper
 * scans a real product, how often can we tell them who owns it?**
 *
 * Company transparency is the app's paid feature, so a product that resolves
 * to no company is a paying user hitting the gate and finding nothing. The
 * catalog we curate by hand (1,092 products) is not a fair test of that —
 * every one of those was researched. The fair test is the ~124k US products
 * in the Open Food Facts bulk dump, which is what shoppers will actually
 * point the scanner at.
 *
 * WHY THIS EXISTS: "did we map all the Walmart variants?" is not answerable
 * by reading companies.js. There are 284 company records and ~11k distinct
 * brand-owner strings in the wild; the only honest answer is a measurement
 * you can re-run after every change. This script is that measurement.
 *
 * It reports:
 *   1. SKU-weighted resolution — the number that matters, because owners are
 *      wildly unequal in size (one Walmart is worth a thousand small brands).
 *   2. Per-company reach — which records are doing work, and which are dead
 *      weight that nothing in the wild ever resolves to.
 *   3. The unresolved work queue, sorted by SKU count, so the next mapping
 *      you add is always the highest-value one available.
 *
 * USAGE:
 *   node scripts/report-company-resolution.js            # summary
 *   node scripts/report-company-resolution.js --top 60   # longer work queue
 *   node scripts/report-company-resolution.js --company walmart
 *                                                        # every wild string
 *                                                        # that lands on one id
 *
 * NOTE: reads src/data/products_generated.json (221MB, gitignored). Streamed
 * line-by-line, never JSON.parse'd whole. If it's absent, the script says so
 * and exits rather than reporting a misleading zero.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const DUMP = path.join(ROOT, 'src', 'data', 'products_generated.json');

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const argOf = (flag, dflt) => {
  const i = argv.indexOf(flag);
  return i === -1 ? dflt : argv[i + 1];
};
const TOP = parseInt(argOf('--top', '30'), 10);
const ONLY_COMPANY = argOf('--company', null);

// ── the app's real resolution logic ──────────────────────────────────────────
// Deliberately re-implemented here rather than imported: src/utils/productParser.js
// uses extensionless ESM imports that plain `node` cannot resolve (the same
// trap that produced the bogus photo-coverage numbers on 2026-07-11 — see
// priorities.md). Keep this in sync with findCompanyId(); the pinned tests in
// src/utils/__tests__/productParser.test.js are the contract both must satisfy.
const { BRAND_TO_COMPANY, BRAND_PARENT_MAP, COMPANY_DB } = require('../src/data/companies.js');

const b2cKeys = Object.keys(BRAND_TO_COMPANY);
const dbValues = Object.values(COMPANY_DB);

function findCompanyId(brand) {
  if (!brand) return null;
  const lower = String(brand).toLowerCase().trim();

  if (BRAND_TO_COMPANY[lower]) return BRAND_TO_COMPANY[lower];

  const directKey = b2cKeys.find((k) => lower.includes(k) || k.includes(lower));
  if (directKey) return BRAND_TO_COMPANY[directKey];

  const parentName = BRAND_PARENT_MAP[lower];
  if (parentName) {
    const pLower = parentName.toLowerCase();
    const match = dbValues.find(
      (c) => c.name.toLowerCase().includes(pLower) || pLower.includes(c.name.toLowerCase())
    );
    if (match) return match.id;
  }
  return null;
}

// ── US/Canada filter ─────────────────────────────────────────────────────────
// OFF is a global database with a heavy European skew; ranking brands without
// this filter surfaces French supermarkets, not the US shelf this app covers.
// UPC-A (12 digits) and EAN-13 beginning 0 or 1 are the US/Canada prefixes.
function isUS(barcode) {
  const s = String(barcode || '').replace(/\D/g, '');
  if (s.length === 12) return true;
  if (s.length === 13) return /^[01]/.test(s);
  return false;
}

async function main() {
  if (!fs.existsSync(DUMP)) {
    console.error(`Missing ${path.relative(ROOT, DUMP)} (gitignored, ~221MB).`);
    console.error('This report needs the Open Food Facts bulk dump to mean anything.');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(DUMP, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  const brandSkus = new Map(); // brand string -> SKU count
  let currentBarcode = null;
  let scanned = 0;
  let usSkus = 0;

  for await (const line of rl) {
    let m = line.match(/^\s*"barcode":\s*"([^"]*)"/);
    if (m) { currentBarcode = m[1]; scanned++; continue; }
    m = line.match(/^\s*"brand":\s*"([^"]*)"/);
    if (m && currentBarcode !== null) {
      if (isUS(currentBarcode)) {
        usSkus++;
        const b = m[1].trim();
        if (b) brandSkus.set(b, (brandSkus.get(b) || 0) + 1);
      }
      currentBarcode = null;
    }
  }

  // ── resolve every distinct brand string once ───────────────────────────────
  const perCompany = new Map();   // companyId -> { skus, strings[] }
  const unresolved = [];          // [string, skus]
  let resolvedSkus = 0;
  let resolvedStrings = 0;

  for (const [brand, skus] of brandSkus) {
    const id = findCompanyId(brand);
    if (id) {
      resolvedSkus += skus;
      resolvedStrings++;
      if (!perCompany.has(id)) perCompany.set(id, { skus: 0, strings: [] });
      const rec = perCompany.get(id);
      rec.skus += skus;
      rec.strings.push([brand, skus]);
    } else {
      unresolved.push([brand, skus]);
    }
  }

  // ── --company mode: audit one record's real-world reach ────────────────────
  if (ONLY_COMPANY) {
    const rec = perCompany.get(ONLY_COMPANY);
    const known = COMPANY_DB[ONLY_COMPANY];
    console.log(`\nCompany: ${ONLY_COMPANY}` + (known ? `  ("${known.name}")` : '  [NO SUCH RECORD]'));
    if (!rec) {
      console.log('  Nothing in the wild catalog resolves to this record.');
      return;
    }
    console.log(`  ${rec.skus} SKUs via ${rec.strings.length} distinct brand strings:\n`);
    rec.strings.sort((a, b) => b[1] - a[1]).forEach(([b, n]) =>
      console.log(`    ${String(n).padStart(5)}  ${b}`)
    );
    // The most useful part: near-miss strings that a human would expect to
    // land here but don't.
    const needle = (known ? known.name : ONLY_COMPANY).toLowerCase().replace(/[^a-z0-9]/g, '');
    const nearMisses = unresolved
      .filter(([b]) => b.toLowerCase().replace(/[^a-z0-9]/g, '').includes(needle.slice(0, 6)))
      .sort((a, b) => b[1] - a[1]);
    if (nearMisses.length) {
      console.log(`\n  UNRESOLVED strings that look like they belong here:`);
      nearMisses.slice(0, 20).forEach(([b, n]) =>
        console.log(`    ${String(n).padStart(5)}  ${b}`)
      );
    }
    return;
  }

  // ── summary ────────────────────────────────────────────────────────────────
  const pct = (a, b) => ((a / b) * 100).toFixed(1) + '%';
  console.log('\n═══ COMPANY RESOLUTION ═══════════════════════════════════════');
  console.log(`Scanned ${scanned.toLocaleString()} products; ${usSkus.toLocaleString()} US/Canada.`);
  console.log(`Distinct brand-owner strings: ${brandSkus.size.toLocaleString()}`);
  console.log('');
  console.log(`  SKU-weighted resolution:  ${resolvedSkus.toLocaleString()} / ${usSkus.toLocaleString()}  (${pct(resolvedSkus, usSkus)})`);
  console.log(`  ...what a shopper actually experiences.`);
  console.log('');
  console.log(`  Brand strings resolved:   ${resolvedStrings.toLocaleString()} / ${brandSkus.size.toLocaleString()}  (${pct(resolvedStrings, brandSkus.size)})`);
  console.log(`  Company records reached:  ${perCompany.size} / ${Object.keys(COMPANY_DB).length}`);

  const dead = Object.keys(COMPANY_DB).filter((id) => !perCompany.has(id));
  if (dead.length) {
    console.log(`  Records nothing resolves to: ${dead.length}`);
    console.log(`    (not necessarily wrong — may only exist for curated products)`);
  }

  console.log(`\n─── TOP ${TOP} UNRESOLVED (the work queue, highest value first) ───`);
  unresolved.sort((a, b) => b[1] - a[1]);
  const queueSkus = unresolved.slice(0, TOP).reduce((s, [, n]) => s + n, 0);
  unresolved.slice(0, TOP).forEach(([b, n]) =>
    console.log(`  ${String(n).padStart(5)}  ${b}`)
  );
  console.log(`\n  Mapping just these ${TOP} would add ${queueSkus.toLocaleString()} SKUs (+${pct(queueSkus, usSkus)}).`);
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
