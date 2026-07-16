/**
 * Shared ingredient-text normalizer used by BOTH the app runtime parser
 * (src/utils/productParser.js) and the build-time catalog ingestor
 * (scripts/ingest-products.js). Pure CommonJS-compatible module — no RN
 * imports — so it can be required from plain Node scripts as well as
 * bundled by Metro.
 *
 * Exports:
 *   normalizeIngredientTokens(rawText) -> string[]
 *   classifyTokenPlausibility(token, knownKeysSet) -> { verdict, rescuedTo? }
 */

// ─── Specific oils recognized inside a "vegetable oil (...)" disclosure ──────
const KNOWN_SPECIFIC_OILS = new Set([
  'canola oil', 'canola',
  'sunflower oil', 'sunflower',
  'soybean oil', 'soybean',
  'corn oil', 'corn',
  'safflower oil', 'safflower',
  'palm oil', 'palm',
  'cottonseed oil', 'cottonseed',
  'olive oil', 'olive',
  'peanut oil', 'peanut',
  'rice bran oil', 'rice bran',
  'avocado oil', 'avocado',
  'coconut oil', 'coconut',
]);

// The generic "family" terms that may precede a parenthetical oil disclosure.
const GENERIC_OIL_TERMS = new Set([
  'vegetable oil', 'vegetable oils', 'vegetable oil blend', 'oil blend',
]);

// ─── Advisory / label-phrase blocklist (single source of truth) ─────────────
// No real ingredient name starts with to/for/as/contains, so anchoring those
// to the start is safe.
const ADVISORY_PATTERNS = [
  /allerg/i, /may contain/i, /produced from/i, /see highlighted/i,
  /warning/i, /advice/i, /for all/i, /genetically modified/i,
  /^\s*and\s/i, /^\s*or\s/i,
  /less than \d/i,
  /contains \d+%/i,
  /^\d+%?\s*(or less)?\s*of/i,
  /^to\s/i,
  /^for\s/i,
  /^as\s/i,
  /^contains\b/i,
  /\bor\s+less\b/i,
  /^an?\s+(preservative|natural\s+(mold|color|colour|flavou?r)|milk\s+derivative|artificial\s+flavou?r$)/i,
  /\bmold inhibitor\b/i,
  /^ingredients?\b/i,
  /[€£¥]\s*\d/,
  /\b20\d{2}[\/\-]\d{2}/,
  /^t&c\b/i,
  // ── expanded set ──
  /added to preserve/i,
  /to preserve (freshness|color|quality)/i,
  /preserves? freshness/i,
  /^an? (emulsifier|preservative|anticaking agent|natural mold inhibitor)$/i,
  /^and\/?or$/i,
  /may contain .*/i,
  /contains? \d+% or less/i,
  /less than \d+% of/i,
  /^(ingredients|contains)$/i,
  /vitamin (blend|and mineral blend):?$/i,
  /added for (color|freshness)/i,
  /for (color|freshness|texture)$/i,
];

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/gi, '')
    .replace(/&amp;/gi, '&')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#\d+;/gi, '');
}

/**
 * Detects "generic oil term ( specific oil list )" patterns and rewrites the
 * text so only the specific oils survive (the generic parent is dropped).
 * Conservative: if any item inside the parens isn't a recognized specific
 * oil, this pattern is left untouched (falls back to normal paren-flatten).
 */
function resolveOilDisclosures(text) {
  // Match "<generic term> ( <contents> )" — generic term is one of a short
  // list, contents is a run of non-paren characters.
  const genericAlt = Array.from(GENERIC_OIL_TERMS).map(escapeRegExp).join('|');
  const re = new RegExp(`\\b(${genericAlt})\\s*\\(([^()]+)\\)`, 'gi');

  return text.replace(re, (full, generic, inner) => {
    // Split on commas, slashes, and "and"/"or"/"and/or" connector words
    // (word-boundary anchored so "corn" isn't broken by the "or" inside it).
    // filter(Boolean) drops the empty strings produced when a comma and a
    // connector word sit back-to-back ("canola, and/or sunflower oil").
    const parts = inner
      .split(/\s*(?:,|\band\/or\b|\band\b|\bor\b|\/)\s*/i)
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);

    if (parts.length === 0) return full;
    const allKnown = parts.every((p) => KNOWN_SPECIFIC_OILS.has(p));
    if (!allKnown) return full;

    // Emit only the specific oils, comma-joined, dropping the generic parent.
    // Bare names ("canola and sunflower") get the " oil" suffix so they hit
    // the ingredient profiles as oils, not as seeds/plants.
    return parts.map((p) => (p.endsWith(' oil') ? p : `${p} oil`)).join(', ');
  });
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * normalizeIngredientTokens(rawText) -> string[]
 *
 * Pipeline: decode entities -> resolve oil disclosures -> flatten remaining
 * brackets/parens -> split -> trim/clean/lowercase -> filter advisory
 * phrases and numeric/unit fragments -> dedupe (first occurrence wins).
 */
