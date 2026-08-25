#!/usr/bin/env node

/**
 * Phase 2 of the ingredient-parsing overhaul — SAFE vs NEEDS-RE-FETCH
 * classification (read-only). Reuses the loader pattern from
 * scripts/catalog-database/phase2-drift.js.
 *
 * For every product currently in MANUAL_PRODUCTS (src/data/products.js —
 * read as-is, whatever Chad's latest wave left it as), this:
 *   1. Re-normalizes the ingredients text with the CURRENT (Part-1-fixed)
 *      normalizeIngredientTokens().
 *   2. Re-scores old vs new with the exact scorer bundle the offline SQLite
 *      build uses (build-products-sqlite.js's loadScorer()).
 *   3. Classifies the re-parse as SAFE-TO-APPLY (no OCR/nutrition-facts/
 *      packaging garbage survives in the new tokens) or NEEDS-RE-FETCH (some
 *      does — re-parsing only reshuffles contamination that was already in
 *      the stored text; the real fix is a verbatim OFF re-fetch).
 *   4. Also re-parses with the PRE-Part-1 normalizer (loaded from git HEAD)
 *      to measure how many products the Part-1 tail-rescue tweak moved out
 *      of garbage-survives territory.
 *
 * Does NOT write src/data/products.js or assets/db/products.db. Does NOT
 * commit. Output:
 *   scripts/catalog-database/phase2-safe-list.md
 *   scripts/catalog-database/phase2-refetch-list.md
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SAFE_LIST_PATH = path.join(__dirname, 'phase2-safe-list.md');
const REFETCH_LIST_PATH = path.join(__dirname, 'phase2-refetch-list.md');

const {
  normalizeIngredientTokens,
  isLabelBoilerplate,
} = require(path.join(ROOT, 'src', 'utils', 'ingredientNormalizer.js'));

function readSource(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// ─── Loaders copied verbatim (behavior-identical) from build-products-sqlite.js / phase2-drift.js ──

function objectLiteralAfter(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Marker not found: ${marker}`);

  const start = source.indexOf('{', markerIndex);
  if (start < 0) throw new Error(`Object start not found after: ${marker}`);

  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n' || ch === '\r') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  throw new Error(`Object end not found after: ${marker}`);
}

function evalObjectLiteral(literal, label) {
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    filename: label,
    timeout: 30000,
  });
}

function loadManualProducts() {
  const source = readSource('src/data/products.js');
  const literal = objectLiteralAfter(source, 'const MANUAL_PRODUCTS =');
  return evalObjectLiteral(literal, 'MANUAL_PRODUCTS');
}

function loadCompanies() {
  const source = readSource('src/data/companies.js');
  const literal = objectLiteralAfter(source, 'export const COMPANY_DB =');
  return evalObjectLiteral(literal, 'COMPANY_DB');
}

function transformExports(source) {
  return source
    .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}

function stripModuleExports(source) {
  return source.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, '');
}

function loadScorer(companies) {
  const bundle = [
    transformExports(readSource('src/data/ingredientCache.js')),
    transformExports(readSource('src/data/ingredients.js')),
    stripModuleExports(readSource('src/utils/ingredientNormalizer.js')),
    transformExports(readSource('src/utils/sourcingMatch.js')),
    transformExports(readSource('src/utils/scorer.js')),
    // lookupIngredient/getKnownKeysSet are exported alongside scoreProduct so
    // this script's garbage classifier can mirror analyzeIngredients()'s
    // exact-hit / weak-hit / no-hit branching EXACTLY (see classifyToken()
    // below) instead of reimplementing the DB lookup logic separately.
    '\nmodule.exports = { scoreProduct, scoreToGrade, lookupIngredient, getKnownKeysSet };',
  ].join('\n\n');

  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    COMPANY_DB: companies,
  };

  vm.runInNewContext(bundle, sandbox, {
    filename: 'scorer-bundle.js',
    timeout: 30000,
  });

  if (typeof sandbox.module.exports.scoreProduct !== 'function') {
    throw new Error('scoreProduct was not exported from scorer bundle');
  }
  return sandbox.module.exports;
}

// ─── PRE-Part-1 normalizer, loaded from git HEAD, for the "how many products
// did the Part-1 tweak move into safe" comparison. Best-effort: if git or
// the require fails for any reason, the comparison is skipped (reported as
// "unknown") rather than crashing the whole classification run. ──────────
function loadOldNormalizer() {
  try {
    const oldSource = execFileSync('git', ['show', 'HEAD:src/utils/ingredientNormalizer.js'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    const tmpPath = path.join(os.tmpdir(), `ingredientNormalizer-pre-part1-${Date.now()}.js`);
    fs.writeFileSync(tmpPath, oldSource, 'utf8');
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mod = require(tmpPath);
    try { fs.unlinkSync(tmpPath); } catch (_e) { /* best-effort cleanup */ }
    if (typeof mod.normalizeIngredientTokens !== 'function') return null;
    return mod.normalizeIngredientTokens;
  } catch (e) {
    console.warn(`Could not load pre-Part-1 normalizer from git HEAD (skipping that comparison): ${e.message}`);
    return null;
  }
}

