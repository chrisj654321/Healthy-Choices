#!/usr/bin/env node
/**
 * Healthy Choices — one-time (re-runnable) normalizer for the CURATED catalog.
 *
 * Why this exists
 * ---------------
 * `normalizeIngredientTokens()` runs in the live-scan parser (productParser.js)
 * and in the build-time ingestor (ingest-products.js), but it has never been
 * applied to `MANUAL_PRODUCTS` in src/data/products.js. The scorer consumes
 * those arrays VERBATIM, so curated entries still carry raw label structure:
 *
 *   'enriched flour (wheat flour, niacin, reduced iron, folic acid)'
 *
 * renders as ONE row, matches no ingredient key, and — being over the 6-word
 * plausibility limit — is hidden from the user entirely as an "unreadable
 * label entry". Its sub-ingredients are never scored.
 *
 * What it does
 * ------------
 * Per product: pre-clean each token (below), join, run the shared normalizer,
 * write the result back preserving the file's existing formatting.
 *
 * The pre-clean exists because curated arrays differ from live-scan text in one
 * way that matters: legal disclaimers, section headers and purpose clauses are
 * GLUED ONTO the ingredient rather than standing as their own comma-separated
 * token. The normalizer's advisory blocklist then rejects the whole token,
 * ingredient included — e.g. 'contains 1% or less of salt' would silently drop
 * the salt. ingest-products.js already strips the same two things before
 * normalizing; this applies that treatment per token, plus guards for damage
 * the normalizer would otherwise do to curated strings.
 *
 * Safety
 * ------
 * A product is SKIPPED (left byte-identical) when normalizing would cost it 3+
 * ingredient keys the DB already recognizes. That only fires on entries whose
 * curated array is itself whole-package OCR garbage (nutrition panel, phone
 * numbers); those need re-research, not reformatting. Run with --report to
 * list them.
 *
 * Usage:
 *   node scripts/normalize-curated-ingredients.js --dry-run
 *   node scripts/normalize-curated-ingredients.js --report
 *   node scripts/normalize-curated-ingredients.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_FILE = path.join(ROOT, 'src', 'data', 'products.js');
const { normalizeIngredientTokens } = require(path.join(ROOT, 'src', 'utils', 'ingredientNormalizer.js'));

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const REPORT = args.has('--report');

// ─── Pre-clean ──────────────────────────────────────────────────────────────

// "contains 2% or less of:", "less than 1% of", "2% or less of" — prefix only.
// Must carry a disclaimer marker. A BARE percentage is a claim, not a
// disclaimer: stripping it would turn '100% whole grain wheat flour' into
// 'whole grain wheat flour' and lose real label meaning.
const DISCLAIMER_PREFIX = new RegExp(
  '^(?:' +
    'contains\\s+(?:less\\s+than\\s+)?[\\d.]+\\s*%\\s*(?:or\\s+less\\s*)?(?:of\\b)?\\s*:?\\s*' +
    '|less\\s+than\\s+[\\d.]+\\s*%\\s*(?:of\\b)?\\s*:?\\s*' +
    '|[\\d.]+\\s*%\\s*or\\s+less\\s*(?:of\\b)?\\s*:?\\s*' +
    '|contains\\s+[\\d.]+\\s*%\\s*:?\\s*' +
  ')', 'i');

const LEADIN_PREFIX = /^made\s+(?:from|with)\s+/i;

// 'VITAMINS & MINERALS:', 'CRUST:' — a header glued to its first ingredient.
const SECTION_HEADER = /^[a-z][a-z &']{1,40}:\s*/i;

// A disclaimer can also sit MID-token, gluing the ingredient before it to the
// group after it ('corn syrup and less than 2% of the following: pork broth').
// Cutting keeps both sides; the advisory blocklist would drop all of it.
const MID_DISCLAIMER =
  /[\s,]+(?:and\s+)?(?:contains\s+)?(?:less\s+than\s+[\d.]+\s*%|[\d.]+\s*%\s*or\s+less)\s*(?:of\s+)?(?:each\s+of\s+)?(?:the\s+following)?\s*:?\s*/gi;

