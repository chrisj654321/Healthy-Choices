/**
 * fetch-onboarding-assets.js
 *
 * One-shot fetch of every image the onboarding value screens need, so they
 * can be BUNDLED as local assets instead of hotlinked (onboarding must look
 * perfect on a fresh install with bad/no network).
 *
 * Downloads into assets/onboarding/{products,stores,companies}/ :
 *   - 12 product hero shots (catalog image URLs where present; OFF search
 *     fallback for Pop-Tarts / Hot Pockets which have no catalog image)
 *   - all 16 store logos (Google favicon service, same source the app
 *     already uses in COMPANY_DB)
 *   - PepsiCo logo for the transparency step
 *
 * Writes assets/onboarding/manifest.json describing what landed where so
 * the review pass + Hadrian have one source of truth.
 *
 * Usage: node scripts/fetch-onboarding-assets.js
 */

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'onboarding');

// Exact catalog rows found by name (verified present with image 2026-07-06).
const PRODUCTS_FROM_CATALOG = [
  { slug: 'cheerios',      catalogName: 'Cheerios Original' },
  { slug: 'doritos',       catalogName: 'Doritos Nacho Cheese' },
  { slug: 'wonder-bread',  catalogName: 'Wonder Classic White Bread' },
  { slug: 'coca-cola',     catalogName: 'Coca-Cola Classic 12oz Can' },
  { slug: 'lunchables',    catalogName: 'LUNCHABLES, HAM & CHEDDAR WITH CRACKERS' },
  { slug: 'oreos',         catalogName: 'OREO mini' },
  { slug: 'cheetos',       catalogName: 'Cheetos Crunchy Cheese Flavored Snacks' },
  { slug: 'mountain-dew',  catalogName: 'Mountain Dew Original Soda' },
  { slug: 'kraft-mac',     catalogName: 'Kraft Macaroni & Cheese Original' },
  { slug: 'eggo',          catalogName: 'Eggo Buttermilk Waffles' },
];

// No catalog image — resolve via OpenFoodFacts search API.
const PRODUCTS_FROM_OFF_SEARCH = [
  { slug: 'pop-tarts',   query: 'pop-tarts frosted strawberry' },
  { slug: 'hot-pockets', query: 'hot pockets pepperoni pizza' },
];

// Google favicon service — identical source to COMPANY_DB logos in-app.
const STORE_DOMAINS = {
  aldi: 'aldi.us',
  costco: 'costco.com',
  walmart: 'walmart.com',
  target: 'target.com',
  kroger: 'kroger.com',
  publix: 'publix.com',
  'harris-teeter': 'harristeeter.com',
  'food-lion': 'foodlion.com',
  'whole-foods': 'wholefoodsmarket.com',
  'trader-joes': 'traderjoes.com',
  'sams-club': 'samsclub.com',
  sprouts: 'sprouts.com',
  wegmans: 'wegmans.com',
  meijer: 'meijer.com',
  heb: 'heb.com',
  gordons: 'gfs.com',
};

const COMPANY_DOMAINS = { pepsico: 'pepsico.com' };

const UA = 'ShelfExpose/1.0 (onboarding asset fetch; contact: christianjames128@gmail.com)';

function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
}

async function download(url, destNoExt) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const type = (res.headers.get('content-type') || '').toLowerCase();
  const ext = type.includes('png') ? '.png'
    : type.includes('webp') ? '.webp'
    : type.includes('gif') ? '.gif'
    : '.jpg';
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`Suspiciously small (${buf.length}B) from ${url}`);
  const dest = destNoExt + ext;
  fs.writeFileSync(dest, buf);
  return { dest: path.relative(ROOT, dest), bytes: buf.length, source: url };
}

async function offSearchImage(query) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,image_front_url,countries_tags`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`OFF search HTTP ${res.status}`);
  const data = await res.json();
  const hit = (data.products || []).find((p) => p.image_front_url);
  if (!hit) throw new Error(`No OFF image hit for "${query}"`);
  return { imageUrl: hit.image_front_url, matchedName: hit.product_name };
}

async function main() {
  for (const sub of ['products', 'stores', 'companies']) {
    fs.mkdirSync(path.join(OUT, sub), { recursive: true });
  }

  const manifest = { fetchedAt: new Date().toISOString(), products: {}, stores: {}, companies: {}, failures: [] };

  // ── Products from the built catalog ──
  const db = new DatabaseSync(path.join(ROOT, 'assets', 'db', 'products.db'), { readOnly: true });
  for (const p of PRODUCTS_FROM_CATALOG) {
    try {
      const row = db.prepare('SELECT name, image FROM products WHERE name = ? AND image IS NOT NULL LIMIT 1').get(p.catalogName);
      if (!row) throw new Error(`catalog row not found: ${p.catalogName}`);
      const info = await download(row.image, path.join(OUT, 'products', p.slug));
      manifest.products[p.slug] = { ...info, catalogName: row.name };
      console.log('OK  product', p.slug, `(${info.bytes}B)`);
    } catch (e) {
      manifest.failures.push({ kind: 'product', slug: p.slug, error: e.message });
      console.log('FAIL product', p.slug, '—', e.message);
    }
  }

  // ── Products via OFF search ──
  for (const p of PRODUCTS_FROM_OFF_SEARCH) {
    try {
      const { imageUrl, matchedName } = await offSearchImage(p.query);
      const info = await download(imageUrl, path.join(OUT, 'products', p.slug));
      manifest.products[p.slug] = { ...info, matchedName };
      console.log('OK  product', p.slug, '←', matchedName, `(${info.bytes}B)`);
    } catch (e) {
      manifest.failures.push({ kind: 'product', slug: p.slug, error: e.message });
      console.log('FAIL product', p.slug, '—', e.message);
    }
  }

  // ── Store logos ──
  for (const [id, domain] of Object.entries(STORE_DOMAINS)) {
    try {
      const info = await download(faviconUrl(domain), path.join(OUT, 'stores', id));
      manifest.stores[id] = info;
      console.log('OK  store  ', id, `(${info.bytes}B)`);
    } catch (e) {
      manifest.failures.push({ kind: 'store', slug: id, error: e.message });
      console.log('FAIL store  ', id, '—', e.message);
    }
  }

  // ── Company logos ──
  for (const [id, domain] of Object.entries(COMPANY_DOMAINS)) {
    try {
      const info = await download(faviconUrl(domain), path.join(OUT, 'companies', id));
      manifest.companies[id] = info;
      console.log('OK  company', id, `(${info.bytes}B)`);
    } catch (e) {
      manifest.failures.push({ kind: 'company', slug: id, error: e.message });
      console.log('FAIL company', id, '—', e.message);
    }
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${manifest.failures.length} failure(s). Manifest at assets/onboarding/manifest.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
