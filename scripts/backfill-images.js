/**
 * backfill-images.js
 * Fetches product images from OpenFoodFacts for barcodes that lack images.
 * Targets: MANUAL_PRODUCTS barcodes from products.js (curated ~400 items).
 * Writes results to src/data/product_images.json.
 *
 * Usage: node scripts/backfill-images.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_JS = path.join(ROOT, 'src', 'data', 'products.js');
const GENERATED_JSON = path.join(ROOT, 'src', 'data', 'products_generated.json');
const OUTPUT_JSON = path.join(ROOT, 'src', 'data', 'product_images.json');

const THROTTLE_MS = 120;
const OFF_API = 'https://world.openfoodfacts.org/api/v2/product';
const UA = 'ShelfExpose/1.0';

// ── 1. Collect barcodes from MANUAL_PRODUCTS (text scan) ────────────────────
function collectManualBarcodes() {
  const text = fs.readFileSync(PRODUCTS_JS, 'utf8');
  // Match lines like:  '016000275287': {
  const re = /^\s+'(\d{8,14})':\s*\{/gm;
  const barcodes = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    barcodes.add(m[1]);
  }
  return [...barcodes];
}

// ── 2. Collect barcodes from generated JSON (no-image only) ─────────────────
function collectGeneratedNullBarcodes() {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(GENERATED_JSON, 'utf8'));
  } catch (_) {
    return [];
  }
  if (!Array.isArray(raw.products)) return [];
  return raw.products
    .filter(p => p.barcode && !p.image && !p.image_front_url && !p.image_url)
    .map(p => String(p.barcode));
}

// ── 3. Fetch a single barcode from OpenFoodFacts ────────────────────────────
async function fetchOFF(barcode) {
  const url = `${OFF_API}/${barcode}.json?fields=image_front_url,image_url`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.status === 0 || !data.product) return null;
    const img =
      (data.product.image_front_url && data.product.image_front_url.trim()) ||
      (data.product.image_url && data.product.image_url.trim()) ||
      null;
    return img || null;
  } catch (_) {
    return null;
  }
}

// ── 4. Sleep helper ──────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── 5. Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== backfill-images.js ===');

  // Collect manual barcodes (primary focus: curated products)
  const manualBarcodes = collectManualBarcodes();
  console.log(`Manual product barcodes found: ${manualBarcodes.length}`);

  // NOTE: generated JSON has 135k+ products with no images — we skip those
  // to keep run-time reasonable. Only manual (curated) barcodes are fetched.
  // To also backfill generated products, uncomment the next block and merge.
  //
  // const generatedBarcodes = collectGeneratedNullBarcodes();
  // console.log(`Generated no-image barcodes: ${generatedBarcodes.length}`);

  // Deduplicate: manual barcodes only
  const allBarcodes = [...new Set(manualBarcodes)];
  console.log(`Unique barcodes to check: ${allBarcodes.length}`);
  console.log('Fetching from OpenFoodFacts…\n');

  const results = {};
  let found = 0;
  let notFound = 0;
  let errors = 0;
  const failedBarcodes = [];

  for (let i = 0; i < allBarcodes.length; i++) {
    const barcode = allBarcodes[i];

    if (i > 0) await sleep(THROTTLE_MS);

    if ((i + 1) % 25 === 0 || i === allBarcodes.length - 1) {
      console.log(
        `  [${i + 1}/${allBarcodes.length}] found=${found} notFound=${notFound} errors=${errors}`
      );
    }

    let img;
    try {
      img = await fetchOFF(barcode);
    } catch (e) {
      errors++;
      failedBarcodes.push(barcode);
      continue;
    }

    if (img) {
      results[barcode] = img;
      found++;
    } else {
      notFound++;
    }
  }

  // Write output
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2) + '\n', 'utf8');

  console.log('\n=== Summary ===');
  console.log(`Total checked:  ${allBarcodes.length}`);
  console.log(`Images found:   ${found}`);
  console.log(`Not on OFF:     ${notFound}`);
  console.log(`Errors:         ${errors}`);
  console.log(`Output:         ${OUTPUT_JSON}`);

  if (failedBarcodes.length > 0) {
    console.log(`\nFailed barcodes (network errors):`);
    failedBarcodes.forEach(b => console.log(`  ${b}`));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
