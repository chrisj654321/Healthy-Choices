/**
 * Shared product-parsing utilities used by ScannerScreen and ProductSearchScreen.
 * Converts raw OpenFoodFacts API responses into the app's internal product shape.
 */

import { BRAND_TO_COMPANY, BRAND_PARENT_MAP, COMPANY_DB } from '../data/companies';

// ─── Parse ingredient string → array ─────────────────────────────────────────

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

// Phrases that are advisory text or purpose descriptors, not ingredients —
// filter after splitting. No real ingredient name starts with to/for/as/contains,
// so anchoring those to the start is safe.
const ADVISORY_PATTERNS = [
  /allerg/i, /may contain/i, /produced from/i, /see highlighted/i,
  /warning/i, /advice/i, /for all/i, /genetically modified/i,
  /^\s*and\s/i, /^\s*or\s/i,
  /less than \d/i,          // "Less than 2% of:"
  /contains \d+%/i,         // "Contains 2% or less of:"
  /^\d+%?\s*(or less)?\s*of/i,
  /^to\s/i,                 // "to prevent caking", "to protect flavor/color"
  /^for\s/i,                // "for color", "for tartness", "for freshness"
  /^as\s/i,                 // "as a preservative", "as preservatives"
  /^contains\b/i,           // "contains milk", "contains 2 or less of salt"
  /\bor\s+less\b/i,         // "2 or less of salt", "less than 2 or less"
  /^an?\s+(preservative|natural\s+(mold|color|colour|flavou?r)|milk\s+derivative|artificial\s+flavou?r$)/i,
  /\bmold inhibitor\b/i,    // "a natural mold inhibitor"
  /^ingredients?\b/i,       // "ingredients water" parsing artifact
];

export function parseIngredients(p) {
  let text =
    p.ingredients_text_en ||
    p.ingredients_text ||
    (Array.isArray(p.ingredients)
      ? p.ingredients.map((i) => i.text || '').join(', ')
      : '');

  if (!text) return [];

  // 1. Decode HTML entities
  text = decodeHtmlEntities(text);

  // 2. Period followed by space acts as a separator in some EU/UK data
  text = text.replace(/\.\s+/g, ', ');

  // 3. Expand brackets/parens into the ingredient stream instead of discarding
  //    "Coating [sugar, cocoa butter]" → "Coating , sugar, cocoa butter"
  text = text.replace(/[\[\]()]/g, ',');

  // 4. Split and clean each token
  return text
    .split(/[,;]+/)
    .map((s) =>
      s
        .replace(/\*/g, '')
        .replace(/["""]/g, '')
        .replace(/^\s*[-.:]\s*/, '')   // strip leading punctuation artifacts
        .trim()
        .toLowerCase()
    )
    .filter((s) => s.length > 2)
    .filter((s) => !/^\d+(\.\d+)?\s*(%|g|mg|ml|oz|lb|kg|cal|kcal)?$/.test(s))
    .filter((s) => !ADVISORY_PATTERNS.some((re) => re.test(s)));
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

  return null;
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
    category:       cats[0]?.replace('en:', '').replace(/-/g, ' ') || 'General',
    ingredients:    parseIngredients(p),
    nutrition:      parseNutrition(p.nutriments),
    certifications: labels.includes('en:organic') ? ['USDA Organic'] : [],
    isOrganic:      labels.includes('en:organic'),
    isVegan:        labels.includes('en:vegan'),
    isGlutenFree:   labels.includes('en:gluten-free'),
    servingSize:    p.serving_size || null,
    calories:       Math.round(
      p.nutriments?.['energy-kcal_serving'] ||
      p.nutriments?.['energy-kcal_100g']    ||
      0
    ),
    image: p.image_front_url || p.image_url || null,
  };
}
