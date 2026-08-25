/**
 * Shared product-parsing utilities used by ScannerScreen and ProductSearchScreen.
 * Converts raw OpenFoodFacts API responses into the app's internal product shape.
 */

import { BRAND_TO_COMPANY, BRAND_PARENT_MAP, COMPANY_DB } from '../data/companies';
import { normalizeIngredientTokens, detectBioengineered } from './ingredientNormalizer';

// ─── Parse ingredient string → array ─────────────────────────────────────────
// Normalization (paren-flattening, oil-disclosure resolution, advisory-phrase
// filtering, dedup) lives in ingredientNormalizer.js — shared with the
// build-time ingest script (scripts/catalog-database/ingest-products.js).

function rawIngredientsText(p) {
  return (
    p.ingredients_text_en ||
    p.ingredients_text ||
    (Array.isArray(p.ingredients)
      ? p.ingredients.map((i) => i.text || '').join(', ')
      : '')
  );
}

export function parseIngredients(p) {
  const text = rawIngredientsText(p);
  if (!text) return [];

  return normalizeIngredientTokens(text);
}

// ─── Bioengineered (GMO) disclosure detection ────────────────────────────────
//
// Runs detectBioengineered() against the RAW ingredients text — i.e. BEFORE
// normalizeIngredientTokens strips a USDA "Bioengineered Food Ingredient" /
// "produced with genetic engineering" disclosure sentence as label text (see
// ingredientNormalizer.js's BIOENGINEERED_PATTERNS). This is a neutral
// disclosure flag only — Phase 3 (2026-08-25, founder-locked): bioengineered
// status must NEVER change the 0-100 score (src/utils/scorer.js does not
// read this field), it only drives a UI badge + an opt-in avoidance
// preference alert.
export function detectContainsBioengineered(p) {
  return detectBioengineered(rawIngredientsText(p));
}

// ─── Parse nutriments object → normalized nutrition ───────────────────────────

export function parseNutrition(n = {}) {
  // Prefer _serving values (true per-serving) over _100g when available.
  // OpenFoodFacts provides both; _serving is more accurate for the user.
  const hasServing = n['proteins_serving'] != null || n['fat_serving'] != null;

  const v = (keyServing, key100g, scale = 1) => {
    const raw = hasServing && n[keyServing] != null ? n[keyServing] : (n[key100g] ?? 0);
    return Math.round(raw * scale * 10) / 10;
  };

  return {
    fat:          v('fat_serving',                   'fat_100g'),
    saturatedFat: v('saturated-fat_serving',         'saturated-fat_100g'),
    sodium:       v('sodium_serving',                'sodium_100g', 1000),  // g → mg
    carbs:        v('carbohydrates_serving',         'carbohydrates_100g'),
    sugars:       v('sugars_serving',                'sugars_100g'),
    protein:      v('proteins_serving',              'proteins_100g'),
    fiber:        (hasServing ? n['fiber_serving'] : n['fiber_100g']) != null
      ? v('fiber_serving', 'fiber_100g')
      : null,
    perServing: hasServing,
  };
}

// ─── Map brand string → internal company ID ───────────────────────────────────
//
// findCompanyId() resolves a brand string in three stages:
//   1. BRAND_TO_COMPANY exact/substring keys (consumer brands, e.g. "cheerios")
//   2. BRAND_PARENT_MAP -> fuzzy match against COMPANY_DB record names
//   3. NEW: direct match against COMPANY_DB record NAMES themselves — this is
//      what lets manufacturer legal-name strings straight out of the OFF bulk
//      dump ("General Mills, Inc.", "The Kroger Co.", "Wal-Mart Stores, Inc.")
//      resolve even though they're not brands and aren't in BRAND_TO_COMPANY.
//
// Stage 3 is intentionally conservative: a wrongly-named parent company is a
// worse failure for this app than showing nothing, so every rule below is
// biased toward returning null over guessing. See matchCompanyDbName().

const CORP_SUFFIX_WORDS = new Set([
  'inc', 'llc', 'ltd', 'co', 'corp', 'corporation', 'company', 'the', 'usa', 'holdings',
]);

const MIN_PREFIX_LEN = 5;   // shorter side must clear this before a prefix match counts
const MIN_INITIALISM_LEN = 3;

/**
 * Lowercase; drop parenthetical asides (aka/parent/dba notes, mirrors the
 * "(...)" strip scorer.js already does for ingredients); join hyphens so
 * "Wal-Mart" lines up with "Walmart"; turn remaining punctuation into word
 * boundaries; drop corporate-suffix noise words.
 * Returns the significant words as an array (callers join(' ') as needed).
 */
function normalizeCompanyWords(str) {
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')     // drop parenthetical asides
    .replace(/-/g, '')              // join hyphenated names: "Wal-Mart" -> "walmart"
    .replace(/[^a-z0-9\s]/g, ' ')   // remaining punctuation -> word boundary
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !CORP_SUFFIX_WORDS.has(w));
}

