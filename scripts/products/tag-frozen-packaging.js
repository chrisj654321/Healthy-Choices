const fs = require('fs');

const path = 'src/data/products.js';
let source = fs.readFileSync(path, 'utf8');

const manualStart = source.indexOf('const MANUAL_PRODUCTS = {');
const exportIndex = source.indexOf('\nexport const PRODUCT_DB');
const manualEnd = exportIndex === -1 ? -1 : source.lastIndexOf('\n};', exportIndex);
if (manualStart === -1 || manualEnd === -1) {
  throw new Error('Could not locate MANUAL_PRODUCTS block.');
}

const body = source.slice(manualStart, manualEnd);
const entryRe = /\n  '([^']+)': \{/g;
const entries = [...body.matchAll(entryRe)];
let added = 0;

for (let i = entries.length - 1; i >= 0; i -= 1) {
  const objStart = manualStart + entries[i].index;
  const objEnd = i + 1 < entries.length ? manualStart + entries[i + 1].index : manualEnd;
  const block = source.slice(objStart, objEnd);

  if (!/category: 'Frozen Vegetables & Fruit'/.test(block)) continue;
  if (/\n    packaging: \{/.test(block)) continue;

  const name = (block.match(/name: '([^']+)'/) || [])[1] || '';
  const isSteam = /\b(steamfresh|steamers|simply steam|steam)\b/i.test(name);
  const packaging = isSteam
    ? "    packaging: { material: 'plastic', format: 'steam-bag', heatUse: 'microwave', concernLevel: 'high', concerns: ['microplastics', 'heated-plastic-contact'] },\n"
    : "    packaging: { material: 'plastic', format: 'plastic-bag', heatUse: 'unknown', concernLevel: 'low', concerns: ['microplastics', 'plastic-food-contact'] },\n";

  const categoryLine = "    category: 'Frozen Vegetables & Fruit',\n";
  const categoryIndex = source.indexOf(categoryLine, objStart);
  if (categoryIndex < 0 || categoryIndex > objEnd) continue;

  const insertAt = categoryIndex + categoryLine.length;
  source = source.slice(0, insertAt) + packaging + source.slice(insertAt);
  added += 1;
}

fs.writeFileSync(path, source);
console.log(`packaging_tags_added=${added}`);
