#!/usr/bin/env node
/**
 * Ingredient Coverage Diagnostic
 *
 * Measures how many product ingredients are recognized vs "unknown",
 * before and after a smart-matching algorithm.
 *
 * Usage: node ingredient-coverage.js
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────────────────────────────────

// Confirmed unclassifiable across Wave 1 (2026-07-05) and Wave 2 (2026-07-05) —
// OCR noise, bare numeric fragments, and parser artifacts with no verifiable
// ingredient identity. Both waves independently punted these to
// `could_not_verify` rather than force-classify them, and they resurface at
// the top of every fresh top-150 list purely because they're high-occurrence
// junk, wasting a Chad classification slot each round on the same non-answer.
// Excluded permanently so future waves work on genuinely new territory.
const PERMANENTLY_UNCLASSIFIABLE = new Set([
  'slat', '5', '1', '', '3', 'ntss 31', '4', '8',
]);

let INGREDIENT_DB = {};
let CACHED_INGREDIENT_ANALYSIS = {};
let products = [];

// Load INGREDIENT_DB from ingredients.js
try {
  const ingredientsPath = path.join(__dirname, '..', '..', 'src', 'data', 'ingredients.js');
  let src = fs.readFileSync(ingredientsPath, 'utf8');
  // Normalize CRLF to LF
  src = src.replace(/\r\n/g, '\n');
  // Strip leading 'export '
  src = src.replace(/^export\s+/gm, '');
  // Execute in Function context
  const result = new Function(src + '\n; return { INGREDIENT_DB };')();
  INGREDIENT_DB = result.INGREDIENT_DB;
  console.log(`✓ Loaded INGREDIENT_DB: ${Object.keys(INGREDIENT_DB).length} entries`);
} catch (err) {
  console.error(`✗ Failed to load INGREDIENT_DB:`, err.message);
  process.exit(1);
}

// Load CACHED_INGREDIENT_ANALYSIS from ingredientCache.js
try {
  const cachePath = path.join(__dirname, '..', '..', 'src', 'data', 'ingredientCache.js');
  let src = fs.readFileSync(cachePath, 'utf8');
  // Normalize CRLF to LF
  src = src.replace(/\r\n/g, '\n');
  // Strip import statements
  src = src.replace(/^import\s+.*?;$/gm, '');
  // Strip leading 'export '
  src = src.replace(/^export\s+/gm, '');
  try {
    const result = new Function(src + '\n; return { CACHED_INGREDIENT_ANALYSIS };')();
    CACHED_INGREDIENT_ANALYSIS = result.CACHED_INGREDIENT_ANALYSIS;
    console.log(`✓ Loaded CACHED_INGREDIENT_ANALYSIS: ${Object.keys(CACHED_INGREDIENT_ANALYSIS).length} entries (via Function)`);
  } catch (fnErr) {
    // Fallback: regex extraction
    console.log(`  Function parse failed, trying regex fallback...`);
    const match = src.match(/CACHED_INGREDIENT_ANALYSIS\s*=\s*\{([\s\S]*?)\n\};/);
    if (match) {
      const objStr = '{' + match[1] + '\n}';
      CACHED_INGREDIENT_ANALYSIS = JSON.parse(objStr.replace(/'/g, '"').replace(/\n\s*\/\/.*$/gm, ''));
      console.log(`✓ Loaded CACHED_INGREDIENT_ANALYSIS: ${Object.keys(CACHED_INGREDIENT_ANALYSIS).length} entries (via regex)`);
    } else {
      throw new Error('Regex extraction failed');
    }
  }
} catch (err) {
  console.error(`✗ Failed to load CACHED_INGREDIENT_ANALYSIS:`, err.message);
  process.exit(1);
}

// Load products from products_generated.json
try {
  const productsPath = path.join(__dirname, '..', '..', 'src', 'data', 'products_generated.json');
  const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  products = data.products || [];
  console.log(`✓ Loaded products: ${products.length} products`);
} catch (err) {
  console.error(`✗ Failed to load products:`, err.message);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────
// BUILD INGREDIENT INDEXES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Normalize ingredient string:
 * - lowercase
 * - remove parenthetical and bracket content
 * - replace [._*]+ with space
 * - replace non-alphanumeric (except &, -, space) with space
 * - collapse whitespace
 * - trim
 */
