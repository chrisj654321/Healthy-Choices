/**
 * Shared ingredient-text normalizer used by BOTH the app runtime parser
 * (src/utils/productParser.js) and the build-time catalog ingestor
 * (scripts/catalog-database/ingest-products.js). Pure CommonJS-compatible module — no RN
 * imports — so it can be required from plain Node scripts as well as
 * bundled by Metro.
 *
 * Exports:
 *   normalizeIngredientTokens(rawText) -> string[]
 *   classifyTokenPlausibility(token, knownKeysSet) -> { verdict, rescuedTo? }
 *   segmentIntoKnownIngredients(token, knownKeysSet) -> string[] | null
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
  // Sourcing/marketing descriptors that occasionally leak into a scraped
  // ingredients field (vandalized or malformed third-party listings) — no
  // real ingredient declaration opens with "local" as a sourcing claim.
  /^local\s/i,
];

// ─── Label-section cutoff ────────────────────────────────────────────────────
// Third-party listings are frequently populated by OCR'ing the WHOLE package,
// so the "ingredients" field runs straight past the ingredient declaration
// into the Nutrition Facts panel, the warning box, and the manufacturer's
// address/social handles. Every one of those tails then reaches the UI as
// pretend ingredient rows ("Boise", "Cans Per Day", "Nutrition Facts Serving
// Size 1 Can") — see the Gorilla Mind energy-drink listing that surfaced this.
//
// A real ingredient declaration never RESUMES after any of these markers, so
// the whole tail can be cut in one move rather than filtered token by token.
// Every marker below is a phrase that cannot appear inside an ingredient name.
const LABEL_SECTION_MARKERS = [
  /\bnutrition(al)? facts\b/i,
  /\bsupplement facts\b/i,
  /\bserving size\b/i,
  /\bservings? per (container|package)\b/i,
  /\bpercent daily values?\b/i,
  /\bdaily values?\s*(are|is|not)\b/i,
  /\bwarnings?\s*[:!]/i,
  /\bcaution\s*[:!]/i,
  /\bdo not exceed\b/i,
  /\bnot for use by\b/i,
  /\bconsult (a|an|your)\b/i,
  /\bkeep out of reach\b/i,
  /\bdistributed (by|for)\b/i,
  /\bmanufactured (by|for)\b/i,
  /\bpacked (by|for)\b/i,
  /\bimported by\b/i,
  /\bquestions or comments\b/i,
  /\b1[-\s]?800[-\s]?\d/,
  /\bplease recycle\b/i,
  /\brefrigerate after opening\b/i,
  /\bkeep refrigerated\b/i,
  /\bstore in a cool\b/i,
  /\bbest (by|before|if used by)\b/i,
  /\bhttps?:\/\//i,
  /\bwww\./i,
  /\b@[a-z0-9_]{3,}/i,
  /[a-z0-9]\.(com|net|org)\b/i,
];

// Never cut inside the opening of the field — a marker that appears in the
// first few characters is far more likely to be a mis-scrape of a header than
// a genuine end-of-ingredients boundary, and cutting there would throw away
// the entire declaration.
const MIN_CUTOFF_INDEX = 20;

/**
 * Truncate the raw ingredients text at the first label-section marker, so
 * Nutrition Facts / warning / manufacturer-address text never enters the
 * ingredient stream. Returns the text unchanged when no marker is found.
 */
function truncateAtLabelSections(text) {
  let cut = -1;
  for (const re of LABEL_SECTION_MARKERS) {
    const m = re.exec(text);
    if (m && m.index >= MIN_CUTOFF_INDEX && (cut === -1 || m.index < cut)) {
      cut = m.index;
    }
  }
  return cut === -1 ? text : text.slice(0, cut);
}

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

  // Drop the Nutrition Facts / warning / manufacturer tail BEFORE the period
  // split below turns those sentences into ingredient-shaped fragments.
  text = truncateAtLabelSections(text);
  if (!text.trim()) return [];

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
// PERMANENTLY_UNCLASSIFIABLE set in scripts/ingredients/ingredient-coverage.js (confirmed
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

// Words that no real ingredient name contains, but that packaging boilerplate
// is full of. A token containing ANY of these is label text, not an
// ingredient. Deliberately excludes words that legitimately appear in food
// names — "nutritional"/"nutrition" (nutritional yeast, "nutrition blend:"),
// "imported" (imported olive oil), "packed" (blueberries packed in water),
// "daily" (OCR'd "non daily creamer") — each verified against the curated
// catalog to hide real rows if listed; their boilerplate forms ("imported
// by", "packed by", "nutrition facts", "% daily value") are handled by the
// LABEL_SECTION_MARKERS truncation instead. Keep this a hard reject.
const NON_INGREDIENT_WORDS = new Set([
  'warning', 'warnings', 'consult', 'physician', 'healthcare', 'professional',
  'pregnant', 'nursing', 'exceed', 'dosage', 'persons', 'cause', 'rate',
  'facts', 'calories', 'serving', 'servings',
  'recycle', 'recyclable', 'distributed', 'manufactured',
  'questions', 'comments', 'satisfaction', 'guaranteed',
  'refrigerate', 'refrigerated', 'website', 'address', 'trademark',
  'registered', 'copyright', 'oz', 'fl', 'lbs',
]);

