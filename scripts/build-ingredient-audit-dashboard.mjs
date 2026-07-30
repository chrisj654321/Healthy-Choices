import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = 'C:\\Users\\chris\\Ingredient Audit by ChatGPT';
const archive = path.join(root, 'Archive - Technical Research Records');
const copies = path.join(archive, 'Working Ingredient Copies');
const audit = path.join(archive, 'Completed Audit Batches', 'efficient-v2');
const batches = path.join(audit, 'batches');
const candidates = path.join(archive, 'Ingredient Expansion Candidates');
const csv = value => `"${String(value ?? '').replaceAll('"', '""').replaceAll(/\r?\n/g, ' ')}"`;
const normalize = value => String(value ?? '').trim().toLowerCase().replaceAll(/\s+/g, ' ');

async function writeCsv(file, headers, rows) {
  const lines = [headers.map(csv).join(','), ...rows.map(row => headers.map(key => csv(row[key])).join(','))];
  await fs.writeFile(path.join(root, file), `${lines.join('\n')}\n`, 'utf8');
}

async function findNamedFiles(dir, filename) {
  const results = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...await findNamedFiles(full, filename));
    else if (entry.name === filename) results.push(full);
  }
  return results;
}

const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const { INGREDIENT_DB } = await import(pathToFileURL(path.join(copies, 'ingredients-copy.mjs')).href);
const { CACHED_INGREDIENT_ANALYSIS } = await import(pathToFileURL(path.join(copies, 'ingredientCache-copy.mjs')).href);
const { INGREDIENT_RATING_CHANGE_PROPOSALS: copyProposals = [] } = await import(pathToFileURL(path.join(copies, 'ingredient-rating-change-proposals.js')).href);
const registryJson = await readJson(path.join(audit, 'source-registry.json'));
const sources = Array.isArray(registryJson) ? registryJson : Object.values(registryJson.sources ?? registryJson);
const inventory = await readJson(path.join(archive, 'Completed Audit Batches', 'inventory.json'));
const candidateRows = (await fs.readFile(path.join(candidates, 'candidate-ledger.jsonl'), 'utf8')).split(/\r?\n/).filter(Boolean).map(JSON.parse);
let waveState = { waves: [] };
try { waveState = await readJson(path.join(candidates, 'ingredient-wave-state.json')); } catch { /* no planned waves yet */ }
const waveByCandidate = new Map((waveState.waves ?? []).flatMap(wave => wave.candidateIds.map(candidateId => [candidateId, wave])));

// Only sealed PASS batches become part of the user-facing master list.
const finalFiles = await findNamedFiles(batches, 'final.json');
const completed = new Map();
for (const finalFile of finalFiles) {
  const folder = path.dirname(finalFile);
  const completionFile = path.join(folder, 'completion.json');
  try {
    const completion = await readJson(completionFile);
    const final = await readJson(finalFile);
    if (completion.status !== 'PASS' || !Array.isArray(final.entries)) continue;
    for (const entry of final.entries) {
      if (!entry.key || !['PASS', 'FIX'].includes(entry.reviewVerdict)) continue;
      completed.set(normalize(entry.key), {
        ingredient: entry.key,
        source: `Completed audit: ${final.batchId ?? path.basename(folder)}`,
        riskScore: entry.currentRisk ?? '',
        rating: entry.currentFlag ?? '',
        category: entry.category ?? '',
        customerExplanation: entry.explanation ?? '',
        evidenceSummary: entry.evidenceLine ?? '',
        auditStatus: 'Completed and independently reviewed',
        batchId: final.batchId ?? path.basename(folder),
        reviewedAt: entry.reviewedAt ?? completion.sealedAt ?? '',
      });
    }
  } catch { /* incomplete batches stay out of the public master list */ }
}

const entries = new Map();
for (const [ingredient, value] of Object.entries(INGREDIENT_DB)) entries.set(normalize(ingredient), { ingredient, source: 'Primary ingredient database', riskScore: value.risk, rating: value.flag, category: value.category, customerExplanation: value.note ?? '', evidenceSummary: value.evidence ?? '', auditStatus: 'Working database entry', batchId: '', reviewedAt: '' });
for (const [ingredient, value] of Object.entries(CACHED_INGREDIENT_ANALYSIS)) if (!entries.has(normalize(ingredient))) entries.set(normalize(ingredient), { ingredient, source: 'Ingredient cache', riskScore: value.risk, rating: '', category: value.category, customerExplanation: value.explanation ?? '', evidenceSummary: '', auditStatus: 'Working database entry', batchId: '', reviewedAt: '' });
for (const [key, record] of completed) entries.set(key, record);
const master = [...entries.values()].sort((a, b) => a.ingredient.localeCompare(b.ingredient));

const proposalFiles = await findNamedFiles(batches, 'rating-proposals.json');
const proposalsByKey = new Map(copyProposals.map(item => [normalize(item.key), item]));
for (const proposalFile of proposalFiles) {
  try {
    for (const item of (await readJson(proposalFile)).proposals ?? []) proposalsByKey.set(normalize(item.key), item);
  } catch { /* incomplete proposal files never alter the dashboard */ }
}
const proposals = [...proposalsByKey.values()].sort((a, b) => String(a.key).localeCompare(String(b.key)));
const outstandingQueue = candidateRows.filter(item => !entries.has(normalize(item.normalizedTerm ?? item.exactTerm)) && item.status !== 'completed');