function normalizeIngredientTokens(rawText) {
  let text = String(rawText || '');
  if (!text) return [];

  text = decodeHtmlEntities(text);

  // Period followed by space acts as a separator in some EU/UK data.
  text = text.replace(/\.\s+/g, ', ');

  // Resolve "vegetable oil (canola oil, sunflower oil)" BEFORE flattening.
  text = resolveOilDisclosures(text);

  // Flatten remaining brackets/parens into the ingredient stream.
  text = text.replace(/[\[\]()]/g, ',');

  const seen = new Set();
  const out = [];

  text
    .split(/[,;]+/)
    .map((s) =>
      s
        .replace(/\*/g, '')
        .replace(/["""]/g, '')
        .replace(/^\s*[-.:]\s*/, '')
        .trim()
        .replace(/^(and|or)\s+/i, '')
        .replace(/^&\s*/, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase()
    )
    .filter((s) => s.length > 2)
    .filter((s) => !/^\d+(\.\d+)?\s*(%|g|mg|ml|oz|lb|kg|cal|kcal)?$/.test(s))
    .filter((s) => !ADVISORY_PATTERNS.some((re) => re.test(s)))
    .forEach((token) => {
      if (seen.has(token)) return;
      seen.add(token);
      out.push(token);
    });

  return out;
}

// ─── Plausibility gate + fuzzy rescue ────────────────────────────────────────

// Bare punt fragments that show up from OCR/parsing artifacts. Mirrors the
// PERMANENTLY_UNCLASSIFIABLE set in scripts/ingredient-coverage.js (confirmed
// unclassifiable across Wave 1/2 review — OCR noise/parser artifacts).
const PUNT_FRAGMENTS = new Set(['', 'slat', 'ntss 31']);

// A generous but bounded set of words that show up across real ingredient
// names. Used only to keep the short-token garbage heuristic below from
// over-triggering on legitimate 1-2 word ingredients — this is NOT meant to
// be exhaustive (novel/branded ingredient names still reach classifyUnknown
// normally when they're 3+ words or contain one of these words).
const COMMON_INGREDIENT_WORDS = new Set([
  'oil', 'water', 'salt', 'sugar', 'milk', 'corn', 'wheat', 'soy', 'soybean',
  'rice', 'bean', 'beans', 'extract', 'flavor', 'flavour', 'flavoring',
  'color', 'colour', 'coloring', 'natural', 'artificial', 'powder', 'syrup',
  'acid', 'gum', 'starch', 'protein', 'vitamin', 'mineral', 'organic',
  'dried', 'roasted', 'concentrate', 'concentrated', 'juice', 'blend',
  'butter', 'cheese', 'cream', 'yogurt', 'yeast', 'flour', 'egg', 'eggs',
  'canola', 'sunflower', 'palm', 'olive', 'coconut', 'peanut', 'sesame',
  'almond', 'cashew', 'walnut', 'oat', 'oats', 'barley', 'honey', 'molasses',
  'vanilla', 'cocoa', 'chocolate', 'caramel', 'gelatin', 'lecithin',
  'sodium', 'potassium', 'calcium', 'magnesium', 'iron', 'zinc', 'niacin',
  'riboflavin', 'thiamine', 'folic', 'citrate', 'benzoate', 'sorbate',
  'nitrite', 'nitrate', 'phosphate', 'sulfite', 'stearate', 'lactate',
  'carbonate', 'chloride', 'sulfate', 'gluconate', 'oxide', 'hydroxide',
  'cellulose', 'dextrose', 'fructose', 'glucose', 'lactose', 'maltose',
  'sucrose', 'sorbitol', 'xylitol', 'erythritol', 'maltitol', 'stevia',
  'monk', 'fruit', 'vegetable', 'vegetables', 'spice', 'spices', 'herb',
  'herbs', 'pepper', 'garlic', 'onion', 'tomato', 'apple', 'orange',
  'lemon', 'lime', 'berry', 'berries', 'grape', 'cane', 'beet', 'agave',
  'whey', 'casein', 'chicken', 'beef', 'pork', 'turkey', 'fish', 'tuna',
  'salmon', 'shrimp', 'stock', 'broth', 'puree', 'paste', 'gum', 'agar',
  'carrageenan', 'pectin', 'inulin', 'maltodextrin', 'dextrin',
  'hydrogenated', 'partially', 'modified', 'enriched', 'bleached',
  'refined', 'processed', 'preservative', 'preservatives', 'emulsifier',
  'stabilizer', 'antioxidant', 'aspartame', 'sucralose', 'saccharin',
  'msg', 'glutamate', 'nitrogen', 'carbon', 'dioxide', 'ascorbic',
  'citric', 'lactic', 'tartaric', 'malic', 'phosphoric', 'sorbic',
  'benzoic', 'acetic',
]);

function boundedLevenshtein(a, b, maxDist) {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const la = a.length;
  const lb = b.length;
  let prev = new Array(lb + 1);
  let curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost // substitution
      );
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDist) return maxDist + 1; // early exit
    [prev, curr] = [curr, prev];
  }
  return prev[lb];
}

/**
 * classifyTokenPlausibility(token, knownKeysSet) -> { verdict, rescuedTo? }
 * verdict: 'ok' | 'rescued' | 'garbage'
 */
function classifyTokenPlausibility(token, knownKeysSet) {
  const t = String(token || '').trim().toLowerCase();

  if (PUNT_FRAGMENTS.has(t) || /^\d+$/.test(t)) {
    return { verdict: 'garbage' };
  }

  const words = t.split(/\s+/).filter(Boolean);

  const hasDigitInWord = words.some((w) => /[a-z]/i.test(w) && /\d/.test(w));
  const hasTrademarkGlyph = /[®™]/.test(t);
  const hasVowel = /[aeiouy]/i.test(t);
  const tooManyWords = words.length > 6;
  const singleLetterWordCount = words.filter((w) => w.length === 1).length;

  if (hasDigitInWord || hasTrademarkGlyph || !hasVowel || tooManyWords || singleLetterWordCount >= 2) {
    return { verdict: 'garbage' };
  }

  // Exact match already handled upstream (would not reach here as "unknown"),
  // but guard anyway.
  if (knownKeysSet && knownKeysSet.has(t)) {
    return { verdict: 'ok' };
  }

  // Fuzzy rescue: edit-distance <= 2 to a known key of similar length.
  if (knownKeysSet && t.length >= 5) {
    for (const key of knownKeysSet) {
      if (key.length < 5) continue;
      if (Math.abs(key.length - t.length) > 2) continue;
      const dist = boundedLevenshtein(t, key, 2);
      if (dist <= 2) {
        return { verdict: 'rescued', rescuedTo: key };
      }
    }
  }

  // Short (<=2 word) tokens that aren't a rescuable typo AND don't contain any
  // recognizable food/ingredient-ish word are very likely OCR bleed from
  // packaging text (addresses, city names, manufacturer boilerplate — e.g.
  // "Balle Creak", "Unequar"). Scoped to short tokens only so it never
  // touches the longer synthesized/novel ingredient names the rest of the
  // pipeline is meant to classify as legitimate "unknown" ingredients.
  if (words.length <= 2 && !words.some((w) => COMMON_INGREDIENT_WORDS.has(w))) {
    return { verdict: 'garbage' };
  }

  return { verdict: 'ok' };
}

module.exports = {
  normalizeIngredientTokens,
  classifyTokenPlausibility,
  ADVISORY_PATTERNS,
};
