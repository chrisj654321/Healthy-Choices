const fs = require('node:fs');
const path = require('node:path');

const { safeJson } = require('./utils');

const CONTENT_TYPES = Object.freeze({
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
});

function storageConnection() {
  const publicBase = String(process.env.CONTENT_ASSET_BASE_URL || '').replace(
    /\/+$/,
    ''
  );
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const match = publicBase.match(
    /^(https:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)(?:\/(.*))?$/
  );

  if (!match) {
    throw new Error(
      'CONTENT_ASSET_BASE_URL must be a Supabase public Storage URL.'
    );
  }
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from the local .env file.'
    );
  }

  return {
    projectUrl: match[1],
    bucket: decodeURIComponent(match[2]),
    prefix: match[3] ? decodeURIComponent(match[3].replace(/\/+$/, '')) : '',
    publicBase,
    serviceKey,
  };
}

function encodeObjectPath(value) {
  return String(value)
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
}

function remoteObjectPath(connection, slug, fileName) {
  return [connection.prefix, slug, fileName].filter(Boolean).join('/');
}

function publicObjectUrl(connection, objectPath) {
  const relativePath = connection.prefix
    ? objectPath.replace(`${connection.prefix}/`, '')
    : objectPath;
  return `${connection.publicBase}/${encodeObjectPath(relativePath)}`;
}

async function uploadBuffer(connection, objectPath, body, contentType) {
  const uploadUrl = `${connection.projectUrl}/storage/v1/object/${encodeURIComponent(
    connection.bucket
  )}/${encodeObjectPath(objectPath)}`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${connection.serviceKey}`,
      apikey: connection.serviceKey,
      'Content-Type': contentType,
      'Cache-Control': '3600',
      'x-upsert': 'true',
    },
    body,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Supabase upload failed (${response.status}): ${detail.slice(0, 300)}`
    );
  }

  const publicUrl = publicObjectUrl(connection, objectPath);
  const verification = await fetch(publicUrl, {
    headers: { Range: 'bytes=0-0' },
  });
  if (!verification.ok) {
    throw new Error(
      `Uploaded asset is not publicly reachable (${verification.status}): ${publicUrl}`
    );
  }
  return publicUrl;
}

function packageAssets(contentPackage) {
  return safeJson(contentPackage.asset_manifest_json, []).filter((asset) =>
    ['image', 'video'].includes(asset.type)
  );
}

async function uploadPackageAssets(contentPackage, options = {}) {
  const connection = storageConnection();
  const assets = packageAssets(contentPackage);
  if (!assets.length) {
    throw new Error(`Package ${contentPackage.id} has no publishable media.`);
  }

  const uploads = [];
  for (const asset of assets) {
    const localPath = path.resolve(asset.path);
    if (!fs.existsSync(localPath)) {
      throw new Error(`Local media file is missing: ${localPath}`);
    }
    const fileName = path.basename(localPath);
    const objectPath = remoteObjectPath(
      connection,
      contentPackage.slug,
      fileName
    );
    const publicUrl = publicObjectUrl(connection, objectPath);
    if (options.dryRun) {
      uploads.push({ localPath, objectPath, publicUrl, dryRun: true });
      continue;
    }
    const contentType =
      CONTENT_TYPES[path.extname(fileName).toLowerCase()] ||
      'application/octet-stream';
    const uploadedUrl = await uploadBuffer(
      connection,
      objectPath,
      fs.readFileSync(localPath),
      contentType
    );
    uploads.push({ localPath, objectPath, publicUrl: uploadedUrl });
  }
  return uploads;
}

async function testStorageConnection(options = {}) {
  const connection = storageConnection();
  const objectPath = remoteObjectPath(
    connection,
    '_healthcheck',
    'content-factory.png'
  );
  const publicUrl = publicObjectUrl(connection, objectPath);
  if (options.dryRun) return { dryRun: true, objectPath, publicUrl };

  const onePixelPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64'
  );
  await uploadBuffer(
    connection,
    objectPath,
    onePixelPng,
    CONTENT_TYPES['.png']
  );
  return { ok: true, objectPath, publicUrl };
}

module.exports = {
  CONTENT_TYPES,
  packageAssets,
  publicObjectUrl,
  remoteObjectPath,
  storageConnection,
  testStorageConnection,
  uploadPackageAssets,
};
