#!/usr/bin/env node

/**
 * Phase 2 of the ingredient-parsing overhaul — REVIEW GATE (read-only).
 *
 * Re-normalizes every MANUAL_PRODUCTS product's ingredients text with the
 * Phase 1 normalizer (src/utils/ingredientNormalizer.js) and re-scores both
 * the old (as-shipped) and new ingredient lists with the exact scorer bundle
 * the offline SQLite build uses (scripts/catalog-database/build-products-sqlite.js's
 * loadScorer()), then writes a before/after drift report.
 *
 * Does NOT write src/data/products.js or assets/db/products.db. Does NOT
 * commit. Output: scripts/catalog-database/phase2-ingredient-drift-<date>.md
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');
const REPORT_PATH = path.join(__dirname, 'phase2-ingredient-drift-2026-08-23.md');

const {
  normalizeIngredientTokens,
  detectBioengineered,
  ADVISORY_PATTERNS,
} = require(path.join(ROOT, 'src', 'utils', 'ingredientNormalizer.js'));

function readSource(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// ─── Loaders copied verbatim (behavior-identical) from build-products-sqlite.js ──

function objectLiteralAfter(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Marker not found: ${marker}`);

  const start = source.indexOf('{', markerIndex);
  if (start < 0) throw new Error(`Object start not found after: ${marker}`);

  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n' || ch === '\r') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  throw new Error(`Object end not found after: ${marker}`);
}

function evalObjectLiteral(literal, label) {
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    filename: label,
    timeout: 30000,
  });
}

function loadManualProducts() {
  const source = readSource('src/data/products.js');
  const literal = objectLiteralAfter(source, 'const MANUAL_PRODUCTS =');
  return evalObjectLiteral(literal, 'MANUAL_PRODUCTS');
}

function loadCompanies() {
  const source = readSource('src/data/companies.js');
  const literal = objectLiteralAfter(source, 'export const COMPANY_DB =');
  return evalObjectLiteral(literal, 'COMPANY_DB');
}

function transformExports(source) {
  return source
    .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}

function stripModuleExports(source) {
  return source.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, '');
}

function loadScorer(companies) {
  const bundle = [
    transformExports(readSource('src/data/ingredientCache.js')),
    transformExports(readSource('src/data/ingredients.js')),
    stripModuleExports(readSource('src/utils/ingredientNormalizer.js')),
    transformExports(readSource('src/utils/sourcingMatch.js')),
    transformExports(readSource('src/utils/scorer.js')),
    '\nmodule.exports = { scoreProduct, scoreToGrade };',
  ].join('\n\n');

  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    COMPANY_DB: companies,
  };

  vm.runInNewContext(bundle, sandbox, {
    filename: 'scorer-bundle.js',
    timeout: 30000,
  });

  if (typeof sandbox.module.exports.scoreProduct !== 'function') {
    throw new Error('scoreProduct was not exported from scorer bundle');
  }
  return sandbox.module.exports;
}

// ─── Drift analysis helpers ───────────────────────────────────────────────

function normForCompare(token) {
  return String(token || '')
    .trim()
    .toLowerCase()
    .replace(/["""]/g, '')
    .replace(/\.$/, '')
    .trim();
}

const STOPWORDS = new Set(['and', 'or', 'the', 'a', 'an', 'of', 'with', 'less', 'than']);

function significantWords(token) {
  return String(token || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

// Is a removed OLD token "explained" by the normalizer's known, intentional
// behaviors (advisory filter, lead-in/editorial trim, bioengineered
// disclosure, paren-flatten decomposition into new tokens)? If not, and the
// token looks like it could be a real ingredient name, it's a candidate for
// the "looks WRONG / needs human review" section.
function classifyRemoval(oldToken, newIngredientsSet, rawBioengineered) {
  const t = String(oldToken || '');

  if (ADVISORY_PATTERNS.some((re) => re.test(t))) {
    return { explained: true, reason: 'advisory-pattern' };
  }
  if (/bioengineered|produced with genetic engineering/i.test(t)) {
    return { explained: true, reason: 'bioengineered-disclosure' };
  }
  if (/less than\s+\d/i.test(t) || /\d+%\s*(or less)?\s*of/i.test(t)) {
    return { explained: true, reason: 'lead-in-phrase' };
  }

  // Word-overlap check: did the meaningful words of this token resurface in
  // ANY new token (paren-flatten / editorial-tail decomposition)?
  const oldWords = significantWords(t);
  if (oldWords.length === 0) {
    return { explained: true, reason: 'no-significant-words' };
  }
  const newWordsUnion = new Set();
  for (const nt of newIngredientsSet) {
    for (const w of significantWords(nt)) newWordsUnion.add(w);
  }
  const overlap = oldWords.filter((w) => newWordsUnion.has(w));
  const overlapRatio = overlap.length / oldWords.length;
  if (overlapRatio >= 0.5) {
    return { explained: true, reason: 'word-overlap-decomposed' };
  }

  // Not explained — flag it, unless it's obviously not a real ingredient
  // name to begin with (no vowel, all-numeric, single very short word).
  const hasVowel = /[aeiouy]/i.test(t);
  if (!hasVowel) {
    return { explained: true, reason: 'no-vowel-likely-noise' };
  }

  return { explained: false, reason: 'unexplained-loss' };
}

function fmtList(arr) {
  return arr.length ? arr.join(', ') : '(none)';
}

function main() {
  console.log('Loading MANUAL_PRODUCTS and COMPANY_DB...');
  const manualProducts = loadManualProducts();
  const companies = loadCompanies();
  console.log(`Loaded ${Object.keys(manualProducts).length} manual products, ${Object.keys(companies).length} companies.`);

  console.log('Loading scorer bundle...');
  const { scoreProduct } = loadScorer(companies);
  console.log('Scorer loaded.');

  const total = Object.keys(manualProducts).length;
  let processed = 0;
  let errored = 0;

  const errors = [];
  const ingredientChanges = []; // { barcode, name, brand, oldIngredients, newIngredients, added, removed }
  const scoreMovers = []; // { barcode, name, brand, oldScore, newScore, delta, addedSummary, removedSummary }
  const bioNewlyFlagged = [];
  const bioRemovedDisclosure = []; // { barcode, name, removedTokens }
  const minorRecovered = []; // { barcode, name, recoveredTokens }
  const wrongCandidates = []; // { barcode, name, unexplainedRemoved, oldIngredients, newIngredients }

  let scoreDeltaUp = 0;
  let scoreDeltaDown = 0;
  const bucket1_2 = { up: 0, down: 0 };
  const bucket3_5 = { up: 0, down: 0 };
  const bucket6_10 = { up: 0, down: 0 };
  const bucketOver10 = { up: 0, down: 0 };

  for (const [barcode, product] of Object.entries(manualProducts)) {
    processed += 1;
    try {
      const oldIngredients = Array.isArray(product.ingredients) ? product.ingredients : [];
      const rawText = oldIngredients.join(', ');
      const newIngredients = normalizeIngredientTokens(rawText);
      const bio = detectBioengineered(rawText);

      let oldResult = null;
      let newResult = null;
      try {
        oldResult = scoreProduct(product);
      } catch (e) {
        throw new Error(`old score failed: ${e.message}`);
      }
      try {
        newResult = scoreProduct({ ...product, ingredients: newIngredients });
      } catch (e) {
        throw new Error(`new score failed: ${e.message}`);
      }

      const oldScore = Number.isFinite(oldResult?.score) ? oldResult.score : null;
      const newScore = Number.isFinite(newResult?.score) ? newResult.score : null;

      // ── Ingredient diff (exact-string, normalized for casing/whitespace only) ──
      const oldSetRaw = oldIngredients.map(normForCompare);
      const oldSet = new Set(oldSetRaw);
      const newSet = new Set(newIngredients);

      const removed = [...oldSet].filter((t) => !newSet.has(t));
      const added = [...newSet].filter((t) => !oldSet.has(t));
      const hasIngredientChange = removed.length > 0 || added.length > 0;

      const name = product.name || '(unnamed)';
      const brand = product.brand || '';

      if (hasIngredientChange) {
        ingredientChanges.push({ barcode, name, brand, oldIngredients, newIngredients, added, removed });
      }

      if (bio) {
        bioNewlyFlagged.push({ barcode, name, brand });
      }

      const removedBioTokens = removed.filter((t) => /bioengineered|produced with genetic engineering/i.test(t));
      if (removedBioTokens.length > 0) {
        bioRemovedDisclosure.push({ barcode, name, brand, removedTokens: removedBioTokens, oldIngredients, newIngredients });
      }

      // Recovered minor ingredients: raw text carried a "less than X%" style
      // clause AND at least one added token is not itself an advisory/lead-in
      // remnant (i.e. a real ingredient name resurfaced from inside that
      // clause, like canola oil out of a rice's "less than 2%" disclosure).
      if (/less than\s+\d+(\.\d+)?%/i.test(rawText) || /\d+(\.\d+)?%\s*(or less)?\s*of/i.test(rawText)) {
        const recoveredTokens = added.filter(
          (t) => !ADVISORY_PATTERNS.some((re) => re.test(t)) && !/^less than/i.test(t)
        );
        if (recoveredTokens.length > 0) {
          minorRecovered.push({ barcode, name, brand, recoveredTokens, oldIngredients, newIngredients });
        }
      }

      // "Looks WRONG" candidates — removed tokens not explained by any known
      // intentional normalizer behavior.
      const unexplainedRemoved = [];
      for (const rtoken of removed) {
        const verdict = classifyRemoval(rtoken, newSet, bio);
        if (!verdict.explained) unexplainedRemoved.push(rtoken);
      }
      if (unexplainedRemoved.length > 0) {
        wrongCandidates.push({ barcode, name, brand, unexplainedRemoved, oldIngredients, newIngredients, removed, added });
      }

      if (oldScore != null && newScore != null && oldScore !== newScore) {
        const delta = newScore - oldScore;
        scoreMovers.push({
          barcode, name, brand, oldScore, newScore, delta,
          addedSummary: added.slice(0, 5),
          removedSummary: removed.slice(0, 5),
        });
        const abs = Math.abs(delta);
        const dir = delta > 0 ? 'up' : 'down';
        if (delta > 0) scoreDeltaUp += 1; else scoreDeltaDown += 1;
        if (abs <= 2) bucket1_2[dir] += 1;
        else if (abs <= 5) bucket3_5[dir] += 1;
        else if (abs <= 10) bucket6_10[dir] += 1;
        else bucketOver10[dir] += 1;
      }
    } catch (e) {
      errored += 1;
      errors.push({ barcode, name: product?.name || '(unknown)', message: e.message });
    }

    if (processed % 2000 === 0) {
      console.log(`Processed ${processed}/${total}...`);
    }
  }

  console.log(`Done. Processed ${processed}, errored ${errored}.`);
  console.log(`Ingredient changes: ${ingredientChanges.length}. Score changes: ${scoreMovers.length}.`);
  console.log(`Bioengineered flagged: ${bioNewlyFlagged.length}. Disclosure-removed: ${bioRemovedDisclosure.length}. Minor-recovered: ${minorRecovered.length}. Wrong-candidates: ${wrongCandidates.length}.`);

  // ── Build report ──
  scoreMovers.sort((a, b) => b.delta - a.delta);
  const topUp = scoreMovers.filter((m) => m.delta > 0).slice(0, 20);
  const topDown = scoreMovers.slice().sort((a, b) => a.delta - b.delta).slice(0, 20);

  const lines = [];
  lines.push('# Phase 2 Ingredient Re-Normalization — Before/After Drift Report');
  lines.push('');
  lines.push(`Generated: 2026-08-23. Read-only analysis — src/data/products.js and assets/db/products.db were NOT modified. No commit was made.`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total products in MANUAL_PRODUCTS: ${total}`);
  lines.push(`- Products processed successfully: ${processed - errored}`);
  lines.push(`- Products that errored during scoring/normalizing (skipped, logged below): ${errored}`);
  lines.push(`- Products with an ingredient list change (added and/or removed tokens): ${ingredientChanges.length}`);
  lines.push(`- Products with a score change: ${scoreMovers.length} (up: ${scoreDeltaUp}, down: ${scoreDeltaDown})`);
  lines.push(`- Products carrying a bioengineered disclosure per the raw label text (detectBioengineered === true): ${bioNewlyFlagged.length}`);
  lines.push(`- Products where the bioengineered disclosure sentence was REMOVED from the visible ingredient list: ${bioRemovedDisclosure.length}`);
  lines.push(`- Products where a "less than X%" minor ingredient was RECOVERED: ${minorRecovered.length}`);
  lines.push(`- Products flagged for human review (unexplained ingredient loss): ${wrongCandidates.length}`);
  lines.push('');
  lines.push('### Score-delta distribution (|old score - new score|)');
  lines.push('');
  lines.push('| Bucket | Moved up | Moved down |');
  lines.push('|---|---|---|');
  lines.push(`| 1-2 points | ${bucket1_2.up} | ${bucket1_2.down} |`);
  lines.push(`| 3-5 points | ${bucket3_5.up} | ${bucket3_5.down} |`);
  lines.push(`| 6-10 points | ${bucket6_10.up} | ${bucket6_10.down} |`);
  lines.push(`| >10 points | ${bucketOver10.up} | ${bucketOver10.down} |`);
  lines.push('');

  if (errors.length > 0) {
    lines.push('### Processing errors (skipped, not counted in drift)');
    lines.push('');
    for (const e of errors.slice(0, 50)) {
      lines.push(`- \`${e.barcode}\` ${e.name}: ${e.message}`);
    }
    if (errors.length > 50) lines.push(`- ...and ${errors.length - 50} more.`);
    lines.push('');
  }

  lines.push('## Top 20 score movers UP');
  lines.push('');
  for (const m of topUp) {
    lines.push(`- **${m.name}**${m.brand ? ` (${m.brand})` : ''} \`${m.barcode}\`: ${m.oldScore} -> ${m.newScore} (+${m.delta}). Added: ${fmtList(m.addedSummary)}. Removed: ${fmtList(m.removedSummary)}.`);
  }
  lines.push('');

  lines.push('## Top 20 score movers DOWN');
  lines.push('');
  for (const m of topDown) {
    lines.push(`- **${m.name}**${m.brand ? ` (${m.brand})` : ''} \`${m.barcode}\`: ${m.oldScore} -> ${m.newScore} (${m.delta}). Added: ${fmtList(m.addedSummary)}. Removed: ${fmtList(m.removedSummary)}.`);
  }
  lines.push('');

  lines.push('## Bioengineered disclosure removed from the ingredient list');
  lines.push('');
  lines.push('These products had a USDA bioengineered-food disclosure sentence (e.g. "and bioengineered food ingredient", "produced with genetic engineering") sitting in the `ingredients` array as a fake ingredient row. The re-normalized list drops it as label text, not an ingredient (detectBioengineered() still separately reports it as `true` for a future UI badge — see the flag count above).');
  lines.push('');
  for (const b of bioRemovedDisclosure) {
    lines.push(`- **${b.name}**${b.brand ? ` (${b.brand})` : ''} \`${b.barcode}\``);
    lines.push(`  - Before: ${fmtList(b.oldIngredients)}`);
    lines.push(`  - After: ${fmtList(b.newIngredients)}`);
  }
  if (bioRemovedDisclosure.length === 0) lines.push('(none)');
  lines.push('');

  lines.push('## Minor ingredients RECOVERED from a "less than X%" clause');
  lines.push('');
  lines.push('These products had a real minor ingredient (e.g. canola oil) buried inside a "less than 2%" disclosure clause that the old normalizer dropped whole. The new normalizer strips only the lead-in phrase and keeps the ingredient.');
  lines.push('');
  for (const r of minorRecovered) {
    lines.push(`- **${r.name}**${r.brand ? ` (${r.brand})` : ''} \`${r.barcode}\`: recovered ${fmtList(r.recoveredTokens)}`);
    lines.push(`  - Before: ${fmtList(r.oldIngredients)}`);
    lines.push(`  - After: ${fmtList(r.newIngredients)}`);
  }
  if (minorRecovered.length === 0) lines.push('(none)');
  lines.push('');

  lines.push('## FLAGGED FOR HUMAN REVIEW — possible real ingredient loss');
  lines.push('');
  lines.push('For each removed old token below, no known intentional normalizer behavior (advisory-phrase match, bioengineered-disclosure match, lead-in-phrase strip, or word-overlap into a decomposed new token) explains its disappearance, and the token itself looks plausibly like a real ingredient name (contains a vowel). This is a heuristic, not certainty — read each one before trusting the new parse over the old.');
  lines.push('');
  if (wrongCandidates.length === 0) {
    lines.push('None found. Every removed token across the whole catalog was explained by an advisory pattern, a bioengineered-disclosure match, a "less than X%" lead-in strip, or reappeared (by word overlap) inside a decomposed new token.');
  } else {
    for (const w of wrongCandidates) {
      lines.push(`- **${w.name}**${w.brand ? ` (${w.brand})` : ''} \`${w.barcode}\``);
      lines.push(`  - Unexplained removed token(s): ${fmtList(w.unexplainedRemoved)}`);
      lines.push(`  - Before: ${fmtList(w.oldIngredients)}`);
      lines.push(`  - After: ${fmtList(w.newIngredients)}`);
    }
  }
  lines.push('');

  lines.push(`## All products with an ingredient-list change (${ingredientChanges.length} total)`);
  lines.push('');
  lines.push('Full list, added/removed tokens only (not full before/after) to keep this section scannable.');
  lines.push('');
  for (const c of ingredientChanges) {
    lines.push(`- **${c.name}**${c.brand ? ` (${c.brand})` : ''} \`${c.barcode}\` — added: ${fmtList(c.added)} | removed: ${fmtList(c.removed)}`);
  }
  lines.push('');

  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(`Report written to ${REPORT_PATH}`);

  return {
    total,
    processed,
    errored,
    ingredientChangeCount: ingredientChanges.length,
    scoreChangeCount: scoreMovers.length,
    scoreDeltaUp,
    scoreDeltaDown,
    bioFlaggedCount: bioNewlyFlagged.length,
    bioRemovedCount: bioRemovedDisclosure.length,
    minorRecoveredCount: minorRecovered.length,
    wrongCandidateCount: wrongCandidates.length,
  };
}

try {
  const summary = main();
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  console.error(`FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
}
