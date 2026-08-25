/**
 * validate-ingredients.js — Octavius pipeline guardrail (run before Stage 4 merge).
 *
 * Scans a product's `ingredients` array for the contamination Phase 1-2
 * (2026-08) spent real effort cleaning out of the catalog, so it cannot be
 * reintroduced by a future add. The reference bug this guards against — Ben's
 * rice stored as:
 *   "parboiled long grain brown rice (less than 2% canola oil that adds a
 *    trivial amount of saturated fat)"
 *   "and bioengineered food ingredient"
 * — is a lead-in disclaimer + editorial commentary glued onto one ingredient
 * token, plus a USDA bioengineered disclosure stored as if it were an
 * ingredient row. Both should never have been anything but VERBATIM,
 * separate label tokens.
 *
 * Detection reuses the machinery already in src/utils/ingredientNormalizer.js
 * (ADVISORY_PATTERNS, isLabelBoilerplate, detectBioengineered) instead of
 * re-deriving those regexes. Two additions here are NOT in that module:
 *   - an "editorial connector" check for phrases like "that adds" / "which
 *     provides" — ingredientNormalizer only strips that shape of text
 *     internally to REPAIR a token (EDITORIAL_TAIL_PATTERNS is not exported);
 *     this file needs to FLAG the same shape for human review instead, so it
 *     carries a narrow mirror of that list. Keep the two in sync if
 *     ingredientNormalizer's list changes.
 *   - a plain >6-word length check for run-on/OCR tokens. Deliberately NOT
 *     ingredientNormalizer's classifyTokenPlausibility: that function's extra
 *     structural checks (no-vowel, short-token-not-a-common-word) are
 *     calibrated for tokens that already failed a full INGREDIENT_DB lookup
 *     (scorer.js only calls it on a DB miss) — used directly on raw label
 *     tokens here it false-positived on ordinary short real names this
 *     validator has no DB access to confirm ("tbhq", "arabica coffee").
 *
 * Library usage (e.g. from an Octavius Stage 3 review step):
 *   const { validateIngredients } = require('./validate-ingredients');
 *   const offenders = validateIngredients(product.ingredients);
 *   // offenders: [{ token, reasons: string[] }, ...] — [] means clean
 *
 * CLI usage (scan every product in a batch file):
 *   node scripts/catalog-database/validate-ingredients.js <batch_formatted.js|_reviewed.js>
 * Exit code 0 = clean, 1 = offenders found (fix before merge), 2 = usage error.
 */

const fs = require('fs');
const path = require('path');
const {
  ADVISORY_PATTERNS,
  isLabelBoilerplate,
  detectBioengineered,
} = require('../../src/utils/ingredientNormalizer');

// ── Editorial-connector check ────────────────────────────────────────────────
// Narrow mirror of EDITORIAL_TAIL_PATTERNS in ingredientNormalizer.js (not
// exported there — it's used to repair a token, not to flag one). Catches
// "canola oil that adds a trivial amount of saturated fat",
// "riboflavin which is a source of vitamin b2", "bht added to preserve
// freshness" style commentary glued onto a real ingredient name.
const EDITORIAL_CONNECTOR_PATTERNS = [
  /\b(?:that|which)\s+(?:adds?|provides?|is\s+a\s+source\s+of|helps?)\b/i,
  /\b(?:to|for)\s+(?:preserve|protect|enhance|maintain|retain)\s+(?:freshness|color|colou?r|texture|quality)\b/i,
  /\bas\s+an?\s+(?:source\s+of|preservative|emulsifier|anticaking\s+agent|antioxidant|stabilizer|flavou?r\s+enhancer|colou?r(?:ing)?)\b/i,
  /\badded\s+to\s+.{0,64}?\b(?:freshness|color|colour|quality)\b/i,
];

