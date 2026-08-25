import { INGREDIENT_DB, FLAG_LEVELS } from '../data/ingredients';
import { CACHED_INGREDIENT_ANALYSIS, riskToFlag } from '../data/ingredientCache';
import {
  classifyTokenPlausibility,
  isLabelBoilerplate,
  segmentIntoKnownIngredients,
} from './ingredientNormalizer';
import { detectHousingTier, isEggsHousingEligible, detectMeatSpecies } from './sourcingMatch';
import { COMPANY_DB } from '../data/companies';

// ─── Ingredient lookup: normalization + smart-matching ────────────────────────

/**
 * normalize(s): lowercase; remove parentheticals; replace [._*]+ and other
 * punctuation with spaces; collapse whitespace; trim.
 */
function normalize(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')      // remove (...) parentheticals
    .replace(/\[[^\]]*\]/g, ' ')     // remove [...] bracket groups
    .replace(/[._*]+/g, ' ')         // dots, underscores, asterisks -> space
    .replace(/[^a-z0-9&\- ]+/g, ' ') // strip remaining punctuation
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

/**
 * singularize(token): if token.length > 4 and ends with 's' but not 'ss',
 * drop the trailing 's'.
 */
function singularize(token) {
  if (token.length > 4 && token.endsWith('s') && !token.endsWith('ss')) {
    return token.slice(0, -1);
  }
  return token;
}

/**
 * Tokens that, by themselves, may NOT trigger a fuzzy/token match.
 */
const WEAK_TOKENS = new Set([
  'salt','milk','water','sugar','oil','acid','calcium','sodium','potassium',
  'magnesium','iron','zinc','color','colour','flavor','flavour','flavoring',
  'flavouring','natural','artificial','extract','powder','concentrate','juice',
  'syrup','starch','protein','vitamin','mineral','blend','organic','dried',
  'ground','whole','and','or','of','with','less','than','contains','modified',
  'enriched','refined',
]);

/**
 * Returns the significant tokens of a normalized string:
 * tokens of length > 3, not in WEAK_TOKENS, each singularized.
 */
function significantTokens(normalized) {
  return normalized
    .split(' ')
    .map(singularize)
    .filter((t) => t.length > 3 && !WEAK_TOKENS.has(t));
}

// ─── Ingredient indexes (built lazily on first lookup) ───────────────────────
//
// Each index value is: { entry, source }
//   source === 'db'    => entry has shape { risk, label, category, note, flag }
//   source === 'cache' => entry has shape { risk, category, explanation }

const indexExact = new Map(); // normalize(key) -> { entry, source }
const indexToken = new Map(); // singularized token -> { entry, source, keyTokenCount }

// Build the exact/token indexes LAZILY — on the first ingredient lookup, not at
// module import. This was previously an IIFE that ran the instant scorer.js was
// evaluated. Because AppNavigator statically imports HomeScreen (and other
// screens) which import scorer.js only for cheap helpers like gradeToColor, the
// full regex-heavy index build over the ~3k-entry ingredient cache + INGREDIENT_DB
// ran synchronously on the JS thread during COLD START — contributing to a Sentry
// "App Hanging" (ANR) at launch. Deferring it to the first real lookupIngredient()
// call (i.e. when a product is actually scored, off the launch path) removes that
// work from startup. ensureIndexes() is idempotent and memoized via _indexesBuilt,
// so after the first build it costs a single boolean check.
let _indexesBuilt = false;
function ensureIndexes() {
  if (_indexesBuilt) return;

  // 1. Cache entries (lower priority)
  for (const [key, entry] of Object.entries(CACHED_INGREDIENT_ANALYSIS)) {
    const n = normalize(key);
    if (n) {
      indexExact.set(n, { entry, source: 'cache' });
    }
  }
  // 2. DB entries overwrite cache on collision
  for (const [key, entry] of Object.entries(INGREDIENT_DB)) {
    const n = normalize(key);
    if (n) {
      indexExact.set(n, { entry, source: 'db' });
    }
  }

  // Build indexToken from the same two sources.
  // On collision: keep the entry whose key has FEWER significant tokens
  // (more specific/canonical). DB preferred over cache at same token count.

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
        // Prefer fewer tokens (more specific); on tie, prefer db over cache
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

  // Cache first (lower priority), then db (higher priority)
  for (const [key, entry] of Object.entries(CACHED_INGREDIENT_ANALYSIS)) {
    addToTokenIndex(key, entry, 'cache');
  }
  for (const [key, entry] of Object.entries(INGREDIENT_DB)) {
    addToTokenIndex(key, entry, 'db');
  }

  _indexesBuilt = true;
}

// Lazily-built set of all known ingredient DB/cache keys (lowercased), used
// by the plausibility gate's fuzzy-rescue step. Built once, on first use.
let _knownKeys = null;
function getKnownKeysSet() {
  if (_knownKeys) return _knownKeys;
  _knownKeys = new Set();
  for (const key of Object.keys(INGREDIENT_DB)) _knownKeys.add(key.toLowerCase());
  for (const key of Object.keys(CACHED_INGREDIENT_ANALYSIS)) _knownKeys.add(key.toLowerCase());
  return _knownKeys;
}

const LEADING_LABEL_NOISE = new Set([
  'ingredient', 'ingredients', 'leavening', 'humectant', 'seasoning',
]);

const TRAILING_LABEL_NOISE = new Set([
  'preservative', 'preservatives', 'emulsifier', 'color', 'colour', 'added',
]);

function lookupExactWithSingulars(normalized) {
  ensureIndexes();
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
  const cleaned = words
    .filter(Boolean)
    .join(' ')
    .trim();
  if (cleaned && !seen.has(cleaned)) {
    seen.add(cleaned);
    variants.push(cleaned);
  }
}