function normalizeCompanyName(str) {
  return normalizeCompanyWords(str).join(' ');
}

// Detect "H-E-B"-style initialisms: every hyphen/period/space-delimited
// segment of the ORIGINAL (pre-normalization) company name is a single
// character, 3 or more segments (e.g. "H-E-B" -> ['H','E','B'] -> "heb").
// This is the only way a real-data case like "H E Butt Grocery Company"
// (OFF legal-name text) resolves to a COMPANY_DB record literally named
// "H-E-B" — plain word-boundary prefix matching can't bridge that gap
// because "Butt" (not "B") is the third significant word on the brand side.
function detectInitialism(originalName) {
  const segments = originalName.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (segments.length < MIN_INITIALISM_LEN) return null;
  if (!segments.every((s) => s.length === 1)) return null;
  return segments.join('').toLowerCase();
}

function isWordBoundaryPrefix(shorter, longer) {
  if (shorter.length < MIN_PREFIX_LEN) return false;
  if (!longer.startsWith(shorter)) return false;
  const rest = longer.slice(shorter.length);
  return rest === '' || rest.startsWith(' '); // never a bare substring match
}

// A single leftover word is too weak a signal to trust as a prefix root
// UNLESS it is COMPANY_DB's own curated canonical name (e.g. "walmart",
// "target") acting as the prefix of a longer legal-entity string. If
// instead it's the incoming (uncurated, third-party) brand string that
// reduces to one bare word, that word must NOT be allowed to reach out and
// prefix-match a longer DB name it merely happens to share a root with.
// Two real near-collisions surfaced validating this against the full OFF
// bulk dump:
//   - "The Organic Co" reduces to "organic" (after stripping "The"/"Co"),
//     which would otherwise prefix-match "Organic Valley (CROPP
//     Cooperative)" — a different real company.
//   - "RIVERSIDE" (tagged on a "FROZEN LOBSTER MEAT" SKU) would otherwise
//     prefix-match "Riverside Natural Foods Ltd.", a vegan snack-bar maker
//     with nothing to do with lobster.
function isTrustworthyPrefixPair(dbWords, brandWords) {
  const dbNorm = dbWords.join(' ');
  const brandNorm = brandWords.join(' ');
  const dbIsShorter = dbNorm.length <= brandNorm.length;
  const shorterWords = dbIsShorter ? dbWords : brandWords;
  const shorter = dbIsShorter ? dbNorm : brandNorm;
  const longer = dbIsShorter ? brandNorm : dbNorm;
  if (shorterWords.length === 1 && !dbIsShorter) return false;
  return isWordBoundaryPrefix(shorter, longer);
}

// COMPANY_DB name index, built LAZILY on first use (not at module import) —
// same pattern as scorer.js's ensureIndexes()/_indexesBuilt (785baf0), which
// fixed a cold-start ANR caused by eager index-building at import time.
// productParser.js is imported by screens on the launch path; this index
// build is O(records) with regex work per record, so it must stay off that
// path and only run when a brand string is actually being resolved.
let _companyIndexBuilt = false;
const companyNameIndex = new Map();  // normalized name -> Set(company ids)
const companyInitialismIndex = new Map(); // initials string -> Set(company ids)

function ensureCompanyIndex() {
  if (_companyIndexBuilt) return;

  for (const c of Object.values(COMPANY_DB)) {
    const n = normalizeCompanyName(c.name);
    if (n) {
      if (!companyNameIndex.has(n)) companyNameIndex.set(n, new Set());
      companyNameIndex.get(n).add(c.id);
    }
    const init = detectInitialism(c.name);
    if (init) {
      if (!companyInitialismIndex.has(init)) companyInitialismIndex.set(init, new Set());
      companyInitialismIndex.get(init).add(c.id);
    }
  }

  _companyIndexBuilt = true;
}

/**
 * Match a (lowercased) brand/manufacturer string directly against
 * COMPANY_DB record names. Returns a single company id, or null if there's
 * no confident match — including when the string is ambiguous between two
 * or more different real companies (never guess between candidates).
 */
function matchCompanyDbName(lowerBrand) {
  ensureCompanyIndex();

  const words = normalizeCompanyWords(lowerBrand);
  const n = words.join(' ');
  if (!n) return null;

  const matches = new Set();

  // 1. Exact equality (COMPANY_DB names are unique once normalized, so this
  //    can never itself be ambiguous).
  if (companyNameIndex.has(n)) {
    for (const id of companyNameIndex.get(n)) matches.add(id);
  }

  // 2. Word-boundary prefix match, either direction, shorter side >= MIN_PREFIX_LEN.
  if (matches.size === 0) {
    for (const [name, ids] of companyNameIndex) {
      if (isTrustworthyPrefixPair(name.split(' '), words)) {
        for (const id of ids) matches.add(id);
      }
    }
  }

  // 3. Initialism match (e.g. "H-E-B"): leading words' first letters spell
  //    a known DB initialism, in order.
  if (matches.size === 0) {
    for (const [init, ids] of companyInitialismIndex) {
      if (words.length < init.length) continue;
      const leading = words.slice(0, init.length).map((w) => w[0]).join('');
      if (leading === init) {
        for (const id of ids) matches.add(id);
      }
    }
  }

  // Ambiguous (matches more than one real company) -> null, never guess.
  if (matches.size === 1) return [...matches][0];
  return null;
}