// 'dough conditioners (CONTAINS ONE OR MORE OF THE FOLLOWING: sodium stearoyl
// lactylate, ...)' — a group lead-in with no percentage. Once parens flatten,
// the lead-in heads its own token and `/^contains\b/` throws the first real
// additive away with it.
const GROUP_LEADIN =
  /[\s,(]*contains\s+(?:one\s+or\s+more\s+of\s+)?(?:each\s+of\s+)?the\s+following\s*:?\s*/gi;

// '... added to preserve freshness', '... for color'. Treated as a SEPARATOR,
// not a suffix: a comma-loss merge routinely buries the next real ingredient
// behind one ('fruit juice for color natural flavors' is fruit juice AND
// natural flavors). The for/to/as lead-in requirement keeps ingredient names
// that merely contain 'color'/'flavor' ('caramel color') untouched.
const PURPOSE_CLAUSE =
  /[\s,(]+(?:added\s+)?(?:as\s+an?\s+|to\s+|for\s+|used\s+to\s+)(?:help\s+)?(?:preserv\w*|protect\w*|maintain\w*|retain\w*)?\s*(?:freshness|color|colour|flavou?r|tartness|texture|quality|preservatives?)\b\s*\)?/gi;

// The normalizer treats '. ' as a token separator, which destroys the very
// common dye form 'FD&C Red No. 40' (-> 'fd&c red color no' plus a bare '40'
// the numeric filter drops). Close the period up so the dye survives.
const ABBREV_PERIOD = /\bno\.\s*(\d)/gi;

function precleanToken(raw) {
  let t = String(raw || '').trim();
  if (!t) return '';
  t = t.replace(ABBREV_PERIOD, 'no $1');

  let prev;
  do {
    prev = t;
    t = t.replace(DISCLAIMER_PREFIX, '').replace(LEADIN_PREFIX, '');
  } while (t !== prev);

  // Only treat a colon-prefix as a header when something survives after it.
  const headerStripped = t.replace(SECTION_HEADER, '');
  if (headerStripped.trim()) t = headerStripped;

  t = t.replace(GROUP_LEADIN, ', ').replace(MID_DISCLAIMER, ', ');

  // Never let the purpose cut eat the whole token.
  const purposeCut = t.replace(PURPOSE_CLAUSE, ', ');
  if (purposeCut.replace(/[,\s]/g, '').length >= 3) t = purposeCut;

  return t.replace(/\s*,\s*,+/g, ', ').replace(/^\s*,\s*|\s*,\s*$/g, '').trim();
}

function normalizeProductIngredients(list) {
  const pre = list.map(precleanToken).filter(Boolean);
  return normalizeIngredientTokens(pre.join(', '));
}

// ─── Known-key safety gate ──────────────────────────────────────────────────

function objectLiteralAfter(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Marker not found: ${marker}`);
  const start = source.indexOf('{', markerIndex);
  let depth = 0, quote = null, lineComment = false, blockComment = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i], next = source[i + 1];
    if (lineComment) { if (ch === '\n' || ch === '\r') lineComment = false; continue; }
    if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i += 1; } continue; }
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i += 1; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i += 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    if (ch === '}') { depth -= 1; if (depth === 0) return source.slice(start, i + 1); }
  }
  throw new Error(`Object end not found after: ${marker}`);
}

function loadKnownKeys() {
  const sandbox = { IngredientRisk: { Low: 2, Medium: 5, High: 8 } };
  const read = (rel, marker) => vm.runInNewContext(
    `(${objectLiteralAfter(fs.readFileSync(path.join(ROOT, rel), 'utf8'), marker)})`,
    sandbox, { timeout: 60000 }
  );
  const db = read('src/data/ingredients.js', 'export const INGREDIENT_DB');
  const cache = read('src/data/ingredientCache.js', 'export const CACHED_INGREDIENT_ANALYSIS');
  const set = new Set();
  for (const k of Object.keys(db)) set.add(k.toLowerCase());
  for (const k of Object.keys(cache)) set.add(k.toLowerCase());
  return set;
}

const KNOWN = loadKnownKeys();
// Gate only on CLEAN keys — a key carrying a paren or an asterisk is itself
// catalog corruption (it was harvested from damaged tokens), not something
// worth preserving.
const GATE_KEYS = [...KNOWN]
  .filter((k) => !/[()*]/.test(k) && k.length > 3 &&
    !/^(color|colour|for [a-z]+|b\d+|vit\.? ?b\d+|preservative|natural|flavou?rs?|vitamins?|minerals?|milk|wheat|sodium)$/.test(k))
  .sort((a, b) => b.length - a.length);
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const GATE_RE = new Map(GATE_KEYS.map((k) => [k, new RegExp(`(?<![a-z0-9])${escRe(k)}(?![a-z0-9])`, 'i')]));
function keysIn(text) {
  const found = new Set();
  for (const k of GATE_KEYS) if (GATE_RE.get(k).test(text)) found.add(k);
  return found;
}

// The oil-disclosure resolver deliberately drops the generic parent once the
// specific oils are recovered (commit 6e8fcf5, founder-reviewed). Not a loss.
const INTENTIONAL_DROPS = new Set([
  'vegetable oil', 'vegetable oils', 'oils', 'oil blend',
  'canola and/or sunflower oil', 'hydrogenated vegetable oil',
]);
const MAX_KEY_LOSS = 3;

// ─── products.js surgery ────────────────────────────────────────────────────

/** Finds each `ingredients: [ ... ]` span, quote-aware. */
function findIngredientSpans(src) {
  const spans = [];
  const marker = 'ingredients: [';
  let idx = src.indexOf(marker);
  while (idx !== -1) {
    const open = idx + marker.length - 1;
    let depth = 0, quote = null, end = -1;
    for (let i = open; i < src.length; i += 1) {
      const ch = src[i];
      if (quote) {
        if (ch === '\\') i += 1;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
      if (ch === '[') depth += 1;
      if (ch === ']') { depth -= 1; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) throw new Error(`Unterminated ingredients array at ${idx}`);
    spans.push({ open, end, body: src.slice(open, end + 1) });
    idx = src.indexOf(marker, end);
  }
  return spans;
}

function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function main() {
  const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const spans = findIngredientSpans(raw);

  let changed = 0, skipped = 0, unchanged = 0, tokensBefore = 0, tokensAfter = 0;
  const skipList = [];
  const edits = [];

  for (const span of spans) {
    const before = vm.runInNewContext(`(${span.body})`, Object.create(null), { timeout: 5000 });
    if (!Array.isArray(before) || before.length === 0) { unchanged++; continue; }

    const after = normalizeProductIngredients(before);
    if (after.length === 0) { skipped++; skipList.push({ before, reason: 'would empty the array' }); continue; }

    const lostKeys = [...keysIn(before.join(' | ').toLowerCase())]
      .filter((k) => !keysIn(after.join(' | ')).has(k) && !INTENTIONAL_DROPS.has(k));
    if (lostKeys.length >= MAX_KEY_LOSS) {
      skipped++;
      skipList.push({ before, reason: `would lose ${lostKeys.length} known keys`, lostKeys });
      continue;
    }

    const same = after.length === before.length &&
      after.every((t, i) => t === String(before[i]).trim().toLowerCase());
    if (same) { unchanged++; continue; }

    tokensBefore += before.length;
    tokensAfter += after.length;
    changed++;

    // Preserve the file's existing single-line vs multi-line shape.
    const multiline = span.body.includes('\n');
    const body = multiline
      ? `[${eol}${after.map((t) => `      ${quote(t)},`).join(eol)}${eol}    ]`
      : `[${after.map(quote).join(', ')}]`;
    edits.push({ open: span.open, end: span.end, body });
  }

  console.log(`ingredient arrays found : ${spans.length}`);
  console.log(`unchanged               : ${unchanged}`);
  console.log(`normalized              : ${changed}`);
  console.log(`skipped (safety gate)   : ${skipped}`);
  console.log(`tokens in changed rows  : ${tokensBefore} -> ${tokensAfter}`);

  if (REPORT || skipped) {
    console.log(`\n--- skipped for manual re-research (${skipList.length}) ---`);
    for (const s of skipList) {
      console.log(`  ${s.reason}${s.lostKeys ? `: ${JSON.stringify(s.lostKeys.slice(0, 6))}` : ''}`);
      console.log(`     first tokens: ${JSON.stringify(s.before.slice(0, 2))}`);
    }
  }

  if (DRY_RUN) { console.log('\n--dry-run: no file written.'); return; }

  let out = raw;
  for (const edit of edits.sort((a, b) => b.open - a.open)) {
    out = out.slice(0, edit.open) + edit.body + out.slice(edit.end + 1);
  }
  fs.writeFileSync(PRODUCTS_FILE, out);
  console.log(`\nWrote ${PRODUCTS_FILE}`);
}

main();
