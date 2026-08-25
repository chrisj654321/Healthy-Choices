#!/usr/bin/env node

/**
 * Phase 2a of the ingredient-parsing overhaul — APPLY the SAFE re-parses to
 * src/data/products.js.
 *
 * This re-derives the SAME SAFE/NEEDS-RE-FETCH split that
 * scripts/catalog-database/phase2-classify.js computed (the classifier logic
 * below is copied verbatim from that script so the two runs can never
 * disagree), then cross-checks the recomputed SAFE barcode set against the
 * committed phase2-safe-list.md / phase2-refetch-list.md as an extra guard.
 * If the sets do not match exactly, the script ABORTS before writing
 * anything.
 *
 * For every SAFE product whose re-normalized ingredients differ from what is
 * currently stored, this does a TARGETED in-place text replacement of just
 * that product's `ingredients: [...]` array inside the src/data/products.js
 * SOURCE TEXT (found by its unique barcode object key) — it does not
 * re-serialize the file. The 64 NEEDS-RE-FETCH products are never touched.
 *
 * Modes:
 *   node scripts/catalog-database/phase2-apply-safe.js            (dry-run, default)
 *   node scripts/catalog-database/phase2-apply-safe.js --apply     (writes the file)
 *
 * Does NOT rebuild products.db and does NOT commit — run
 * build-products-sqlite.js separately after --apply.
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');
const PRODUCTS_PATH = path.join(ROOT, 'src', 'data', 'products.js');
const SAFE_LIST_PATH = path.join(__dirname, 'phase2-safe-list.md');
const REFETCH_LIST_PATH = path.join(__dirname, 'phase2-refetch-list.md');
const APPLY_REPORT_PATH = path.join(__dirname, 'phase2-apply-report.md');

const APPLY = process.argv.includes('--apply');

const {
  normalizeIngredientTokens,
  isLabelBoilerplate,
} = require(path.join(ROOT, 'src', 'utils', 'ingredientNormalizer.js'));

function readSource(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// ─── Loaders copied verbatim (behavior-identical) from phase2-classify.js /
// build-products-sqlite.js ──────────────────────────────────────────────

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

function loadManualProducts(source) {
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
    '\nmodule.exports = { scoreProduct, scoreToGrade, lookupIngredient, getKnownKeysSet };',
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

// ─── Garbage-token classifier — copied verbatim from phase2-classify.js so
// the SAFE/NEEDS-RE-FETCH split can never drift between the two scripts. ──

const NUTRITION_VOCAB_PATTERNS = [
  /\bnutrition\s*facts?\b/i,
  /\bsupplement\s*facts?\b/i,
  /\bcalories?\b.{0,20}?\d/i,
  /\d.{0,10}?\bcalories?\b/i,
  /\bsaturated\s+fat\b/i,
  /\btrans\s+fat\b/i,
  /\btotal\s+fat\b.{0,10}?\d/i,
  /\bsodium\b.{0,12}?\d/i,
  /\bcholesterol\b.{0,12}?\d/i,
  /\bdietary\s+fiber\b/i,
  /\btotal\s+carb(ohydrate)?/i,
  /\btotal\s+sugars?\b/i,
  /\badded\s+sugars?\b/i,
  /%\s*dv\b/i,
  /\bdaily\s+values?\b/i,
  /\bserving\s+size\b/i,
  /\bservings?\s+per\s+(container|package)\b/i,
  /\b\d+(\.\d+)?\s*mg\b/i,
  /\b\d+(\.\d+)?\s*mcg\b/i,
  /\b\d+(\.\d+)?\s*%\s*(dv)?\b/,
];

function looksNumericHeavy(t) {
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 5) return false;
  const numericish = words.filter((w) => /^\d+(\.\d+)?%?$/.test(w));
  return numericish.length > 0 && numericish.length / words.length >= 0.34;
}

function looksLikeMangledOCR(t) {
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;
  const hasDigitInWord = words.some((w) => /[a-z]/i.test(w) && /\d/.test(w));
  const hasTrademarkGlyph = /[®™]/.test(t);
  const hasVowel = /[aeiouy]/i.test(t);
  const tooManyWords = words.length > 6;
  const singleLetterWordCount = words.filter((w) => w.length === 1).length;
  return hasDigitInWord || hasTrademarkGlyph || !hasVowel || tooManyWords || singleLetterWordCount >= 2;
}

function classifyToken(token, lookupIngredient) {
  const t = String(token || '');

  if (isLabelBoilerplate(t)) return { garbage: true, reason: 'label-boilerplate-or-contact' };
  if (NUTRITION_VOCAB_PATTERNS.some((re) => re.test(t))) return { garbage: true, reason: 'nutrition-vocab' };

  const hit = lookupIngredient(t);
  if (hit && !hit.weak) {
    return { garbage: false };
  }

  if (looksLikeMangledOCR(t)) return { garbage: true, reason: 'mangled-ocr' };
  if (looksNumericHeavy(t)) return { garbage: true, reason: 'numeric-heavy-fragment' };
  return { garbage: false };
}

function findGarbageTokens(tokens, lookupIngredient) {
  const hits = [];
  for (const tok of tokens) {
    const verdict = classifyToken(tok, lookupIngredient);
    if (verdict.garbage) hits.push({ token: tok, reason: verdict.reason });
  }
  return hits;
}

// ─── Cross-check against the committed classification lists ─────────────

function extractBarcodesFromList(mdText) {
  // Barcodes are rendered as `` `028400589864` `` in both list files.
  const matches = mdText.match(/`(\d{6,14})`/g) || [];
  return new Set(matches.map((m) => m.slice(1, -1)));
}

// ─── Balanced-bracket slicing, quote- and comment-aware (mirrors
// objectLiteralAfter's handling exactly, generalized to any open/close char
// pair). Comment-awareness matters: some hand-edited product blocks have
// trailing `//` review-note comments containing an apostrophe (e.g.
// `// verified: Kar's Nuts rebranded...`) — without skipping comments, that
// stray apostrophe would be misread as opening a string and desync the
// brace/bracket depth count for the rest of the file. A literal
// '{'/'}'/'['/']' inside a real quoted string (e.g. "Cheese [Milk,
// Enzymes]") is still skipped correctly via the quote-tracking below. ────

function sliceBalancedEnd(source, openIndex, openChar, closeChar) {
  if (source[openIndex] !== openChar) {
    throw new Error(`Expected '${openChar}' at index ${openIndex}, found '${source[openIndex]}'`);
  }
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n' || ch === '\r') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') { blockComment = false; i += 1; }
      continue;
    }
    if (quote) {
      if (ch === '\\') { i += 1; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i += 1; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i += 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === openChar) depth += 1;
    else if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Unbalanced '${openChar}'/'${closeChar}' starting at index ${openIndex} — no matching close found`);
}

function jsStringLiteral(str, preferredQuote) {
  const other = preferredQuote === '"' ? "'" : '"';
  const hasPreferred = str.includes(preferredQuote);
  const hasOther = str.includes(other);
  if (!hasPreferred) return `${preferredQuote}${str}${preferredQuote}`;
  if (!hasOther) return `${other}${str}${other}`;
  const escaped = str.split(preferredQuote).join(`\\${preferredQuote}`);
  return `${preferredQuote}${escaped}${preferredQuote}`;
}

function serializeIngredientsArray(tokens, propIndent, quoteChar, trailingComma) {
  if (!tokens || tokens.length === 0) return '[]';
  const itemIndent = `${propIndent}  `;
  const lines = tokens.map((t, i) => {
    const isLast = i === tokens.length - 1;
    const comma = (!isLast || trailingComma) ? ',' : '';
    return `${itemIndent}${jsStringLiteral(String(t), quoteChar)}${comma}`;
  });
  return `[\n${lines.join('\n')}\n${propIndent}]`;
}

// Locates, for one barcode, the exact [start, end) span in `source` of its
// `ingredients: [ ... ]` array (end is exclusive, i.e. one past the closing
// `]`), plus the indentation of the `ingredients:` property line and the
// existing array's quote style / trailing-comma style (the codebase has two
// hand-formatted styles in play — the original single-quote,
// trailing-comma style, and a newer double-quote, JSON-like,
// no-trailing-comma style used by at least one later batch — so both must
// be detected and mirrored per-product rather than assumed). Throws (never
// guesses) if the barcode key isn't found exactly once, or if the
// `ingredients:` property inside that product's block isn't found exactly
// once, or if the bracket immediately following it isn't found within a
// few characters (i.e. the file's shape doesn't match what this script
// assumes).
function findIngredientsSpan(source, barcode) {
  const keyPattern = new RegExp(`(['"])${barcode}\\1:\\s*\\{`, 'g');
  const keyMatches = [...source.matchAll(keyPattern)];
  if (keyMatches.length !== 1) {
    throw new Error(`Expected exactly 1 occurrence of key '${barcode}': { , found ${keyMatches.length}`);
  }
  const keyMatch = keyMatches[0];
  const braceOpenIndex = keyMatch.index + keyMatch[0].lastIndexOf('{');
  const braceCloseIndex = sliceBalancedEnd(source, braceOpenIndex, '{', '}');

  const blockText = source.slice(braceOpenIndex, braceCloseIndex + 1);
  const ingredientsKeyMatches = [...blockText.matchAll(/["']?ingredients["']?:/g)];
  if (ingredientsKeyMatches.length !== 1) {
    throw new Error(`Product ${barcode}: expected exactly 1 "ingredients:" key in its block, found ${ingredientsKeyMatches.length}`);
  }
  const ingredientsKeyIndexAbs = braceOpenIndex + ingredientsKeyMatches[0].index;
  const afterKeyIndex = ingredientsKeyIndexAbs + ingredientsKeyMatches[0][0].length;

  const between = source.slice(afterKeyIndex, afterKeyIndex + 5);
  const bracketOffsetInBetween = between.indexOf('[');
  if (bracketOffsetInBetween < 0) {
    throw new Error(`Product ${barcode}: no '[' found within 5 chars after "ingredients:" (got: ${JSON.stringify(between)})`);
  }
  const bracketOpenIndex = afterKeyIndex + bracketOffsetInBetween;
  const bracketCloseIndex = sliceBalancedEnd(source, bracketOpenIndex, '[', ']');

  const lineStart = source.lastIndexOf('\n', ingredientsKeyIndexAbs) + 1;
  const propIndent = source.slice(lineStart, ingredientsKeyIndexAbs);
  if (!/^[ \t]*$/.test(propIndent)) {
    throw new Error(`Product ${barcode}: unexpected non-whitespace before "ingredients:" on its line: ${JSON.stringify(propIndent)}`);
  }

  // Detect quote style and trailing-comma style from the EXISTING array
  // contents so the replacement mirrors this specific product's formatting.
  const existingArrayText = source.slice(bracketOpenIndex, bracketCloseIndex + 1);
  const firstQuoteMatch = existingArrayText.match(/["']/);
  const quoteChar = firstQuoteMatch ? firstQuoteMatch[0] : "'";
  const beforeCloseBracket = existingArrayText.slice(0, -1).replace(/\s+$/, '');
  const trailingComma = beforeCloseBracket.endsWith(',');

  return {
    start: bracketOpenIndex,
    end: bracketCloseIndex + 1,
    propIndent,
    quoteChar,
    trailingComma,
  };
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (will write products.js)' : 'DRY-RUN (no writes)'}`);

  const originalSource = readSource('src/data/products.js');
  const manualProducts = loadManualProducts(originalSource);
  const originalProductCount = Object.keys(manualProducts).length;
  console.log(`Loaded ${originalProductCount} manual products.`);

  const companies = loadCompanies();
  const { lookupIngredient, getKnownKeysSet } = loadScorer(companies);
  if (typeof lookupIngredient !== 'function' || typeof getKnownKeysSet !== 'function') {
    throw new Error('lookupIngredient/getKnownKeysSet were not exported from the scorer bundle');
  }
  getKnownKeysSet(); // sanity: scorer bundle initialized correctly
  console.log('Scorer loaded.');

  // ── Recompute the SAFE / NEEDS-RE-FETCH split ──
  const recomputedSafe = new Map(); // barcode -> { oldIngredients, newIngredients }
  const recomputedRefetch = new Set();

  for (const [barcode, product] of Object.entries(manualProducts)) {
    const oldIngredients = Array.isArray(product.ingredients) ? product.ingredients : [];
    const rawText = oldIngredients.join(', ');
    const newIngredients = normalizeIngredientTokens(rawText);
    const garbageHits = findGarbageTokens(newIngredients, lookupIngredient);
    if (garbageHits.length === 0) {
      recomputedSafe.set(barcode, { oldIngredients, newIngredients });
    } else {
      recomputedRefetch.add(barcode);
    }
  }

  console.log(`Recomputed: SAFE=${recomputedSafe.size}, NEEDS-RE-FETCH=${recomputedRefetch.size}.`);

  // ── Cross-check against the committed lists — ABORT on any mismatch ──
  const committedSafeSet = extractBarcodesFromList(fs.readFileSync(SAFE_LIST_PATH, 'utf8'));
  const committedRefetchSet = extractBarcodesFromList(fs.readFileSync(REFETCH_LIST_PATH, 'utf8'));

  console.log(`Committed lists: SAFE=${committedSafeSet.size}, NEEDS-RE-FETCH=${committedRefetchSet.size}.`);

  const recomputedSafeBarcodes = new Set(recomputedSafe.keys());
  const missingFromRecomputed = [...committedSafeSet].filter((b) => !recomputedSafeBarcodes.has(b));
  const extraInRecomputed = [...recomputedSafeBarcodes].filter((b) => !committedSafeSet.has(b));

  if (missingFromRecomputed.length > 0 || extraInRecomputed.length > 0) {
    console.error(`ABORT: recomputed SAFE set does not match phase2-safe-list.md.`);
    console.error(`  In committed list but not recomputed as SAFE: ${missingFromRecomputed.length} (e.g. ${missingFromRecomputed.slice(0, 5).join(', ')})`);
    console.error(`  Recomputed as SAFE but not in committed list: ${extraInRecomputed.length} (e.g. ${extraInRecomputed.slice(0, 5).join(', ')})`);
    process.exitCode = 1;
    return;
  }
  console.log('Cross-check OK: recomputed SAFE set exactly matches phase2-safe-list.md (1082 expected).');

  const refetchIntersectsSafe = [...recomputedRefetch].filter((b) => committedSafeSet.has(b));
  if (refetchIntersectsSafe.length > 0) {
    console.error(`ABORT: ${refetchIntersectsSafe.length} recomputed NEEDS-RE-FETCH barcodes are in the committed SAFE list.`);
    process.exitCode = 1;
    return;
  }

  // ── Determine which SAFE products actually changed ──
  const changed = []; // { barcode, name, oldIngredients, newIngredients }
  for (const [barcode, { oldIngredients, newIngredients }] of recomputedSafe.entries()) {
    if (!arraysEqual(oldIngredients, newIngredients)) {
      changed.push({ barcode, name: manualProducts[barcode]?.name || '(unnamed)', oldIngredients, newIngredients });
    }
  }
  console.log(`${changed.length} of ${recomputedSafe.size} SAFE products have different ingredients after re-normalizing (rest are already identical — skipped).`);

  if (changed.length === 0) {
    console.log('Nothing to change. Exiting.');
    return;
  }

  // ── Locate spans for every changed product BEFORE mutating anything ──
  const spans = []; // { barcode, start, end, propIndent, newIngredients }
  const findErrors = [];
  for (const item of changed) {
    try {
      const span = findIngredientsSpan(originalSource, item.barcode);
      spans.push({ ...span, barcode: item.barcode, newIngredients: item.newIngredients });
    } catch (e) {
      findErrors.push({ barcode: item.barcode, message: e.message });
    }
  }

  if (findErrors.length > 0) {
    console.error(`ABORT: ${findErrors.length} products could not be located unambiguously in products.js source text:`);
    for (const e of findErrors.slice(0, 20)) console.error(`  - ${e.barcode}: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Located all ${spans.length} ingredients-array spans in the source text.`);

  // Sanity: spans must be non-overlapping and each barcode's span must not
  // fall inside another span (guards against the barcode-uniqueness regex
  // matching a nested/unexpected structure).
  spans.sort((a, b) => a.start - b.start);
  for (let i = 1; i < spans.length; i += 1) {
    if (spans[i].start < spans[i - 1].end) {
      throw new Error(`ABORT: overlapping replacement spans between ${spans[i - 1].barcode} and ${spans[i].barcode} — refusing to write.`);
    }
  }

  // ── Build the new source text by splicing all spans in one pass ──
  let newSource = '';
  let cursor = 0;
  for (const span of spans) {
    newSource += originalSource.slice(cursor, span.start);
    newSource += serializeIngredientsArray(span.newIngredients, span.propIndent, span.quoteChar, span.trailingComma);
    cursor = span.end;
  }
  newSource += originalSource.slice(cursor);

  // ── Validate the new source before writing anything ──
  console.log('Validating rewritten source (re-parsing MANUAL_PRODUCTS)...');
  const newManualProducts = loadManualProducts(newSource);
  const newProductCount = Object.keys(newManualProducts).length;
  if (newProductCount !== originalProductCount) {
    throw new Error(`ABORT: product count changed after rewrite (${originalProductCount} -> ${newProductCount}). Refusing to write.`);
  }
  console.log(`Product count unchanged: ${newProductCount}.`);

  // Every changed product's new ingredients must match what we intended,
  // and every UNCHANGED / NEEDS-RE-FETCH product's ingredients must be
  // byte-identical to before.
  const changedBarcodeSet = new Set(spans.map((s) => s.barcode));
  let verifyMismatches = 0;
  for (const barcode of Object.keys(manualProducts)) {
    const before = manualProducts[barcode].ingredients || [];
    const after = newManualProducts[barcode].ingredients || [];
    if (changedBarcodeSet.has(barcode)) {
      const expected = recomputedSafe.get(barcode).newIngredients;
      if (!arraysEqual(after, expected)) {
        verifyMismatches += 1;
        console.error(`Verify mismatch (changed) ${barcode}: got ${JSON.stringify(after)} expected ${JSON.stringify(expected)}`);
      }
    } else if (!arraysEqual(before, after)) {
      verifyMismatches += 1;
      console.error(`Verify mismatch (should be untouched) ${barcode}: before ${JSON.stringify(before)} after ${JSON.stringify(after)}`);
    }
  }
  if (verifyMismatches > 0) {
    throw new Error(`ABORT: ${verifyMismatches} products failed post-rewrite verification. Refusing to write.`);
  }
  console.log('Verification OK: every changed product matches its intended new ingredients; every other product is byte-identical.');

  // ── Score-drift summary (informational) ──
  const { scoreProduct } = loadScorer(companies);
  let scoreUp = 0;
  let scoreDown = 0;
  let scoreSame = 0;
  let scoreDownOver10 = 0;
  for (const barcode of changedBarcodeSet) {
    const oldScore = scoreProduct(manualProducts[barcode])?.score ?? null;
    const newScore = scoreProduct(newManualProducts[barcode])?.score ?? null;
    if (Number.isFinite(oldScore) && Number.isFinite(newScore)) {
      const delta = newScore - oldScore;
      if (delta > 0) scoreUp += 1;
      else if (delta < 0) {
        scoreDown += 1;
        if (delta < -10) scoreDownOver10 += 1;
      } else scoreSame += 1;
    }
  }

  const reportLines = [
    '# Phase 2a — apply-safe report',
    '',
    `Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    `- Total manual products: ${originalProductCount}`,
    `- Recomputed SAFE (matches phase2-safe-list.md): ${recomputedSafe.size}`,
    `- Recomputed NEEDS-RE-FETCH (matches phase2-refetch-list.md, untouched): ${recomputedRefetch.size}`,
    `- SAFE products whose ingredients actually changed: ${changed.length}`,
    `- SAFE products already identical (skipped): ${recomputedSafe.size - changed.length}`,
    '',
    '## Score drift among changed products',
    '',
    `- Unchanged score: ${scoreSame}`,
    `- Moved up: ${scoreUp}`,
    `- Moved down: ${scoreDown} (of which down by more than 10 points: ${scoreDownOver10})`,
    '',
  ];
  fs.writeFileSync(APPLY_REPORT_PATH, reportLines.join('\n'), 'utf8');
  console.log(`Report written to ${APPLY_REPORT_PATH}`);
  console.log(reportLines.join('\n'));

  if (!APPLY) {
    console.log('DRY-RUN complete. No files were written. Re-run with --apply to write src/data/products.js.');
    return;
  }

  fs.writeFileSync(PRODUCTS_PATH, newSource, 'utf8');
  console.log(`APPLIED: wrote ${PRODUCTS_PATH} (${changed.length} products' ingredients updated).`);
}

try {
  main();
} catch (error) {
  console.error(`FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
}
