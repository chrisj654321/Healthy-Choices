const fs = require('fs');
const path = require('path');

const productsSource = fs.readFileSync('src/data/products.js', 'utf8');
const existing = new Set([...productsSource.matchAll(/\n  '(\d+)': \{/g)].map((m) => m[1]));
const hits = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!/(reviewed|formatted).*\.js$/.test(name)) continue;
    const source = fs.readFileSync(filePath, 'utf8');
    const barcodes = [...source.matchAll(/['"](\d{8,14})['"]\s*:\s*\{/g)]
      .map((m) => m[1])
      .filter((barcode) => !existing.has(barcode));
    if (barcodes.length > 0) {
      const imageBacked = barcodes.filter((barcode) => {
        const idx = source.search(new RegExp(`['"]${barcode}['"]\\s*:\\s*\\{`));
        const next = idx === -1 ? -1 : source.indexOf('\n  ', idx + 5);
        const block = source.slice(idx, next === -1 ? source.length : next);
        return /image:\s*'http/.test(block);
      });
      hits.push({ filePath, count: barcodes.length, imageBacked: imageBacked.length, sample: barcodes.slice(0, 8), imageSample: imageBacked.slice(0, 8) });
    }
  }
}

walk('src/data/batches/products');
console.log(JSON.stringify(hits, null, 2));