await writeCsv('Ingredient Master List.csv', ['ingredient', 'source', 'riskScore', 'rating', 'category', 'customerExplanation', 'evidenceSummary', 'auditStatus', 'batchId', 'reviewedAt'], master);
await writeCsv('Score Change Proposals.csv', ['ingredient', 'currentRisk', 'currentRating', 'proposedRisk', 'proposedRating', 'rationale', 'confidence', 'reviewVerdict', 'status', 'lastReviewed'], proposals.map(item => ({ ingredient: item.key, currentRisk: item.currentRisk, currentRating: item.currentFlag, proposedRisk: item.proposedRisk, proposedRating: item.proposedFlag, rationale: item.rationale, confidence: item.confidence, reviewVerdict: item.reviewerVerdict, status: item.status, lastReviewed: item.lastReviewed })));
await writeCsv('Research Sources.csv', ['sourceId', 'title', 'publisher', 'publicationDate', 'sourceType', 'jurisdiction', 'identifier', 'url'], sources.map(item => ({ sourceId: item.id, title: item.title, publisher: item.publisher, publicationDate: item.publicationDate, sourceType: item.sourceType, jurisdiction: item.jurisdiction, identifier: item.identifier, url: item.url })).sort((a, b) => String(a.sourceId).localeCompare(String(b.sourceId))));
await writeCsv('Next Ingredient Queue.csv', ['batch', 'batchStatus', 'candidateId', 'ingredient', 'productFrequency', 'currentStatus', 'releaseEligibility', 'nextStep'], outstandingQueue.map(item => { const wave = waveByCandidate.get(item.candidateId); return { batch: wave?.batchId ?? 'Unscheduled', batchStatus: wave?.status ?? 'waiting', candidateId: item.candidateId, ingredient: item.exactTerm, productFrequency: item.productFrequency, currentStatus: item.status, releaseEligibility: item.releaseEligibility, nextStep: wave ? 'Start identity and evidence triage for this batch' : 'Schedule after the five active batches' }; }).sort((a, b) => (a.batch === 'Unscheduled') - (b.batch === 'Unscheduled') || b.productFrequency - a.productFrequency));

const completedIndex = new Map((inventory.entries ?? []).map(entry => [normalize(entry.key), { ingredient: entry.key, batchId: 'pre-existing-audited-inventory', reviewedAt: inventory.createdAt }]));
for (const [key, record] of completed) completedIndex.set(key, { ingredient: record.ingredient, batchId: record.batchId, reviewedAt: record.reviewedAt });
const index = { generatedAt: new Date().toISOString(), auditedExactEntries: inventory.totalExactEntries, knownUniqueIngredientKeys: completedIndex.size, sealedFinalRecordsIndexed: completed.size, masterEntries: master.length, completed: [...completedIndex.values()].sort((a, b) => a.ingredient.localeCompare(b.ingredient)) };
await fs.writeFile(path.join(archive, 'completed-work-index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
const ratingCounts = master.reduce((counts, item) => { const label = item.rating || `risk ${item.riskScore} without display label`; counts[label] = (counts[label] ?? 0) + 1; return counts; }, {});
const dashboard = [
  '# Ingredient Audit Dashboard', '', '## Start here', '', 'Open **Ingredient Master List.csv** to search the current ingredient database. Open **Next Ingredient Queue.csv** only when choosing the next batch.', '',
  '## Current status', '', `- Ingredient records in the searchable master list: ${master.length}`, `- Exact audited inventory entries protected from duplicate work: ${inventory.totalExactEntries}`, `- Unique ingredient names in the completed-work index: ${completedIndex.size}`, `- Candidates still waiting to be processed: ${outstandingQueue.length}`, `- Score-change proposals awaiting user decision: ${proposals.length}`, '- Live HealthyChoices ingredient files changed: No', '',
  '## Score breakdown', '', ...Object.entries(ratingCounts).sort(([a], [b]) => a.localeCompare(b)).map(([rating, count]) => `- ${rating}: ${count}`), '',
  '## Active ingredient batches', '', ...(waveState.waves ?? []).map(wave => `- ${wave.batchId}: ${wave.candidateIds.length} ingredients, ${wave.status}`), '',
  '## Automatic update rule', '', 'When a batch is sealed PASS after independent review, save its final.json, completion.json, rating-proposals.json, and sources in the technical archive, then run the audit refresh. The refresh blocks duplicate completed ingredients, adds the approved entry to the master list, updates sources and proposals, removes it from the next queue, and records it in the completed-work index.', '',
  '## What each file is for', '', '- **Ingredient Master List.csv**: the only master list to read and search.', '- **Score Change Proposals.csv**: proposed score changes only. Nothing here is applied automatically.', '- **Research Sources.csv**: the evidence library supporting audit work.', '- **Next Ingredient Queue.csv**: candidates that remain after completed ingredients are filtered out.', '- **Archive - Technical Research Records**: detailed checkpoints and independent reviews. You do not need it for normal work.', ''
].join('\n');
await fs.writeFile(path.join(root, 'START HERE - Ingredient Audit Dashboard.md'), dashboard, 'utf8');
console.log(JSON.stringify({ masterEntries: master.length, completedEntries: completed.size, sources: sources.length, queue: outstandingQueue.length, proposals: proposals.length }, null, 2));