function cleanedPhraseVariants(normalized) {
  const originalWords = normalized.split(' ').filter(Boolean);
  const variants = [];
  const seen = new Set();

  const noNumbers = originalWords.filter((word) => !/^\d+$/.test(word));
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

  // Try meaningful contiguous phrases before one-token fuzz. This catches
  // parser fragments like "roasted peanuts 39" without adding every count.
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

/**
 * lookupIngredient(raw): returns { entry, source } or null.
 *
 * source === 'db'    -> entry fields: .risk .label .category .note .flag
 * source === 'cache' -> entry fields: .risk .category .explanation
 */
export function lookupIngredient(raw) {
  ensureIndexes();

  // a. Normalize
  const n = normalize(raw);
  if (!n) return null;

  // b. Exact lookup on full normalized string
  const exactHit = lookupExactWithSingulars(n);
  if (exactHit) return exactHit;

  const cleanedHit = lookupCleanedPhrase(n);
  if (cleanedHit) return cleanedHit;

  // c. Token fallback
  const sigTokens = significantTokens(n);
  if (sigTokens.length === 0) return null;

  // Gather candidates: { entry, source, keyTokenCount } keyed by the entry reference
  const candidateMap = new Map(); // entry object -> { hit, sharedCount }
  for (const token of sigTokens) {
    const hit = indexToken.get(token);
    if (!hit) continue;
    const existing = candidateMap.get(hit.entry);
    if (existing) {
      existing.sharedCount += 1;
    } else {
      candidateMap.set(hit.entry, { hit, sharedCount: 1 });
    }
  }

  if (candidateMap.size === 0) return null;

  // Find the candidate sharing the most significant tokens with n
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

  // Require at least ONE shared non-weak token and a clear winner
  if (!bestHit || bestShared < 1 || ambiguous) return null;

  // Flag token-fallback results as WEAK: all this match proves is that one
  // significant word of the raw string also appears in a known ingredient
  // name. That is the right level of confidence for a noisy-but-real label
  // ("sunflower oil (high oleic)"), and the wrong one for a whole sentence of
  // packaging text that happens to contain a food word — which is how
  // "May Cause Occasionally Rapid Heart Rate" reached the UI scored as an
  // ingredient. Callers must re-check weak hits against the plausibility gate.
  return { ...bestHit, weak: true };
}

// ─── Unknown ingredient classifier ───────────────────────────────────────────

// Single whole-food words that are inherently natural, unprocessed ingredients.
// Used for word-level matching inside multi-word ingredient names.
const WHOLE_FOOD_WORDS = new Set([
  // Fruits
  'apple','apricot','avocado','banana','blackberry','blueberry','cherry','coconut',
  'cranberry','date','fig','grape','grapefruit','guava','kiwi','lemon','lime',
  'mango','melon','nectarine','orange','papaya','peach','pear','pineapple','plum',
  'pomegranate','raspberry','raisin','strawberry','tangerine','watermelon','prune',
  'currant','elderberry','passionfruit','persimmon','tamarind','jackfruit',
  // Vegetables
  'artichoke','asparagus','beet','beetroot','broccoli','cabbage','carrot',
  'cauliflower','celery','chard','collard','corn','cucumber','eggplant','fennel',
  'garlic','ginger','kale','leek','lettuce','mushroom','onion','parsley',
  'parsnip','pea','pepper','potato','pumpkin','radish','shallot','spinach',
  'squash','tomato','turnip','yam','zucchini','jalapeño','jalapeno','turmeric',
  'arugula','bok','choy','rutabaga','watercress','endive','radicchio','chive',
  // Grains
  'amaranth','barley','buckwheat','cornmeal','farro','millet','oat','oats',
  'quinoa','rice','rye','sorghum','spelt','teff','wheat','triticale',
  // Legumes
  'bean','chickpea','edamame','lentil','soybean','peanut','lupin',
  // Nuts & seeds
  'almond','cashew','chia','flaxseed','flax','hazelnut','hemp','macadamia',
  'pecan','pistachio','sesame','sunflower','walnut','poppy','pumpkinseed',
  // Proteins
  'beef','bison','chicken','egg','eggs','fish','lamb','pork','salmon',
  'sardine','shrimp','tilapia','tuna','turkey','anchovy','herring','cod',
  // Dairy
  'butter','cheese','cream','ghee','milk','yogurt','whey','casein','lactose',
  'colostrum',
  // Pantry basics
  'cacao','carob','cocoa','coffee','honey','molasses','oil','salt','sugar',
  'tapioca','vanilla','vinegar','water','yeast','arrowroot','cornstarch',
  'gelatin','flour','cocoa','chocolate','caramel',
  // Spices & herbs
  'allspice','anise','basil','cardamom','cayenne','cilantro','cinnamon','clove',
  'coriander','cumin','dill','lavender','marjoram','mint','mustard','nutmeg',
  'oregano','paprika','rosemary','saffron','sage','tarragon','thyme',
  // Oils (standalone)
  'rapeseed','sunflowerseed','flaxseed','cottonseed','canola',
]);

// Patterns that indicate synthetic/heavily processed ingredients
const SYNTHETIC_PATTERNS = [
  /\bhydrogenated\b/i,
  /\bpartially\s+hydrogenated\b/i,
  /\binteresterified\b/i,
  /\bmodified\b/i,
  /\bartificial\b/i,
  /\bbleached\b/i,
  /\bE\s?\d{3,4}\b/i,
  /\b(mono|di|poly)glyceride/i,
  /\bpolyglycerol\b/i,
  /\bpolyricinoleate\b/i,
  /\b(ethyl|methyl|propyl|butyl)\b/i,
  /\b(xanthan|carrageenan|maltodextrin|cellulose)\b/i,
  /\b(sucralose|aspartame|acesulfame|saccharin|neotame|advantame)\b/i,
  /\b(phosphate|sulfite|nitrite|benzoate|sorbate)\b/i,
  /\b(dextrin|maltitol|sorbitol|xylitol|erythritol)\b/i,
  /\bemulsifier/i,
  /\bstabilizer/i,
  /\bantioxidant\b/i,
  /\bpreservative/i,
  /\bcolor(ing|ant)?\b/i,
  /\bcolou?r(ing|ant)?\b/i,
  /\bflavou?r(ing|s)?\b/i,
];

function classifyUnknown(name) {
  const lower = name.toLowerCase().trim();
  const words = lower.split(/[\s\-/]+/).filter(Boolean);

  // Synthetic/chemical patterns take priority
  if (SYNTHETIC_PATTERNS.some((p) => p.test(lower))) {
    return { flag: 'caution', risk: 3 };
  }

  // If any significant word is a recognized whole food, treat as natural.
  // Rule 4 exclusion (2026-08-17 form-penalty model): when the candidate is
  // clearly an OIL (contains the word "oil"), avocado/canola/sunflower/
  // safflower/soybean/vegetable no longer count as a whole-food word for it
  // — a whole avocado still does, only the refined oil pressed from it loses
  // the free pass. See SNACK_FRYING_OIL_NAMES below for the dominant
  // real-catalog path (exact cache-matched oil names); this covers any
  // unresolved/garbled oil phrasing that reaches this fallback classifier.
  const isOilForm = /\boil\b/.test(lower);
  const hasWholeFoodWord = words.some(
    (w) => w.length > 3 && WHOLE_FOOD_WORDS.has(w) &&
      !(isOilForm && OIL_FORM_EXCLUDED_WHOLE_FOOD_WORDS.has(w))
  );
  if (hasWholeFoodWord) {
    return { flag: 'ok', risk: 0 };
  }

  // Long complex multi-word names that aren't whole foods are suspicious
  if (words.length > 5) {
    return { flag: 'moderate', risk: 1 };
  }

  return { flag: 'ok', risk: 0 };
}

/**
 * Returns personalised warnings and flags based on user prefs.
 * Returns { allergenHits, dietaryConflicts, goalNote }
 */
export function getPersonalisedWarnings(analyzedIngredients, product, prefs) {
  if (!prefs) return { allergenHits: [], dietaryConflicts: [], goalNote: null, bioengineeredAlert: false };

  const { allergens = [], dietaryFlags = [], primaryGoal } = prefs;
  const { nutrition = {} } = product;

  // Bioengineered (GMO) avoidance alert — Phase 3 (2026-08-25, founder-locked
  // decision): a NEUTRAL disclosure, never a score change (scoreProduct never
  // reads isBioengineered/containsBioengineered). This can't be detected by
  // the usual ingredient-keyword scan above/below — the USDA disclosure
  // sentence itself is stripped OUT of the ingredient tokens as label text
  // (see ingredientNormalizer.js's detectBioengineered/BIOENGINEERED_PATTERNS)
  // — so it's a direct product-level flag check instead. `isBioengineered` is
  // the curated-catalog field (products.js / productStore.js);
  // `containsBioengineered` is the runtime live-scan field (productParser.js,
  // computed from the raw pre-normalized ingredients text). Only surfaces
  // when the user opted in via the 'avoid-bioengineered' dietary preference.
  const bioengineeredAlert =
    dietaryFlags.includes('avoid-bioengineered') &&
    !!(product.isBioengineered || product.containsBioengineered);

  // Allergen hits — ingredient category matches an allergen the user flagged
  const ALLERGEN_CATEGORY_MAP = {
    peanuts: ['proteins'],
    'tree nuts': ['proteins'],
    milk: ['dairy'],
    eggs: ['proteins'],
    wheat: ['grains'],
    soy: ['proteins'],
    fish: ['proteins'],
    shellfish: ['proteins'],
  };
  const ALLERGEN_KEYWORD_MAP = {
    peanuts: ['peanut'],
    'tree nuts': ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'tree nut'],
    milk: ['milk', 'dairy', 'whey', 'casein', 'lactose', 'cream', 'butter', 'cheese'],
    eggs: ['egg', 'albumin'],
    wheat: ['wheat', 'gluten', 'flour', 'bread'],
    soy: ['soy', 'tofu', 'edamame', 'tempeh'],
    fish: ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'anchovy'],
    shellfish: ['shellfish', 'shrimp', 'crab', 'lobster', 'scallop', 'clam'],
  };

  const allergenHits = allergens.reduce((acc, a) => {
    const keywords = ALLERGEN_KEYWORD_MAP[a] || [];
    const hits = analyzedIngredients.filter((item) => {
      const rawLower = item.raw.toLowerCase();
      return keywords.some((kw) => rawLower.includes(kw));
    });
    if (hits.length > 0) acc.push({ allergen: a, ingredients: hits });
    return acc;
  }, []);

  // Dietary conflicts
  const DIET_CONFLICT_MAP = {
    vegan: { keywords: ['milk', 'dairy', 'whey', 'casein', 'egg', 'albumin', 'honey', 'gelatin', 'tallow', 'lard', 'shellac'], label: 'Vegan' },
    vegetarian: { keywords: ['gelatin', 'tallow', 'lard', 'anchovies', 'rennet'], label: 'Vegetarian' },
    'gluten-free': { keywords: ['wheat', 'gluten', 'barley', 'rye', 'malt'], label: 'Gluten-Free' },
    'dairy-free': { keywords: ['milk', 'dairy', 'whey', 'casein', 'lactose', 'cream', 'butter', 'cheese'], label: 'Dairy-Free' },
    keto: { keywords: ['sugar', 'high fructose corn syrup', 'maltodextrin', 'dextrose', 'corn syrup', 'honey', 'rice syrup'], label: 'Keto' },
    'low-sugar': { keywords: ['sugar', 'high fructose corn syrup', 'corn syrup', 'honey', 'rice syrup', 'dextrose'], label: 'Low Sugar' },
  };

  const dietaryConflicts = dietaryFlags.reduce((acc, flag) => {
    const rule = DIET_CONFLICT_MAP[flag];
    if (!rule) return acc;
    const hits = analyzedIngredients.filter((item) => {
      const rawLower = item.raw.toLowerCase();
      return rule.keywords.some((kw) => rawLower.includes(kw));
    });
    if (hits.length > 0) acc.push({ diet: flag, label: rule.label, ingredients: hits });
    return acc;
  }, []);

  // Goal note
  const highRiskIngredients = analyzedIngredients.filter((i) => i.flag === 'avoid');
  const unknownIngredients  = analyzedIngredients.filter((i) => i.category === 'unknown');
  const GOAL_NOTE_MAP = {
    'avoid-added-sugar': nutrition.sugars > 12
      ? `Contains ${nutrition.sugars}g sugar — above your low-sugar goal.`
      : null,
    'reduce-sodium': nutrition.sodium > 300
      ? `Contains ${nutrition.sodium}mg sodium — high for your sodium goal.`
      : null,
    'increase-protein': nutrition.protein < 5
      ? 'Low protein content — under 5g per serving.'
      : null,
    'increase-fiber': nutrition.fiber != null
      ? (nutrition.fiber < 3
          ? `Only ${nutrition.fiber ?? 0}g fiber per serving — low for your fiber goal.`
          : null)
      : 'Fiber content not listed for this product.',
    'avoid-high-risk': highRiskIngredients.length > 0
      ? `${highRiskIngredients.length} high-risk ingredient${highRiskIngredients.length > 1 ? 's' : ''} found: ${highRiskIngredients.slice(0, 2).map((i) => i.label).join(', ')}${highRiskIngredients.length > 2 ? '…' : ''}.`
      : null,
    'eat-clean': unknownIngredients.length > 3
      ? `${unknownIngredients.length} unrecognized ingredients — may be heavily processed.`
      : (highRiskIngredients.length > 0
          ? `Contains ${highRiskIngredients.length} flagged additive${highRiskIngredients.length > 1 ? 's' : ''} — not ideal for a clean diet.`
          : null),
    'low-carb-diet': nutrition.carbs > 20
      ? `Contains ${nutrition.carbs}g carbs — above your low-carb target.`
      : null,
  };
  const goalNote = primaryGoal ? GOAL_NOTE_MAP[primaryGoal] ?? null : null;

  return { allergenHits, dietaryConflicts, goalNote, bioengineeredAlert };
}

/**
 * Scores a product's ingredients and returns a health score (0-100) and grade (A-F).
 */
/**
 * Processing ceiling: the heavier a product's weighted marker load, the lower
 * its score may climb — structurally enforcing "ultra-processed food can't top
 * out." It's a smooth curve (not a tiered cliff) so a single mild marker costs
 * only a few points, while a stack of severe ones bottoms out near the floor.
 * Penalties still operate *under* the ceiling so products stay spread out.
 *
 * markerLoad is a weighted sum (see markerWeight): ~0.4 per mild marker (natural
 * flavors), 0.7 moderate, 1.0 severe (trans fat, HFCS, dyes).
 *   load 0.4 → ~91   load 1.0 → ~78   load 2.0 → ~56   load 2.7+ → 40 (floor)
 */
export function upfCeiling(markerLoad) {
  if (markerLoad <= 0) return 100;
  return Math.max(40, Math.round(100 - markerLoad * 22));
}

