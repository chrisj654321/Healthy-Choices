#!/usr/bin/env node
/**
 * Merge the reviewed ingredient score changes into the app data.
 *
 * Source: "Score Change Proposals.csv" (93 in-scope rows: status=proposed
 * AND reviewVerdict != FIX).
 * Targets:
 *   - src/data/ingredients.js       (INGREDIENT_DB, flag stored explicitly)
 *   - src/data/ingredientCache.js   (CACHED_INGREDIENT_ANALYSIS, flag derived)
 *
 * Full spec: C:\Users\chris\Ingredient Audit by ChatGPT\MERGE BRIEF - Score Changes.md
 *
 * Usage:
 *   node scripts/merge-score-changes.js              # dry run (default, no writes)
 *   node scripts/merge-score-changes.js --dry-run    # dry run (explicit)
 *   node scripts/merge-score-changes.js --apply      # write ingredients.js and ingredientCache.js
 *
 * This script changes only the `risk` field (and, for the 13 rows that exist
 * in both stores, the DB `flag` field). It does not touch labels, notes,
 * evidence, categories, or any other field. It is a plain string-splice
 * patch on the located value tokens, so formatting, key order, and
 * comments in both files are preserved byte-for-byte outside those tokens.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CSV_PATH = 'C:\\Users\\chris\\Ingredient Audit by ChatGPT\\Score Change Proposals.csv';
const DB_PATH = path.join(__dirname, '..', 'src', 'data', 'ingredients.js');
const CACHE_PATH = path.join(__dirname, '..', 'src', 'data', 'ingredientCache.js');

const APPLY = process.argv.includes('--apply');

// Founder-resolved 2026-08-11 (see brief "Resolved conflicts"): these 4 rows'
// proposedRating word doesn't fit the store flag vocabulary. Apply as plain
// cache risk changes; ignore the CSV word entirely and never write it to any
// flag field. All 4 are cache-only (verified below), so this never touches the DB.
const RESOLVED_CONFLICTS = {
  'green s': 7,
  seitan: 3,
  semolina: 3,
  'semolina wheat': 3,
};

// ---------- CSV parsing (quoted fields, doubled-quote escaping, CRLF/LF safe) ----------
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      // ignore; \n below closes the row
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function loadCsvRows() {
  const text = fs.readFileSync(CSV_PATH, 'utf8');
  const table = parseCSV(text);
  const header = table[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  return table
    .slice(1)
    .filter((r) => r.length > 1)
    .map((r) => ({
      ingredient: r[idx.ingredient],
      currentRisk: r[idx.currentRisk],
      currentRating: r[idx.currentRating],
      proposedRisk: r[idx.proposedRisk],
      proposedRating: r[idx.proposedRating],
      reviewVerdict: r[idx.reviewVerdict],
      status: r[idx.status],
    }));
}

function matchKey(ingredient) {
  return ingredient
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

// ---------- locate object-literal entries in the two data files ----------
// String-aware brace matcher: skips over quoted content so a stray `{`/`}`
// inside a string (none expected here, but be safe) can't desync the scan.
function findMatchingBrace(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    const c = text[i];
    if (c === "'" || c === '"' || c === '`') {
      i++;
      while (i < text.length) {
        if (text[i] === '\\') {
          i += 2;
          continue;
        }
        if (text[i] === c) break;
        i++;
      }
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error('Unmatched brace scanning from index ' + openIndex);
}

// Returns Map<lowercasedKey, { rawKey, braceOpen, braceClose }>
function findEntries(text) {
  const entries = new Map();
  const re = /^[ \t]*'((?:[^'\\]|\\.)*)':\s*\{/gm;
  let m;
  while ((m = re.exec(text))) {
    const rawKey = m[1];
    const braceOpen = m.index + m[0].length - 1;
    const braceClose = findMatchingBrace(text, braceOpen);
    const lower = rawKey.toLowerCase();
    // JS object literals let a later duplicate key win at runtime; keep the
    // LAST occurrence so we patch the entry the app actually reads.
    entries.set(lower, { rawKey, braceOpen, braceClose });
  }
  return entries;
}

// Find the `risk:` value token span within [braceOpen, braceClose] (absolute offsets).
function findRiskSpan(text, entry) {
  const block = text.slice(entry.braceOpen, entry.braceClose + 1);
  const m = /risk:\s*([^,}]+)/.exec(block);
  if (!m) throw new Error('No risk field found for ' + entry.rawKey);
  const valueStart = entry.braceOpen + m.index + m[0].indexOf(m[1]);
  const valueEnd = valueStart + m[1].length;
  return { start: valueStart, end: valueEnd, oldToken: m[1] };
}

// Find the `flag: '...'` value token span (DB only).
function findFlagSpan(text, entry) {
  const block = text.slice(entry.braceOpen, entry.braceClose + 1);
  const m = /flag:\s*'([^']*)'/.exec(block);
  if (!m) return null;
  const quoteIdx = block.indexOf("'", m.index + 'flag:'.length);
  const valueStart = entry.braceOpen + quoteIdx + 1;
  const valueEnd = valueStart + m[1].length;
  return { start: valueStart, end: valueEnd, oldValue: m[1] };
}

function resolveRiskNumber(token) {
  const enumMatch = /IngredientRisk\.(Low|Medium|High)/.exec(token);
  if (enumMatch) {
    return { Low: 2, Medium: 5, High: 8 }[enumMatch[1]];
  }
  const n = Number(token.trim());
  if (Number.isNaN(n)) throw new Error('Could not parse risk token: ' + token);
  return n;
}

function riskToCacheToken(n) {
  if (n === 2) return 'IngredientRisk.Low';
  if (n === 5) return 'IngredientRisk.Medium';
  if (n === 8) return 'IngredientRisk.High';
  return String(n);
}

function riskToFlag(risk) {
  if (risk >= 8) return 'avoid';
  if (risk >= 5) return 'moderate';
  return 'ok';
}

// ---------- apply a set of non-overlapping absolute-offset patches to text ----------
function applyPatches(text, patches) {
  const sorted = [...patches].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) {
      throw new Error('Overlapping patches detected at offset ' + sorted[i].start);
    }
  }
  let out = '';
  let cursor = 0;
  for (const p of sorted) {
    out += text.slice(cursor, p.start) + p.replacement;
    cursor = p.end;
  }
  out += text.slice(cursor);
  return out;
}

// ---------- main ----------
function main() {
  const csvRows = loadCsvRows();
  const proposedRows = csvRows.filter((r) => r.status === 'proposed');
  const fixRows = proposedRows.filter((r) => r.reviewVerdict === 'FIX');
  const applyRows = proposedRows.filter((r) => r.reviewVerdict !== 'FIX');

  const dbText = fs.readFileSync(DB_PATH, 'utf8');
  const cacheText = fs.readFileSync(CACHE_PATH, 'utf8');
  const dbEntries = findEntries(dbText);
  const cacheEntries = findEntries(cacheText);

  const dbPatches = [];
  const cachePatches = [];
  const patchedDbKeys = new Set();
  const patchedCacheKeys = new Set();

  const reportRows = [];
  const unmatched = [];

  for (const row of applyRows) {
    const key = matchKey(row.ingredient);
    const inDb = dbEntries.has(key);
    const inCache = cacheEntries.has(key);

    if (!inDb && !inCache) {
      unmatched.push(row.ingredient);
      continue;
    }

    const conflictOverride = Object.prototype.hasOwnProperty.call(RESOLVED_CONFLICTS, key);
    const proposedRiskNum = conflictOverride ? RESOLVED_CONFLICTS[key] : Number(row.proposedRisk);
    const stores = [];

    if (inCache) {
      const entry = cacheEntries.get(key);
      const riskSpan = findRiskSpan(cacheText, entry);
      const oldRiskNum = resolveRiskNumber(riskSpan.oldToken);
      const newToken = riskToCacheToken(proposedRiskNum);
      if (!patchedCacheKeys.has(key)) {
        cachePatches.push({
          start: riskSpan.start,
          end: riskSpan.end,
          replacement: newToken,
        });
        patchedCacheKeys.add(key);
      }
      stores.push({
        store: 'cache',
        oldRisk: oldRiskNum,
        newRisk: proposedRiskNum,
        oldFlag: riskToFlag(oldRiskNum) + ' (derived)',
        newFlag: riskToFlag(proposedRiskNum) + ' (derived)',
      });
    }

    if (inDb) {
      const entry = dbEntries.get(key);
      const riskSpan = findRiskSpan(dbText, entry);
      const flagSpan = findFlagSpan(dbText, entry);
      const oldRiskNum = resolveRiskNumber(riskSpan.oldToken);
      const newFlagWord = conflictOverride ? flagSpan.oldValue : row.proposedRating;
      if (!patchedDbKeys.has(key)) {
        dbPatches.push({
          start: riskSpan.start,
          end: riskSpan.end,
          replacement: String(proposedRiskNum),
        });
        if (flagSpan && !conflictOverride) {
          dbPatches.push({
            start: flagSpan.start,
            end: flagSpan.end,
            replacement: newFlagWord,
          });
        }
        patchedDbKeys.add(key);
      }
      stores.push({
        store: 'db',
        oldRisk: oldRiskNum,
        newRisk: proposedRiskNum,
        oldFlag: flagSpan ? flagSpan.oldValue : '(none)',
        newFlag: newFlagWord,
      });
    }

    reportRows.push({
      ingredient: row.ingredient,
      key,
      conflictOverride,
      stores,
    });
  }

  // ---------- report ----------
  console.log('=== Ingredient score merge — ' + (APPLY ? 'APPLY' : 'DRY RUN') + ' ===\n');

  console.log(
    'ingredient'.padEnd(46) +
      'store'.padEnd(8) +
      'old risk/flag'.padEnd(22) +
      'new risk/flag'
  );
  console.log('-'.repeat(100));
  for (const r of reportRows) {
    for (const s of r.stores) {
      const label = r.ingredient + (r.conflictOverride ? ' [conflict-resolved]' : '');
      console.log(
        label.padEnd(46) +
          s.store.padEnd(8) +
          `${s.oldRisk}/${s.oldFlag}`.padEnd(22) +
          `${s.newRisk}/${s.newFlag}`
      );
    }
  }

  console.log('\n=== Held (not applied) ===');
  for (const r of fixRows) {
    console.log(`  [FIX]  ${r.ingredient}  (proposedRisk=${r.proposedRisk}, proposedRating=${r.proposedRating})`);
  }

  console.log('\n=== Summary ===');
  console.log('CSV proposed rows (status=proposed):', proposedRows.length);
  console.log('Held (reviewVerdict=FIX):', fixRows.length);
  console.log('Applied (rows reflected in the diff above):', reportRows.length);
  console.log('  cache-only patches (unique keys):', patchedCacheKeys.size);
  console.log('  DB patches (unique keys, both-store):', patchedDbKeys.size);
  console.log('Unmatched (no store key found):', unmatched.length);
  if (unmatched.length) {
    console.log('  ' + unmatched.join(', '));
  }

  if (reportRows.length !== applyRows.length) {
    console.error('\nERROR: applied row count does not equal in-scope row count. Aborting.');
    process.exit(1);
  }

  // Compute the patched text in memory either way, so a dry run can also
  // confirm the eventual --apply would produce syntactically valid JS.
  const newDbText = applyPatches(dbText, dbPatches);
  const newCacheText = applyPatches(cacheText, cachePatches);

  try {
    const babel = require('@babel/core');
    const configFile = path.join(__dirname, '..', 'babel.config.js');
    babel.transform(newDbText, { configFile, filename: DB_PATH });
    babel.transform(newCacheText, { configFile, filename: CACHE_PATH });
    console.log('\nBabel parse of the patched output: OK (both files)');
  } catch (e) {
    console.error('\nBabel parse of the patched output FAILED:', e.message);
    process.exit(1);
  }

  if (!APPLY) {
    console.log('\nDry run only — no files written. Re-run with --apply to write changes.');
    return;
  }

  fs.writeFileSync(DB_PATH, newDbText, 'utf8');
  fs.writeFileSync(CACHE_PATH, newCacheText, 'utf8');
  console.log('\nWrote', DB_PATH);
  console.log('Wrote', CACHE_PATH);
}

main();
