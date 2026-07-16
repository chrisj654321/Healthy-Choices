/**
 * Shared product-parsing utilities used by ScannerScreen and ProductSearchScreen.
 * Converts raw OpenFoodFacts API responses into the app's internal product shape.
 */

import { BRAND_TO_COMPANY, BRAND_PARENT_MAP, COMPANY_DB } from '../data/companies';
import { normalizeIngredientTokens } from './ingredientNormalizer';

// ─── Parse ingredient string → array ─────────────────────────────────────────
// Normalization (paren-flattening, oil-disclosure resolution, advisory-phrase
// filtering, dedup) lives in ingredientNormalizer.js — shared with the
// build-time ingest script (scripts/ingest-products.js).

export function parseIngredients(p) {
  const text =
    p.ingredients_text_en ||
    p.ingredients_text ||
    (Array.isArray(p.ingredients)
      ? p.ingredients.map((i) => i.text || '').join(', ')
      : '');

  if (!text) return [];

  return normalizeIngredientTokens(text);
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