export function findCompanyId(brand) {
  if (!brand) return null;
  const lower = brand.toLowerCase().trim();

  if (BRAND_TO_COMPANY[lower]) return BRAND_TO_COMPANY[lower];

  const directKey = Object.keys(BRAND_TO_COMPANY).find(
    (k) => lower.includes(k) || k.includes(lower)
  );
  if (directKey) return BRAND_TO_COMPANY[directKey];

  const parentName = BRAND_PARENT_MAP[lower];
  if (parentName) {
    const pLower = parentName.toLowerCase();
    const match = Object.values(COMPANY_DB).find(
      (c) =>
        c.name.toLowerCase().includes(pLower) ||
        pLower.includes(c.name.toLowerCase())
    );
    if (match) return match.id;
  }

  const dbNameMatch = matchCompanyDbName(lower);
  if (dbNameMatch) return dbNameMatch;

  return null;
}

// ─── Category detection from OFF categories_tags ───────────────────────────
//
// OFF's categories_tags order runs general -> specific (taxonomy expansion),
// so blindly trusting cats[0] mostly returns a broad tag like "fresh-foods,"
// never the specific one the app's category-gated features (e.g. the eggs
// Living Conditions card) key off of. Scan every tag for known category
// signals instead; cats[0] stays the fallback for anything unmatched.
//
// Egg detection matches "egg"/"eggs" as a whole hyphen-delimited token
// (never a bare substring) so "en:eggplants" can't false-positive.
const CATEGORY_TAG_MATCHERS = [
  { category: 'Eggs', test: (tag) => /(^|-)eggs?($|-)/.test(tag) },
];

function detectCategory(cats) {
  for (const { category, test } of CATEGORY_TAG_MATCHERS) {
    if (cats.some((t) => test(t.replace('en:', '')))) return category;
  }
  return cats[0]?.replace('en:', '').replace(/-/g, ' ') || 'General';
}

// ─── Build product from a barcode API response ({ product: {...} }) ───────────

export function buildProduct(barcode, data) {
  return buildProductFromRaw(barcode, data.product || {});
}

// ─── Build product from a raw OFF product object (search results, etc.) ───────

export function buildProductFromRaw(barcode, p) {
  const brand = (p.brands || '').split(',')[0].trim();
  const labels = p.labels_tags || [];
  const cats   = p.categories_tags || [];

  return {
    barcode:        barcode || p.code || null,
    name:           p.product_name || p.product_name_en || 'Unknown Product',
    brand:          brand || 'Unknown Brand',
    companyId:      findCompanyId(brand),
    source:         'community',
    category:       detectCategory(cats),
    ingredients:    parseIngredients(p),
    nutrition:      parseNutrition(p.nutriments),
    certifications: labels.includes('en:organic') ? ['USDA Organic'] : [],
    isOrganic:      labels.includes('en:organic'),
    isVegan:        labels.includes('en:vegan'),
    isGlutenFree:   labels.includes('en:gluten-free'),
    containsBioengineered: detectContainsBioengineered(p),
    servingSize:    p.serving_size || null,
    calories:       Math.round(
      p.nutriments?.['energy-kcal_serving'] ||
      p.nutriments?.['energy-kcal_100g']    ||
      0
    ),
    image: p.image_front_url || p.image_url || null,
    packaging: detectPackagingConcern(p),
  };
}

function detectPackagingConcern(p = {}) {
  const packagingText = [
    p.packaging,
    p.packaging_text,
    ...(Array.isArray(p.packaging_tags) ? p.packaging_tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const prepText = [
    p.preparation,
    p.preparation_text,
    p.cooking_instructions,
    p.instructions,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const combined = `${packagingText} ${prepText}`;
  if (!combined.includes('plastic') && !/(steam|microwave).{0,24}(bag|pouch|tray)|\b(bag|pouch|tray)\b/.test(combined)) {
    return null;
  }

  const isMicrowave = combined.includes('microwave');
  const isSteamBag = combined.includes('steam') && combined.includes('bag');
  const format = isSteamBag ? 'steam-bag' : (combined.includes('pouch') ? 'pouch' : (combined.includes('tray') ? 'tray' : 'plastic-bag'));

  return {
    material: 'plastic',
    format,
    heatUse: isMicrowave || isSteamBag ? 'microwave' : 'unknown',
    concernLevel: isMicrowave || isSteamBag ? 'high' : 'low',
    concerns: isMicrowave || isSteamBag
      ? ['microplastics', 'heated-plastic-contact']
      : ['microplastics', 'plastic-food-contact'],
  };
}
