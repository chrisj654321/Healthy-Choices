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

  // If any significant word is a recognized whole food, treat as natural
  const hasWholeFoodWord = words.some(
    (w) => w.length > 3 && WHOLE_FOOD_WORDS.has(w)
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
  if (!prefs) return { allergenHits: [], dietaryConflicts: [], goalNote: null };

  const { allergens = [], dietaryFlags = [], primaryGoal } = prefs;
  const { nutrition = {} } = product;

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

  return { allergenHits, dietaryConflicts, goalNote };
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

// Applied when a product has no packaging data at all — most retail grocery
// packaging is plastic or plastic-lined, so silently treating "unresearched"
// the same as "verified clean" understated how common plastic contact is.
// Founder rule (2026-07-09): assume plastic until packaging is actually
// verified otherwise, rather than let missing data default to a free pass.
const UNRESEARCHED_PACKAGING_PENALTY = 2;

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
const SOURCING_ADJUSTMENT = {
  // The only tier with a real foraging + sun-exposure mechanism behind it
  // — this is what the Penn State 2.5x-omega-3/2x-vitamin-E/4x-vitamin-D
  // gap actually measured. Pushes a typical clean egg to the literal 100
  // ceiling, standing alone as the sole tier that reaches grade A.
  'pasture-raised': 10,
  // USDA's 2023 Organic Livestock & Poultry Standards rule is the newest,
  // most specific outdoor-access requirement short of pasture-raised
  // (prohibits total confinement, requires vegetated outdoor space "to
  // the degree practicable") — a real step toward the foraging mechanism,
  // though not verified to match pasture-raised's actual square footage.
  // A real audited counter-example is already on file (Eggland's Best's
  // organic line measured 1.2 sq ft/hen indoors, below even the cage-free
  // floor), so this stays a meaningful but bounded improvement, not
  // treated as pasture-equivalent.
  organic: -7,
  // USDA free-range requires SOME outdoor access but sets no minimum
  // space, no vegetation requirement, and no standard for what's actually
  // out there — a concrete-and-fence yard satisfies the legal term. Real,
  // but doesn't carry the foraging mechanism the nutrient study measured.
  'free-range': -8,
  // No outdoor access requirement at all — a real welfare improvement
  // (no cage confinement) but zero mechanistic basis for the nutrient
  // gap this whole adjustment is grounded in, so it sits closest to
  // conventional of the non-conventional tiers.
  'cage-free': -13,
  conventional: -18,
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

// Beef/lamb: grass-finished vs. grain-finished. Real, peer-reviewed
// evidence (2025 Journal of Animal Science commercial-system comparison;
// Daley et al. 2010 review, Nutrition Journal) — grass-finished beef has
// roughly a 4x better omega-6:omega-3 ratio (~2.1 vs. ~8.3), up to 2x the
// CLA (conjugated linoleic acid), and elevated vitamin A/E precursors and
// antioxidants vs. grain-finished. Magnitude kept smaller than eggs'
// pasture-raised bonus deliberately: the research itself flags the
// absolute omega-3 gain as "modest" and there are no RCTs yet proving a
// disease-outcome difference in humans, unlike the more clear-cut egg
// nutrient-density comparison.
const GRASS_FINISHED_ADJUSTMENT = {
  certified: 6,               // independently certified (e.g. American Grassfed Association)
  'company-disclosure-only': 2, // real claim, not independently audited
  'not-claimed': -4,          // confirmed no claim made -> the industry default is grain-finished
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
  // that ingredient carries no processing indicator, and packaging has been
  // actually checked (not just assumed) and found clean.
  const isRawWholeFood =
    wholeFoodClean &&
    ingredients.length === 1 &&
    isRawIngredientName(ingredients[0]) &&
    packagingResearched &&
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
      const isMarker = dbEntryIsMarker(data);
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
      items.push({
        raw,
        label: formatIngredientLabel(raw),
        risk: cached.risk,
        category: cached.category || 'unknown',
        note: cached.explanation,
        flag,
        flagInfo: FLAG_LEVELS[flag] || FLAG_LEVELS['ok'],
        penalty,
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
