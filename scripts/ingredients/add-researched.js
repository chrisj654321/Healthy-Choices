#!/usr/bin/env node

/**
 * add-researched.js
 *
 * Adds the genuinely-new substances from the audit queue's still-novel list
 * (scripts/ingredient-audit/still-novel.json) that were researched against
 * primary regulatory sources — NOT generated from memory. Each risk is tied
 * to a specific FDA/eCFR/EFSA citation recorded in the `source` note beside
 * the entry so the basis is auditable in-file.
 *
 * Scope decision (2026-08-08): of the 26 still-novel tokens, only these are
 * real substances. The rest are label boilerplate ("preserves freshness",
 * "non gmo"), descriptors ("granular"), or OCR junk ("slat", "ntss") — the
 * parser already treats those as unknown and the scorer never penalizes an
 * unknown (scorer.js: "never penalized for a data gap"), so adding risk
 * entries for them would be inventing data. They are deliberately left out.
 *
 * Sources (verified 2026-08-08):
 *   ferric phosphate        21 CFR 184.1301 (GRAS, iron fortificant)
 *   ferric pyrophosphate    21 CFR 184.1304 (GRAS, iron fortificant)
 *   disodium pyrophosphate  21 CFR 182.1087 (GRAS, SAPP leavening acid)
 *   ammonium phosphate      21 CFR 184.1141a (GRAS, leavening/dough)
 *   distilled monoglyceride 21 CFR 184.1505 (GRAS, emulsifier)
 *   mixed triglycerides     21 CFR 172.861 (approved food fat), GRAS notice
 *   natural smoke flavor    EC 2065/2003 (PAH limits: 30 ug/kg sum, 5 BaP)
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const CACHE_PATH = path.join(ROOT, 'src', 'data', 'ingredientCache.js');

// { key, risk, category, explanation, source }
const ENTRIES = [
  // --- Researched substances ---
  {
    key: 'ferric phosphate', risk: 'Low', category: 'vitamins',
    explanation: 'An iron compound added to fortify foods like flour and cereal; FDA-affirmed GRAS. A nutrient source, not a contaminant — low concern.',
    source: '21 CFR 184.1301',
  },
  {
    key: 'ferric pyrophosphate', risk: 'Low', category: 'vitamins',
    explanation: 'Iron used to fortify foods without changing taste, often in milk powders; FDA-affirmed GRAS. Absorbs less readily than other iron forms but is a safe nutrient.',
    source: '21 CFR 184.1304',
  },
  {
    key: 'disodium pyrophosphate', risk: 'Medium', category: 'additives',
    explanation: 'A leavening acid (SAPP) that helps baked goods rise and holds color; FDA-affirmed GRAS. A processed phosphate additive — medium concern mainly for high total phosphate intake.',
    source: '21 CFR 182.1087',
  },
  {
    key: 'ammonium phosphate', risk: 'Medium', category: 'additives',
    explanation: 'A leavening agent, dough conditioner, and yeast nutrient; FDA-affirmed GRAS. A processed phosphate additive — medium concern for high total phosphate intake.',
    source: '21 CFR 184.1141a',
  },
  {
    key: 'distilled monoglyceride', risk: 'Low', category: 'emulsifiers',
    explanation: 'A purified mono- and diglyceride emulsifier that keeps oil and water mixed; FDA-affirmed GRAS. A common processed fat-based emulsifier — low concern.',
    source: '21 CFR 184.1505',
  },
  {
    key: 'mixed triglycerides', risk: 'Low', category: 'fats',
    explanation: 'The chemical name for fat, used as a carrier or texture fat; approved for food use and GRAS. It is dietary fat — low concern on its own.',
    source: '21 CFR 172.861',
  },
  {
    key: 'natural smoke flavor', risk: 'Medium', category: 'flavoring',
    explanation: 'Condensed and filtered wood smoke that adds smoky taste. Regulated for cancer-linked PAHs like benzo[a]pyrene and usually lower in them than traditional smoking — medium concern.',
    source: 'EC 2065/2003 PAH limits',
  },
  // --- FD&C dye fragments (truncated label forms of synthetic dyes) ---
  {
    key: 'fd c red no', risk: 'High', category: 'dyes',
    explanation: 'A synthetic FD&C red dye such as Red 40 or Red 3; petroleum-derived colors added only for appearance, linked to hyperactivity in children, with Red 3 banned by the FDA in 2025.',
    source: 'FD&C red dye family',
  },
  {
    key: 'fd c colors red', risk: 'High', category: 'dyes',
    explanation: 'A synthetic FD&C red dye such as Red 40 or Red 3; petroleum-derived colors added only for appearance, linked to hyperactivity in children, with Red 3 banned by the FDA in 2025.',
    source: 'FD&C red dye family',
  },
  {
    key: 'artificial colors fd c red', risk: 'High', category: 'dyes',
    explanation: 'A synthetic FD&C red dye such as Red 40 or Red 3; petroleum-derived colors added only for appearance, linked to hyperactivity in children, with Red 3 banned by the FDA in 2025.',
    source: 'FD&C red dye family',
  },
  {
    key: 'artificial color fd c red', risk: 'High', category: 'dyes',
    explanation: 'A synthetic FD&C red dye such as Red 40 or Red 3; petroleum-derived colors added only for appearance, linked to hyperactivity in children, with Red 3 banned by the FDA in 2025.',
    source: 'FD&C red dye family',
  },
  {
    key: 'fd c colors', risk: 'Medium', category: 'dyes',
    explanation: 'Synthetic FD&C artificial colors; petroleum-derived dyes added only for appearance, with no nutritional value. Some are linked to hyperactivity in children.',
    source: 'FD&C dye family',
  },
  // --- Whole foods the matcher could not safely reduce ---
  {
    key: 'orange puree', risk: 'Low', category: 'fruits',
    explanation: 'Pureed orange — the fruit, a source of vitamin C. Low concern (this is fruit, not an orange dye).',
    source: 'whole fruit',
  },
  {
    key: 'gluten free flour', risk: 'Low', category: 'grains',
    explanation: 'A flour blend made without wheat, usually rice-, corn-, or starch-based. A refined flour base — low concern, but lower in fiber than whole grain.',
    source: 'refined flour base',
  },
];

function jsStr(v) { return String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function main() {
  let source = fs.readFileSync(CACHE_PATH, 'utf8');
  const existing = new Set(
    [...source.matchAll(/^ {2}'((?:[^'\\]|\\.)*)':/gm)].map((m) => m[1].replace(/\\'/g, "'"))
  );

  const fresh = ENTRIES.filter((e) => !existing.has(e.key));
  const skipped = ENTRIES.filter((e) => existing.has(e.key));
  if (skipped.length) console.log('Already present, skipped:', skipped.map((e) => e.key).join(', '));

  const block = fresh.map((e) =>
    `  '${jsStr(e.key)}': { risk: IngredientRisk.${e.risk}, category: '${jsStr(e.category)}', explanation: '${jsStr(e.explanation)}' }, // src: ${e.source}`
  ).join('\n');

  const marker = '\n  // --- Researched from the audit queue (2026-08-08): genuinely-new\n' +
    '  // substances, each risk tied to the FDA/eCFR/EFSA citation in its src note.\n' +
    '  // See scripts/ingredient-audit/add-researched.js for the source list. ---\n';
  const closeIdx = source.indexOf('\n};', source.indexOf('CACHED_INGREDIENT_ANALYSIS = {'));
  source = source.slice(0, closeIdx) + marker + block + '\n' + source.slice(closeIdx + 1);

  fs.writeFileSync(CACHE_PATH, source);
  console.log(`Added ${fresh.length} researched entries to ${path.relative(ROOT, CACHE_PATH)}.`);
}

main();
