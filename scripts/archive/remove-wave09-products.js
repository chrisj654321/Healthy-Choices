const fs = require('fs');

const productsPath = 'src/data/products.js';
let source = fs.readFileSync(productsPath, 'utf8');
const marker = '\n  // Wave 09 - image-backed consumer expansion, added 2026-07-01\n';
const start = source.indexOf(marker);
if (start === -1) {
  console.log('removed=0');
  process.exit(0);
}
const endMarker = '\n};\n\n// Merge: generated data is the base, manual entries always override';
const end = source.indexOf(endMarker, start);
if (end === -1) throw new Error('Could not locate Wave 09 block end.');
const removedBlock = source.slice(start, end);
const removed = [...removedBlock.matchAll(/\n  '(\d+)': \{/g)].length;
source = source.slice(0, start) + source.slice(end);
fs.writeFileSync(productsPath, source);
console.log(`removed=${removed}`);