// ─── Certification bonus (2026-07-09 overhaul) ───────────────────────────────
//
// Certifications used to get a flat +3 each regardless of what they actually
// verify — "Made in USA" (a country-of-origin marketing claim, not an
// independent audit of anything) carried the same weight as USDA Organic.
// Tiered by what real, independent verification actually stands behind each
// mark, so the bonus reflects certification substance, not just presence:
//
//   Tier A (+3) — independently verifies the product's INGREDIENT/ADDITIVE
//   profile against a safety/quality standard:
//     USDA Organic (National Organic Program: bars synthetic pesticides, most
//     synthetic additives, irradiation, GMOs; CCOF is a USDA-accredited
//     certifier) · Non-GMO Project Verified (tests high-risk ingredients,
//     doesn't just take a label's word) · Heart-Check (American Heart
//     Association: product meets AHA's saturated fat/sodium/added-sugar
//     criteria for its category).
//
//   Tier B (+2) — real independent verification, but scoped to a specific
//   dietary/allergen safety need rather than overall ingredient quality:
//     Certified Gluten-Free/GFCO (tests to <10ppm, stricter than the FDA's
//     own <20ppm threshold — meaningful for celiac safety) · Certified Vegan
//     (Vegan Action: no animal-derived ingredients/testing) · Nut-Free
//     Certified (real allergen testing) · Kosher (OU/other recognized
//     certifiers) and Halal Certified (real third-party religious-dietary
//     compliance audits).
//
//   Tier C (+1) — real third-party certification, but about ETHICS/SOURCING
//   rather than this product's health/ingredient profile:
//     Fair Trade Certified (labor/trade standards) · Certified Humane
//     (animal-welfare supply chain standards) · Rainforest Alliance Certified
//     (environmental/sourcing standards) · B Corp Certified (company-wide
//     governance, not product-specific) · California Olive Oil Council
//     Certified (authenticity/quality standard specific to olive oil).
//
//   Tier D (+0) — a dietary-pattern or origin claim, not an independently
//   verified safety/quality standard the way the tiers above are:
//     Keto / Paleo / Whole30 (and their "Certified"/"Approved" variants) are
//     macro/ingredient-pattern compliance claims with no single dominant
//     accrediting body the way organic or gluten-free have; Made in USA is a
//     country-of-origin claim (FTC-regulated, but not an ingredient-safety
//     audit). Real programs, just not evidence a product is more healthful.
//
// Total is capped at MAX_CERT_BONUS so a long cert list can't stack past a
// reasonable ceiling. An unrecognized certification string defaults to +1
// (assume it's a real but unverified-scope mark) rather than the old blind +3.
const CERT_TIER_A = new Set([
  'usda organic', 'organic', 'usda-organic', 'ccof-certified-organic',
  'non-gmo project verified', 'non-gmo project', 'non-gmo', 'non-gmo-project',
  'heart-check',
]);
const CERT_TIER_B = new Set([
  'certified gluten-free (gfco)', 'certified gluten-free', 'gluten-free (gfco)',
  'gluten-free certified', 'gluten free certified', 'gluten-free', 'gluten free',
  'certified-gluten-free',
  'certified vegan', 'vegan action certified', 'vegan',
  'nut-free certified',
  'kosher (ou)', 'orthodox union kosher', 'kosher', 'tk kosher',
  'orthodox-union-kosher', 'organized-kashrut-kosher',
  'halal certified',
]);
const CERT_TIER_C = new Set([
  'fair trade certified',
  'certified humane',
  'rainforest alliance certified',
  'b corp certified',
  'california olive oil council certified',
]);
const CERT_TIER_D = new Set([
  'keto certified', 'keto',
  'paleo certified', 'certified paleo', 'paleo',
  'whole30 approved', 'whole30',
  'made in usa',
]);
const MAX_CERT_BONUS = 8;

function certWeight(cert) {
  const n = String(cert || '').toLowerCase().trim();
  if (CERT_TIER_A.has(n)) return 3;
  if (CERT_TIER_B.has(n)) return 2;
  if (CERT_TIER_C.has(n)) return 1;
  if (CERT_TIER_D.has(n)) return 0;
  return 1; // unrecognized mark: assume real but unverified scope
}

function calcCertBonus(certifications) {
  const total = (certifications || []).reduce((sum, c) => sum + certWeight(c), 0);
  return Math.min(MAX_CERT_BONUS, total);
}

// Words whose presence in an ingredient's name means that ingredient (and so
// the product) underwent some processing step beyond simply being the whole
// food itself — pasteurizing, juicing, roasting, salting, etc. Used to gate
// the literal-100 ceiling below.
const PROCESSING_INDICATORS = [
  'pasteuriz', 'juice', 'concentrate', 'roast', 'salt', 'smoke', 'cured',
  'fried', 'fry', 'baked', 'bake', 'cooked', 'cook', 'boiled', 'steamed',
  'extract', 'isolate', 'hydrolyz', 'powder', 'syrup', 'flavor', 'flavour',
  'sweetened', 'seasoned', 'blanched', 'toasted', 'dehydrated', 'canned',
  'preserved',
];

function isRawIngredientName(name) {
  const n = String(name || '').toLowerCase();
  return !PROCESSING_INDICATORS.some((w) => n.includes(w));
}

// A product with a clean ingredient profile but ANY processing step, more
// than one ingredient, or unverified-clean packaging is "excellent" but never
// perfect — 100 is reserved for a genuinely raw, single-ingredient whole food
// in packaging that's been checked and found non-plastic. Founder rule
// (2026-07-09): "the only things that should get 100 are entirely whole
// foods... even the cleanest product has been processed, or the container is
// bad." In a barcoded grocery catalog this ceiling is meant to be almost
// unreachable, not a typical outcome.
const PROCESSED_CLEAN_CEILING = 96;

// REVERSED 2026-08-08 (founder). The prior rule (2026-07-09) was "assume
// plastic until packaging is actually verified otherwise" — a flat penalty
// whenever packaging data was missing. It was withdrawn after Vital Farms
// Pasture-Raised Eggs surfaced the failure case: a single-ingredient,
// Certified Humane product in a paperboard carton was capped at 96 purely
// because WE had never recorded the carton, with no packaging note on screen
// to explain the missing points. Docking a product for a gap in our own data,
// invisibly, is the opposite of what a transparency app should do.
//
// Unknown packaging is now NEUTRAL: no penalty, and it no longer blocks a
// literal 100. A real, researched packaging CONCERN still carries its own
// penalty (see analyzePackagingConcern) — that path is unchanged, because
// that one is an actual finding about the product rather than an absence of
// data about it.
const UNRESEARCHED_PACKAGING_PENALTY = 0;

// Housing/living-conditions scoring adjustment. Founder directive
// (2026-07-30): "the chicken condition should weigh heavily into the
// scoring, that's the point of this feature... pasture raised organic is
// the healthiest chicken and hence egg, score should reflect that" —
// then, after an initial pass: "it needs to be more strict than this. the
// health difference and vitamin difference from conventional to pasture
// raised is significant, scores should reflect that."
// Before this, `certifications` on the product could earn a small ethics/
// sourcing bonus (Tier C, +1 — see calcCertBonus) but nothing PENALIZED a
// plain conventional/caged product, so an Eggland's Best Classic egg
// (single clean ingredient, no packaging concern) scored identically to a
// pasture-raised egg with the exact same ingredient profile.
//
// The stricter conventional penalty is grounded in real nutrient data, not
// just a welfare framing: a Penn State University study (Karsten et al.,
// Renewable Agriculture and Food Systems) comparing pastured vs. caged
// hens' eggs found 2.5x total omega-3 fatty acids, 2x long-chain omega-3,
// less than half the omega-6:omega-3 ratio, 2x vitamin E, up to 4x vitamin
// D (driven by outdoor sun exposure), and 38% more vitamin A in pastured
// eggs. That is a genuinely large, peer-reviewed nutrient gap — the
// magnitude below reflects it, not an arbitrary welfare-only penalty.
//
// Read PURELY from the product's own name via detectHousingTier() — the
// same ground truth the Living Conditions card uses (sourcingMatch.js) —
// never from company data, so this applies identically to a curated
// catalog product and an unrecognized scan alike. Scoped to Eggs only:
// this is the one module with real, founder-approved research behind the
// housing ladder (see .claude/skills/sourcing-transparency); a future
// module (meat-poultry, seafood, dairy) needs the same treatment added
// explicitly once ITS research is real, never inherited by default.
//
// Applied AFTER the packaging/processing ceiling (a different, unrelated
// axis) rather than inside it, so the bonus/penalty isn't silently
// absorbed the way it was before this feature existed.
//
// Redesigned 2026-07-30 (second pass, same day) after the founder pushed
// back on the first version clustering every non-conventional tier within
// 2 points of pasture-raised: "free range does not mean they have a
// hundred square feet of bugs and little proteins and foods that it eats
// on the regular... All scores should reflect less than ideal nutrition
// than pasture raised." That's correct and changes the model — the Penn
// State nutrient gap is specifically about hens actually FORAGING pasture
// (legumes, grasses, insects) plus real sun exposure, not about "has a
// door to outside." USDA free-range requires SOME outdoor access with NO
// vegetation or foraging-space minimum; cage-free requires no outdoor
// access at all. Neither has the mechanism the nutrient study measured —
// scoring them close to pasture-raised was crediting the label claim, not
// the actual biology. Only pasture-raised (108 sq ft/hen, real range) gets
// credit for the full nutrient gap; everything else is a real but modest
// welfare/regulatory step, clustered well below pasture and well above
// conventional rather than near-tied with either end.
// NOTE (2026-08-08): every tier below was shifted down by 4 when the
// unresearched-packaging penalty was removed (see
// UNRESEARCHED_PACKAGING_PENALTY). That change raised a clean egg's base
// score from 96 to 100, which would otherwise have lifted every housing tier
// by 4 and compressed the gap this table exists to create. The offset keeps
// each tier's final score exactly where it was tuned, while letting
// pasture-raised finally reach the literal 100 this table's own comment
// always claimed for it (the packaging gate had been silently capping it
// at 96).
const SOURCING_ADJUSTMENT = {
  // The only tier with a real foraging + sun-exposure mechanism behind it
  // — this is what the Penn State 2.5x-omega-3/2x-vitamin-E/4x-vitamin-D
  // gap actually measured. Pushes a typical clean egg to the literal 100
  // ceiling, standing alone as the sole tier that reaches grade A.
  'pasture-raised': 6,
  // USDA's 2023 Organic Livestock & Poultry Standards rule is the newest,
  // most specific outdoor-access requirement short of pasture-raised
  // (prohibits total confinement, requires vegetated outdoor space "to
  // the degree practicable") — a real step toward the foraging mechanism,
  // though not verified to match pasture-raised's actual square footage.
  // A real audited counter-example is already on file (Eggland's Best's
  // organic line measured 1.2 sq ft/hen indoors, below even the cage-free
  // floor), so this stays a meaningful but bounded improvement, not
  // treated as pasture-equivalent.
  organic: -11,
  // USDA free-range requires SOME outdoor access but sets no minimum
  // space, no vegetation requirement, and no standard for what's actually
  // out there — a concrete-and-fence yard satisfies the legal term. Real,
  // but doesn't carry the foraging mechanism the nutrient study measured.
  'free-range': -12,
  // No outdoor access requirement at all — a real welfare improvement
  // (no cage confinement) but zero mechanistic basis for the nutrient
  // gap this whole adjustment is grounded in, so it sits closest to
  // conventional of the non-conventional tiers.
  'cage-free': -17,
  conventional: -22,
};

function calcEggsSourcingAdjustment(product) {
  if (!isEggsHousingEligible(product)) return 0;
  const tier = detectHousingTier(product.name);
  return SOURCING_ADJUSTMENT[tier] ?? 0;
}

