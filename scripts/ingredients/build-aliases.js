#!/usr/bin/env node

/**
 * build-aliases.js
 *
 * Closes the "alias" half of the ingredient queue (see triage-queue.js): raw
 * label strings that the app doesn't match today but that clearly ARE an
 * ingredient the dictionary already explains.
 *
 * Safety model — no new facts are ever invented:
 *   - An alias is created ONLY when the app's own shipped matcher
 *     (lookupIngredient) resolves a lightly-cleaned form of the token.
 *     We feed the matcher cleaned candidates; we never override its verdict.
 *   - The new entry copies the matched parent's risk / category / explanation
 *     verbatim. It is the same ingredient under a messier label string, so the
 *     parent's verified analysis is correct for it. Nothing is generated.
 *   - Tokens that no cleaned form resolves are left untouched and written to
 *     still-novel.json — those are genuinely new substances that need real
 *     sourced research, not an alias.
 *
 * Output:
 *   alias-map.csv        — every proposed mapping, for founder review
 *   still-novel.json     — tokens that stayed unmatched
 *   (with --apply)       — appends the alias entries to ingredientCache.js
 *
 * Usage:
 *   node scripts/ingredient-audit/build-aliases.js            # write review files
 *   node scripts/ingredient-audit/build-aliases.js --apply    # also edit the cache
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');
const CACHE_PATH = path.join(ROOT, 'src', 'data', 'ingredientCache.js');
// Match resolves against BOTH the cache (risks 2/5/8) and INGREDIENT_DB
// (risks up to 10, different field names). Threshold any risk to the app's
// enum step the same way riskToFlag() does, so a db risk of 9 or 10 becomes
// High instead of being silently dropped.
function numToToken(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  if (v >= 8) return 'High';
  if (v >= 5) return 'Medium';
  return 'Low';
}
// Cache entries carry `explanation`; INGREDIENT_DB entries carry `note`
// (customer-facing) — take whichever exists. Never synthesize text.
function entryText(entry) {
  return (entry.explanation || entry.note || '').trim();
}

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function strip(src) {
  return src
    .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}
function stripCjs(src) { return src.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, ''); }

function loadMatcher() {
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

// Qualifier / process / label-noise words. Stripping these turns a messy label
// string into the base ingredient the matcher knows. None of them change WHICH
// ingredient it is — they describe grade, cut, process, or are label filler.
const NOISE = new Set([
  'pasteurized', 'part', 'skim', 'cow', 'cows', 'semi', 'sweet', 'unsweetened',
  'gluten', 'free', 'oleic', 'reduced', 'concentrated', 'crushed',
  'minced', 'ground', 'cracked', 'rolled', 'naturally', 'derived', 'artificial',
  'natural', 'organic', 'raw', 'fresh', 'dried', 'live', 'active', 'less', 'than',
  'contains', 'of', 'to', 'protect', 'retain', 'flavor', 'flavour', 'flavored',
  'freshness', 'added', 'refined', 'expeller', 'pressed', 'cold', 'virgin',
  'extra', 'light', 'low', 'nonfat', 'liquid', 'powdered', 'granulated', 'fine',
  'coarse', 'with', 'from', 'whole', 'grade', 'a', 'premium', 'pure', 'real',
  'certified', 'roasted', 'toasted', 'unbleached', 'bleached', 'enriched',
]);

// Words that must never stand alone as a match. They are label boilerplate,
// a generic class, or a bare ion/chemical fragment — matching a specific
// compound to one of these loses the ingredient's identity (e.g. "d alpha
// tocopheryl acetate" is vitamin E, not "acetate"). A token that only reduces
// to one of these is left for real research instead of mis-aliased. They are
// still allowed INSIDE a multi-word candidate ("modified food starch" is fine).
const GENERIC_DENY = new Set([
  // label boilerplate / generic classes
  'contains', 'preserves', 'maintains', 'processed', 'resistant', 'edible',
  'product', 'products', 'base', 'agents', 'agent', 'nutrients', 'leavening',
  'antioxidant', 'preservative', 'preservatives', 'color', 'colors', 'colour',
  'colouring', 'coloring', 'flavoring', 'flavouring', 'seasoning', 'solids',
  'rendered', 'clarified', 'textured', 'milled', 'blend', 'blends', 'concentrate',
  'acid', 'acids', 'smoke', 'isolated', 'microbial', 'cultured', 'distilled',
  'cooked', 'including', 'mixed', 'enrichment', 'disodium', 'monosodium',
  'aluminum', 'aluminium', 'liquid', 'natural',
  // bare ions / generic chemistry fragments
  'acetate', 'oxide', 'sulfate', 'sulphate', 'benzoate', 'sorbate', 'citrate',
  'gluconate', 'phosphate', 'pyrophosphate', 'chloride', 'sodium', 'potassium',
  'calcium', 'ammonium', 'ferric', 'ferrous', 'mono', 'methyl', 'ester', 'esters',
  'hydrolysate', 'stearate', 'monostearate', 'monoglyceride', 'triglycerides',
  // form / cut / shape / container words — the ingredient is the modifier,
  // not this head noun ("almond pieces" is almond, "chicory root" is chicory)
  'swirl', 'filling', 'topping', 'toppings', 'sticks', 'stick', 'chips', 'chip',
  'crumbs', 'crumb', 'pieces', 'piece', 'spread', 'candy', 'hearts', 'heart',
  'leaf', 'leaves', 'peel', 'peels', 'skin', 'skins', 'powder', 'root', 'roots',
  'sprinkles', 'bits', 'bit', 'chunks', 'chunk', 'flakes', 'flake', 'curls',
  'shavings', 'shreds', 'shred', 'strips', 'strip', 'cubes', 'cube', 'slices',
  'slice', 'halves', 'wedges', 'wedge', 'rings', 'ring', 'meal', 'coating',
  'glaze', 'drizzle', 'ribbon', 'puree', 'dust', 'granules', 'pearls', 'nibs',
  'morsels', 'shell', 'shells', 'kernels', 'kernel', 'florets', 'spears',
  'rounds', 'wafers', 'flour',
]);

/**
 * Candidate cleaned forms, least-aggressive first, so the most specific match
 * wins. Every candidate is a real reduction of the token — a subset of its
 * words in order — never anything added. Single-word candidates on the
 * GENERIC_DENY list are never emitted.
 */
