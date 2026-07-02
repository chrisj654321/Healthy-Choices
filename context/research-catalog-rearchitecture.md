# Generated-catalog re-architecture analysis

_Author: gpt-5.5 via codex exec (read-only), 2026-07-02. Commissioned for backlog: 212MB products_generated.json eager-load. Reviewed by Fable._

71,192
# Product Data Re-Architecture Report

## Current Usage Patterns

The current bottleneck is real and broader than the three files listed.

`src/data/products.js` eagerly does:

- `require('./products_generated.json')` at module load.
- Converts `generatedRaw.products` into `_generated` keyed by `barcode`.
- Merges `{ ..._generated, ...MANUAL_PRODUCTS }` into `PRODUCT_DB`.
- Iterates all entries again to backfill `product_images.json`.

Relevant lines:

- `src/data/products.js:11` loads the 221,423,704-byte JSON file.
- `src/data/products.js:25910` exports the merged `PRODUCT_DB`.
- `src/data/products.js:25913` iterates the merged DB for image backfill.

Because `generatedRaw` remains referenced, the app keeps the raw product array plus barcode maps/object indexes in JS memory. The parsed object graph is much larger than the 212 MB file due to object, array, string, and map overhead.

## Actual Consumers

### Scanner

`src/screens/ScannerScreen.js`

Current scan flow is remote-first, local-fallback:

- `handleBarCodeScanned` fetches OpenFoodFacts first.
- If OFF returns no product, it does `PRODUCT_DB[barcode]`.
- If fetch throws, it again does `PRODUCT_DB[barcode]`.

Relevant lines:

- `ScannerScreen.js:26` imports `PRODUCT_DB`.
- `ScannerScreen.js:90` starts `handleBarCodeScanned`.
- `ScannerScreen.js:114` local barcode lookup after OFF miss.
- `ScannerScreen.js:195` local barcode lookup after fetch error.

So local data is only direct barcode-key lookup, not scan search. Offline behavior exists, but only after waiting for a failed network request.

### Product Search

`src/screens/ProductSearchScreen.js`

Usage is mixed:

- Featured products are loaded by fixed barcode keys at module load.
- Local search does `Object.values(PRODUCT_DB)` and filters by `name.includes(q)` or `brand.includes(q)`.
- It returns only the first 6 local hits.
- Remote OpenFoodFacts search still provides the larger result set.

Relevant lines:

- `ProductSearchScreen.js:21` imports `PRODUCT_DB`.
- `ProductSearchScreen.js:95` builds `FEATURED_PRODUCTS`.
- `ProductSearchScreen.js:101` defines `searchLocal`.
- `ProductSearchScreen.js:103` scans `Object.values(PRODUCT_DB)`.
- `ProductSearchScreen.js:206` runs local hits before remote hits.

### Scan History

`src/screens/ScanHistoryScreen.js`

History mostly does not need the full DB anymore:

- `addScanToHistory` stores the full `product` object in AsyncStorage.
- `ScanHistoryScreen` only falls back to `PRODUCT_DB[item.barcode]` when `item.product` is missing.

Relevant lines:

- `storage.js:58` `addScanToHistory(product, scoreResult)`.
- `storage.js:72` stores `product` inside the history entry.
- `ScanHistoryScreen.js:19` imports `PRODUCT_DB`.
- `ScanHistoryScreen.js:73` uses `item.product || PRODUCT_DB[item.barcode]`.

This fallback can become an async lookup without affecting the normal path.

### Additional Heavy Consumers

The DB is also used outside the files named in the prompt:

- `HomeScreen.js:59` category counts iterate the DB.
- `HomeScreen.js:68` hero images score category products.
- `healthyCategories.js:58` filters `Object.values(PRODUCT_DB)`.
- `healthyCategories.js:71` counts via `Object.values(PRODUCT_DB)`.
- `CompanyProfileScreen.js:35` filters all products by `companyId`.
- `HealthyCategoryScreen.js:23` lists products for category.
- `spotlight.js:16` builds a set of company IDs from all products.

These screens mean the replacement should not be just `getProductByBarcode`. It needs query APIs for category, company, featured products, and spotlight metadata.

---

# Option 1: Prebuilt SQLite Database With `expo-sqlite`

## Shape

Generate a SQLite database at build time from `products_generated.json` plus manual overrides.

Suggested tables:

```sql
products (
  barcode TEXT PRIMARY KEY,
  name TEXT,
  brand TEXT,
  companyId TEXT,
  category TEXT,
  image TEXT,
  servingSize TEXT,
  calories INTEGER,
  ingredients_json TEXT,
  nutrition_json TEXT,
  certifications_json TEXT,
  flags_json TEXT,
  source TEXT,
  score INTEGER,
  grade TEXT,
  search_text TEXT
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_company ON products(companyId);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_search_text ON products(search_text);
```