// meat-poultry and seafood adjustments (2026-07-30, second sourcing module
// after eggs). Structurally different from eggs on purpose, not by
// oversight: verified against the real catalog that NO meat-poultry
// product carries a housing/diet tier claim in its own name (no
// "grass-fed," no "gestation-crate-free" — deli meat and sausage
// packaging doesn't print that the way egg cartons print their tier), so
// there is no per-SKU signal to detect the way detectHousingTier() reads
// eggs. The real signal for these two modules lives in the COMPANY-level
// `sourcing` data from the sourcing-transparency pipeline — a deliberate,
// verified architecture choice, not a shortcut.
//
// Every magnitude below is either grounded in real evidence (cited) or
// zero — this module does not invent a nutrition claim to justify a
// number the way it would be tempting to, mirroring the eggs feature's
// own discipline (e.g. eggs left 'organic' with no fabricated generic
// standard when no verifiable figure existed).

// Beef/lamb: grass-finished vs. grain-finished. Revised 2026-08-03 after
// checking real evidence against the founder's specific question — is
// there a meaningful difference between "traditional," "grass-fed,"
// "grass-finished," and "100% grass-fed" claims, and does the SCIENCE
// support graduated credit between them? Two real findings changed the
// design:
//
// 1. A 2026 Journal of Animal Science commercial-system study (the newest,
//    most rigorous data available) found a broader and STRONGER nutrient
//    gap than initially cited: omega-6:3 ratio 2.14 vs. 8.28 (~3.9x),
//    total omega-3 1.79% vs. 0.57% (~3.1x), EPA 4x, calcium 3x, selenium
//    6x, CLA ~1.6x — comparable to or exceeding the egg pasture-raised
//    case across MORE independently measured nutrients (P<0.001 on nearly
//    all). The magnitude below is revised up accordingly, no longer
//    treated as more "modest" than eggs.
// 2. Critically, that same study tested UNCERTIFIED retail "grass-fed"
//    products directly and found some had omega ratios INDISTINGUISHABLE
//    from grain-fed beef — i.e., an unverified "grass-fed" claim (no
//    "100%," no certification) does NOT reliably predict the nutrient
//    benefit. There is no USDA definition of "grass-fed" (the voluntary
//    label standard was withdrawn in 2016) and "grass-finished" alone has
//    no legal definition either — AGA's own materials call an uncertified
//    "grass-finished" claim "meaningless" without their standard (100%
//    forage, birth to harvest) behind it. This is exactly the "biggest
//    misleading claim in the category" this module already flagged — the
//    real data now shows WHY: a vague claim doesn't verify the mechanism.
//
// Net effect: the graduated tiers below aren't about rewarding "some
// grass exposure" progressively — they're about how VERIFIED the 100%
// claim is. A bare, uncompleted "grass-fed"/"grass-finished" claim earns
// no credit (not because it's assumed false, but because the real data
// shows it doesn't reliably predict the outcome); an explicit, specific
// "100%" self-declaration is a stronger, more falsifiable claim and earns
// partial credit; only independent certification (AGA or equivalent,
// verified 100% forage birth-to-harvest) earns the full credit the study
// actually measured.
const GRASS_FINISHED_ADJUSTMENT = {
  // Independently certified 100% grass-fed AND grass-finished (e.g.
  // American Grassfed Association: birth-to-harvest forage diet, audited
  // every 15 months). The only tier with the confirmed mechanism the 2026
  // study measured — scaled to match, not undersell, that evidence.
  certified: 12,
  // Company explicitly states "100% grass-fed" / "grass-fed and
  // grass-finished" (a specific, falsifiable claim — if untrue, it's
  // false advertising) but not independently audited. Real signal, partial
  // credit, well below certified.
  'company-claims-100-percent': 5,
  // A bare "grass-fed" or "grass-finished" claim with no completion
  // language — the exact claim type the 2026 study found sometimes
  // matches grain-fed nutritionally. No credit, not because it's assumed
  // false, but because the real data shows it doesn't reliably predict
  // the benefit either way.
  'company-disclosure-vague': 0,
  // Confirmed no grass-fed/grass-finished claim at all -> the industry
  // default is grain-finished feedlot, matching the study's grain-finished
  // comparison group. Penalty scaled to the same real multi-nutrient gap
  // that earns 'certified' its bonus above.
  'not-claimed': -16,
  unknown: 0,                 // genuinely couldn't be determined, never penalized for a data gap
  'not-applicable': 0,        // company doesn't sell beef/lamb at all
};

// Pork: gestation-crate status. No nutrition/vitamin evidence found for
// this axis (unlike grass-finishing) — this is a welfare fact, not a
// health fact, same honest treatment eggs gave cage-free (real, modest,
// not claimed to be about nutrient content).
const GESTATION_CRATE_ADJUSTMENT = {
  'certified-crate-free': 4,
  'company-claims-crate-free': 1,  // real claim, not independently audited
  'crates-used': -6,               // confirmed practice, real fact (Hormel, Smithfield both verified here)
  unknown: 0,
  'not-applicable': 0,
};

// GAP (Global Animal Partnership) step — the cross-species standardized
// ladder. Bonus-only, never a penalty for absence: GAP is an opt-in
// certification system, and "not GAP-rated" is not evidence of bad
// practice any more than "not USDA Organic" is (evidence-schema.md's
// Display rules: absence of certification is never displayed as an
// accusation). Currently dormant for every company in the catalog (all
// 'unknown' or 'none') — architecture-ready for when real positive data
// exists, not a guess today.
const GAP_STEP_ADJUSTMENT = {
  '5+': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1,
  none: 0, unknown: 0,
};

function calcMeatPoultryAdjustment(product) {
  const company = product.companyId ? COMPANY_DB[product.companyId] : null;
  const sourcing = company?.sourcing;
  if (!sourcing || sourcing.industry !== 'meat-poultry') return 0;

  const w = sourcing.welfareMeatPoultry;
  if (!w) return 0;

  const species = detectMeatSpecies(product.name);
  let adjustment = 0;

  if (species === 'beef') {
    adjustment += GRASS_FINISHED_ADJUSTMENT[w.grassFinished] ?? 0;
  } else if (species === 'pork') {
    adjustment += GESTATION_CRATE_ADJUSTMENT[w.gestationCrateStatus] ?? 0;
  }
  // poultry: chillMethod is a processing fact, not a welfare/nutrition
  // claim (evidence-schema.md's own comment on this field) — deliberately
  // excluded from scoring, not an oversight.

  adjustment += GAP_STEP_ADJUSTMENT[w.gapStep] ?? 0;

  return adjustment;
}

// Seafood Watch rating is stored as free text (e.g. "Avoid (red) —
// category rating for skipjack/purse-seine-on-FADs, NOT a confirmed
// StarKist-brand-specific rating") rather than a clean enum, because the
// Stage 5 review found the rating is often method/region-level, not a
// confirmed brand-specific figure — parsing just the leading rating word
// respects that same caveat rather than pretending it's a precise number.
function parseSeafoodWatchAdjustment(ratingText) {
  const t = (ratingText || '').toLowerCase();
  if (t.startsWith('best choice')) return 4;
  if (t.startsWith('good alternative')) return 1;
  if (t.startsWith('avoid')) return -5;
  return 0;
}

function calcSeafoodAdjustment(product) {
  const company = product.companyId ? COMPANY_DB[product.companyId] : null;
  const sourcing = company?.sourcing;
  if (!sourcing || sourcing.industry !== 'seafood') return 0;

  const w = sourcing.welfareSeafood;
  if (!w) return 0;

  let adjustment = parseSeafoodWatchAdjustment(w.seafoodWatchRating);

  // Farmed shrimp with an unconfirmed sourcing country: a real, peer-
  // reviewed 2021 study (PMC7870836) found higher antibiotic-resistance-
  // gene prevalence in imported farm-raised shrimp vs. wild-caught US
  // shrimp — but it's a category-level finding about IMPORTED farmed
  // shrimp broadly, not proof about any specific farm. Kept small and
  // only applies when the farming country is genuinely unconfirmed
  // (rather than guessing a specific country's risk level) — matches the
  // real catalog case (Rich Products/SeaPak, farmingCountry: 'unknown').
  const isFarmedUnconfirmed =
    (w.sourceType === 'farmed' || w.sourceType === 'mixed') &&
    (w.farmingCountry === 'unknown' || !w.farmingCountry);
  if (isFarmedUnconfirmed) adjustment -= 3;

  return adjustment;
}

function calcSourcingAdjustment(product) {
  if (isEggsHousingEligible(product)) return calcEggsSourcingAdjustment(product);

  // Dispatch on the COMPANY's sourcing industry, not a fallthrough guess —
  // a meat-poultry product legitimately scoring 0 (e.g. a poultry item
  // with no positive GAP data) must not fall through and get re-evaluated
  // as a seafood product just because both happen to return zero.
  const company = product.companyId ? COMPANY_DB[product.companyId] : null;
  const industry = company?.sourcing?.industry;
  if (industry === 'meat-poultry') return calcMeatPoultryAdjustment(product);
  if (industry === 'seafood') return calcSeafoodAdjustment(product);
  return 0;
}

// ─── Form-penalty model (2026-08-17, founder-approved — see decision-log.md) ─
//
// Accuracy audit against the live catalog found the scorer rewarded short,
// clean-looking ingredient LISTS while never asking whether the food's FORM
// is inherently unhealthy — Lay's Classic 91, Fritos 91, Hebrew National
// franks 96, Bob Evans pork sausage 96, Applegate deli turkey 96, Boulder
// Canyon "avocado oil" chips 96. Four rules, all constants below so they stay
// tunable after the re-grade:
//   RULE 1 — processed/cured meat -> hard cap 40 (WHO Group 1 carcinogen).
//   RULE 2 — snack form -> tiered hard cap (see below).
//   RULE 3 — refined-grain #1 ingredient -> -25 point PENALTY (not a cap).
//   RULE 4 — snack/frying oils -> neutral, never a positive credit.
// Deliberately form/ingredient-aware, not a blunt category cap: Simple Mills
// almond-flour crackers and Mary's Gone whole-grain crackers are neither
// fried nor refined-grain and must stay high; fresh/whole proteins (plain
// chicken breast, salmon, ground beef, eggs) are not processed meat and the
// cap must never touch them.
//
// RULE 2 UPDATE (2026-08-19, evidence review: context/research/
// baked-vs-fried-chips.md): the original single fried-snack cap treated
// every chip/crisp/puff-format snack the same, which wrongly hit baked/
// popped snacks and simple popcorn as hard as an actually deep-fried chip.
// Split into three tiers — see the RULE 2 section below for the full detail.

const PROCESSED_CURED_MEAT_CAP = 40;
const FRIED_SNACK_CAP = 50;
const BAKED_SNACK_CAP = 65;
const REFINED_GRAIN_PENALTY = 25;