// Contact details and web/social handles that OCR sweeps in from the back of
// the package. No ingredient declaration contains an @handle or a domain.
const CONTACT_PATTERNS = [
  /@[a-z0-9_]/i,
  /\bwww\./i,
  /[a-z0-9]\.(com|net|org|co)\b/i,
  /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/,
  /\b[a-z]{2}\s+\d{5}(-\d{4})?\b/i,   // "ID 83702" — state + ZIP
];

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
 * isLabelBoilerplate(token) -> boolean
 *
 * The narrow, high-precision half of the garbage detection: is this token
 * provably PACKAGING TEXT rather than an ingredient — boilerplate vocabulary
 * (warning/consult/serving/recycle…), contact details/handles/domains, or an
 * over-long sentence (>6 words; no real ingredient name is that long, and
 * anything longer is a swept-in warning or storage instruction).
 *
 * This is the ONLY check applied to tokens that got a weak
 * (single-shared-token) DB match, because a weak hit is no evidence the
 * string is an ingredient ("may cause occasionally rapid heart rate" weak-
 * matched a seed via "rapeseed"-style token overlap). Calibrated against the
 * whole curated catalog:
 *   - full plausibility gate on weak hits → 8,160 legit tokens newly hidden
 *     ("bay leaf", "dill", "cabbage" — the vocabulary heuristic assumes
 *     no-match tokens only);
 *   - adding the digit/glyph/single-letter structural checks → 3,708 newly
 *     hidden, still wrong ("riboflavin vitamin b2", "flavor enhancer e621",
 *     "yellow 5 & 6" — E-numbers and vitamin codes are legitimate
 *     digit-words);
 *   - adding a >6-word length check → 2,771 newly hidden, still wrong
 *     (run-on but real ingredient globs like "organic grade a milk and
 *     organic grade a cream", "contains 2% or less of: dried whole egg");
 *   - this vocabulary+contact set → every actual bug row (each contains a
 *     boilerplate word or handle/domain) and nothing that looks like a
 *     declared ingredient.
 */
function isLabelBoilerplate(token) {
  const t = String(token || '').trim().toLowerCase();
  if (!t) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.some((w) => NON_INGREDIENT_WORDS.has(w))) return true;
  return CONTACT_PATTERNS.some((re) => re.test(t));
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

  // Packaging boilerplate and contact details are label text, never
  // ingredients — reject before any lookup or fuzzy rescue can dress them up
  // as a real row.
  if (isLabelBoilerplate(t)) {
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

// ─── Merged-ingredient segmentation ──────────────────────────────────────────
//
// OCR'd labels routinely lose the comma between two ingredients, gluing them
// into one token ("Potassium Sorbate L-theanine", "Saffron Extract Edelate
// Catum Disodium"). Those render as one nonsense row and score against the
// wrong profile.
//
// This splits such a token ONLY when every word of it is accounted for by a
// known ingredient key (greedy longest-match). Partial decomposition returns
// null and the token is left exactly as it was — a half-understood split
// would invent an ingredient the label never declared, which is worse than
// showing the merged text.
const MAX_SEGMENT_WORDS = 5;
const MAX_SEGMENTABLE_WORDS = 6;

function segmentIntoKnownIngredients(token, knownKeysSet) {
  const t = String(token || '').trim().toLowerCase();
  if (!t || !knownKeysSet || knownKeysSet.size === 0) return null;
  if (knownKeysSet.has(t)) return null;   // the whole token is itself a real name

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3 || words.length > MAX_SEGMENTABLE_WORDS) return null;

  const segments = [];
  let i = 0;
  while (i < words.length) {
    let matched = null;
    for (let len = Math.min(MAX_SEGMENT_WORDS, words.length - i); len >= 1; len--) {
      const candidate = words.slice(i, i + len).join(' ');
      if (knownKeysSet.has(candidate)) {
        matched = candidate;
        i += len;
        break;
      }
    }
    if (!matched) return null;            // all-or-nothing
    segments.push(matched);
  }

  if (segments.length < 2) return null;

  // EVERY piece must be a COMPOUND ingredient name — multi-word, or a
  // hyphenated chemical name ("l-theanine"). This is the rule that makes the
  // whole thing safe, and it was arrived at by running the candidate splits
  // across all ~3M ingredient tokens in the catalog: allowing a bare
  // single-word piece wrecks ~15k real ingredients, because a bare word is
  // nearly always a modifier that belongs to its neighbour, not an ingredient
  // in its own right — "blackberry juice concentrate" is not blackberry plus
  // juice concentrate, "dried cheddar cheese" is not dried plus cheddar
  // cheese, "bourbon vanilla extract" is not bourbon plus vanilla extract.
  // Hyphenated names are exempt from the bare-word rule because they can't be
  // modifiers of a neighbour — that's what lets the real scanned case
  // "potassium sorbate l-theanine" split into its two declared ingredients.
  // The cost is recall (a genuine "palm oil carrageenan" merge stays merged);
  // that trade is deliberate — a merged row shows the label's own words,
  // whereas a bad split invents an ingredient the label never declared.
  if (!segments.every((s) => s.includes(' ') || s.includes('-'))) return null;

  // A glued token can also carry advisory text the per-token filter never saw
  // because it was never its own comma-separated token ("citric acid to
  // protect flavor"). Now that the pieces are separated, hold them to the
  // same advisory rule as any other token.
  const kept = segments.filter((s) => !ADVISORY_PATTERNS.some((re) => re.test(s)));
  if (kept.length === 0) return null;
  return kept;
}

module.exports = {
  normalizeIngredientTokens,
  classifyTokenPlausibility,
  isLabelBoilerplate,
  segmentIntoKnownIngredients,
  ADVISORY_PATTERNS,
};
