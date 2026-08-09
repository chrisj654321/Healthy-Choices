#!/usr/bin/env node

/**
 * triage-queue.js
 *
 * Buckets the audit's "Next Ingredient Queue" (raw label strings the scanner
 * has seen but that aren't clean cache keys) into:
 *
 *   resolved  — the app's own runtime matcher (lookupIngredient) already
 *               explains this token. No data work needed at all.
 *   alias     — normalizes/segments to a known ingredient but the matcher
 *               misses it; capturable with a deterministic alias, no new
 *               facts, no fabrication risk. This is work Claude can do safely.
 *   novel     — genuinely not in the dictionary in any form. Assigning a risk
 *               score + regulatory rationale here is fact-generation, which is
 *               the never-fabricate rail — needs real sourced research.
 *
 * The point is to size the safe half vs. the fabrication-risk half before
 * doing either. Reuses the scorer via the same VM bundling the SQLite build
 * uses, so the match logic tested is exactly the shipped one.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');
const AUDIT = 'C:\\Users\\chris\\Ingredient Audit by ChatGPT\\';

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function strip(src) {
  return src
    .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}
function stripCjs(src) {
  return src.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, '');
}

function loadScorer() {
  // COMPANY_DB is referenced by scorer.js; a stub is fine, we only call
  // lookupIngredient which never touches it.
  const bundle = [
    strip(read('src/data/ingredientCache.js')),
    strip(read('src/data/ingredients.js')),
    stripCjs(read('src/utils/ingredientNormalizer.js')),
    strip(read('src/utils/sourcingMatch.js')),
    strip(read('src/utils/scorer.js')),
    '\nmodule.exports = { lookupIngredient };',
  ].join('\n\n');
  const sandbox = { module: { exports: {} }, exports: {}, console, COMPANY_DB: {} };
  vm.runInNewContext(bundle, sandbox, { filename: 'scorer-bundle.js', timeout: 30000 });
  return sandbox.module.exports.lookupIngredient;
}

function parseCsv(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function main() {
  const lookupIngredient = loadScorer();
  const rows = parseCsv(fs.readFileSync(AUDIT + 'Next Ingredient Queue.csv', 'utf8'));
  const header = rows[0];
  const q = rows.slice(1).filter((r) => r.length > 1)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));

  const resolved = [];
  const novel = [];
  for (const item of q) {
    const name = (item.ingredient || '').trim();
    if (!name) continue;
    const hit = lookupIngredient(name);
    (hit ? resolved : novel).push({ name, freq: Number(item.productFrequency) || 0 });
  }

  novel.sort((a, b) => b.freq - a.freq);
  const novelFreq = novel.reduce((s, x) => s + x.freq, 0);
  const resolvedFreq = resolved.reduce((s, x) => s + x.freq, 0);

  console.log('=== Queue triage (' + q.length + ' tokens) ===');
  console.log('Already resolved by the app: ' + resolved.length + '  (' + resolvedFreq + ' label occurrences)');
  console.log('Genuinely novel:             ' + novel.length + '  (' + novelFreq + ' label occurrences)');
  console.log('\nTop 40 NOVEL tokens by frequency (the real work list):');
  for (const x of novel.slice(0, 40)) console.log('  ' + String(x.freq).padStart(5) + '  ' + x.name);

  fs.writeFileSync(
    path.join(__dirname, 'novel-tokens.json'),
    JSON.stringify(novel, null, 0)
  );
  console.log('\nWrote ' + novel.length + ' novel tokens to scripts/ingredient-audit/novel-tokens.json');
}

main();