// ─── Garbage-token detection ──────────────────────────────────────────────
//
// Mirrors the app's OWN DB-lookup gate (scorer.js's analyzeIngredients(): a
// strong DB hit is never garbage; a weak hit only goes through
// isLabelBoilerplate) and then applies this script's OWN narrow "is this
// actually OCR/nutrition-facts/packaging contamination" checks to whatever
// has no DB hit at all — see classifyToken() and looksLikeMangledOCR() below
// for why this does NOT reuse classifyTokenPlausibility's full verdict.
const NUTRITION_VOCAB_PATTERNS = [
  /\bnutrition\s*facts?\b/i,
  /\bsupplement\s*facts?\b/i,
  /\bcalories?\b.{0,20}?\d/i,
  /\d.{0,10}?\bcalories?\b/i,
  /\bsaturated\s+fat\b/i,
  /\btrans\s+fat\b/i,
  /\btotal\s+fat\b.{0,10}?\d/i,
  /\bsodium\b.{0,12}?\d/i,
  /\bcholesterol\b.{0,12}?\d/i,
  /\bdietary\s+fiber\b/i,
  /\btotal\s+carb(ohydrate)?/i,
  /\btotal\s+sugars?\b/i,
  /\badded\s+sugars?\b/i,
  /%\s*dv\b/i,
  /\bdaily\s+values?\b/i,
  /\bserving\s+size\b/i,
  /\bservings?\s+per\s+(container|package)\b/i,
  /\b\d+(\.\d+)?\s*mg\b/i,
  /\b\d+(\.\d+)?\s*mcg\b/i,
  /\b\d+(\.\d+)?\s*%\s*(dv)?\b/,
];

// A short run dominated by bare numbers/percent fragments ("11", "0g" as its
// own word, "8%") that the structural OCR check below doesn't catch on its
// own (a digit-glued-to-letter check needs a letter to pair with; a bare
// "11" has none).
function looksNumericHeavy(t) {
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 5) return false;
  const numericish = words.filter((w) => /^\d+(\.\d+)?%?$/.test(w));
  return numericish.length > 0 && numericish.length / words.length >= 0.34;
}

// "Obvious mangled OCR" — the STRUCTURAL half of ingredientNormalizer.js's
// classifyTokenPlausibility (digit glued to a letter, a trademark glyph, no
// vowel anywhere, a run-on >6-word sentence, 2+ single-letter word
// fragments — "high share of non-word tokens" in shape). Deliberately
// excludes classifyTokenPlausibility's OTHER branch — "<=2 words and none of
// them is in the COMMON_INGREDIENT_WORDS list" — because that branch tests
// DATABASE COVERAGE, not OCR mangling: it's what wrongly flagged real,
// simply-uncatalogued ingredient phrases like "carrot extractives", "celery
// root", "basil leaves", "sriracha", and "katsuwonus pelamis" (a real
// scientific name for skipjack tuna) as NEEDS-RE-FETCH in an earlier version
// of this script. Re-fetching from OFF would not fix any of those — the
// stored text is already correct, the app's ingredient DB just hasn't
// catalogued the phrase yet, which is a separate (non-Phase-2) problem.
function looksLikeMangledOCR(t) {
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;
  const hasDigitInWord = words.some((w) => /[a-z]/i.test(w) && /\d/.test(w));
  const hasTrademarkGlyph = /[®™]/.test(t);
  const hasVowel = /[aeiouy]/i.test(t);
  const tooManyWords = words.length > 6;
  const singleLetterWordCount = words.filter((w) => w.length === 1).length;
  return hasDigitInWord || hasTrademarkGlyph || !hasVowel || tooManyWords || singleLetterWordCount >= 2;
}