// ── Known-ingredient keys (best-effort, used only to avoid flagging a long
// but genuinely real compound ingredient name) ────────────────────────────────
function loadKnownIngredientKeys() {
  try {
    const file = path.join(__dirname, '..', '..', 'src', 'data', 'ingredientCache.js');
    const src = fs.readFileSync(file, 'utf8').replace(/^export\s+/gm, '');
    const mod = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function(
      'module', 'exports',
      src + '\n;module.exports={CACHED_INGREDIENT_ANALYSIS};'
    )(mod, mod.exports);
    const keys = new Set();
    for (const k of Object.keys(mod.exports.CACHED_INGREDIENT_ANALYSIS || {})) keys.add(k.toLowerCase());
    return keys;
  } catch (e) {
    return null; // best-effort — validator still works without it
  }
}

let _knownKeys; // lazy + cached across calls in one process
function getKnownKeys() {
  if (_knownKeys === undefined) _knownKeys = loadKnownIngredientKeys();
  return _knownKeys;
}

/**
 * checkToken(token) -> string[] reason codes ([] = clean)
 */
function checkToken(token) {
  const t = String(token || '').trim();
  if (!t) return [];
  const reasons = [];

  if (detectBioengineered(t)) {
    reasons.push('bioengineered-disclosure-stored-as-ingredient');
  } else if (ADVISORY_PATTERNS.some((re) => re.test(t))) {
    // Covers glued lead-in disclaimers ("contains 2% of...", "less than 2%
    // of..."), "for color/freshness/texture" tails, "genetically modified"
    // mentions, and other label-advisory phrasing already recognized by
    // ingredientNormalizer.
    reasons.push('advisory-or-lead-in-disclaimer-text');
  }

  if (EDITORIAL_CONNECTOR_PATTERNS.some((re) => re.test(t))) {
    reasons.push('editorial-commentary-glued-to-ingredient');
  }

  if (isLabelBoilerplate(t)) {
    reasons.push('nutrition-facts-or-packaging-text');
  }

  // Overly long token (>6 words) — no real single ingredient declaration on
  // a US label runs that long; anything longer is either a run-on sentence
  // (editorial commentary, already caught above in most real cases) or an
  // OCR sweep that merged several label sections into one array entry.
  // Deliberately NOT delegated to ingredientNormalizer's
  // classifyTokenPlausibility here: that function's extra structural checks
  // (no-vowel, <=2-word-not-a-common-word) are calibrated for tokens that
  // already failed a full INGREDIENT_DB lookup (see scorer.js's
  // analyzeIngredients, which only calls it on a DB miss) — applied to raw
  // label tokens directly it produces false positives on ordinary short
  // real names this validator has no DB access to confirm ("tbhq",
  // "arabica coffee", "huito"). A plain word-count matches the task's own
  // >6-word rule without that noise.
  const knownKeys = getKnownKeys();
  const isKnownExact = !!(knownKeys && knownKeys.has(t.toLowerCase()));
  // A "parent (sub1, sub2, sub3)" — or the bracketed variant, "parent [sub1,
  // sub2]" — is the standard, verbatim way labels declare a compound
  // ingredient: "vegetable oil (canola oil, corn oil, sunflower oil)",
  // "diced tomatoes in juice [diced tomatoes, tomato juice, citric acid]",
  // per the Octavius decoding rule that keeps a parenthetical sub-list inside
  // its parent entry. So is a bare "X and/or Y and/or Z" oil-sourcing blend
  // with no brackets at all ("canola oil and/or safflower oil and/or
  // sunflower oil"). Both are legitimately long, not a run-on — genuine
  // contamination glued inside one ("...less than 2% canola oil that
  // adds...") is still caught above by the advisory/editorial/bioengineered
  // checks, so it is safe to exempt these shapes here. Inside a bracket/paren
  // group specifically, a bare "and" is accepted too ("vegetable shortening
  // (interesterified and hydrogenated soybean oils)") — scoped to only the
  // ends-in-)/] shape so it never exempts free-running prose that happens to
  // contain "and" without ever closing a group.
  const hasBracketedSubList = /[([]/.test(t) && /[)\]]$/.test(t) && /(,|\band\/or\b|\band\b)/i.test(t);
  const isBareAndOrBlend = /\band\/or\b/i.test(t) && !/[()[\]]/.test(t);
  const isLikelyCompoundDisclosure = hasBracketedSubList || isBareAndOrBlend;
  const wordCount = t.split(/\s+/).filter(Boolean).length;

  if (wordCount > 6 && !isKnownExact && !isLikelyCompoundDisclosure) {
    reasons.push('overly-long-token');
  }

  return reasons;
}