// Escapes regex metacharacters in a literal term, then builds a single
// case-insensitive word-boundary regex matching any term in the list.
// Multi-word terms (e.g. "hot dog") match on adjacent words separated by
// whitespace; word boundaries mean "ham" never matches inside "graham" or
// "hamburger", and "frank" never matches inside "frankfurter" (no boundary
// between "frank" and the following letters) — "frankfurter" is its own
// listed term instead.
function buildWordBoundaryTester(terms) {
  const escaped = terms.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
  );
  return new RegExp('\\b(' + escaped.join('|') + ')\\b', 'i');
}

// RULE 1 — PROCESSED / CURED MEAT ─────────────────────────────────────────
//
// Trigger (a): nitrate/nitrite anywhere in the ingredient list (sodium
// nitrite, potassium nitrate, etc.) — the direct WHO Group 1 curing-agent
// marker.
const NITRATE_NITRITE_PATTERN = /\bnitr(ate|ite)s?\b/i;

// Trigger (b): a cured/processed-meat term in the product's own name.
const PROCESSED_CURED_MEAT_NAME_TERMS = [
  'hot dog', 'frank', 'frankfurter', 'wiener', 'sausage', 'bacon', 'salami',
  'pepperoni', 'bologna', 'mortadella', 'prosciutto', 'deli meat',
  'luncheon meat', 'lunch meat', 'ham', 'corned beef', 'pastrami', 'jerky',
  'kielbasa', 'bratwurst', 'chorizo', 'hot link', 'vienna sausage', 'spam',
  'potted meat',
];
const PROCESSED_CURED_MEAT_NAME_REGEX = buildWordBoundaryTester(PROCESSED_CURED_MEAT_NAME_TERMS);

// Trigger (b, extended) — deli/lunch meat filed under this catalog's own
// 'Deli & Lunch' / 'Deli Meat' categories. WHO Group 1 covers salted, cured,
// smoked, or otherwise preserved meat — so a plain "uncured turkey breast"
// deli slice with no disclosed nitrite still counts; the deli-counter
// slicing/brining process itself is what WHO classifies, not only the
// presence of a nitrite label word. Gated on a real meat/poultry word
// because this same category ALSO holds hummus (Sabra, Cedar's, Hope
// Foods) in the live catalog — category membership alone is never enough.
const DELI_LUNCH_MEAT_CATEGORIES = new Set(['deli & lunch', 'deli meat']);
const DELI_CATEGORY_MEAT_WORDS = ['turkey', 'chicken', 'beef', 'pork', 'ham', 'duck', 'lamb', 'veal'];
const DELI_CATEGORY_MEAT_WORD_REGEX = buildWordBoundaryTester(DELI_CATEGORY_MEAT_WORDS);

// Two real false positives found during the 2026-08-17 drift audit against
// the live catalog. Both are stripped from a working copy of the name
// before the main term regex runs, rather than blocking the whole branch —
// so a genuine OTHER trigger word elsewhere in the same name still fires
// normally, and only the specific false-positive phrase is neutralized.
//
// (1) "Frank's RedHot Original Cayenne Pepper Sauce" — bare "frank" word-
// boundary-matches the possessive brand name "Frank's" (the apostrophe is a
// non-word character, so "Frank" reads as its own whole word). A hot sauce
// is not a hot dog.
const FRANK_POSSESSIVE_REGEX = /\bfrank'?s\b/gi;

// (2) "Wonder Classic Enriched Hot Dog Buns" — the literal phrase "hot dog"
// appears inside a BREAD product's name (a bun to hold a hot dog, not the
// hot dog itself) and wrongly capped a bread product as processed meat.
// "frankfurter buns" gets the identical treatment for the same reason.
const MEAT_BUN_PHRASE_REGEX = /\b(hot\s+dog|frankfurter)\s+buns?\b/gi;

function detectProcessedCuredMeat(product, ingredients) {
  const name = String(product?.name || '')
    .replace(FRANK_POSSESSIVE_REGEX, ' ')
    .replace(MEAT_BUN_PHRASE_REGEX, ' ');
  const category = String(product?.category || '').toLowerCase().trim();

  if ((ingredients || []).some((ing) => NITRATE_NITRITE_PATTERN.test(String(ing)))) {
    return true;
  }

  // A product the catalog's own schema already declares vegan cannot be
  // meat — real catalog false positive found during the drift audit:
  // "sausage" in "MorningStar Farms Veggie Sausage Patties" bare-word-
  // matched Rule 1's name trigger even though it's a soy/wheat-gluten
  // product with isVegan: true. Scoped to the NAME/category-word triggers
  // only (not nitrite above) — nitrite itself carries an independent
  // curing-agent concern even in a rare vegan product that used it.
  if (product?.isVegan === true) return false;

  if (PROCESSED_CURED_MEAT_NAME_REGEX.test(name)) return true;

  if (DELI_LUNCH_MEAT_CATEGORIES.has(category)) {
    const hasMeatWord =
      DELI_CATEGORY_MEAT_WORD_REGEX.test(name) ||
      (ingredients || []).some((ing) => DELI_CATEGORY_MEAT_WORD_REGEX.test(String(ing)));
    if (hasMeatWord) return true;
  }

  return false;
}

// RULE 2 — SNACK FORM TIERS (2026-08-19 refinement, evidence review in
// context/research/baked-vs-fried-chips.md) ───────────────────────────────
//
// Originally a single hard cap at 50 for every chip/crisp/puff-format snack.
// The evidence review found that cap was punishing baked/popped/puffed
// snacks and simple popcorn the same as genuinely deep-fried ones, when the
// real evidence (oil/calorie load, NOVA formulation markers, satiety data)
// supports three distinct tiers instead of one blunt cap. All three tiers
// stay gated to this catalog's real chip/snack categories first — without
// that gate, bare words like "puff" (Gerber baby Puffs), "kettle" (Kettle &
// Fire bone broth), or "crisp" (Cookie Crisp cereal, "Crispy Chicken Fries")
// would false-trigger on completely unrelated foods.
//
//   TIER 1 — deep-fried (classic potato/corn/tortilla chips, kettle-cooked,
//   or an explicit "fried" marker) -> hard cap 50, unchanged from before.
//   TIER 2 — baked/popped/air-puffed/puffed chip ANALOGUE (formed/extruded
//   starch snacks marked baked, popped, air-popped, air-puffed, puffs,
//   puffed, crisps, veggie straws/chips/sticks/crisps, pita chips, or a
//   documented non-fried brand process) -> new, milder cap of 65. Still
//   capped, not exempt — "baked" only means less absorbed oil, not that the
//   food is healthy (acrylamide, sodium, and refined-starch base are all
//   unaffected by the cooking method per the research review).
//   TIER 3 — simple whole-kernel popcorn/kettle corn (popcorn/corn is the
//   #1 ingredient, everything else is oil/salt/sugar/ordinary seasoning, no
//   refined-starch base or NOVA extrusion marker) -> NO process cap at all.
//   Popcorn's real, evidence-backed advantage (intact kernel, satiety) earns
//   the ONLY exemption in this rule — normal scoring (calories, oil,
//   sat-fat, sodium, added sugar) still fully applies, so a sweet kettle
//   corn still loses points for its sugar, it just isn't force-capped.
//
// None of the three tiers grant positive CREDIT for the words "baked",
// "popped", "air-puffed", "veggie", or "sprouted" — they only decide which
// cap (or no cap) applies; the words are never a health signal on their own.
const SNACK_FORM_CATEGORIES = new Set(['chips', 'chips & crackers', 'snacks']);

// TIER 1 — the classic/default chip vocabulary. Deliberately NOT "strong" or
// unconditional: the approved spec is explicit that even an explicit
// "fried" marker must yield to a baked/popped/puffed marker also present on
// the same product (see detectBakedSnackMarker below) — the real catalog
// case this protects is "Lay's Oven Baked Original Potato Crisps", which
// contains both "Potato Crisps" (a Tier 1 term) and "Oven Baked" (a Tier 2
// marker) and must land on the milder tier. "Potato crisp(s)"/"corn
// crisp(s)" are included here (not just "chip(s)") because they're the
// direct US/UK-naming twin of "potato chips"/"corn chips" — real catalog
// case: Pringles "Original Potato Crisps" is a fried, formed snack, not a
// baked-analogue, even though the bare word "crisps" also appears on the
// Tier 2 marker list below.
const FRIED_SNACK_NAME_TERMS = [
  'chip', 'chips', 'kettle', 'fried', 'curl', 'curls', 'pork rind', 'pork rinds',
  'potato crisp', 'potato crisps', 'corn crisp', 'corn crisps',
];
const FRIED_SNACK_NAME_REGEX = buildWordBoundaryTester(FRIED_SNACK_NAME_TERMS);

// TIER 2 — baked/popped/puffed chip-analogue marker words, straight off the
// approved research recommendation. Bare "crisp"/"crisps" is included so
// legume/veggie-format crisps (Harvest Snaps, Off The Eaten Path) are
// caught — see POTATO_OR_CORN_CRISPS_REGEX below for the one carve-out.
const BAKED_ANALOGUE_NAME_TERMS = [
  'popped', 'air popped', 'air-popped', 'air puffed', 'air-puffed',
  'puff', 'puffs', 'puffed', 'crisp', 'crisps',
  'veggie straw', 'veggie straws', 'veggie stick', 'veggie sticks',
  'veggie chip', 'veggie chips', 'veggie crisp', 'veggie crisps',
  'pita chip', 'pita chips',
];
const BAKED_ANALOGUE_NAME_REGEX = buildWordBoundaryTester(BAKED_ANALOGUE_NAME_TERMS);

// "Potato crisps"/"corn crisps" is Tier 1's own classic-chip vocabulary (see
// above) — the bare word "crisp(s)" inside that specific two-word phrase
// must not, on its own, promote a product to Tier 2 the way a real format
// word (puffs, veggie crisps, pita chips) does. Scoped narrowly: if this
// phrase is the ONLY Tier-2-looking word in the name, it doesn't count; a
// second, independent Tier 2 marker (e.g. "Oven Baked ... Potato Crisps")
// still promotes normally.
const POTATO_OR_CORN_CRISPS_REGEX = /\b(potato|corn)\s+crisps?\b/i;
function isOnlyPotatoOrCornCrispsMarker(name) {
  const stripped = name.replace(POTATO_OR_CORN_CRISPS_REGEX, ' ');
  return !BAKED_ANALOGUE_NAME_REGEX.test(stripped);
}

// An explicit "oven baked" claim PAIRED with a chip-format word in the same
// name (real catalog case: "Lay's Oven Baked Original Potato Crisps") is a
// Tier 2 signal. Scoped to require BOTH words — a bare "baked" alone must
// never trigger this on its own, or it would sweep in ordinary baked
// crackers that have nothing to do with this rule (real catalog case:
// "Cheez-It Original Baked Snack Crackers", "Goldfish Baked Snack
// Crackers" — plain wheat crackers, correctly untouched by every tier here,
// matching Rule 2's original "baked crackers are not capped here" intent).
const BAKED_WORD_REGEX = /\bbaked\b/i;
const CHIP_FORMAT_CONTEXT_REGEX = /\b(chip|chips|crisp|crisps|potato|tortilla)\b/i;
function hasBakedWordInChipContext(name) {
  return BAKED_WORD_REGEX.test(name) && CHIP_FORMAT_CONTEXT_REGEX.test(name);
}

