const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contentFingerprint(...values) {
  const normalized = values.map(normalizeText).filter(Boolean).join('|');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function tokenSet(value) {
  return new Set(
    normalizeText(value)
      .split(' ')
      .filter((token) => token.length > 2)
  );
}

function jaccardSimilarity(left, right) {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (!a.size && !b.size) return 1;
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function daysBetween(older, newer = new Date()) {
  const oldDate = new Date(older);
  if (Number.isNaN(oldDate.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((newer.getTime() - oldDate.getTime()) / 86_400_000);
}

function safeJson(value, fallback) {
  try {
    return value == null || value === '' ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function slugify(value) {
  const slug = normalizeText(value).replace(/\s+/g, '-').slice(0, 64);
  return slug || `content-${Date.now()}`;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) {
      result._.push(value);
      continue;
    }

    const [rawKey, inlineValue] = value.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (inlineValue !== undefined) {
      result[key] = inlineValue;
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      result[key] = argv[index + 1];
      index += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

function toBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'y'].includes(String(value).toLowerCase());
}

module.exports = {
  contentFingerprint,
  daysBetween,
  jaccardSimilarity,
  normalizeText,
  parseArgs,
  readJson,
  safeJson,
  slugify,
  toBoolean,
  writeJson,
};
