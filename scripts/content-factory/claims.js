const { insertClaim } = require('./db');
const { readJson } = require('./utils');

const VALID_CLAIM_TYPES = new Set([
  'health',
  'ingredient',
  'ownership',
  'lobbying',
  'political',
  'regulatory',
  'nutrition',
]);

function validateClaim(claim, index) {
  const required = ['claim_text', 'claim_type', 'source_url'];
  const missing = required.filter((field) => !claim[field]);
  if (missing.length) {
    throw new Error(`Claim ${index + 1} is missing: ${missing.join(', ')}`);
  }
  if (!VALID_CLAIM_TYPES.has(claim.claim_type)) {
    throw new Error(`Claim ${index + 1} has unsupported claim_type.`);
  }
  try {
    const url = new URL(claim.source_url);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`Claim ${index + 1} has an invalid source URL.`);
  }
  if (
    claim.verification_status === 'verified' &&
    (!claim.reviewer || !claim.reviewed_at || !claim.evidence_excerpt)
  ) {
    throw new Error(
      `Claim ${index + 1} cannot be verified without reviewer, reviewed_at, and evidence_excerpt.`
    );
  }
}

function importClaims(db, inputPath) {
  const payload = readJson(inputPath);
  const claims = Array.isArray(payload) ? payload : payload.claims;
  if (!Array.isArray(claims)) {
    throw new Error('Claims input must be an array or an object with claims[].');
  }
  return claims.map((claim, index) => {
    validateClaim(claim, index);
    return insertClaim(db, claim);
  });
}

function getClaimsByIds(db, claimIds) {
  if (!claimIds.length) return [];
  const placeholders = claimIds.map(() => '?').join(',');
  return db
    .prepare(`SELECT * FROM claims WHERE id IN (${placeholders})`)
    .all(...claimIds);
}

function validateConceptClaims(db, concept) {
  const claimIds = JSON.parse(concept.source_claim_ids_json || '[]');
  const claims = getClaimsByIds(db, claimIds);
  const failures = [];
  if (claimIds.length !== claims.length) {
    failures.push('One or more linked evidence records are missing.');
  }
  for (const claim of claims) {
    if (claim.verification_status !== 'verified') {
      failures.push(`Claim is not verified: ${claim.claim_text}`);
    }
    if (!claim.source_url) {
      failures.push(`Claim has no source URL: ${claim.claim_text}`);
    }
    if (claim.expires_at && new Date(claim.expires_at) < new Date()) {
      failures.push(`Claim evidence is expired: ${claim.claim_text}`);
    }
  }
  return { claims, failures };
}

module.exports = {
  VALID_CLAIM_TYPES,
  getClaimsByIds,
  importClaims,
  validateClaim,
  validateConceptClaims,
};