// A small number of real snack brands are documented as using a genuinely
// non-fried process even though their own product name carries no baked/
// popped/puffed marker word: Popchips ("popped" potato snack — the brand's
// entire identity is built on being popped under heat and pressure, not
// fried or baked) and Way Better Snacks (marketed as baked, not fried,
// sprouted-grain tortilla chips). FLAGGED FOR REVIEWER VERIFICATION: this is
// a brand-level manufacturing-process claim asserted from general knowledge
// rather than an in-catalog citation, unlike every other marker in this
// file — double-check before this ships.
// Reviewer 2026-08-19: Way Better removed. Like most (even sprouted) tortilla
// chips it is likely fried, so it defaults to the fried tier (50). Only
// Popchips is kept — its whole brand identity is "popped, not fried".
const BAKED_ANALOGUE_BRAND_TERMS = ['popchips'];
const BAKED_ANALOGUE_BRAND_REGEX = buildWordBoundaryTester(BAKED_ANALOGUE_BRAND_TERMS);

function detectBakedSnackMarker(product) {
  const category = String(product?.category || '').toLowerCase().trim();
  if (!SNACK_FORM_CATEGORIES.has(category)) return false;

  const brand = String(product?.brand || '');
  if (BAKED_ANALOGUE_BRAND_REGEX.test(brand)) return true;

  const name = String(product?.name || '');
  if (hasBakedWordInChipContext(name)) return true;

  if (!BAKED_ANALOGUE_NAME_REGEX.test(name)) return false;
  if (POTATO_OR_CORN_CRISPS_REGEX.test(name) && isOnlyPotatoOrCornCrispsMarker(name)) {
    return false;
  }
  return true;
}

function detectFriedSnack(product) {
  const category = String(product?.category || '').toLowerCase().trim();
  if (!SNACK_FORM_CATEGORIES.has(category)) return false;
  // A baked/popped/puffed marker anywhere on the same product overrides the
  // Tier 1 default — see the FRIED_SNACK_NAME_TERMS comment above.
  if (detectBakedSnackMarker(product)) return false;
  const name = String(product?.name || '');
  return FRIED_SNACK_NAME_REGEX.test(name);
}

// TIER 3 — SIMPLE WHOLE-KERNEL POPCORN ────────────────────────────────────
//
// Popcorn's real advantage over a chip is the intact kernel (see the
// research review's satiety citation) — not the word "popcorn" itself, so
// this stays narrow: the name has to say popcorn/kettle corn AND the
// ingredient list has to actually be simple (popcorn/corn first, nothing
// beyond oil/salt/sugar/ordinary seasoning). A flavored, reformulated
// popcorn with a NOVA extrusion/refined-starch marker (real catalog case:
// Smartfood White Cheddar Popcorn's "corn maltodextrin") does NOT qualify —
// it was never form-capped by this rule anyway (no chip/crisp/puff word in
// its name), so it's simply left where it already was: scored on its own
// nutrition/ingredient merits, same as before this feature existed.
const POPCORN_NAME_TERMS = ['popcorn', 'kettle corn'];
const POPCORN_NAME_REGEX = buildWordBoundaryTester(POPCORN_NAME_TERMS);
const POPCORN_DISQUALIFYING_TERMS = [
  'maltodextrin', 'dextrin', 'corn syrup solids',
  'modified starch', 'modified corn starch', 'modified food starch',
  'modified tapioca starch', 'protein isolate',
  'rice flour', 'wheat flour', 'corn flour',
  'potato starch', 'tapioca starch', 'wheat starch', 'rice starch',
  'corn starch', 'cornstarch',
];
const POPCORN_DISQUALIFYING_REGEX = buildWordBoundaryTester(POPCORN_DISQUALIFYING_TERMS);

function detectSimplePopcorn(product, ingredients) {
  const category = String(product?.category || '').toLowerCase().trim();
  if (!SNACK_FORM_CATEGORIES.has(category)) return false;

  const name = String(product?.name || '');
  if (!POPCORN_NAME_REGEX.test(name)) return false;

  const list = ingredients || [];
  const first = list[0];
  if (!first) return false;
  if (!/\b(popcorn|corn)\b/i.test(normalize(String(first)))) return false;

  return !list.some((ing) => POPCORN_DISQUALIFYING_REGEX.test(String(ing)));
}

// RULE 3 — REFINED-GRAIN BASE ─────────────────────────────────────────────
//
// A soft penalty (subtraction, not a cap) so a mostly-good product isn't
// nuked — only fires when the refined grain is the #1 (primary-by-weight)
// ingredient. Whole grains, almond/coconut/chickpea/other legume flours,
// and seed-based bases are never matched.
const REFINED_GRAIN_FIRST_INGREDIENT_TERMS = [
  'enriched flour', 'enriched wheat flour', 'enriched bleached flour',
  'white flour', 'bleached flour', 'white rice flour', 'refined rice flour',
];
const REFINED_GRAIN_REGEX = buildWordBoundaryTester(REFINED_GRAIN_FIRST_INGREDIENT_TERMS);

// A compound first ingredient like "crust (cauliflower, brown rice flour,
// white rice flour, ...)" used to be tested as ONE literal string, which let
// a refined flour buried as a NON-first sub-component inside the
// parenthetical (here "white rice flour" is the 3rd item, not the 1st)
// wrongly fire the penalty even though the food's actual primary-by-weight
// substance is cauliflower. Real catalog false positive: Caulipower
// Margherita Cauliflower Crust Pizza. Fixed by evaluating only the true
// primary candidate: if the label BEFORE the parenthesis is itself a refined
// grain term (e.g. "enriched wheat flour (wheat flour, niacin, ...)"), that
// still fires directly — nothing to look inside for. Otherwise the label is
// a generic compound name ("crust", "sauce", "seasoning blend") and the real
// primary-by-weight ingredient is the FIRST comma-separated item inside the
// parens (top-level only — a nested "[...]" group's own commas don't count).
function firstTopLevelElement(str) {
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) return str.slice(0, i);
  }
  return str;
}

