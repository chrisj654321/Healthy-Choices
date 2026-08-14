#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../src/data/ingredientCache.js');
let c = fs.readFileSync(file, 'utf8');

// Find all instances of letter followed by apostrophe followed by letter
const before = [];
const re = /[a-zA-Z]'[a-z]/g;
let m;
while ((m = re.exec(c)) !== null) {
  before.push({ idx: m.index, match: m[0] });
}
console.log('Found', before.length, 'unescaped apostrophes');
console.log('First 5:', before.slice(0, 5).map(x => x.match));

// Replace using function — build new string manually to avoid $' special sequence
const fixed = c.replace(/([a-zA-Z])'([a-z])/g, function(match, p1, p2) {
  const replacement = p1 + String.fromCharCode(92) + String.fromCharCode(39) + p2;
  return replacement;
});

const after = (fixed.match(/[a-zA-Z]'[a-z]/g) || []).length;
console.log('After fix:', after, 'remaining');

if (fixed !== c) {
  fs.writeFileSync(file, fixed, 'utf8');
  console.log('File written.');
  // Verify
  const verify = fs.readFileSync(file, 'utf8');
  const lines = verify.split('\n');
  console.log('Line 1318:', lines[1317].substring(55, 115));
} else {
  console.log('WARNING: file unchanged — replacement had no effect');
  // Debug: check the actual char codes around the apostrophe on line 1318
  const lines = c.split('\n');
  const line = lines[1317];
  const idx = line.indexOf("cow");
  console.log('Chars around apostrophe:');
  for (let i = idx; i < idx + 6; i++) {
    console.log(' ', i-idx, JSON.stringify(line[i]), '0x' + line.charCodeAt(i).toString(16));
  }
}
