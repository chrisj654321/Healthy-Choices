const fs = require('node:fs');
const path = require('node:path');

const products = require('./formatted_products');
const productsPath = path.resolve(__dirname, '../../../products.js');
const startMarker = '  // ─── CATEGORY DIVERSITY EXPANSION 2026-08-23 ───────────────────────────';
const endMarker = '  // ─── END CATEGORY DIVERSITY EXPANSION 2026-08-23 ───────────────────────';

if (Object.keys(products).length !== 18) {
  throw new Error(`Expected 18 products, received ${Object.keys(products).length}`);
}

let source = fs.readFileSync(productsPath, 'utf8');
const block = `${startMarker}\n${JSON.stringify(products, null, 2)
  .slice(1, -1)
  .trim()
  .split('\n')
  .map((line) => `  ${line}`)
  .join('\n')
  .trimEnd()},\n${endMarker}\n`;

const existingStart = source.indexOf(startMarker);
if (existingStart !== -1) {
  const existingEnd = source.indexOf(endMarker, existingStart);
  if (existingEnd === -1) throw new Error('Expansion block is missing its end marker');
  source = source.slice(0, existingStart) + block + source.slice(existingEnd + endMarker.length + 1);
} else {
  const anchor = 'const MANUAL_PRODUCTS = {\n';
  if (!source.includes(anchor)) throw new Error('Could not find MANUAL_PRODUCTS anchor');
  source = source.replace(anchor, `${anchor}\n${block}`);
}

fs.writeFileSync(productsPath, source);
console.log(`Merged ${Object.keys(products).length} category-diversity products.`);
