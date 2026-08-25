/**
 * Curated "eat better by category" tiles for the Home screen.
 * Each tile maps to one or more PRODUCT_DB `category` values; the category
 * screen then surfaces the highest-scoring products within them, so the lists
 * stay healthy and grow automatically as more products are added.
 *
 * `productCategories` are matched against product.category (case-insensitive).
 * Icons use MaterialCommunityIcons (bundled in @expo/vector-icons).
 */
import { buildCategoryAccents } from '../constants/colors';

// One tile per shopping aisle, ordered roughly by how many products we carry.
// `icon` is a MaterialCommunityIcons name (fallback shown only when an aisle has
// no photographed product yet); the hero is otherwise the best-scoring product
// photo in that aisle. Accent colors are computed from this list's order by
// buildCategoryAccents (colors.js) — consecutive pairs share a shade, light
// green through dark green then restarting light through dark brown.
const tile = (id, label, icon, productCategories) => ({ id, label, icon, productCategories });

const TILES = [
  tile('beverages',        'Beverages',          'bottle-soda',       ['Beverages']),
  tile('chips-crackers',   'Chips & Crackers',   'cookie',            ['Chips & Crackers']),
  tile('snack-bars',       'Snack Bars',         'food-variant',      ['Snack Bars']),
  tile('frozen-veg',       'Frozen Veg & Fruit', 'carrot',            ['Frozen Vegetables & Fruit']),
  tile('cooking-oils',     'Oils & Vinegars',    'oil',               ['Cooking Oils & Vinegars']),
  tile('plant-milk',       'Plant-Based Milk',   'cup',               ['Plant-Based Milk']),
  tile('bread',            'Bread',              'bread-slice',       ['Bread']),
  tile('condiments',       'Condiments & Sauces','bottle-tonic-plus', ['Condiments & Sauces']),
  tile('yogurt',           'Yogurt',             'bowl-mix',          ['Yogurt']),
  tile('frozen-breakfast', 'Frozen Breakfast',   'food-croissant',    ['Frozen Breakfast']),
  tile('cereal',           'Cereal',             'bowl',              ['Cereals', 'Hot Cereal']),
  tile('frozen-meals',     'Frozen Meals',       'microwave',         ['Frozen Meals', 'Packaged Meals']),
  tile('deli-lunch',       'Deli & Lunch',       'sausage',           ['Deli Meat', 'Kids Lunch']),
  tile('canned-goods',     'Canned Goods',       'food',              ['Canned Goods']),
  tile('cheese',           'Cheese & Dairy',     'cheese',            ['Cheese & Dairy']),
  tile('pasta-grains',     'Pasta & Grains',     'pasta',             ['Pasta & Grains']),
  tile('nuts',             'Nuts & Trail Mix',   'peanut-outline',    ['Nuts & Trail Mix']),
  tile('baby-food',        'Baby Food',          'baby-bottle',       ['Baby Food']),
  tile('coffee-creamer',   'Coffee Creamer',     'coffee',            ['Coffee Creamer']),
  tile('nut-butters',      'Nut Butters',        'peanut',            ['Nut Butters']),
  tile('pasta-sauce',      'Pasta Sauce',        'pot-mix',           ['Pasta Sauce & Cooking Sauces']),
  tile('soups',            'Soups & Broths',     'pot-steam',         ['Soups & Broths']),
  tile('coffee-tea',       'Coffee & Tea',       'tea',               ['Coffee & Tea']),
  tile('eggs',             'Eggs',               'egg',               ['Eggs']),
  tile('granola',          'Granola',            'barley',            ['Granola']),
];

const accents = buildCategoryAccents(TILES.map((t) => t.id));

export const HEALTHY_CATEGORIES = TILES.map((t) => ({
  ...t,
  color: accents[t.id].color,
  lightColor: accents[t.id].light,
}));

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

/**
 * Returns the image URL of the first product (by score, best-first) in a
 * category that has a truthy image. Returns null when none have photos.
 * Scoring is injected to avoid a circular import.
 */
export function heroImageForCategory(category, PRODUCT_DB, scoreProduct) {
  const scored = productsForCategory(category, PRODUCT_DB, scoreProduct);
  const found = scored.find((entry) => entry.product.image);
  return found ? found.product.image : null;
}
