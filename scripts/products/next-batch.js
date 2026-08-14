#!/usr/bin/env node
/**
 * next-batch.js — P1 cowork pipeline, Stage 0 slicer.
 *
 * Slices the next N unconsumed rows off the standing candidate queue
 * (src/data/batches/products/candidates-cowork-queue.csv) into a dated Stage-1
 * input CSV, then marks those rows consumed by appending their row keys to an
 * append-only log (never deletes from the queue — keeps it auditable and lets
 * you re-run the same slice by hand if a batch needs re-fetching).
 *
 * Usage:
 *   node scripts/products/next-batch.js --n 15
 *   node scripts/products/next-batch.js --n 15 --queue path/to/other-queue.csv
 *
 * Output: src/data/batches/products/cowork-batch-YYYY-MM-DD.csv
 *         (same header/shape the Octavius Stage 1 fetch script expects:
 *          Barcode,Product Name,Brand,Category)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.resolve(__dirname, '..', '..', 'src', 'data', 'batches', 'products');
const DEFAULT_QUEUE = path.join(PRODUCTS_DIR, 'candidates-cowork-queue.csv');
const CONSUMED_LOG = path.join(PRODUCTS_DIR, '_cowork-queue-consumed.log');

function parseArgs(argv) {
  const args = { n: 15, queue: DEFAULT_QUEUE };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--n') args.n = parseInt(argv[++i], 10);
    else if (argv[i] === '--queue') args.queue = path.resolve(argv[++i]);
  }
  return args;
}

// Minimal quoted-CSV line parser (matches the octavius candidate CSV format).
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function csvField(value) {
  const s = String(value || '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowKey(name, brand) {
  return (name + '|' + brand).toLowerCase().replace(/[^a-z0-9|]/g, '');
}

function main() {
  const { n, queue } = parseArgs(process.argv.slice(2));
  if (!Number.isFinite(n) || n <= 0) {
    console.error('Usage: node scripts/products/next-batch.js --n <count> [--queue <path>]');
    process.exit(1);
  }
  if (!fs.existsSync(queue)) {
    console.error(`Queue file not found: ${queue}`);
    process.exit(1);
  }

  const consumed = new Set();
  if (fs.existsSync(CONSUMED_LOG)) {
    fs.readFileSync(CONSUMED_LOG, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((k) => consumed.add(k));
  }

  const lines = fs.readFileSync(queue, 'utf8').trim().split(/\r?\n/);
  const header = lines[0];
  const dataLines = lines.slice(1).filter((l) => l.trim());

  const picked = [];
  for (const line of dataLines) {
    if (picked.length >= n) break;
    const [barcode, name, brand, category] = parseCsvLine(line);
    if (!name || !brand) continue;
    const key = rowKey(name, brand);
    if (consumed.has(key)) continue;
    picked.push({ key, barcode, name, brand, category });
  }

  if (picked.length === 0) {
    console.log('No unconsumed rows left in the queue. Refresh the queue (Chad/codex exec) before running again.');
    process.exit(0);
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const outPath = path.join(PRODUCTS_DIR, `cowork-batch-${dateStr}.csv`);
  const outLines = [header, ...picked.map((r) =>
    [csvField(r.barcode), csvField(r.name), csvField(r.brand), csvField(r.category)].join(',')
  )];
  fs.writeFileSync(outPath, outLines.join('\n') + '\n');

  fs.appendFileSync(CONSUMED_LOG, picked.map((r) => r.key).join('\n') + '\n');

  const remaining = dataLines.length - consumed.size - picked.length;
  console.log(`Wrote ${picked.length} rows to ${path.relative(process.cwd(), outPath)}`);
  console.log(`Queue: ${dataLines.length} total, ${consumed.size + picked.length} now consumed, ~${Math.max(remaining, 0)} remaining.`);
  console.log('Next stage: run the Octavius Stage 1 fetch script against this batch file.');
}

main();
