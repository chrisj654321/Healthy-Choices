/**
 * Curated "eat better by category" tiles for the Home screen.
 * Each tile maps to one or more PRODUCT_DB `category` values; the category
 * screen then surfaces the highest-scoring products within them, so the lists
 * stay healthy and grow automatically as more products are added.
 *
 * `productCategories` are matched against product.category (case-insensitive).
 */
export const HEALTHY_CATEGORIES = [
  { id: 'yogurt',      label: 'Yogurt',          icon: 'ice-cream-outline',  productCategories: ['Yogurt'] },
  { id: 'snack-bars',  label: 'Snack Bars',      icon: 'fast-food-outline',  productCategories: ['Snack Bars'] },
  { id: 'granola',     label: 'Granola',         icon: 'cafe-outline',       productCategories: ['Granola', 'Cereals', 'Hot Cereal'] },
  { id: 'bread',       label: 'Bread',           icon: 'restaurant-outline', productCategories: ['Bread'] },
  { id: 'nut-butters', label: 'Nut Butters',     icon: 'pin-outline',        productCategories: ['Nut Butters', 'Peanut Butter'] },
  { id: 'nuts',        label: 'Nuts & Trail Mix',icon: 'leaf-outline',       productCategories: ['Nuts & Trail Mix'] },
  { id: 'eggs',        label: 'Eggs',            icon: 'egg-outline',        productCategories: ['Eggs'] },
  { id: 'cheese',      label: 'Cheese & Dairy',  icon: 'square-outline',     productCategories: ['Cheese & Dairy'] },
];

/**
 * Returns products from PRODUCT_DB whose category matches the tile, scored and
 * sorted best-first. Scoring is injected to avoid a circular import.
 */
export function productsForCategory(category, PRODUCT_DB, scoreProduct) {
  const wanted = new Set(category.productCategories.map((c) => c.toLowerCase()));
  return Object.values(PRODUCT_DB)
    .filter((p) => p.category && wanted.has(String(p.category).toLowerCase()))
    .map((p) => ({ product: p, result: scoreProduct(p) }))
    .sort((a, b) => b.result.score - a.result.score);
}

/**
 * Cheap count of products in a category — filter only, no scoring. Used for the
 * Home tile badges so we don't score thousands of products just to show a count.
 */
export function countForCategory(category, PRODUCT_DB) {
  const wanted = new Set(category.productCategories.map((c) => c.toLowerCase()));
  let n = 0;
  for (const p of Object.values(PRODUCT_DB)) {
    if (p.category && wanted.has(String(p.category).toLowerCase())) n++;
  }
  return n;
}