Add a new `src/data/productStore.js` with async APIs:

```js
initProductStore()
getProductByBarcode(barcode)
searchProductsLocal(query, limit)
getProductsByCategory(category, limit)
getCategoryCounts()
getHeroImagesByCategory()
getProductsByCompany(companyId)
getCompanyIdsWithProducts()
getFeaturedProducts(barcodes)
```

## Bundle Size

JS bundle drops dramatically because `products_generated.json` no longer enters Metro’s JS module graph.

The app binary may still include a large DB asset if the full DB ships inside the app. SQLite may be smaller than expanded JSON, but zipped APK/IPA size may not fall proportionally because JSON compresses well. This mostly fixes JS bundle size, parse time, and memory, not necessarily total download size unless the DB is downloaded after install.

## Memory

Major improvement. SQLite queries return only rows needed. No 135k-product JS object graph, no `Object.values(PRODUCT_DB)`, no duplicate barcode maps.

## Cold Start

Major improvement. App startup no longer parses 212 MB of JSON or builds `_generated`/`PRODUCT_DB`.

One caveat: copying a bundled SQLite asset into the app documents directory on first launch can take time. Do it behind `initProductStore()` with a splash/progress path, not during module import.

## Offline Behavior

Best preservation of current offline intent. All 135k products can remain available offline if the full DB ships or is downloaded once.

## Scan Latency

Excellent if scanner becomes local-first:

1. `getProductByBarcode(barcode)`
2. If found, navigate immediately.
3. Optionally refresh from OFF in background or only if local miss.
4. If local miss and online, fetch OFF and cache.

This is faster than the current remote-first flow.

## Migration Effort In This Codebase

Medium-high, but clean.

Files/functions to change:

- `src/data/products.js`
  - Stop requiring `products_generated.json`.
  - Keep only `MANUAL_PRODUCTS`, or move manual rows into the DB generation script.
  - Remove `_generated`, `PRODUCT_DB`, and image backfill loop.

- New build script:
  - `scripts/build-products-sqlite.js`
  - Reads `products_generated.json`, `product_images.json`, and manual products.
  - Applies manual override precedence.
  - Optionally precomputes score/grade.

- New runtime module:
  - `src/data/productStore.js`.

- `src/screens/ScannerScreen.js`
  - Replace `PRODUCT_DB[barcode]` in `handleBarCodeScanned` with `await getProductByBarcode(barcode)`.
  - Prefer local-first lookup to avoid network delay for known products.

- `src/screens/ProductSearchScreen.js`
  - Replace `FEATURED_PRODUCTS` module constant with async state loaded via `getFeaturedProducts(FEATURED_BARCODES)`.
  - Replace `searchLocal` with `await searchProductsLocal(q, 6)`.

- `src/screens/ScanHistoryScreen.js`
  - Replace fallback `PRODUCT_DB[item.barcode]` with `await getProductByBarcode(item.barcode)`.

- `src/data/healthyCategories.js`
  - Replace `productsForCategory`, `countForCategory`, and `heroImageForCategory` with async store-backed equivalents.

- `src/screens/HomeScreen.js`
  - Load category counts and hero images asynchronously instead of `useMemo` over `PRODUCT_DB`.

- `src/screens/HealthyCategoryScreen.js`
  - Load category rows via `getProductsByCategory`.

- `src/screens/CompanyProfileScreen.js`
  - Replace `Object.values(PRODUCT_DB).filter(...)` with `getProductsByCompany(company.id)`.

- `src/utils/spotlight.js`
  - Replace product scan with `getCompanyIdsWithProducts()` or precomputed company-product counts.

## Risks

- Requires adding `expo-sqlite`; it is not currently in `package.json`.
- Async data access touches several screens.
- Need a reliable DB asset copy/open flow.
- If score changes often, precomputed score values can drift unless rebuilt or computed on read.

---

# Option 2: Segmented Lazy JSON

## Shape

Split the 212 MB JSON into smaller assets:

- Barcode shards: `products/by-prefix/00.json`, `01.json`, etc.
- Category shards: `products/by-category/snack-bars.json`, etc.
- A small search index: barcode, name, brand, category, image, maybe score.
- Keep full product rows only in shard files.

Add a store layer:

```js
getProductByBarcode(barcode) // loads one prefix shard
searchProductsLocal(query)   // searches small index
getProductsByCategory(cat)   // loads one category shard
```

## Bundle Size