function classifyToken(token, lookupIngredient) {
  const t = String(token || '');

  // Hard, vocabulary-specific signals apply REGARDLESS of any DB hit —
  // checked FIRST because a giant garbled OCR blob can accidentally
  // strong-match a short DB phrase buried inside it. Real case that
  // surfaced this: the Philadelphia Whipped Cream Cheese Spread's entire
  // mangled Nutrition Facts panel ("nutrition facts amount/serving %
  // baily vaiza ... saturated fat 2.5g ... cholesterol 15mg ...") got a
  // STRONG (non-weak) DB hit against "saturated fat" via the cleaned-phrase
  // lookup, which would have wrongly skipped every other check below if the
  // hit-strength short-circuit ran first. isLabelBoilerplate/nutrition-vocab
  // are specific enough vocabulary matches that they never false-positive on
  // a real ingredient name, so it's safe to apply them unconditionally.
  if (isLabelBoilerplate(t)) return { garbage: true, reason: 'label-boilerplate-or-contact' };
  if (NUTRITION_VOCAB_PATTERNS.some((re) => re.test(t))) return { garbage: true, reason: 'nutrition-vocab' };

  const hit = lookupIngredient(t);
  if (hit && !hit.weak) {
    // Strong/exact DB match — the remaining checks below (structural OCR
    // shape, numeric-heavy fragment) are exactly the ones that would
    // otherwise misflag real short DB entries like "vitamin b1"/
    // "vitamin b12" (digit glued to a letter), so skip them here.
    return { garbage: false };
  }

  // Weak hit or no hit at all — the structural/numeric checks below are
  // exactly what's needed here: a weak (single-shared-token) hit is no
  // stronger evidence of being a real ingredient than no hit at all (see
  // lookupIngredient's own "weak" contract in scorer.js).
  if (looksLikeMangledOCR(t)) return { garbage: true, reason: 'mangled-ocr' };
  if (looksNumericHeavy(t)) return { garbage: true, reason: 'numeric-heavy-fragment' };
  return { garbage: false };
}

function findGarbageTokens(tokens, lookupIngredient) {
  const hits = [];
  for (const tok of tokens) {
    const verdict = classifyToken(tok, lookupIngredient);
    if (verdict.garbage) hits.push({ token: tok, reason: verdict.reason });
  }
  return hits;
}

function shortList(arr, n = 8) {
  if (!arr || arr.length === 0) return '(none)';
  const shown = arr.slice(0, n).join(', ');
  return arr.length > n ? `${shown}, ...(+${arr.length - n} more)` : shown;
}

