#!/usr/bin/env node

/**
 * import-audit.js
 *
 * Works the ChatGPT (Chad) ingredient audit into src/data/ingredientCache.js.
 *
 * Source workspace (outside the repo, Chad's own reviewed output):
 *   C:\Users\chris\Ingredient Audit by ChatGPT\
 *     Ingredient Master List.csv   — 3,553 rows: the app's cache + 25 new ingredients
 *     Score Change Proposals.csv   — 150 proposed risk changes
 *
 * Two deliberate rules, both stated to the founder:
 *   1. Only `proposed` score changes are applied. Rows Chad's own reviewer
 *      marked `needs-more-research` are his "not finished" flag and are held.
 *   2. The app's risk scale is the IngredientRisk enum only: 2 (Low),
 *      5 (Medium), 8 (High). The audit uses a finer 2-9 scale, so each raw
 *      score is mapped to the enum step whose display flag matches (see
 *      numToToken) — the same >=8 / >=5 / else thresholds the app's own
 *      riskToFlag() uses. Storing a raw 3, 4, 7 or 9 would leave a value the
 *      scorer never accounts for.
 *
 * This script edits ingredientCache.js in place with targeted line rewrites —
 * it never regenerates the whole file, so the 47 interspersed comments and
 * every untouched entry are preserved byte for byte.
 *
 * Usage:
 *   node scripts/ingredient-audit/import-audit.js --dry-run   # report only
 *   node scripts/ingredient-audit/import-audit.js             # apply
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const AUDIT_DIR = 'C:\\Users\\chris\\Ingredient Audit by ChatGPT';
const MASTER_CSV = path.join(AUDIT_DIR, 'Ingredient Master List.csv');
const PROPOSALS_CSV = path.join(AUDIT_DIR, 'Score Change Proposals.csv');
const CACHE_PATH = path.join(ROOT, 'src', 'data', 'ingredientCache.js');

const TOKEN_TO_RISK = { Low: 2, Medium: 5, High: 8 };

// The audit uses a finer 2-9 scale; the app has only 2 (Low), 5 (Medium),
// 8 (High). Map each raw score to the enum step whose display flag matches,
// which is exactly what the app's riskToFlag() does (>=8 avoid, >=5 moderate,
// else ok). This preserves the audit author's intended flag for any integer.
function numToToken(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  if (v >= 8) return 'High';
  if (v >= 5) return 'Medium';
  return 'Low';
}

/** Minimal RFC-4180 CSV parser — handles quoted fields, embedded commas, "" escapes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\r') {
      // ignore; \n ends the row
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function readCsvObjects(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

/** Escapes a value for a JS single-quoted literal. */
function jsStr(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Reads the current risk token for each cache key from the source. */
function readCacheEntries(source) {
  const re = /^ {2}'((?:[^'\\]|\\.)*)':\s*\{\s*risk:\s*IngredientRisk\.(Low|Medium|High)\b/gm;
  const map = new Map();
  let m;
  while ((m = re.exec(source)) !== null) {
    map.set(m[1].replace(/\\'/g, "'"), { token: m[2], line: m.index });
  }
  return map;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');

  const master = readCsvObjects(MASTER_CSV);
  const proposals = readCsvObjects(PROPOSALS_CSV);
  let source = fs.readFileSync(CACHE_PATH, 'utf8');
  const cache = readCacheEntries(source);

  // ---- New ingredients: in the master list, not yet in the cache ----
  const newEntries = [];
  const unknownRisk = [];
  for (const row of master) {
    const name = row.ingredient.trim().toLowerCase();
    if (!name || cache.has(name)) continue;
    const token = numToToken(row.riskScore);
    if (!token) { unknownRisk.push({ name, risk: row.riskScore }); continue; }
    newEntries.push({
      name,
      token,
      category: (row.category || 'additives').trim(),
      explanation: (row.customerExplanation || '').trim(),
    });
  }

  // ---- Score changes: only `proposed`, only where the mapped token moves ----
  const changes = [];
  const heldNeedsResearch = [];
  const noOps = [];
  const missing = [];
  for (const p of proposals) {
    const name = p.ingredient.trim().toLowerCase();
    if (p.status !== 'proposed') { heldNeedsResearch.push(name); continue; }
    const current = cache.get(name);
    if (!current) { missing.push(name); continue; }
    const token = numToToken(p.proposedRisk);
    if (!token) { unknownRisk.push({ name, risk: p.proposedRisk }); continue; }
    if (token === current.token) { noOps.push(name); continue; }
    changes.push({ name, from: current.token, to: token, rawFrom: p.currentRisk, rawTo: p.proposedRisk });
  }

  // ---- Report ----
  const raises = changes.filter((c) => TOKEN_TO_RISK[c.to] > TOKEN_TO_RISK[c.from]);
  const lowers = changes.filter((c) => TOKEN_TO_RISK[c.to] < TOKEN_TO_RISK[c.from]);
  console.log('=== Ingredient audit import ===');
  console.log(`New ingredients to add:        ${newEntries.length}`);
  console.log(`Score changes to apply:        ${changes.length}  (raises ${raises.length}, lowers ${lowers.length})`);
  console.log(`Held (needs-more-research):    ${heldNeedsResearch.length}`);
  console.log(`No-op proposals (token same):  ${noOps.length}`);
  if (missing.length) console.log(`WARN proposals with no cache key: ${missing.length} -> ${missing.slice(0, 6).join(', ')}`);
  if (unknownRisk.length) console.log(`WARN unmappable risk values:     ${unknownRisk.length} -> ${JSON.stringify(unknownRisk.slice(0, 6))}`);
  console.log('\nRaises (app gets scarier — worth a look):');
  for (const c of raises) console.log(`  ${c.name}: ${c.from} -> ${c.to}  (audit ${c.rawFrom} -> ${c.rawTo})`);

  if (dryRun) { console.log('\n--dry-run: no file written.'); return; }

  // ---- Apply score changes: targeted single-line rewrites ----
  let applied = 0;
  for (const c of changes) {
    const keyRe = new RegExp(
      `(^ {2}'${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "\\\\?'")}':\\s*\\{\\s*risk:\\s*IngredientRisk\\.)${c.from}\\b`,
      'm'
    );
    const next = source.replace(keyRe, `$1${c.to}`);
    if (next !== source) { source = next; applied += 1; }
    else console.log(`  WARN could not rewrite risk for: ${c.name}`);
  }

  // ---- Append new entries just before the object's closing brace ----
  const closeIdx = source.indexOf('\n};', source.indexOf('CACHED_INGREDIENT_ANALYSIS = {'));
  const block = newEntries.map((e) =>
    `  '${jsStr(e.name)}': { risk: IngredientRisk.${e.token}, category: '${jsStr(e.category)}', explanation: '${jsStr(e.explanation)}' },`
  ).join('\n');
  const marker = '\n  // --- Added from the ChatGPT ingredient audit (2026-08-08) ---\n';
  source = source.slice(0, closeIdx) + marker + block + '\n' + source.slice(closeIdx + 1);

  fs.writeFileSync(CACHE_PATH, source);
  console.log(`\nApplied ${applied} score changes and added ${newEntries.length} ingredients to ${path.relative(ROOT, CACHE_PATH)}.`);
}

main();
