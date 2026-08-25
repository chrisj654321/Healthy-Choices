// Merges the three pending cowork batches (2026-07-17, 07-18, 07-20) into
// src/data/products.js. Follows the exact pattern established by
// merge-wave09-products.js: regex-extract barcode-keyed object literals from
// each *_reviewed.js checkpoint, skip anything already present in
// products.js (or already pulled from an earlier batch in this same run),
// and splice the surviving blocks in just before the MANUAL_PRODUCTS closing
// marker. Only whole `'barcode': { ... },` entries are matched, so the
// could_not_verify arrays/comment blocks at the bottom of each reviewed file
// (which use `{ key: '...', ... }` shape, not `'digits': { ... }`) are never
// swept in.
const fs = require('fs');

const productsPath = 'src/data/products.js';
const batches = [
  { file: 'src/data/batches/products/cowork-batch-2026-07-17_reviewed.js', label: 'Cowork batch 2026-07-17' },
  { file: 'src/data/batches/products/cowork-batch-2026-07-18_reviewed.js', label: 'Cowork batch 2026-07-18' },
  { file: 'src/data/batches/products/cowork-batch-2026-07-20_reviewed.js', label: 'Cowork batch 2026-07-20' },
  { file: 'src/data/batches/products/cowork-batch-2026-07-20b_reviewed.js', label: 'Cowork batch 2026-07-20b' },
];

const productsSource = fs.readFileSync(productsPath, 'utf8');
const existing = new Set([...productsSource.matchAll(/\n  '(\d+)': \{/g)].map((m) => m[1]));

const insertMarker = '\n};\n\n// Merge: generated data is the base, manual entries always override';
const insertAt = productsSource.indexOf(insertMarker);
if (insertAt === -1) throw new Error('Could not locate MANUAL_PRODUCTS closing marker.');

let blocks = '';
let totalMerged = 0;
for (const { file, label } of batches) {
  const source = fs.readFileSync(file, 'utf8');
  const entries = [...source.matchAll(/\n  '(\d+)': \{[\s\S]*?\n  \},/g)]
    .filter((m) => !existing.has(m[1]))
    .map((m) => { existing.add(m[1]); return m[0]; });

  if (entries.length === 0) {
    console.log(`${label}: merged=0 (all already present)`);
    continue;
  }
  blocks += `\n  // ${label}, merged 2026-07-20\n${entries.join('\n')}`;
  totalMerged += entries.length;
  console.log(`${label}: merged=${entries.length}`);
}

if (totalMerged === 0) {
  console.log('total merged=0');
  process.exit(0);
}

const next = productsSource.slice(0, insertAt) + blocks + productsSource.slice(insertAt);
fs.writeFileSync(productsPath, next);
console.log(`total merged=${totalMerged}`);
