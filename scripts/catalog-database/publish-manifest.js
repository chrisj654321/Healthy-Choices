#!/usr/bin/env node

/**
 * Uploads scripts/catalog-database/manifest.json to the "Catalog" Supabase Storage bucket,
 * replacing whatever is already there.
 *
 * scripts/catalog-database/manifest.json is the source of truth and is committed, so every
 * change to the live manifest goes through code review and git history. Do
 * not edit the copy in the Supabase dashboard directly — the next run of
 * this script would silently overwrite it.
 *
 * See scripts/README-remote-manifest.md for the manifest shape and what each
 * field does.
 *
 * Usage:
 *   node scripts/catalog-database/publish-manifest.js            # validate, then upload
 *   node scripts/catalog-database/publish-manifest.js --dry-run  # validate only, no upload
 *
 * Env (read from .env, not passed on the command line):
 *   SUPABASE_SERVICE_ROLE_KEY — required. Bypasses RLS to upload; never ship
 *   this key in the app, never commit it (.env is gitignored).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');
const SUPABASE_URL = 'https://huvxeaegygaeotomdqpc.supabase.co';
const BUCKET = 'Catalog';
const OBJECT_PATH = 'manifest.json';

// Must stay identical to EXPECTED_DB_URL_PREFIX in src/utils/remoteConfig.js.
// The app refuses any dbUrl outside this prefix, so a manifest that breaks
// the rule would publish fine and then be ignored by every device.
const EXPECTED_DB_URL_PREFIX =
  'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/';

// Short CDN lifetime. The manifest is the one file we want to take effect
// quickly — a longer cache would delay a kill-switch flip by that long.
const CACHE_CONTROL_SECONDS = '300';

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

/**
 * Applies the same rules src/utils/remoteConfig.js applies on the device, so
 * a manifest that the app would reject fails here instead of shipping.
 * Throws on the first problem found.
 */
function validate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('manifest must be a JSON object');
  }
  if (typeof raw.dbVersion !== 'string' || !raw.dbVersion.trim()) {
    throw new Error('dbVersion must be a non-empty string');
  }
  if (typeof raw.dbUrl !== 'string' || !raw.dbUrl.startsWith(EXPECTED_DB_URL_PREFIX)) {
    throw new Error(`dbUrl must start with ${EXPECTED_DB_URL_PREFIX}`);
  }
  if (raw.dbUrl.length <= EXPECTED_DB_URL_PREFIX.length) {
    throw new Error('dbUrl must name a file, not just the bucket prefix');
  }
  if (raw.config !== undefined) {
    if (!raw.config || typeof raw.config !== 'object' || Array.isArray(raw.config)) {
      throw new Error('config must be an object when present');
    }
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const fileBuffer = fs.readFileSync(MANIFEST_PATH);
  const parsed = JSON.parse(fileBuffer.toString('utf8'));
  validate(parsed);

  console.log(`Manifest is valid (${path.relative(ROOT, MANIFEST_PATH)}):`);
  console.log(`  dbVersion: ${parsed.dbVersion}`);
  console.log(`  dbUrl:     ${parsed.dbUrl}`);
  console.log(`  config:    ${JSON.stringify(parsed.config ?? {})}`);

  if (dryRun) {
    console.log('\n--dry-run: nothing uploaded.');
    return;
  }

  loadEnvFile();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in .env');
  }

  const supabase = createClient(SUPABASE_URL, serviceRoleKey);
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(OBJECT_PATH, fileBuffer, {
      contentType: 'application/json',
      cacheControl: CACHE_CONTROL_SECONDS,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(OBJECT_PATH);
  console.log(`\nUpload complete: ${data.publicUrl}`);
  console.log(`CDN cache: ${CACHE_CONTROL_SECONDS}s — a change takes up to that long to reach devices.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
