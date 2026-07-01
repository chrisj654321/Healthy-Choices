const fs = require('fs');

const productsPath = 'src/data/products.js';
const reviewedPath = 'src/data/batches/products/chatskill_2026-07-01_wave_09_100_products/wave_09_reviewed_products.js';

const productsSource = fs.readFileSync(productsPath, 'utf8');
const reviewedSource = fs.readFileSync(reviewedPath, 'utf8');
const existing = new Set([...productsSource.matchAll(/\n  '(\d+)': \{/g)].map((m) => m[1]));
const entries = [...reviewedSource.matchAll(/\n  '(\d+)': \{[\s\S]*?\n  \},/g)]
  .filter((m) => !existing.has(m[1]))
  .map((m) => m[0]);

if (entries.length === 0) {
  console.log('merged=0');
  process.exit(0);
}

const insertMarker = '\n};\n\n// Merge: generated data is the base, manual entries always override';
const insertAt = productsSource.indexOf(insertMarker);
if (insertAt === -1) throw new Error('Could not locate MANUAL_PRODUCTS closing marker.');

const block = `\n  // Wave 09 - image-backed consumer expansion, added 2026-07-01\n${entries.join('\n')}`;
const next = productsSource.slice(0, insertAt) + block + productsSource.slice(insertAt);
fs.writeFileSync(productsPath, next);
console.log(`merged=${entries.length}`);
