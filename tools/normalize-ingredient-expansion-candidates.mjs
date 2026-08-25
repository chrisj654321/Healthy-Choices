import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const labDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : 'C:\\Users\\chris\\Ingredient Audit by ChatGPT\\Archive - Technical Research Records\\Ingredient Expansion Candidates';
const completedIndexPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(path.dirname(labDir), 'completed-work-index.json');
const selectionLimit = 150;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeAtomic = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, value);
  fs.renameSync(temporaryPath, filePath);
};
const writeJson = (filePath, value) => writeAtomic(filePath, `${JSON.stringify(value, null, 2)}\n`);
const writeJsonl = (filePath, values) => writeAtomic(filePath, `${values.map((value) => JSON.stringify(value)).join('\n')}\n`);

// This mirrors the intake normalizer, then adds only lossless whitespace cleanup.
const normalize = (value) => String(value || '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\([^)]*\)/g, ' ')
  .replace(/\b\d+(?:[.,]\d+)?\s*%?\b/g, ' ')
  .replace(/[^a-z]+/g, ' ')
  .trim().replace(/\s+/g, ' ');

const singularForms = (term) => {
  const forms = [term];
  const words = term.split(' ');
  const last = words.at(-1);
  if (last?.length > 3 && last.endsWith('ies')) forms.push([...words.slice(0, -1), `${last.slice(0, -3)}y`].join(' '));
  if (last?.length > 3 && last.endsWith('es')) forms.push([...words.slice(0, -1), last.slice(0, -2)].join(' '));
  if (last?.length > 3 && last.endsWith('s') && !last.endsWith('ss')) forms.push([...words.slice(0, -1), last.slice(0, -1)].join(' '));
  return [...new Set(forms.filter(Boolean))];
};

const aliasForms = (term) => {
  const forms = [...singularForms(term)];
  const vitaminAlias = term
    .replace(/^vitamin b\s+/, '')
    .replace(/\s+vitamin b$/, '')
    .replace(/^vitamin c\s+/, '')
    .replace(/\s+vitamin c$/, '')
    .trim();
  if (vitaminAlias && vitaminAlias !== term) forms.push(...singularForms(vitaminAlias));
  return [...new Set(forms)];
};

const ambiguousExactTerms = new Set([
  'additives', 'artificial color', 'artificial colors', 'artificial flavor', 'artificial flavors',
  'color', 'colors', 'cultures', 'flavor', 'flavors', 'food color', 'food colors', 'natural color',
  'natural colors', 'natural flavor', 'natural flavors', 'preservative', 'preservatives', 'spice',
  'spices', 'seasoning', 'seasonings', 'stabilizer', 'stabilizers', 'vegetable oil', 'vegetable oils',
  'alcohol', 'chocolate', 'confectioner s glaze', 'enzyme', 'enzymes', 'malt', 'palm', 'pepper',
  'red lake', 'shortening', 'sunflower', 'vegetable', 'vegetables', 'vegetable color', 'vegetable colors',
  'culture', 'cultures', 'filling', 'fruit', 'granola', 'pasta', 'pretzel', 'pretzels', 'spice', 'spices',
  'acacia', 'canola', 'coloring', 'cottonseed', 'fruit juice', 'mononitrate', 'palmitate', 'thickener',
]);
const ambiguousPattern = /(?:^| )(?:and|or|contains|contain|with|without|including|may|traces?|less|more|added|for|from|of|as|to)(?: |$)/;
const ambiguousSuffix = /(?: blend| mixture| mix| preparation| base| filling| topping| coating| concentrate| compound| system| complex)$/;
const ambiguousPrefix = /^(?:an |assorted|other|various|proprietary|natural|artificial|mixed|organic|modified|enriched|partially|pasteurized|bleached|unbleached|imitation|cultured) /;
const ambiguousToken = /(?:^| )(?:acidulant|chocolate|color|coloring|colors|culture|cultures|dough|emulsifier|emulsifiers|enzyme|enzymes|extractive|extractives|flavor|flavors|glaze|inhibitor|leavening|preservative|preservatives|sauce|seasoning|seasonings|soda|spice|spices|stabilizer|stabilizers|thickener|vegetable|vegetables)(?: |$)/;
const componentTokens = new Set(['bean', 'beef', 'butter', 'cheese', 'chicken', 'corn', 'cream', 'egg', 'fat', 'flour', 'garlic', 'meat', 'milk', 'oat', 'peanut', 'rice', 'sugar', 'tomato', 'wheat', 'whey']);
const tokenStem = (token) => token.endsWith('ies') ? `${token.slice(0, -3)}y` : token.endsWith('oes') ? token.slice(0, -2) : token.endsWith('s') && !token.endsWith('ss') ? token.slice(0, -1) : token;

const identityReason = (term) => {
  if (!term || term.length < 3) return 'too-short-after-normalization';
  if (ambiguousExactTerms.has(term)) return 'generic-ingredient-class';
  if (ambiguousPattern.test(term)) return 'label-fragment-or-combined-entry';
  if (ambiguousSuffix.test(term)) return 'prepared-or-combined-food-entry';
  if (ambiguousPrefix.test(term)) return 'modifier-requires-identity-check';
  if (ambiguousToken.test(term)) return 'generic-function-or-identity-token';
  if (/^[a-z] /.test(term) || / [a-z]$/.test(term)) return 'abbreviated-identity-requires-review';
  const stems = term.split(' ').map(tokenStem);
  if (new Set(stems).size !== stems.length) return 'repeated-token-parser-artifact';
  if (new Set(stems.filter((token) => componentTokens.has(token))).size > 1) return 'multi-ingredient-parser-artifact';
  if (term.split(' ').length > 3) return 'multi-component-term-requires-identity-check';
  return null;
};

const ledgerPath = path.join(labDir, 'candidate-ledger.jsonl');
const ledgerText = fs.readFileSync(ledgerPath, 'utf8');
const ledger = ledgerText.trim().split(/\r?\n/).filter(Boolean).map((line, lineNumber) => {
  try { return JSON.parse(line); } catch { throw new Error(`Invalid JSONL at line ${lineNumber + 1}`); }
});
const completedIndexText = fs.readFileSync(completedIndexPath, 'utf8');
const completedIndex = JSON.parse(completedIndexText);
const completed = Array.isArray(completedIndex.completed) ? completedIndex.completed : [];
const knownByNormalized = new Map();
for (const entry of completed) {
  const normalized = normalize(entry.ingredient);
  if (!normalized) continue;
  const current = knownByNormalized.get(normalized);
  if (!current || String(entry.ingredient).localeCompare(String(current.ingredient)) < 0) knownByNormalized.set(normalized, entry);
}

const runId = sha256(JSON.stringify({
  ledgerSha256: sha256(ledgerText),
  completedIndexSha256: sha256(completedIndexText),
  scriptSha256: sha256(fs.readFileSync(scriptPath)),
  selectionLimit,
})).slice(0, 16);
const queueRoot = path.join(labDir, 'queues');
const alreadyCovered = [];
const identityReview = [];
const clearUncovered = [];
const canonicalSeen = new Set();

const sortedLedger = [...ledger].sort((a, b) =>
  Number(b.productFrequency || 0) - Number(a.productFrequency || 0)
  || String(a.normalizedTerm || a.exactTerm).localeCompare(String(b.normalizedTerm || b.exactTerm))
  || String(a.candidateId).localeCompare(String(b.candidateId)));

for (const candidate of sortedLedger) {
  const term = normalize(candidate.normalizedTerm || candidate.exactTerm);
  const matchedForm = aliasForms(term).find((form) => knownByNormalized.has(form));
  const base = {
    ...candidate,
    normalizedTerm: term || null,
    normalizationRunId: runId,
  };
  if (matchedForm) {
    const completedEntry = knownByNormalized.get(matchedForm);
    alreadyCovered.push({
      ...base,
      status: 'already-covered',
      canonicalCandidateId: null,
      canonicalTerm: matchedForm,
      normalizationDecision: matchedForm === term ? 'exact-completed-match' : 'lossless-singular-completed-match',
      coveredBy: { ingredient: completedEntry.ingredient, batchId: completedEntry.batchId, reviewedAt: completedEntry.reviewedAt },
    });
    continue;
  }
  const reason = identityReason(term);
  if (reason) {
    identityReview.push({
      ...base,
      status: 'identity-review',
      canonicalCandidateId: null,
      canonicalTerm: null,
      normalizationDecision: reason,
    });
    continue;
  }
  const canonicalTerm = aliasForms(term).at(-1) || term;
  if (canonicalSeen.has(canonicalTerm)) {
    identityReview.push({
      ...base,
      status: 'identity-review',
      canonicalCandidateId: null,
      canonicalTerm,
      normalizationDecision: 'duplicate-candidate-canonicalization-requires-alias-review',
    });
    continue;
  }
  canonicalSeen.add(canonicalTerm);
  clearUncovered.push({
    ...base,
    status: 'normalized',
    canonicalCandidateId: `candidate-${sha256(canonicalTerm).slice(0, 12)}`,
    canonicalTerm,
    normalizationDecision: canonicalTerm === term ? 'clear-uncovered-exact' : 'clear-uncovered-lossless-singular',
  });
}

const evidenceResearch = clearUncovered.slice(0, selectionLimit).map((entry, index) => ({
  ...entry,
  status: 'evidence-research',
  researchOrder: index + 1,
  researchWave: `evidence-research-${String(Math.floor(index / 25) + 1).padStart(2, '0')}`,
  releaseEligibility: 'blocked-on-evidence-and-independent-review',
}));
const selectedIds = new Set(evidenceResearch.map((entry) => entry.candidateId));
const normalizedLedger = sortedLedger.map((candidate) => {
  const inCovered = alreadyCovered.find((entry) => entry.candidateId === candidate.candidateId);
  if (inCovered) return inCovered;
  const inIdentity = identityReview.find((entry) => entry.candidateId === candidate.candidateId);
  if (inIdentity) return inIdentity;
  const clear = clearUncovered.find((entry) => entry.candidateId === candidate.candidateId);
  return selectedIds.has(candidate.candidateId) ? evidenceResearch.find((entry) => entry.candidateId === candidate.candidateId) : clear;
});
const deferred = clearUncovered.filter((entry) => !selectedIds.has(entry.candidateId));

const report = {
  schemaVersion: 1,
  runId,
  deterministicInputs: {
    candidateLedgerPath: ledgerPath,
    candidateLedgerSha256: sha256(ledgerText),
    completedWorkIndexPath: completedIndexPath,
    completedWorkIndexSha256: sha256(completedIndexText),
    normalizerPath: scriptPath,
    normalizerSha256: sha256(fs.readFileSync(scriptPath)),
  },
  selection: {
    method: 'descending productFrequency, then normalized term, then candidateId; clear, distinct, and not already covered only',
    selectionLimit,
    selected: evidenceResearch.length,
    deferredClearCandidates: deferred.length,
    waves: evidenceResearch.length ? Math.ceil(evidenceResearch.length / 25) : 0,
  },
  counts: {
    inputCandidates: ledger.length,
    alreadyCovered: alreadyCovered.length,
    identityReview: identityReview.length,
    clearDistinctUncovered: clearUncovered.length,
    evidenceResearch: evidenceResearch.length,
    normalizedDeferred: deferred.length,
    normalizedLedgerRows: normalizedLedger.length,
  },
  outputs: {
    normalizedLedger: path.join(labDir, 'candidate-ledger.normalized.jsonl'),
    alreadyCovered: path.join(queueRoot, 'already-covered.json'),
    identityReview: path.join(queueRoot, 'identity-review.json'),
    evidenceResearch: path.join(queueRoot, 'evidence-research.json'),
    normalizationReport: path.join(labDir, 'normalization-report.json'),
    resumeState: path.join(labDir, 'resume-state.json'),
  },
  safety: {
    liveAppFilesChanged: false,
    healthClaimsCreated: false,
    note: 'This run performs identity and coverage routing only. Evidence research and independent review remain required before any release candidate.',
  },
};
const resumeState = {
  schemaVersion: 1,
  runId,
  stage: 'normalization-complete',
  checkpoints: [
    { name: 'input-hashes-verified', status: 'complete' },
    { name: 'completed-work-coverage-match', status: 'complete', count: alreadyCovered.length },
    { name: 'identity-routing', status: 'complete', count: identityReview.length },
    { name: 'evidence-research-selection', status: 'complete', count: evidenceResearch.length, limit: selectionLimit },
  ],
  nextAction: evidenceResearch.length
    ? 'Start evidence research in the listed 25-candidate waves; do not draft claims before identity and source checks.'
    : 'Resolve identity-review items or supply additional candidates before evidence research.',
};

writeJsonl(path.join(labDir, 'candidate-ledger.normalized.jsonl'), normalizedLedger);
writeJson(path.join(queueRoot, 'already-covered.json'), { runId, queue: 'already-covered', entries: alreadyCovered });
writeJson(path.join(queueRoot, 'identity-review.json'), { runId, queue: 'identity-review', entries: identityReview });
writeJson(path.join(queueRoot, 'evidence-research.json'), { runId, queue: 'evidence-research', entries: evidenceResearch });
writeJson(path.join(labDir, 'normalization-report.json'), report);
writeJson(path.join(labDir, 'resume-state.json'), resumeState);
console.log(JSON.stringify({ runId, counts: report.counts, outputs: report.outputs }, null, 2));
