#!/usr/bin/env node
/**
 * merge-company-issues.js
 *
 * Two operations in one pass:
 *   1. Replace the `issues: [...]` array for each company in COMPANY_DB with
 *      the reanalyzed versions from src/data/company_reanalysis/final_batch_NN.js
 *   2. Insert the 35 new company entries from src/data/companies_new_entries.js
 *      before the closing `};` of COMPANY_DB
 *
 * Run AFTER reviewing the final_batch_NN.js files:
 *   node scripts/merge-company-issues.js
 *
 * Safe to run multiple times — replacements are idempotent if issues haven't
 * changed, but the new-company insertion will double-insert on re-runs, so
 * only run once (or check companies.js first).
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const COMPANIES_FILE    = path.resolve(__dirname, '..', 'src', 'data', 'companies.js');
const REANALYSIS_DIR    = path.resolve(__dirname, '..', 'src', 'data', 'company_reanalysis');
const NEW_ENTRIES_FILE  = path.resolve(__dirname, '..', 'src', 'data', 'companies_new_entries.js');

// ── 1. Load all reanalyzed issues from final_batch_NN.js files ───────────────
const allNewIssues = {};

const batchFiles = fs.readdirSync(REANALYSIS_DIR)
  .filter(f => f.startsWith('final_batch_') && f.endsWith('.js'))
  .sort();

if (batchFiles.length === 0) {
  console.error('ERROR: No final_batch_*.js files found in', REANALYSIS_DIR);
  console.error('Run the reanalysis workflow first and review its output.');
  process.exit(1);
}

console.log(`Loading ${batchFiles.length} final batch files...`);
for (const batchFile of batchFiles) {
  const batchPath = path.join(REANALYSIS_DIR, batchFile);
  try {
    const batchData = require(batchPath);
    const ids = Object.keys(batchData);
    console.log(`  ${batchFile}: ${ids.length} companies`);
    Object.assign(allNewIssues, batchData);
  } catch (e) {
    console.error(`  ERROR loading ${batchFile}: ${e.message}`);
    console.error('  Fix this file before running the merge.');
    process.exit(1);
  }
}

const totalCompanies = Object.keys(allNewIssues).length;
console.log(`Total companies with reanalyzed issues: ${totalCompanies}\n`);

// ── 2. Parse companies.js into lines ─────────────────────────────────────────
let lines = fs.readFileSync(COMPANIES_FILE, 'utf8').split('\n');
console.log(`companies.js: ${lines.length} lines`);

// ── Helper: find the issues: [...] range for a given company ID ──────────────
function findIssuesRange(lines, companyId) {
  // Find the company's top-level entry line
  let companyLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Matches:  'company-id': {
    if (trimmed === `'${companyId}': {` || trimmed === `'${companyId}':{`) {
      companyLineIdx = i;
      break;
    }
  }
  if (companyLineIdx === -1) return null;

  // Find `issues: [` within the next 80 lines of this company block
  let issuesStartIdx = -1;
  const searchLimit = Math.min(companyLineIdx + 80, lines.length);
  for (let i = companyLineIdx; i < searchLimit; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('issues:') && trimmed.includes('[')) {
      issuesStartIdx = i;
      break;
    }
  }
  if (issuesStartIdx === -1) return null;

  // Count [ / ] to find the closing ],
  let depth = 0;
  let issuesEndIdx = -1;
  for (let i = issuesStartIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '[') depth++;
      if (ch === ']') {
        depth--;
        if (depth === 0) {
          issuesEndIdx = i;
          break;
        }
      }
    }
    if (issuesEndIdx !== -1) break;
  }
  if (issuesEndIdx === -1) return null;

  return { companyLineIdx, issuesStartIdx, issuesEndIdx };
}

// ── Helper: build replacement lines for an issues array ─────────────────────
function escape(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ');      // flatten any embedded newlines
}

function buildIssuesLines(issues, baseIndent) {
  const i = baseIndent;
  const out = [`${i}issues: [`];
  for (const iss of issues) {
    out.push(`${i}  {`);
    out.push(`${i}    id: '${escape(iss.id)}',`);
    out.push(`${i}    title: '${escape(iss.title)}',`);
    out.push(`${i}    severity: '${escape(iss.severity)}',`);
    out.push(`${i}    description:`);
    out.push(`${i}      '${escape(iss.description)}',`);
    out.push(`${i}    source: '${escape(iss.source)}',`);
    out.push(`${i}  },`);
  }
  out.push(`${i}],`);
  return out;
}

// ── 3. Collect all replacement targets first, then apply bottom-up ────────────
// Processing bottom-up means earlier line indices are never shifted by a
// prior replacement.
console.log('\nScanning for company entries...');
const replacements = [];
const notFound = [];

for (const [companyId, newIssues] of Object.entries(allNewIssues)) {
  const range = findIssuesRange(lines, companyId);
  if (!range) {
    notFound.push(companyId);
    continue;
  }
  replacements.push({ companyId, newIssues, ...range });
}

if (notFound.length > 0) {
  console.warn(`\nWARN: ${notFound.length} company IDs not found in companies.js — skipped:`);
  notFound.forEach(id => console.warn(`  - ${id}`));
}

// Sort descending by issuesStartIdx so we can splice without shifting
replacements.sort((a, b) => b.issuesStartIdx - a.issuesStartIdx);

console.log(`Replacing issues arrays for ${replacements.length} companies...`);
for (const { companyId, newIssues, issuesStartIdx, issuesEndIdx } of replacements) {
  // Detect indentation from the existing `issues:` line
  const baseIndent = (lines[issuesStartIdx].match(/^(\s+)/) || ['', '    '])[1];
  const newIssuesLines = buildIssuesLines(newIssues, baseIndent);

  // Splice in place: bottom-up means earlier entries are unaffected
  lines.splice(issuesStartIdx, issuesEndIdx - issuesStartIdx + 1, ...newIssuesLines);
}
console.log(`  Done — ${replacements.length} issues arrays replaced.`);

// ── 4. Insert 35 new companies before closing `};` of COMPANY_DB ─────────────
console.log('\nInserting 35 new company entries...');

// Read companies_new_entries.js and strip the comment/instruction header
const rawNewEntries = fs.readFileSync(NEW_ENTRIES_FILE, 'utf8').split('\n');
const firstEntryIdx = rawNewEntries.findIndex(l => /^\s*'[a-z]/.test(l));
if (firstEntryIdx === -1) {
  console.error('ERROR: Could not find first entry in companies_new_entries.js');
  process.exit(1);
}
const newEntryLines = rawNewEntries.slice(firstEntryIdx);
// Drop any trailing blank lines so the insertion is clean
while (newEntryLines.length > 0 && newEntryLines[newEntryLines.length - 1].trim() === '') {
  newEntryLines.pop();
}

// Find the closing `};` of COMPANY_DB (scan backwards — it's the first `};`
// from the end before BRAND_PARENT_MAP which starts with `export const`)
let companyDbClose = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '};') {
    companyDbClose = i;
    break;
  }
}
if (companyDbClose === -1) {
  console.error('ERROR: Could not find closing `};` of COMPANY_DB');
  process.exit(1);
}

console.log(`  Inserting ${newEntryLines.length} lines before line ${companyDbClose + 1} (closing of COMPANY_DB)`);

lines.splice(
  companyDbClose,
  0,
  '',
  '  // ── Independent & Emerging Brands (added 2026-06) ──',
  ...newEntryLines,
  ''
);

// ── 5. Write back ─────────────────────────────────────────────────────────────
fs.writeFileSync(COMPANIES_FILE, lines.join('\n'), 'utf8');

console.log('\n✓ companies.js updated:');
console.log(`    ${replacements.length} issues arrays replaced`);
console.log(`    35 new companies inserted`);
console.log(`    ${lines.length} total lines`);
console.log('\nNext: review the diff, then commit.');
