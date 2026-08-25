#!/usr/bin/env node
/**
 * merge-ingredient-batches.js
 *
 * Reads all batch_*.js files from src/data/batches/, deduplicates against the
 * existing CACHED_INGREDIENT_ANALYSIS keys, then inserts new entries into
 * ingredientCache.js before the closing `};` of that object.
 *
 * Run: node scripts/ingredients/merge-ingredient-batches.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.resolve(__dirname, '..', '..', 'src', 'data', 'ingredientCache.js');
const BATCHES_DIR = path.resolve(__dirname, '..', '..', 'src', 'data', 'batches');

// ── 1. Read existing cache and collect all keys ──────────────────────────────
const cacheContent = fs.readFileSync(CACHE_FILE, 'utf8');

// Extract existing keys: lines like  'key': { ...
const existingKeyRegex = /^\s+'([^']+)':\s*\{/gm;
const existingKeys = new Set();
let m;
while ((m = existingKeyRegex.exec(cacheContent)) !== null) {
  existingKeys.add(m[1].toLowerCase().trim());
}
console.log(`Existing cache keys: ${existingKeys.size}`);

// ── 2. Read and collect new entries from all batch files ─────────────────────
const batchFiles = fs.readdirSync(BATCHES_DIR)
  .filter(f => f.startsWith('batch_') && f.endsWith('.js'))
  .sort();

console.log(`Batch files found: ${batchFiles.join(', ')}`);

const newLines = [];
let skipped = 0;
let added = 0;

for (const batchFile of batchFiles) {
  const batchPath = path.join(BATCHES_DIR, batchFile);
  const batchContent = fs.readFileSync(batchPath, 'utf8');
  const lines = batchContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match entry lines like: 'key': { risk: ... }
    const keyMatch = trimmed.match(/^'([^']+)':\s*\{/);
    if (!keyMatch) continue;

    const key = keyMatch[1].toLowerCase().trim();
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    // Normalise indentation to 2 spaces
    newLines.push('  ' + trimmed.replace(/,\s*$/, '') + ',');
    existingKeys.add(key); // prevent cross-batch duplicates
    added++;
  }
}

console.log(`New entries to add: ${added}`);
console.log(`Duplicate entries skipped: ${skipped}`);

if (added === 0) {
  console.log('Nothing to add — exiting.');
  process.exit(0);
}

// ── 3. Find insertion point: the closing `};` of CACHED_INGREDIENT_ANALYSIS ──
// The file ends with:
//   'last-key': { ... },
// };
//
// We look for the last `};` that closes the exported const.
const lines = cacheContent.split('\n');
let insertionIndex = -1;

// Find the line that is exactly `};` (closing the CACHED_INGREDIENT_ANALYSIS object)
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '};') {
    insertionIndex = i;
    break;
  }
}

if (insertionIndex === -1) {
  console.error('ERROR: Could not find closing `};` in ingredientCache.js');
  process.exit(1);
}

console.log(`Inserting ${added} entries before line ${insertionIndex + 1} of ingredientCache.js`);

// ── 4. Build new file content ─────────────────────────────────────────────────
const before = lines.slice(0, insertionIndex);
const after = lines.slice(insertionIndex);

// Add a blank separator line before the new block for readability
const newContent = [
  ...before,
  '',
  `  // ── Batch-imported entries (${new Date().toISOString().slice(0, 10)}) ──`,
  ...newLines,
  ...after,
].join('\n');

// ── 5. Write back ─────────────────────────────────────────────────────────────
fs.writeFileSync(CACHE_FILE, newContent, 'utf8');
console.log(`Done. ingredientCache.js updated with ${added} new entries.`);
console.log(`Total keys now: ${existingKeys.size}`);