/**
 * validateIngredients(ingredients) -> [{ token, reasons }, ...]
 * Empty array = clean. `ingredients` should be the product's `ingredients`
 * array exactly as it will be written to products.js.
 */
function validateIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [{ token: String(ingredients), reasons: ['ingredients-not-an-array'] }];
  }
  const offenders = [];
  for (const token of ingredients) {
    const reasons = checkToken(token);
    if (reasons.length) offenders.push({ token, reasons });
  }
  return offenders;
}

// ── CLI: scan a whole batch file ─────────────────────────────────────────────
// Loads a `[batch]_formatted.js` / `[batch]_reviewed.js` file the same way
// merge_products.js does (strip `export`, eval as an object literal or a
// `BATCH_PRODUCTS` module) — no shared loader module exists yet, and this
// file must stay import-safe as a library, so the loader is duplicated here
// deliberately rather than requiring merge_products.js for its side effects.
function loadBatchEntries(filePath) {
  const src = fs.readFileSync(filePath, 'utf8').replace(/^export\s+/gm, '');

  // Attempt 1: `module.exports = {...}` (current Stage 4 convention) or a
  // top-level `const BATCH_PRODUCTS = {...}`.
  try {
    const mod = { exports: {} };
    new Function(
      'module', 'exports',
      src + '\n;try{module.exports=BATCH_PRODUCTS}catch(e){};'
    )(mod, mod.exports);
    if (mod.exports && Object.keys(mod.exports).length > 0) return mod.exports;
  } catch (e) { /* fall through */ }

  // Attempt 2: a bare `{ 'barcode': {...}, ... }` object literal.
  try {
    return new Function('return (' + src.trim().replace(/;\s*$/, '') + ')')();
  } catch (e) { /* fall through */ }

  // Attempt 3: older-style batch files whose body is a bare, unwrapped
  // comma-list of `'barcode': {...},` entries (no `{}`/`module.exports`
  // wrapper) — pre-dates the current Stage 4 convention. Wrap it.
  return new Function('return ({' + src + '})')();
}

function runCli() {
  const args = process.argv.slice(2).filter((a) => a !== '--batch');
  const fileArg = args[0];
  if (!fileArg) {
    console.error('usage: node validate-ingredients.js <batch_formatted.js|_reviewed.js>');
    process.exit(2);
  }
  const filePath = path.resolve(fileArg);
  let entries;
  try {
    entries = loadBatchEntries(filePath);
  } catch (e) {
    console.error(`could not parse ${filePath}: ${e.message}`);
    process.exit(2);
  }
  // Only score actual product entries — keyed by their own barcode, per the
  // schema merge_products.js asserts. Batch files sometimes carry sibling
  // report fields on the same exports object (e.g.
  // `module.exports.could_not_verify = [...]`); those aren't products and
  // have no `ingredients` array to check.
  const barcodes = Object.keys(entries || {}).filter(
    (k) => entries[k] && typeof entries[k] === 'object' && !Array.isArray(entries[k]) && entries[k].barcode === k
  );
  if (barcodes.length === 0) {
    console.error(`${filePath} contains no product entries (keyed by barcode).`);
    process.exit(2);
  }

  let totalOffenders = 0;
  let productsWithOffenders = 0;
  for (const bc of barcodes) {
    const p = entries[bc];
    const offenders = validateIngredients(p.ingredients);
    if (offenders.length) {
      productsWithOffenders++;
      totalOffenders += offenders.length;
      console.log(`\n${bc} — ${p.name || '(no name)'}:`);
      for (const o of offenders) {
        console.log(`  [${o.reasons.join(', ')}] "${o.token}"`);
      }
    }
  }

  if (totalOffenders === 0) {
    console.log(`CLEAN — ${barcodes.length} products, 0 offending ingredient tokens.`);
    process.exit(0);
  }
  console.log(
    `\n${totalOffenders} offending ingredient token(s) across ${productsWithOffenders}/${barcodes.length} products — fix before merge.`
  );
  process.exit(1);
}

if (require.main === module) {
  runCli();
}

module.exports = { validateIngredients, checkToken };