function normalize(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[._*]+/g, ' ')
    .replace(/[^a-z0-9&\- ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Singularize token:
 * - if length > 4 and ends with 's' and not 'ss', drop trailing 's'
 */
function singularize(t) {
  if (t.length > 4 && t.endsWith('s') && !t.endsWith('ss')) {
    return t.slice(0, -1);
  }
  return t;
}

// Weak tokens (filtered out during token indexing)
const WEAK_TOKENS = new Set([
  'salt', 'milk', 'water', 'sugar', 'oil', 'acid', 'calcium', 'sodium',
  'potassium', 'magnesium', 'iron', 'zinc', 'color', 'colour', 'flavor',
  'flavour', 'flavoring', 'flavouring', 'natural', 'artificial', 'extract',
  'powder', 'concentrate', 'juice', 'syrup', 'starch', 'protein', 'vitamin',
  'mineral', 'blend', 'organic', 'dried', 'ground', 'whole', 'and', 'or',
  'of', 'with', 'less', 'than', 'contains', 'modified', 'enriched', 'refined'
]);

function significantTokens(normalized) {
  return normalized
    .split(' ')
    .map(singularize)
    .filter(t => t.length > 3 && !WEAK_TOKENS.has(t));
}

// Build indexes from CACHED first, then INGREDIENT_DB (overwrites)
const indexExact = new Map();
const indexToken = new Map();

function addToExactIndex(key, entry, source) {
  const n = normalize(key);
  if (n) {
    indexExact.set(n, { entry, source });
  }
}

function addToTokenIndex(key, entry, source) {
  const n = normalize(key);
  if (!n) return;
  const tokens = significantTokens(n);
  if (tokens.length === 0) return;
  const keyTokenCount = tokens.length;

  for (const token of tokens) {
    const existing = indexToken.get(token);
    if (!existing) {
      indexToken.set(token, { entry, source, keyTokenCount });
    } else {
      const existingIsDb = existing.source === 'db';
      const newIsDb = source === 'db';
      const fewerTokens = keyTokenCount < existing.keyTokenCount;
      const sameCount = keyTokenCount === existing.keyTokenCount;
      if (fewerTokens || (sameCount && newIsDb && !existingIsDb)) {
        indexToken.set(token, { entry, source, keyTokenCount });
      }
    }
  }
}

for (const [key, entry] of Object.entries(CACHED_INGREDIENT_ANALYSIS)) {
  addToExactIndex(key, entry, 'cache');
}
for (const [key, entry] of Object.entries(INGREDIENT_DB)) {
  addToExactIndex(key, entry, 'db');
}
for (const [key, entry] of Object.entries(CACHED_INGREDIENT_ANALYSIS)) {
  addToTokenIndex(key, entry, 'cache');
}
for (const [key, entry] of Object.entries(INGREDIENT_DB)) {
  addToTokenIndex(key, entry, 'db');
}

console.log(`✓ Built indexes: ${indexExact.size} exact matches, ${indexToken.size} significant tokens`);

const LEADING_LABEL_NOISE = new Set([
  'ingredient', 'ingredients', 'leavening', 'humectant', 'seasoning',
]);

const TRAILING_LABEL_NOISE = new Set([
  'preservative', 'preservatives', 'emulsifier', 'color', 'colour', 'added',
]);

function lookupExactWithSingulars(normalized) {
  if (indexExact.has(normalized)) return indexExact.get(normalized);

  const words = normalized.split(' ');
  const lastSingular = singularize(words[words.length - 1]);
  if (lastSingular !== words[words.length - 1]) {
    const variant = [...words.slice(0, -1), lastSingular].join(' ');
    if (indexExact.has(variant)) return indexExact.get(variant);
  }

  const allSingular = words.map(singularize).join(' ');
  if (allSingular !== normalized && indexExact.has(allSingular)) {
    return indexExact.get(allSingular);
  }

  return null;
}

function pushVariant(variants, seen, words) {
  const cleaned = words.filter(Boolean).join(' ').trim();
  if (cleaned && !seen.has(cleaned)) {
    seen.add(cleaned);
    variants.push(cleaned);
  }
}

function cleanedPhraseVariants(normalized) {
  const originalWords = normalized.split(' ').filter(Boolean);
  const variants = [];
  const seen = new Set();

  const noNumbers = originalWords.filter(word => !/^\d+$/.test(word));
  pushVariant(variants, seen, noNumbers);

  let leadingTrimmed = [...noNumbers];
  while (leadingTrimmed.length > 1 && LEADING_LABEL_NOISE.has(leadingTrimmed[0])) {
    leadingTrimmed = leadingTrimmed.slice(1);
    pushVariant(variants, seen, leadingTrimmed);
  }

  let trailingTrimmed = [...noNumbers];
  while (trailingTrimmed.length > 1 && TRAILING_LABEL_NOISE.has(trailingTrimmed[trailingTrimmed.length - 1])) {
    trailingTrimmed = trailingTrimmed.slice(0, -1);
    pushVariant(variants, seen, trailingTrimmed);
  }

  const containsIndex = noNumbers.indexOf('contains');
  if (containsIndex > 0) {
    pushVariant(variants, seen, noNumbers.slice(0, containsIndex));
    pushVariant(variants, seen, noNumbers.slice(containsIndex + 1));
  }

  for (let size = Math.min(5, noNumbers.length); size >= 2; size--) {
    for (let start = 0; start <= noNumbers.length - size; start++) {
      const window = noNumbers.slice(start, start + size);
      const first = window[0];
      const last = window[window.length - 1];
      if (WEAK_TOKENS.has(first) || WEAK_TOKENS.has(last)) continue;
      pushVariant(variants, seen, window);
    }
  }

  return variants;
}

function lookupCleanedPhrase(rawNormalized) {
  for (const variant of cleanedPhraseVariants(rawNormalized)) {
    const hit = lookupExactWithSingulars(variant);
    if (hit) return hit;
  }
  return null;
}

// Pre-build Set of all lowercase keys for fast OLD lookup
const cachedKeysLower = new Set(Object.keys(CACHED_INGREDIENT_ANALYSIS).map(k => k.toLowerCase()));
const dbKeysLower = new Set(Object.keys(INGREDIENT_DB).map(k => k.toLowerCase()));

console.log(`✓ Pre-built lookup sets: ${cachedKeysLower.size} cached, ${dbKeysLower.size} db`);

// ─────────────────────────────────────────────────────────────────────────
// LOOKUP FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * NEW lookup with smart-matching algorithm
 */
function lookupNew(raw) {
  const n = normalize(raw);
  if (!n) return 'empty';

  // Exact match
  if (lookupExactWithSingulars(n)) {
    return 'exact';
  }

  if (lookupCleanedPhrase(n)) {
    return 'cleaned';
  }

  // Token match, mirrored from src/utils/scorer.js.
  const tokens = significantTokens(n);
  if (tokens.length === 0) return 'unknown';

  const candidateMap = new Map();
  for (const token of tokens) {
    const hit = indexToken.get(token);
    if (!hit) continue;
    const existing = candidateMap.get(hit.entry);
    if (existing) {
      existing.sharedCount += 1;
    } else {
      candidateMap.set(hit.entry, { hit, sharedCount: 1 });
    }
  }

  if (candidateMap.size === 0) return 'unknown';

  let bestShared = 0;
  let bestHit = null;
  let ambiguous = false;

  for (const { hit, sharedCount } of candidateMap.values()) {
    if (sharedCount > bestShared) {
      bestShared = sharedCount;
      bestHit = hit;
      ambiguous = false;
    } else if (sharedCount === bestShared) {
      ambiguous = true;
    }
  }

  if (!bestHit || bestShared < 1 || ambiguous) return 'unknown';

  return 'token';
}

/**
 * OLD lookup: app's current exact-match behavior
 * Raw lowercased-trimmed key against original key sets (fast Set lookup)
 */
function lookupOld(raw) {
  if (!raw) return 'empty';

  const key = raw.toLowerCase().trim();

  // Check against pre-built Sets (O(1) lookup)
  if (cachedKeysLower.has(key) || dbKeysLower.has(key)) {
    return 'old-match';
  }

  return 'old-unknown';
}

// ─────────────────────────────────────────────────────────────────────────
// COLLECT CORPUS AND MEASURE
// ─────────────────────────────────────────────────────────────────────────

const corpusIngredients = [];

for (const product of products) {
  if (product.ingredients && Array.isArray(product.ingredients)) {
    for (const ing of product.ingredients) {
      if (ing && typeof ing === 'string' && ing.trim()) {
        corpusIngredients.push(ing);
      }
    }
  }
}

console.log(`\n✓ Corpus: ${corpusIngredients.length} total ingredient occurrences`);

// Pre-compute normalized strings to avoid re-normalizing
const normalized = new Map();
for (const ing of corpusIngredients) {
  const n = normalize(ing);
  if (!normalized.has(ing)) {
    normalized.set(ing, n);
  }
}

// Measure OLD behavior
let oldMatched = 0;
let oldUnknown = 0;

const startOld = Date.now();
for (const ing of corpusIngredients) {
  const result = lookupOld(ing);
  if (result === 'old-match') {
    oldMatched++;
  } else {
    oldUnknown++;
  }
}
const timeOld = Date.now() - startOld;

// Measure NEW behavior
let newMatched = 0;
let newUnknown = 0;
const newMatchKinds = { exact: 0, cleaned: 0, token: 0 };
const unknownsByNormalized = new Map(); // normalized -> count

const startNew = Date.now();
for (const ing of corpusIngredients) {
  const result = lookupNew(ing);
  if (result === 'unknown' || result === 'empty') {
    newUnknown++;
    const n = normalized.get(ing);
    unknownsByNormalized.set(n, (unknownsByNormalized.get(n) || 0) + 1);
  } else {
    newMatched++;
    if (newMatchKinds[result] !== undefined) {
      newMatchKinds[result]++;
    }
  }
}
const timeNew = Date.now() - startNew;
console.log(`\nMeasurement times: OLD=${timeOld}ms, NEW=${timeNew}ms`);

// ─────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────

const recovered = newMatched - oldMatched;
const recoveredPct = ((recovered / corpusIngredients.length) * 100).toFixed(2);

console.log('\n' + '='.repeat(70));
console.log('INGREDIENT COVERAGE SUMMARY');
console.log('='.repeat(70));
console.log(`Total occurrences:        ${corpusIngredients.length}`);
console.log(`\nOLD behavior (exact only):`);
console.log(`  Matched:                ${oldMatched} (${((oldMatched / corpusIngredients.length) * 100).toFixed(2)}%)`);
console.log(`  Unknown:                ${oldUnknown} (${((oldUnknown / corpusIngredients.length) * 100).toFixed(2)}%)`);
console.log(`\nNEW behavior (exact + cleaned phrase + token):`);
console.log(`  Matched:                ${newMatched} (${((newMatched / corpusIngredients.length) * 100).toFixed(2)}%)`);
console.log(`  Unknown:                ${newUnknown} (${((newUnknown / corpusIngredients.length) * 100).toFixed(2)}%)`);
console.log(`  Exact matches:          ${newMatchKinds.exact}`);
console.log(`  Cleaned phrase matches: ${newMatchKinds.cleaned}`);
console.log(`  Token matches:          ${newMatchKinds.token}`);
console.log(`\nRECOVERY:`);
console.log(`  Newly matched:          ${recovered} (${recoveredPct}% of total)`);
console.log('='.repeat(70));

// ─────────────────────────────────────────────────────────────────────────
// OUTPUT REMAINING UNKNOWNS
// ─────────────────────────────────────────────────────────────────────────

const unknownsList = Array.from(unknownsByNormalized.entries())
  .map(([ingredient, count]) => ({ ingredient, count }))
  .filter(({ ingredient }) => !PERMANENTLY_UNCLASSIFIABLE.has(ingredient))
  .sort((a, b) => b.count - a.count)
  .slice(0, 150);

const outputPath = path.join(__dirname, 'remaining-unknowns.json');
fs.writeFileSync(outputPath, JSON.stringify(unknownsList, null, 2), 'utf8');
console.log(`\n✓ Wrote top 150 unknown ingredients to: ${outputPath}`);
console.log(`  (${unknownsList.length} distinct normalized ingredients remain unknown)`);
