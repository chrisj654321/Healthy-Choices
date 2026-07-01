const fs = require('fs');

const outDir = 'src/data/batches/products/chatskill_2026-07-01_wave_09_100_products';
const candidates = JSON.parse(fs.readFileSync(`${outDir}/wave_09_candidates.json`, 'utf8'));
const outPath = `${outDir}/wave_09_off_images.json`;
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};

async function fetchOne(p) {
  if (existing[p.barcode]?.image_url || existing[p.barcode]?.source === null) return existing[p.barcode];
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(p.barcode)}?fields=image_front_url,image_url,product_name,brands`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ShelfExpose/1.0 product-photo-lookup (research@shelfexpose.local)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const product = data.product || {};
    const image = product.image_front_url || product.image_url || null;
    existing[p.barcode] = image
      ? { image_url: image, source: 'openfoodfacts', matched_name: product.product_name || null, matched_brand: product.brands || null }
      : { image_url: null, source: null, matched_name: product.product_name || null, matched_brand: product.brands || null };
  } catch (err) {
    existing[p.barcode] = { image_url: null, source: null, error: err.message };
  }
  return existing[p.barcode];
}

(async () => {
  let done = 0;
  for (const p of candidates) {
    await fetchOne(p);
    done += 1;
    if (done % 25 === 0) {
      fs.writeFileSync(outPath, JSON.stringify(existing, null, 2));
      console.log(`checked=${done}`);
    }
  }
  fs.writeFileSync(outPath, JSON.stringify(existing, null, 2));
  const hits = Object.values(existing).filter((v) => v.image_url).length;
  console.log(`hits=${hits} checked=${done}`);
})();