Total app asset size remains close to current if all shards ship with the app. JS bundle size improves because the full file is not one eager `require`.

If shards are delivered as assets and copied/read on demand, JS bundle improves a lot. If they are imported via static `require`, Metro can still include them, but lazy execution is better than one huge module.

## Memory

Better than current. Only the active shard/index is parsed.

Search memory depends on the index size. A compact index of `{ barcode, name, brand, category, image, score }` for 135k products could still be several MB, but much smaller than full ingredients/nutrition.

## Cold Start

Good if no large shard is imported at startup. Home/category screens must avoid loading all category shards.

## Offline Behavior

Can preserve full offline behavior if all shards ship. If only top-N shards ship, offline falls back to top-N/cache only.

## Scan Latency

Good if barcode prefix maps cleanly to one shard. Lookup becomes:

1. Normalize barcode.
2. Load prefix shard.
3. Lookup barcode inside shard.
4. Cache shard in memory with an upper bound.

First lookup for a prefix has JSON parse cost. Subsequent lookups are fast.

## Migration Effort In This Codebase

Medium.

Files/functions to change are similar to SQLite, but the implementation stays JS-only:

- Replace `PRODUCT_DB` import with `productStore`.
- Replace direct `Object.values(PRODUCT_DB)` category/company/search scans.
- Add generation scripts for shards and indexes.
- Change `ScannerScreen`, `ProductSearchScreen`, `ScanHistoryScreen`, `HomeScreen`, `HealthyCategoryScreen`, `CompanyProfileScreen`, `spotlight.js`.

## Risks

- Metro dynamic import/require behavior can be awkward for many generated JSON files.
- Too many shards can hurt bundling and filesystem overhead.
- Search quality requires a separate index.
- Still parses JSON on the JS thread.
- Easier than SQLite initially, but less robust long term.

---

# Option 3: Remote Lookup With On-Device LRU Cache + Top-N Local Products

## Shape

Ship only:

- Manual/curated products from `products.js`.
- Featured products.
- Maybe top 1k to 5k high-scan products.
- A compact local search index for those top products.

Use remote lookup for long-tail products:

- OFF, Supabase, or your own normalized product API.
- Cache successful lookups locally.
- Cache full product objects by barcode.
- Cache search results by query.
- Store recently scanned full products, which already happens in `storage.js`.

## Bundle Size

Best option. Removes the 212 MB generated JSON from the app.

## Memory

Best option. Only top-N, current search results, and cache entries enter JS memory.

## Cold Start

Best option. No huge parse, no full DB indexing.

## Offline Behavior

Weakest. Offline supports:

- Previously scanned products.
- Cached search/lookup products.
- Top-N shipped products.

It no longer supports “any of the 135k local products resolve offline” unless the cache has them.

## Scan Latency

Variable.

- Fast for top-N/cached products.
- Network-dependent for long tail.
- Current scanner is already remote-first, so this aligns with existing behavior.
- Better UX if local cache/top-N is checked first, then remote.

## Migration Effort In This Codebase

Low-medium.

This is closest to current scanner/search behavior.

Files/functions to change:

- `src/data/products.js`
  - Reduce to manual/top-N products only.

- `src/data/productStore.js`
  - Add `getCachedProduct`, `putCachedProduct`, `getProductByBarcode`, `searchProductsLocal`.

- `ScannerScreen.js`
  - Check cache/top-N first.
  - Fetch remote on miss.
  - Cache `buildProduct(...)` result.

- `ProductSearchScreen.js`
  - Search top-N/cache locally.
  - Keep existing OFF search.
  - Cache selected or returned products.

- `ScanHistoryScreen.js`
  - Use stored `item.product`; fallback to cache/remote if missing.

- `HomeScreen`, `HealthyCategoryScreen`, `CompanyProfileScreen`, `spotlight.js`
  - Must stop depending on full product coverage.
  - Either show top-N/category curated rows only, or query remote/backend summaries.

## Risks

- OFF availability, rate limits, schema variance, and latency.
- Product coverage depends on network.
- Privacy considerations for barcode/search queries.
- Offline promise is reduced.
- App quality depends more on remote infrastructure.

---

# Option 4: Hybrid SQLite Store: Curated Local Core + Remote/Cache Long Tail + Optional Offline Pack

## Shape

This combines the best parts:

- Build a `productStore` abstraction now.
- Initially support both local SQLite and remote cache.
- Ship a small curated/top-N SQLite DB in the app.
- Cache remote products into SQLite.
- Optionally offer a downloadable full offline pack after install.

Runtime lookup:

```txt
barcode scan
  -> manual/top-N SQLite
  -> cached SQLite
  -> remote OFF/backend
  -> cache normalized product
```