function main() {
  console.log('Loading MANUAL_PRODUCTS, COMPANY_DB...');
  const manualProducts = loadManualProducts();
  const companies = loadCompanies();
  console.log(`Loaded ${Object.keys(manualProducts).length} manual products, ${Object.keys(companies).length} companies.`);

  console.log('Loading scorer bundle...');
  const { scoreProduct, lookupIngredient, getKnownKeysSet } = loadScorer(companies);
  if (typeof lookupIngredient !== 'function' || typeof getKnownKeysSet !== 'function') {
    throw new Error('lookupIngredient/getKnownKeysSet were not exported from the scorer bundle');
  }
  const knownKeysSet = getKnownKeysSet();
  console.log(`Scorer loaded. ${knownKeysSet.size} known ingredient keys.`);

  const normalizeOld = loadOldNormalizer();
  console.log(normalizeOld ? 'Pre-Part-1 normalizer loaded from git HEAD.' : 'Pre-Part-1 normalizer NOT available — "moved to safe" count will be reported as unknown.');

  const total = Object.keys(manualProducts).length;
  let processed = 0;
  let errored = 0;
  const errors = [];

  const safeList = [];      // { barcode, name, brand, oldIngredients, newIngredients, oldScore, newScore, delta }
  const refetchList = [];   // { barcode, name, brand, garbage: [{token, reason}] }

  let movedToSafeByPart1 = 0;
  let part1ComparisonAvailable = Boolean(normalizeOld);

  // Score-delta distribution — SAFE set only.
  let scoreDeltaUp = 0;
  let scoreDeltaDown = 0;
  let scoreDeltaSame = 0;
  const bucket1_2 = { up: 0, down: 0 };
  const bucket3_5 = { up: 0, down: 0 };
  const bucket6_10 = { up: 0, down: 0 };
  const bucketOver10 = { up: 0, down: 0 };

  for (const [barcode, product] of Object.entries(manualProducts)) {
    processed += 1;
    try {
      const oldIngredients = Array.isArray(product.ingredients) ? product.ingredients : [];
      const rawText = oldIngredients.join(', ');
      const newIngredients = normalizeIngredientTokens(rawText);

      const name = product.name || '(unnamed)';
      const brand = product.brand || '';

      const garbageHits = findGarbageTokens(newIngredients, lookupIngredient);
      const isSafe = garbageHits.length === 0;

      let oldScore = null;
      let newScore = null;
      try { oldScore = scoreProduct(product)?.score ?? null; } catch (e) { throw new Error(`old score failed: ${e.message}`); }
      try { newScore = scoreProduct({ ...product, ingredients: newIngredients })?.score ?? null; } catch (e) { throw new Error(`new score failed: ${e.message}`); }

      if (part1ComparisonAvailable) {
        try {
          const oldParserTokens = normalizeOld(rawText);
          const oldParserGarbage = findGarbageTokens(oldParserTokens, lookupIngredient).length > 0;
          if (oldParserGarbage && isSafe) movedToSafeByPart1 += 1;
        } catch (_e) {
          // Best-effort — a single product failing the old-parser comparison
          // doesn't block the rest of the run.
        }
      }

      if (isSafe) {
        const delta = (Number.isFinite(oldScore) && Number.isFinite(newScore)) ? newScore - oldScore : null;
        safeList.push({ barcode, name, brand, oldIngredients, newIngredients, oldScore, newScore, delta });

        if (delta != null) {
          if (delta > 0) scoreDeltaUp += 1;
          else if (delta < 0) scoreDeltaDown += 1;
          else scoreDeltaSame += 1;

          const abs = Math.abs(delta);
          const dir = delta > 0 ? 'up' : 'down';
          if (delta !== 0) {
            if (abs <= 2) bucket1_2[dir] += 1;
            else if (abs <= 5) bucket3_5[dir] += 1;
            else if (abs <= 10) bucket6_10[dir] += 1;
            else bucketOver10[dir] += 1;
          }
        }
      } else {
        refetchList.push({ barcode, name, brand, garbage: garbageHits, oldIngredients, newIngredients });
      }
    } catch (e) {
      errored += 1;
      errors.push({ barcode, name: product?.name || '(unknown)', message: e.message });
    }

    if (processed % 2000 === 0) console.log(`Processed ${processed}/${total}...`);
  }

  console.log(`Done. Processed ${processed}, errored ${errored}.`);
  console.log(`SAFE: ${safeList.length}. NEEDS-RE-FETCH: ${refetchList.length}.`);
  console.log(`Moved into safe by the Part-1 tweak (vs. pre-Part-1 parser): ${part1ComparisonAvailable ? movedToSafeByPart1 : 'unknown (git HEAD load failed)'}`);

  // ── SAFE list ──
  const safeLines = [];
  safeLines.push('# Phase 2 — SAFE-TO-APPLY re-parse list');
  safeLines.push('');
  safeLines.push('Generated by scripts/catalog-database/phase2-classify.js. Read-only analysis — src/data/products.js and assets/db/products.db were NOT modified. No commit was made.');
  safeLines.push('');
  safeLines.push('A product is SAFE when re-normalizing its stored ingredients text with the current (Part-1-fixed) normalizeIngredientTokens() produces NO surviving OCR/nutrition-facts/packaging garbage token (see phase2-refetch-list.md\'s detection rules). Applying these re-parses to products.js is a mechanical, low-risk change — no verbatim OFF re-fetch needed.');
  safeLines.push('');
  safeLines.push('## Summary');
  safeLines.push('');
  safeLines.push(`- Total products in MANUAL_PRODUCTS: ${total}`);
  safeLines.push(`- Products processed successfully: ${processed - errored} (errored/skipped: ${errored})`);
  safeLines.push(`- SAFE-TO-APPLY: ${safeList.length}`);
  safeLines.push(`- NEEDS-RE-FETCH: ${refetchList.length} (see phase2-refetch-list.md)`);
  safeLines.push(`- Products the Part-1 advisory-tail-rescue tweak moved from "garbage survives" to SAFE: ${part1ComparisonAvailable ? movedToSafeByPart1 : 'unknown — pre-Part-1 normalizer could not be loaded from git HEAD'}`);
  safeLines.push('');
  safeLines.push('### Score-delta distribution — SAFE set only (|old score - new score|)');
  safeLines.push('');
  safeLines.push(`- No score change: ${scoreDeltaSame}`);
  safeLines.push(`- Moved up: ${scoreDeltaUp} | Moved down: ${scoreDeltaDown}`);
  safeLines.push('');
  safeLines.push('| Bucket | Moved up | Moved down |');
  safeLines.push('|---|---|---|');
  safeLines.push(`| 1-2 points | ${bucket1_2.up} | ${bucket1_2.down} |`);
  safeLines.push(`| 3-5 points | ${bucket3_5.up} | ${bucket3_5.down} |`);
  safeLines.push(`| 6-10 points | ${bucket6_10.up} | ${bucket6_10.down} |`);
  safeLines.push(`| >10 points | ${bucketOver10.up} | ${bucketOver10.down} |`);
  safeLines.push('');
  if (errors.length > 0) {
    safeLines.push('### Processing errors (skipped, not counted in either list)');
    safeLines.push('');
    for (const e of errors.slice(0, 50)) safeLines.push(`- \`${e.barcode}\` ${e.name}: ${e.message}`);
    if (errors.length > 50) safeLines.push(`- ...and ${errors.length - 50} more.`);
    safeLines.push('');
  }

  // Sort by |delta| descending so the biggest movers are easy to spot-check first.
  const safeSorted = safeList.slice().sort((a, b) => Math.abs(b.delta || 0) - Math.abs(a.delta || 0));

  safeLines.push(`## All SAFE-TO-APPLY products (${safeList.length} total)`);
  safeLines.push('');
  for (const p of safeSorted) {
    const deltaStr = p.delta == null ? 'n/a' : (p.delta > 0 ? `+${p.delta}` : `${p.delta}`);
    safeLines.push(`- **${p.name}**${p.brand ? ` (${p.brand})` : ''} \`${p.barcode}\` — score ${p.oldScore ?? 'n/a'} -> ${p.newScore ?? 'n/a'} (${deltaStr})`);
    safeLines.push(`  - Before: ${shortList(p.oldIngredients)}`);
    safeLines.push(`  - After: ${shortList(p.newIngredients)}`);
  }
  safeLines.push('');

  fs.writeFileSync(SAFE_LIST_PATH, safeLines.join('\n'), 'utf8');
  console.log(`SAFE list written to ${SAFE_LIST_PATH}`);

  // ── NEEDS-RE-FETCH list ──
  const refetchLines = [];
  refetchLines.push('# Phase 2 — NEEDS-RE-FETCH list');
  refetchLines.push('');
  refetchLines.push('Generated by scripts/catalog-database/phase2-classify.js. Read-only analysis — src/data/products.js and assets/db/products.db were NOT modified. No commit was made.');
  refetchLines.push('');
  refetchLines.push('A product lands here when re-normalizing its stored ingredients text with the current (Part-1-fixed) normalizeIngredientTokens() still leaves at least one OCR/nutrition-facts/packaging garbage token in the parsed output. Re-parsing only reshuffles contamination that was ALREADY in the stored ingredients text — the real fix is a verbatim OpenFoodFacts re-fetch of the ingredients_text field, not another local re-parse.');
  refetchLines.push('');
  refetchLines.push('**Detection rules** — applied to a token ONLY after `lookupIngredient()` (the exact app-runtime DB lookup) finds no strong hit; a strong hit is never garbage, and a WEAK (single-shared-word) hit only goes through the boilerplate check, exactly like the app runtime\'s own `analyzeIngredients()`. A token is garbage if ANY of these fire:');
  refetchLines.push('- `isLabelBoilerplate()` true (packaging-boilerplate vocabulary or a contact detail/handle/domain/ZIP — same check the app runtime uses)');
  refetchLines.push('- Nutrition-facts vocabulary (calories/sodium/saturated fat/total fat/cholesterol/dietary fiber/total carb/% DV/serving size/servings per container, or an `Xmg`/`Xmcg`/`X%` macro fragment)');
  refetchLines.push('- Obvious mangled OCR: a digit glued directly to a letter in the same word, a trademark glyph, no vowel anywhere in the token, a run-on sentence over 6 words, or 2+ single-letter word fragments');
  refetchLines.push('- A short token dominated by bare numeric/percent fragments (OCR noise like a stray "11" or "0g" that survived as its own word)');
  refetchLines.push('');
  refetchLines.push('Deliberately NOT a garbage signal here: a short (1-2 word) unmatched token that simply isn\'t in the ingredient database yet ("carrot extractives", "celery root", "sriracha", "katsuwonus pelamis" — a real scientific name for skipjack tuna). That\'s a database-coverage gap, not OCR/packaging contamination — a verbatim OFF re-fetch would not fix it, so it does not belong in this list.');
  refetchLines.push('');
  refetchLines.push('## Summary');
  refetchLines.push('');
  refetchLines.push(`- Total products in MANUAL_PRODUCTS: ${total}`);
  refetchLines.push(`- Products processed successfully: ${processed - errored} (errored/skipped: ${errored})`);
  refetchLines.push(`- SAFE-TO-APPLY: ${safeList.length} (see phase2-safe-list.md)`);
  refetchLines.push(`- NEEDS-RE-FETCH: ${refetchList.length}`);
  refetchLines.push(`- Products the Part-1 advisory-tail-rescue tweak moved from "garbage survives" to SAFE: ${part1ComparisonAvailable ? movedToSafeByPart1 : 'unknown — pre-Part-1 normalizer could not be loaded from git HEAD'}`);
  refetchLines.push('');
  if (errors.length > 0) {
    refetchLines.push('### Processing errors (skipped, not counted in either list)');
    refetchLines.push('');
    for (const e of errors.slice(0, 50)) refetchLines.push(`- \`${e.barcode}\` ${e.name}: ${e.message}`);
    if (errors.length > 50) refetchLines.push(`- ...and ${errors.length - 50} more.`);
    refetchLines.push('');
  }

  refetchLines.push(`## All NEEDS-RE-FETCH products (${refetchList.length} total)`);
  refetchLines.push('');
  for (const p of refetchList) {
    const garbageStr = p.garbage.map((g) => `"${g.token}" (${g.reason})`).join('; ');
    refetchLines.push(`- **${p.name}**${p.brand ? ` (${p.brand})` : ''} \`${p.barcode}\``);
    refetchLines.push(`  - Garbage token(s): ${garbageStr}`);
  }
  refetchLines.push('');

  fs.writeFileSync(REFETCH_LIST_PATH, refetchLines.join('\n'), 'utf8');
  console.log(`NEEDS-RE-FETCH list written to ${REFETCH_LIST_PATH}`);

  return {
    total,
    processed,
    errored,
    safeCount: safeList.length,
    refetchCount: refetchList.length,
    movedToSafeByPart1: part1ComparisonAvailable ? movedToSafeByPart1 : null,
    scoreDeltaUp,
    scoreDeltaDown,
    scoreDeltaSame,
  };
}

try {
  const summary = main();
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  console.error(`FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
}