function candidates(raw) {
  const words = raw.toLowerCase().split(/\s+/).filter(Boolean);
  const out = [];
  const push = (arr) => {
    const s = arr.join(' ').trim();
    if (!s || out.includes(s)) return;
    if (arr.length === 1 && GENERIC_DENY.has(s)) return; // no lone generic fragment
    out.push(s);
  };

  // Split "X and or Y" / "X and Y" / "X or Y": try the first alternative first,
  // it's usually the primary ingredient ("safflower and or canola oil").
  const joinIdx = words.findIndex((w, i) => (w === 'and' || w === 'or') && i > 0);
  if (joinIdx > 0) push(words.slice(0, joinIdx));

  // Strip qualifier/process words, then try EVERY contiguous sub-phrase of the
  // remaining words, longest first, left to right. Longest-first means the most
  // specific real ingredient wins ("orange juice" before "orange"), and a lone
  // generic head ("solids", "acetate") is never emitted at all.
  // Within each length, scan right-to-left: the head noun of an English food
  // phrase is the last content word ("vegetable mono diglycerides" is
  // diglycerides, not vegetable), so a sub-phrase nearer the end is the more
  // faithful ingredient and should be tried first.
  const dense = words.filter((w) => !NOISE.has(w));
  for (let size = dense.length; size >= 1; size--) {
    for (let start = dense.length - size; start >= 0; start--) {
      push(dense.slice(start, start + size));
    }
  }
  return out;
}

function main() {
  const apply = process.argv.includes('--apply');
  const lookupIngredient = loadMatcher();
  const novel = JSON.parse(read('scripts/ingredient-audit/novel-tokens.json'));

  const aliases = [];
  const stillNovel = [];
  for (const item of novel) {
    let matched = null;
    for (const cand of candidates(item.name)) {
      const hit = lookupIngredient(cand);
      if (!hit || !hit.entry) continue;
      const token = numToToken(hit.entry.risk);
      if (!token) continue;
      // Reject a single-word candidate that comes back High. Reducing a whole
      // label token down to one word AND getting "dangerous" is almost always
      // a fuzzy false-positive on a same-spelled dye (e.g. "orange" the fruit
      // hitting an orange dye). Multi-word High matches are trustworthy.
      if (cand.split(' ').length === 1 && token === 'High') continue;
      matched = { via: cand, token, entry: hit.entry };
      break;
    }
    if (matched) {
      aliases.push({
        token: item.name.toLowerCase().trim(),
        freq: item.freq,
        via: matched.via,
        token_risk: matched.token,
        category: matched.entry.category || 'additives',
        explanation: entryText(matched.entry),
      });
    } else {
      stillNovel.push(item);
    }
  }

  // De-dup against keys already present (a token whose normalized form already
  // equals a live key would be redundant).
  const existing = new Set(
    [...read('src/data/ingredientCache.js').matchAll(/^ {2}'((?:[^'\\]|\\.)*)':/gm)]
      .map((m) => m[1].replace(/\\'/g, "'"))
  );
  const fresh = aliases.filter((a) => !existing.has(a.token));

  // Review file.
  const csv = ['token,frequency,matched_via,risk,category']
    .concat(fresh.map((a) =>
      `"${a.token.replace(/"/g, '""')}",${a.freq},"${a.via.replace(/"/g, '""')}",${a.token_risk},${a.category}`
    )).join('\n');
  fs.writeFileSync(path.join(__dirname, 'alias-map.csv'), csv);
  fs.writeFileSync(path.join(__dirname, 'still-novel.json'), JSON.stringify(stillNovel, null, 0));

  console.log('novel tokens in:      ', novel.length);
  console.log('alias-able (matched): ', aliases.length, '(', fresh.length, 'new after de-dup)');
  console.log('still novel (research):', stillNovel.length);
  console.log('\nReview file: scripts/ingredient-audit/alias-map.csv');
  console.log('Sample mappings:');
  for (const a of fresh.slice(0, 20)) console.log(`  ${a.token}  ->  [${a.via}]  ${a.token_risk}`);

  if (!apply) { console.log('\nNo --apply: cache not touched.'); return; }

  let source = read('src/data/ingredientCache.js');
  const jsStr = (v) => String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const block = fresh.map((a) =>
    `  '${jsStr(a.token)}': { risk: IngredientRisk.${a.token_risk}, category: '${jsStr(a.category)}', explanation: '${jsStr(a.explanation)}' },`
  ).join('\n');
  const closeIdx = source.indexOf('\n};', source.indexOf('CACHED_INGREDIENT_ANALYSIS = {'));
  const marker = '\n  // --- Aliases resolved from the audit queue (2026-08-08): messy label\n' +
    '  // strings mapped to an existing ingredient by the app\'s own matcher ---\n';
  source = source.slice(0, closeIdx) + marker + block + '\n' + source.slice(closeIdx + 1);
  fs.writeFileSync(CACHE_PATH, source);
  console.log(`\nApplied ${fresh.length} alias entries to ${path.relative(ROOT, CACHE_PATH)}.`);
}

main();