function primaryIngredientCandidate(raw) {
  const s = String(raw || '').trim();
  const m = s.match(/^([^(]+)\(([\s\S]*)\)\s*$/);
  if (!m) return s;
  const label = m[1].trim();
  if (REFINED_GRAIN_REGEX.test(label)) return label;
  const firstInner = firstTopLevelElement(m[2]).trim();
  return firstInner || label;
}

function calcRefinedGrainPenalty(ingredients) {
  const first = (ingredients || [])[0];
  if (!first) return 0;
  return REFINED_GRAIN_REGEX.test(primaryIngredientCandidate(first)) ? REFINED_GRAIN_PENALTY : 0;
}

// RULE 4 — SNACK / FRYING OILS: neutral, never a positive ────────────────
//
// (4a) Whole-food-word exclusion: a whole avocado, whole soybeans, or
// sunflower seeds are real whole foods and keep their WHOLE_FOOD_WORDS
// credit in classifyUnknown() below — but the refined OIL pressed from them
// is a processed ingredient, not a whole food, so these specific words must
// not grant a free "natural" pass when the candidate string is clearly an
// oil (contains the word "oil"). Scoped to exactly the oils named in the
// approved rule.
const OIL_FORM_EXCLUDED_WHOLE_FOOD_WORDS = new Set([
  'avocado', 'canola', 'sunflower', 'safflower', 'soybean', 'vegetable',
]);

// (4b) The real-catalog mechanism this rule exists to close: several of
// these oils (avocado oil, and "high oleic"/"expeller pressed" qualified
// variants) already resolve via the ingredient cache to a genuinely Low
// risk/'ok' flag — correct on pure nutrition grounds, but because cache-
// sourced ingredients never fed the UPF-marker system (only DB-sourced ones
// did, see dbEntryIsMarker below), a chip whose only "processed-looking"
// ingredient was a claimed frying oil could reach the same whole-food-clean
// ceiling as an actual raw whole food. This list forces every listed oil —
// regardless of its own risk tier — to always count as a processing marker,
// so it can never make a product "wholeFoodClean" on its own. This does NOT
// change any oil's individual risk/penalty number (a genuinely Medium-risk
// oil like canola stays Medium-risk) — it only removes the free pass on
// whether the PRODUCT counts as a clean whole food.
const SNACK_FRYING_OIL_NAMES = new Set([
  'avocado oil', 'organic avocado oil',
  'canola oil', 'organic canola oil', 'expeller pressed canola oil',
  'non-gmo expeller pressed canola oil', 'non-gmo canola oil',
  'sunflower oil', 'organic sunflower oil', 'high oleic sunflower oil',
  'expeller pressed sunflower oil', 'expeller pressed high oleic sunflower oil',
  'organic expeller pressed sunflower oil', 'organic high oleic sunflower oil',
  'organic expeller-pressed sunflower oil',
  'safflower oil', 'organic safflower oil', 'high oleic safflower oil',
  'expeller pressed high oleic safflower oil',
  'vegetable oil',
  'soybean oil', 'organic soybean oil', 'high oleic soybean oil',
  'non-gmo soybean oil',
]);

function isSnackFryingOilIngredient(raw) {
  return SNACK_FRYING_OIL_NAMES.has(normalize(raw));
}

export function scoreProduct(product) {
  const { ingredients = [], nutrition = {}, certifications = [] } = product;

  const insufficientData = (ingredients?.length ?? 0) === 0;

  const analyzed = analyzeIngredients(ingredients);
  const nutritionPenalty = calcNutritionPenalty(nutrition);
  const certBonus = calcCertBonus(certifications);
  const sourcingAdjustment = calcSourcingAdjustment(product);
  const markerCount = analyzed.markerCount;
  const markerLoad = analyzed.markerLoad;
  const packagingConcern = analyzePackagingConcern(product);
  const packagingResearched = !!product.packaging;
  const packagingPenalty = packagingConcern
    ? packagingConcern.penalty
    : (packagingResearched ? 0 : UNRESEARCHED_PACKAGING_PENALTY);
  // Ceiling for anything that isn't a raw whole food: the existing UPF curve,
  // intersected with the new hard "excellent but not perfect" cap so a
  // near-zero marker load can no longer reach literal 100 on its own.
  const ceiling = Math.min(PROCESSED_CLEAN_CEILING, upfCeiling(markerLoad));

  // "Whole-food clean": zero ultra-processing markers and nothing flagged
  // moderate/caution/avoid. The sugars and fats in a whole food are intrinsic,
  // so we waive almost all of the nutrition penalty — pure blackberries, raw
  // almonds, plain raisins all land at/near the ceiling.
  const hasConcern = analyzed.items.some(
    (i) => i.flag === 'moderate' || i.flag === 'caution' || i.flag === 'avoid'
  );
  const wholeFoodClean = !insufficientData && markerCount === 0 && !hasConcern;

  // The stricter subset eligible for a literal 100: exactly one ingredient,
  // that ingredient carries no processing indicator, and no packaging concern
  // on file. Note this requires the ABSENCE of a known concern, not the
  // PRESENCE of packaging research — the `packagingResearched` gate was
  // removed 2026-08-08 (see UNRESEARCHED_PACKAGING_PENALTY above): missing
  // packaging data should not silently hold a clean whole food below 100.
  const isRawWholeFood =
    wholeFoodClean &&
    ingredients.length === 1 &&
    isRawIngredientName(ingredients[0]) &&
    !packagingConcern;

  let score;
  if (wholeFoodClean) {
    const cleanCeiling = isRawWholeFood ? 100 : PROCESSED_CLEAN_CEILING;
    score = Math.min(
      cleanCeiling,
      100 - Math.min(nutritionPenalty * 0.25, 5) - packagingPenalty + certBonus
    );
  } else {
    score = 100 - analyzed.totalPenalty - nutritionPenalty - packagingPenalty + certBonus;
    score = Math.min(score, ceiling);
  }
  // Applied AFTER the packaging/processing ceiling above, not capped by it —
  // that ceiling exists for an unrelated reason (unverified packaging data),
  // and letting it silently absorb the housing bonus is exactly what made
  // pasture-raised and conventional eggs score identically before this.
  // A strong housing tier can push a whole-food-clean egg past 96 up to the
  // literal 100 a raw-whole-food packaging-verified product would otherwise
  // need separately-verified packaging to reach; a conventional/caged egg
  // drops a real letter grade instead of landing on the ceiling like a good
  // one. Still clamped to [0, 100] below like everything else.
  score = score + sourcingAdjustment;

  // RULE 3 (2026-08-17) — refined-grain #1 ingredient: a soft penalty
  // (subtraction, not a cap), floored at 0 so it can't push a product
  // negative before Rules 1/2 get a chance to apply their own floor.
  const refinedGrainPenalty = calcRefinedGrainPenalty(ingredients);
  score = Math.max(0, score - refinedGrainPenalty);

  // RULES 1 & 2 (2026-08-17, RULE 2 tiered 2026-08-19) — processed/cured
  // meat and snack-form hard caps, applied LAST as the final ceiling (per
  // the approved application order: base score incl. Rule 4 -> Rule 3's
  // penalty -> Rule 1/2 caps). If a product triggers more than one, the
  // LOWER cap wins. isSimplePopcorn is resolved FIRST and, when true, skips
  // fried/baked-analogue detection entirely — Tier 3 is a full exemption,
  // not a milder cap. Real catalog case this ordering protects: Angie's
  // BOOMCHICKAPOP "Sweet & Salty Kettle Corn" contains the bare word
  // "kettle", which would otherwise match Tier 1's default fried vocabulary.
  const isProcessedCuredMeat = detectProcessedCuredMeat(product, ingredients);
  const isSimplePopcorn = detectSimplePopcorn(product, ingredients);
  const isFriedSnack = !isSimplePopcorn && detectFriedSnack(product);
  const isBakedSnack = !isSimplePopcorn && !isFriedSnack && detectBakedSnackMarker(product);
  let formCap = null;
  if (isProcessedCuredMeat) formCap = PROCESSED_CURED_MEAT_CAP;
  if (isFriedSnack) {
    formCap = formCap === null ? FRIED_SNACK_CAP : Math.min(formCap, FRIED_SNACK_CAP);
  }
  if (isBakedSnack) {
    formCap = formCap === null ? BAKED_SNACK_CAP : Math.min(formCap, BAKED_SNACK_CAP);
  }
  if (formCap !== null) score = Math.min(score, formCap);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const grade = scoreToGrade(score);

  return {
    score,
    grade,
    displayGrade: insufficientData ? '?' : grade,
    gradeColor: gradeToColor(insufficientData ? '?' : grade),
    analyzedIngredients: analyzed.items,
    flaggedCount: analyzed.flaggedCount,
    avoidCount: analyzed.avoidCount,
    hiddenUnreadableCount: analyzed.hiddenUnreadableCount,
    markerCount,
    markerLoad,
    upfCeiling: ceiling,
    nutritionPenalty,
    packagingPenalty,
    packagingConcern,
    packagingResearched,
    certBonus,
    sourcingAdjustment,
    wholeFoodClean,
    isRawWholeFood,
    insufficientData,
    refinedGrainPenalty,
    isProcessedCuredMeat,
    isFriedSnack,
    isBakedSnack,
    isSimplePopcorn,
    formCap,
  };
}

function analyzePackagingConcern(product = {}) {
  const packaging = product.packaging;
  if (!packaging) return null;

  const material = String(packaging.material || '').toLowerCase();
  const format = String(packaging.format || '').toLowerCase();
  const heatUse = String(packaging.heatUse || '').toLowerCase();
  const concernLevel = String(packaging.concernLevel || '').toLowerCase();
  const concerns = Array.isArray(packaging.concerns) ? packaging.concerns.map(String) : [];

  const isPlastic = material.includes('plastic') || concerns.some((c) => c.includes('plastic'));
  const isDirectContactFormat = format.includes('bag') || format.includes('pouch') || format.includes('tray');
  if (!isPlastic && !isDirectContactFormat) return null;

  let penalty = 0;
  if (concernLevel === 'high') penalty = 6;
  else if (concernLevel === 'moderate') penalty = 3;
  else if (concernLevel === 'low') penalty = 2;
  else if (isDirectContactFormat) penalty = 2;

  if (heatUse === 'microwave' || format.includes('steam')) penalty += 2;
  if (concerns.includes('heated-plastic-contact')) penalty += 1;
  if (concerns.includes('fatty-food-contact') || concerns.includes('oily-food-contact')) penalty += 1;

  penalty = Math.min(10, penalty);
  if (penalty <= 0) return null;

  const isHeated = heatUse === 'microwave' || format.includes('steam');
  const title = isHeated ? 'Microwave plastic packaging' : 'Plastic food-contact packaging';
  const note = packaging.note || (
    isHeated
      ? 'Prepared by heating food in plastic packaging. We reduce the score because Food Exposé prioritizes lower heated-plastic food contact where practical.'
      : 'Packaged in direct-contact plastic. We apply a small score reduction for consumers trying to reduce plastic food-contact exposure.'
  );

  return {
    title,
    note,
    penalty,
    material: packaging.material || 'plastic',
    format: packaging.format || null,
    heatUse: packaging.heatUse || null,
    concernLevel: packaging.concernLevel || null,
    concerns,
  };
}

/**
 * Decide whether a resolved DB entry counts as an ULTRA-PROCESSING MARKER for
 * the processing-ceiling logic.
 *
 * New entries carry an explicit `upfMarker` boolean — that always wins.
 * Legacy entries (no boolean) are derived from category + flag so we don't have
 * to hand-edit dozens of rows:
 *   - refined oils → always a marker
 *   - dyes / flavor-enhancers / emulsifiers → marker unless the entry is a
 *     benign natural one (flagged 'ok', e.g. annatto, soy lecithin, xanthan gum)
 *   - additives / preservatives / proteins / sweeteners → marker only when the
 *     entry itself is concerning (flag 'avoid'/'caution'), which excludes plain
 *     sugar, citric acid, and allergen-flagged whole foods
 */
function dbEntryIsMarker(entry) {
  if (!entry) return false;
  if (entry.upfMarker === true) return true;
  if (entry.upfMarker === false) return false;
  const c = entry.category;
  if (c === 'oils') return true;
  if (c === 'dyes' || c === 'flavor-enhancers' || c === 'emulsifiers') {
    return entry.flag !== 'ok';
  }
  if (c === 'additives' || c === 'preservatives' || c === 'proteins' || c === 'sweeteners') {
    return entry.flag === 'avoid' || entry.flag === 'caution';
  }
  return false;
}

/**
 * How heavily a single marker pulls the processing ceiling down, by severity.
 * A mild marker (natural flavors, refined oil, modified starch — risk ≤4)
 * costs far less than a severe one (trans fat, HFCS, nitrites, dyes — risk ≥7).
 * This is what keeps a lone "natural flavors" from imposing a flat 25-pt cliff.
 */
function markerWeight(entry) {
  const r = entry?.risk ?? 4;
  if (r >= 7) return 1.0;   // severe
  if (r >= 5) return 0.7;   // moderate
  return 0.4;               // mild (e.g. natural flavors)
}

/**
 * Split tokens that are two real ingredients glued together by a missing
 * comma before anything is scored. Only touches tokens that have no strong
 * (exact/cleaned-phrase) match of their own — a token the DB already
 * recognizes as one ingredient is never taken apart.
 */
function expandMergedIngredients(ingredients) {
  const knownKeys = getKnownKeysSet();
  const out = [];

  // Original tokens pass through untouched, duplicates and all — this
  // function's job is splitting merges, not cleaning up the input list.
  // Only PIECES RECOVERED BY A SPLIT are deduped, and only against tokens
  // that already exist: "lemon juice citric acid" must not add a second
  // "citric acid" row when the label also declares it separately, and
  // "palm oil palm oil" must not become two identical rows.
  const originals = new Set(ingredients);
  const emittedParts = new Set();

  for (const raw of ingredients) {
    const hit = lookupIngredient(raw);
    if (!hit || hit.weak) {
      const parts = segmentIntoKnownIngredients(raw, knownKeys);
      if (parts) {
        for (const part of parts) {
          if (originals.has(part) || emittedParts.has(part)) continue;
          emittedParts.add(part);
          out.push(part);
        }
        continue;
      }
    }
    out.push(raw);
  }
  return out;
}

function analyzeIngredients(rawIngredients) {
  const ingredients = expandMergedIngredients(rawIngredients);
  let totalPenalty = 0;
  let flaggedCount = 0;
  let avoidCount = 0;
  let markerCount = 0;
  let markerLoad = 0;
  let hiddenUnreadableCount = 0;
  const items = [];

  ingredients.forEach((raw) => {
    let hit = lookupIngredient(raw);

    // A WEAK (single-shared-token) match is not evidence the string is an
    // ingredient at all — hold it to the narrow label-boilerplate check.
    // (Running weak hits through the full gate would hide thousands of real
    // single-token-matched ingredients like "bay leaf" and "vitamin b2";
    // see the calibration notes on isLabelBoilerplate.)
    if (hit && hit.weak && isLabelBoilerplate(raw)) {
      hiddenUnreadableCount++;
      return;
    }

    // If nothing matched, run the full plausibility gate before treating it
    // as a plain "unknown" row: rescue near-miss OCR typos to a known key,
    // and hide genuinely unreadable garbage tokens instead of showing them
    // as an Unknown ingredient.
    if (!hit) {
      const { verdict, rescuedTo } = classifyTokenPlausibility(raw, getKnownKeysSet());
      if (verdict === 'garbage') {
        hiddenUnreadableCount++;
        return;
      }
      if (verdict === 'rescued' && rescuedTo) {
        const rescuedHit = lookupIngredient(rescuedTo);
        if (rescuedHit) hit = rescuedHit;
      }
    }

    if (hit && hit.source === 'db') {
      const data = hit.entry;
      const penalty = data.flag === 'allergen' ? 0 : data.risk * 2.5;
      totalPenalty += penalty;
      flaggedCount++;
      if (data.flag === 'avoid') avoidCount++;
      // Rule 4 (2026-08-17): a snack/frying oil that resolved to an 'ok'
      // flag (Low risk — avocado oil and the "high oleic"/"expeller
      // pressed" Low-risk variants) always counts as a processing marker,
      // even though its own risk number is low — that's the specific gap
      // this rule closes (see SNACK_FRYING_OIL_NAMES). A Medium-risk oil
      // (canola, regular sunflower, etc.) is already excluded from
      // wholeFoodClean by its own 'moderate' flag and already carries its
      // own risk*2.5 penalty — forcing it into the marker system too would
      // ALSO drag down the UPF ceiling for an otherwise-clean product that
      // never had a free-pass problem in the first place (caught by the
      // Simple Mills safeguard fixture during testing).
      const isMarker = dbEntryIsMarker(data) || (isSnackFryingOilIngredient(raw) && data.flag === 'ok');
      if (isMarker) { markerCount++; markerLoad += markerWeight(data); }

      items.push({
        raw,
        label: data.label,
        risk: data.risk,
        category: data.category,
        note: data.note,
        evidence: data.evidence ?? null,
        flag: data.flag,
        flagInfo: FLAG_LEVELS[data.flag],
        penalty,
        isMarker,
      });
    } else if (hit && hit.source === 'cache') {
      const cached = hit.entry;
      const flag = riskToFlag(cached.risk);
      const penalty = (flag === 'ok' || flag === 'allergen') ? 0 : cached.risk * 2.5;
      totalPenalty += penalty;
      if (flag !== 'ok') flaggedCount++;
      if (flag === 'avoid') avoidCount++;
      // Rule 4 (2026-08-17): cache-sourced ingredients normally never feed
      // the UPF-marker system at all (only DB-sourced ones did) — this is
      // the specific override that closes the "clean-looking oil" gap for
      // the named snack/frying oils, scoped to the 'ok'-flagged (Low risk)
      // ones — see the longer comment on the db-source branch above for why
      // an already-'moderate'-flagged oil is deliberately left alone.
      const isMarker = isSnackFryingOilIngredient(raw) && flag === 'ok';
      if (isMarker) { markerCount++; markerLoad += markerWeight(cached); }
      items.push({
        raw,
        label: formatIngredientLabel(raw),
        risk: cached.risk,
        category: cached.category || 'unknown',
        note: cached.explanation,
        flag,
        flagInfo: FLAG_LEVELS[flag] || FLAG_LEVELS['ok'],
        penalty,
        isMarker,
      });
    } else {
      const { flag, risk } = classifyUnknown(raw);
      const penalty = flag === 'ok' ? 0 : risk * 2.5;
      totalPenalty += penalty;
      if (flag !== 'ok') flaggedCount++;
      if (flag === 'avoid') avoidCount++;
      items.push({
        raw,
        label: formatIngredientLabel(raw),
        risk,
        category: 'unknown',
        note: null,
        flag,
        flagInfo: FLAG_LEVELS[flag] || FLAG_LEVELS['ok'],
        penalty,
      });
    }
  });

  return { items, totalPenalty: Math.min(totalPenalty, 80), flaggedCount, avoidCount, markerCount, markerLoad, hiddenUnreadableCount };
}

function calcNutritionPenalty(nutrition) {
  let penalty = 0;
  if (nutrition.sugars > 30) penalty += 12;
  else if (nutrition.sugars > 20) penalty += 8;
  else if (nutrition.sugars > 12) penalty += 4;

  if (nutrition.sodium > 500) penalty += 8;
  else if (nutrition.sodium > 300) penalty += 4;

  if (nutrition.saturatedFat > 10) penalty += 8;
  else if (nutrition.saturatedFat > 5) penalty += 4;

  return Math.min(penalty, 20);
}

// NOTE: letter grades are no longer shown in the UI — we display the 0–100
// score directly. scoreToGrade is retained only to drive score color and the
// verdict word, and now uses standard academic bands.
export function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Score → color, independent of any displayed letter.
export function scoreToColor(score) {
  if (score == null) return '#9BB5AE';
  if (score >= 90) return '#1D9E75';
  if (score >= 80) return '#6DBE47';
  if (score >= 70) return '#F5A623';
  if (score >= 50) return '#F06A25';
  return '#D93B3B';
}

export function gradeToColor(grade) {
  const map = { A: '#1D9E75', B: '#6DBE47', C: '#F5A623', D: '#F06A25', F: '#D93B3B', '?': '#9BB5AE' };
  return map[grade] || '#9BB5AE';
}

export function formatIngredientLabel(raw) {
  return raw
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Distinguishes "we have no lobbying data for this company" from "we verified
// they spend little." `null`/`undefined` obviously means no data — but so
// does `0` in this dataset: `lobbyingSpend: 0` is the established convention
// for "not yet researched" (see e.g. COMPANY_DB.willas), NOT a verified-zero
// federal lobbying finding. Nothing in the schema currently distinguishes a
// real audited zero from an unresearched placeholder, so both null and 0 map
// to the neutral "No data" band rather than the green "Low" band. This is a
// deliberate behavior change from the old code (which returned "Low" — green
// — for 0, fabricating a favorable claim on ~144 of 268 existing companies).
// Every positive numeric input's band is unchanged.
export function getLobbyingRiskLevel(spend) {
  if (spend == null || spend === 0) {
    return { label: 'No data', color: '#9BB5AE', bg: '#EEF2F1', unknown: true };
  }
  if (spend >= 3000000) return { label: 'Very High', color: '#D93B3B', bg: '#FDE8E8' };
  if (spend >= 1500000) return { label: 'High', color: '#F06A25', bg: '#FEF0E6' };
  if (spend >= 500000) return { label: 'Moderate', color: '#F5C842', bg: '#FEF9E7' };
  return { label: 'Low', color: '#1D9E75', bg: '#E8F7F2' };
}

// Returns null for missing amounts instead of "$undefined" / "$null" — callers
// must check for null themselves and show honest placeholder copy (or hide
// the element) rather than render this as a dollar figure.
export function formatCurrency(amount) {
  if (amount == null) return null;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function scoreToVerdict(grade) {
  const map = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Avoid', '?': 'Unscored' };
  return map[grade] || 'Unknown';
}

export function generateScoreExplanation(product, result) {
  const { grade, flaggedCount, nutritionPenalty, packagingPenalty, packagingConcern, certBonus, analyzedIngredients } = result;
  const avoidList = analyzedIngredients.filter((i) => i.flag === 'avoid');
  const cautionList = analyzedIngredients.filter((i) => i.flag === 'caution' || i.flag === 'moderate');
  const cleanPackagingNote = packagingPenalty > 0 && packagingConcern && flaggedCount === 0;

  if (cleanPackagingNote && grade !== 'A') {
    return `${product.name} has clean ingredients, but ${packagingConcern.title.toLowerCase()} lowers the score as a packaging-exposure concern.`;
  }

  if (grade === 'A') {
    if (certBonus > 0 && product.certifications?.length > 0) {
      return `${product.name} earns a top score with clean, recognizable ingredients and ${product.certifications[0]} certification — no harmful additives detected.`;
    }
    if (flaggedCount === 0) {
      return `Every ingredient in ${product.name} passed our screening with no concerns. A clean, healthy choice.`;
    }
    return `${product.name} has clean ingredients overall. A few minor items are noted in the breakdown below, but nothing significant.`;
  }

  if (grade === 'F') {
    if (avoidList.length >= 2) {
      const a = avoidList[0].label;
      const b = avoidList[1].label;
      return `This product scores poorly mainly due to ${a} and ${b}${avoidList.length > 2 ? `, along with ${avoidList.length - 2} more flagged ingredient${avoidList.length > 3 ? 's' : ''}` : ''}, which are flagged in our database. See the breakdown for details.`;
    }
    if (avoidList.length === 1) {
      const m = avoidList[0];
      return `${m.label} is the primary concern — ${m.note ? m.note.toLowerCase() : 'flagged in our database'}. Additional issues also lower the score.`;
    }
    return `Multiple flagged ingredients and high sugar, sodium, or saturated fat levels combine to give this product a low score. See the breakdown for details.`;
  }

  if (grade === 'D') {
    if (avoidList.length > 0) {
      const m = avoidList[0];
      const extra = avoidList.length > 1 ? ` and ${avoidList.length - 1} other flagged ingredient${avoidList.length > 2 ? 's' : ''}` : '';
      return `${m.label}${extra} lower this score significantly. ${m.note ? m.note : 'This ingredient is flagged in our database — check the breakdown for details.'}`;
    }
    if (nutritionPenalty > 8) {
      return `High ${nutritionPenalty > 12 ? 'sugar and sodium' : 'sugar or sodium'} levels, combined with several flagged additives, pull this score down.`;
    }
    return `Several caution-level ingredients combine to give this product a poor score. See the breakdown below for specifics.`;
  }

  if (grade === 'C') {
    if (avoidList.length > 0) {
      const m = avoidList[0];
      return `${m.label} is the primary concern in this product${m.note ? ` — ${m.note.toLowerCase().slice(0, 80)}` : ''}. Check the ingredients tab for the full breakdown.`;
    }
    if (cautionList.length >= 2) {
      const names = cautionList.slice(0, 2).map((i) => i.label).join(' and ');
      return `${names} are worth monitoring here. These aren't classified as high-risk but may be a concern for some people.`;
    }
    if (nutritionPenalty > 4) {
      return `Above-average ${nutritionPenalty > 8 ? 'sugar and sodium levels' : 'nutritional values'}, along with ${flaggedCount} flagged ingredient${flaggedCount !== 1 ? 's' : ''}, bring this into the fair range.`;
    }
    return `A fair score — no avoid-level ingredients, but ${flaggedCount} ingredient${flaggedCount !== 1 ? 's' : ''} worth monitoring.`;
  }

  if (grade === 'B') {
    if (flaggedCount === 0) {
      return `${product.name} is a solid choice with clean ingredients and no red flags. A minor nutritional consideration keeps it from a perfect score.`;
    }
    const c = cautionList[0];
    if (c) {
      return `A good product overall. ${c.label} is worth noting${c.note ? ` — ${c.note.toLowerCase().slice(0, 70)}` : ''}, but no high-risk ingredients were found.`;
    }
    return `${product.name} scores well with mostly clean ingredients. A small number of items to be aware of, but nothing high-risk.`;
  }

  return `${product.name} received a moderate score. Review the ingredient breakdown below for details.`;
}
