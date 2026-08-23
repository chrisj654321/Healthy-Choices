const fs = require('fs');
const path = require('path');

const dir = __dirname;
const productsPath = path.resolve(dir, '../../../products.js');
const formatted = require('./catalog_80plus_expansion_formatted.js');
let source = fs.readFileSync(productsPath, 'utf8');
const barcodes = Object.keys(formatted);
const marker = 'const MANUAL_PRODUCTS = {\n';
if (!source.includes(marker)) throw new Error('MANUAL_PRODUCTS marker not found');
const entries = JSON.stringify(formatted, null, 2).slice(2, -2);
const batchMarker = '  // ─── CATALOG 80+ EXPANSION 2026-08-22';
const nextMarker = '  // ─── STAPLE WAVE 2026-08-17';
const block = `${batchMarker} ───────────────────────────────────\n${entries},\n\n`;
if (source.includes(batchMarker)) {
  const start = source.indexOf(batchMarker);
  const end = source.indexOf(nextMarker, start);
  if (end < 0) throw new Error('Next MANUAL_PRODUCTS section marker not found');
  source = `${source.slice(0, start)}${block}${source.slice(end)}`;
} else {
  const duplicates = barcodes.filter((barcode) =>
    new RegExp(`['"]${barcode}['"]\\s*:`).test(source)
  );
  if (duplicates.length) throw new Error(`Already present outside batch block: ${duplicates.join(', ')}`);
  source = source.replace(marker, `${marker}\n${block}`);
}
fs.writeFileSync(productsPath, source);
console.log(`Merged ${barcodes.length} products into MANUAL_PRODUCTS.`);
