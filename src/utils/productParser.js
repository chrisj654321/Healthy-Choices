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

// Phrases that are advisory text, not ingredients — filter after splitting
const ADVISORY_PATTERNS = [
  /allerg/i, /may contain/i, /produced from/i, /see highlighted/i,
  /warning/i, /advice/i, /for all/i, /genetically modified/i,
  /^\s*and\s/i, /^\s*or\s/i,
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
  return {
    fat:          Math.round((n['fat_100g']            ?? 0) * 10) / 10,
    saturatedFat: Math.round((n['saturated-fat_100g']  ?? 0) * 10) / 10,
    sodium:       Math.round((n['sodium_100g']          ?? 0) * 1000),
    carbs:        Math.round((n['carbohydrates_100g']   ?? 0) * 10) / 10,
    sugars:       Math.round((n['sugars_100g']          ?? 0) * 10) / 10,
    protein:      Math.round((n['proteins_100g']        ?? 0) * 10) / 10,
    fiber:        n['fiber_100g'] != null
      ? Math.round(n['fiber_100g'] * 10) / 10
      : null,
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
