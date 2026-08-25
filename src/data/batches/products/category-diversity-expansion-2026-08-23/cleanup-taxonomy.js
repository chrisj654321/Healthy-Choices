const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..', '..', '..', '..');
const productsPath = path.join(root, 'src', 'data', 'products.js');
let source = fs.readFileSync(productsPath, 'utf8');

function replaceAllExact(from, to, expectedCount) {
  const count = source.split(from).length - 1;
  if (count === 0) return;
  if (count !== expectedCount) {
    throw new Error(`Expected ${expectedCount} occurrences of ${from}, found ${count}`);
  }
  source = source.split(from).join(to);
}

function updateProduct(barcode, replacements) {
  const marker = `barcode: '${barcode}'`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing product barcode ${barcode}`);
  const end = source.indexOf('\n  },', start);
  if (end < 0) throw new Error(`Could not find product boundary for ${barcode}`);

  let block = source.slice(start, end);
  for (const [from, to] of replacements) {
    const count = block.split(from).length - 1;
    if (count === 0 && block.includes(to)) continue;
    if (count !== 1) {
      throw new Error(`Expected one ${from} in ${barcode}, found ${count}`);
    }
    block = block.replace(from, to);
  }
  source = `${source.slice(0, start)}${block}${source.slice(end)}`;
}

// Canonical aisle labels: remove legacy category splits that fragmented counts.
replaceAllExact("category: 'Chips',", "category: 'Chips & Crackers',", 2);
replaceAllExact("category: 'Crackers',", "category: 'Chips & Crackers',", 2);
replaceAllExact("category: 'Peanut Butter',", "category: 'Nut Butters',", 18);
replaceAllExact("category: 'Deli & Lunch',", "category: 'Deli Meat',", 47);

// The only non-meat records in the former Deli & Lunch bucket are hummus.
for (const barcode of ['044115403011', '856500004006', '040822011143']) {
  updateProduct(barcode, [["category: 'Deli Meat',", "category: 'Dips & Hummus',"]]);
}

// Hormel's official brand list and acquisition record identify Planters as a
// Hormel brand. Correct four older records that still pointed to Kraft Heinz.
for (const barcode of ['0029000016699', '0029000073241', '0029000073456', '0029000076501']) {
  updateProduct(barcode, [["companyId: 'kraft-heinz',", "companyId: 'hormel',"]]);
}

fs.writeFileSync(productsPath, source);
console.log('Category cleanup applied: 69 category corrections and 4 Planters owner corrections.');
