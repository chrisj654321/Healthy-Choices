import fs from 'node:fs/promises';
import path from 'node:path';

const root = 'C:\\Users\\chris\\Ingredient Audit by ChatGPT\\Archive - Technical Research Records\\Ingredient Expansion Candidates';
const candidates = (await fs.readFile(path.join(root, 'candidate-ledger.jsonl'), 'utf8')).split(/\r?\n/).filter(Boolean).map(JSON.parse);
const batchSize = 30;
const batchCount = 5;
const selected = candidates.slice(0, batchSize * batchCount);
if (selected.length !== batchSize * batchCount) throw new Error('Not enough candidates for five 30-ingredient batches.');
const seen = new Set();
for (const item of selected) {
  const key = String(item.normalizedTerm ?? item.exactTerm).trim().toLowerCase();
  if (seen.has(key)) throw new Error(`Duplicate inside the existing candidate queue: ${key}`);
  seen.add(key);
}
const waves = Array.from({ length: batchCount }, (_, index) => ({
  batchId: `Batch ${String(index + 1).padStart(3, '0')}`,
  status: 'ready to start',
  ingredientCount: batchSize,
  internalReviewGroups: [15, 15],
  candidateIds: selected.slice(index * batchSize, (index + 1) * batchSize).map(item => item.candidateId),
}));
await fs.writeFile(path.join(root, 'ingredient-wave-state.json'), `${JSON.stringify({ updatedAt: new Date().toISOString(), source: 'existing pre-deduplicated candidate ledger', waves }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batches: waves.map(wave => ({ batchId: wave.batchId, ingredientCount: wave.ingredientCount, status: wave.status })) }, null, 2));