Search:

```txt
query
  -> local SQLite top-N/cache
  -> remote search
  -> dedupe
```

Home/category/company:

- Use precomputed local summary tables for top-N.
- Optionally expand from remote/backend when online.
- Avoid scoring/filtering all products on the device at render time.

## Bundle Size

Very good. The app ships only a small DB, not 212 MB of JSON.

If a full offline pack is optional, it does not affect initial app download.

## Memory

Very good. SQLite returns only needed rows.

## Cold Start

Very good. No eager JSON parse.

## Offline Behavior

Good, with tiers:

- Always offline: manual/top-N products, recent history, cached remote products.
- Optional full offline: all 135k products after user downloads the offline pack.
- Without the pack, offline is not full long-tail coverage.

## Scan Latency

Good:

- Top-N/cache scans are instant.
- Remote scans depend on network.
- Optional full pack makes all known barcode scans local.

## Migration Effort In This Codebase

Medium-high, but it creates the right boundary.

Same files as Option 1, but the first DB can be small:

- `src/data/productStore.js`
- `ScannerScreen.js`
- `ProductSearchScreen.js`
- `ScanHistoryScreen.js`
- `HomeScreen.js`
- `HealthyCategoryScreen.js`
- `CompanyProfileScreen.js`
- `spotlight.js`
- `healthyCategories.js`
- `products.js`
- build script for SQLite generation

## Risks

- More product-state complexity: bundled rows, cached rows, remote rows, optional offline rows.
- Need schema versioning and cache invalidation.
- Need clear UX if offline product is unavailable.
- Requires deciding whether full offline coverage is a premium/downloadable feature or an internal background asset.

---

# Recommendation

Use Option 4, implemented in phases: create a SQLite-backed `productStore` abstraction first, then remove the eager JSON from the JS bundle.

I would not keep `PRODUCT_DB` as a global object. The current app does three incompatible things with it: barcode lookup, name search, and full-table category/company scans. Those should become explicit async queries. Once that boundary exists, you can choose whether the backing data is full SQLite, top-N SQLite plus remote cache, or an optional offline pack without rewriting screens again.

For the first migration, preserve behavior by generating a full SQLite DB from the existing JSON. That immediately fixes memory and cold-start risk while keeping offline barcode coverage. Then shrink the shipped DB later if app binary size remains unacceptable.

---

# Phased Migration Plan

## Phase 1: Add Product Store Boundary

Create `src/data/productStore.js` with async methods:

```js
initProductStore()
getProductByBarcode(barcode)
searchProductsLocal(query, limit = 6)
getFeaturedProducts(barcodes)
getProductsByCategory(category)
getCategoryCounts()
getHeroImagesByCategory()
getProductsByCompany(companyId)
getCompanyIdsWithProducts()
cacheProduct(product)
```

At this phase it can still wrap `PRODUCT_DB` internally if needed. The point is to remove direct imports from screens first.

Update:

- `ScannerScreen.js`
- `ProductSearchScreen.js`
- `ScanHistoryScreen.js`
- `HomeScreen.js`
- `HealthyCategoryScreen.js`
- `CompanyProfileScreen.js`
- `spotlight.js`
- `healthyCategories.js`

## Phase 2: Replace JSON With Full SQLite

Add a build script that converts:

- `products_generated.json`
- `product_images.json`
- `MANUAL_PRODUCTS`

into a SQLite database.

Manual products must keep override priority.

Remove this path from runtime:

```js
require('./products_generated.json')
```

Keep `products.js` only for manual product definitions if needed by the build script, not the app runtime.

## Phase 3: Make Scanner Local-First

Change `ScannerScreen.handleBarCodeScanned`:

1. `await getProductByBarcode(barcode)`
2. If found, navigate immediately.
3. If not found, fetch OFF.
4. Normalize with `buildProduct`.
5. `cacheProduct(product)`.
6. Navigate.

This improves offline behavior and scan latency at the same time.

## Phase 4: Remove Runtime Full-Table Scoring

Precompute or query summaries for:

- Home category counts.
- Category hero images.
- Company product counts.
- Spotlight eligible company IDs.

Avoid scoring thousands of products in `HomeScreen` and category helpers. Store `score`/`grade` in SQLite during DB generation, or compute lazily per product detail if score rules change frequently.

## Phase 5: Decide Full Offline Strategy

After measuring app size with full SQLite:

- If acceptable: ship the full SQLite DB.
- If still too large: ship top-N SQLite, cache remote lookups, and make the full 135k-product DB an optional downloaded offline pack.

This keeps the user experience fast now and gives you a clean path to reduce binary size without another screen-level rewrite.
