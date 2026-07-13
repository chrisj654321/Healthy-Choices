#!/usr/bin/env node

/**
 * Uploads assets/db/products.db to the "Catalog" Supabase Storage bucket
 * (public), replacing whatever is already there.
 *
 * Run this after any rebuild (`node scripts/build-products-sqlite.js`) that
 * should reach devices — then bump DB_VERSION in src/data/productStore.js so
 * devices that already downloaded a copy pick up the new one.
 *
 * Usage:
 *   node scripts/upload-products-db.js
 *
 * Env (read from .env, not passed on the command line):
 *   SUPABASE_SERVICE_ROLE_KEY — required. Bypasses RLS to upload; never ship
 *   this key in the app, never commit it (.env is gitignored).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'assets', 'db', 'products.db');
const SUPABASE_URL = 'https://huvxeaegygaeotomdqpc.supabase.co';
const BUCKET = 'Catalog';
const OBJECT_PATH = 'products.db';

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

async function main() {
  loadEnvFile();

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in .env');
  }
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found: ${path.relative(ROOT, DB_PATH)} — run scripts/build-products-sqlite.js first`);
  }

  const fileBuffer = fs.readFileSync(DB_PATH);
  const sizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`Uploading ${path.relative(ROOT, DB_PATH)} (${sizeMB} MB) to ${BUCKET}/${OBJECT_PATH}...`);

  const supabase = createClient(SUPABASE_URL, serviceRoleKey);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(OBJECT_PATH, fileBuffer, {
      contentType: 'application/octet-stream',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(OBJECT_PATH);
  console.log('Upload complete.');
  console.log(`Public URL: ${data.publicUrl}`);
  console.log('Reminder: bump DB_VERSION in src/data/productStore.js so devices with an existing local copy re-download.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
