const fs = require('node:fs');
const path = require('node:path');

const { transitionEntity } = require('./db');
const { safeJson, writeJson } = require('./utils');

const BUFFER_ENDPOINT = 'https://api.buffer.com';
const CREATE_DRAFT_MUTATION = `
mutation CreateDraftPost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post { id text status }
    }
    ... on MutationError {
      message
    }
  }
}`;

async function bufferRequest(query, variables = {}) {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'BUFFER_API_KEY is missing. Add it to the local .env file first.'
    );
  }

  const response = await fetch(BUFFER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(
      payload.errors?.map((error) => error.message).join('; ') ||
        `Buffer returned HTTP ${response.status}.`
    );
  }
  return payload.data;
}

async function listBufferChannels() {
  const organizationData = await bufferRequest(`
    query GetOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
  `);
  const organizations = organizationData.account?.organizations || [];
  const results = [];

  for (const organization of organizations) {
    const channelData = await bufferRequest(
      `
        query GetChannels($organizationId: OrganizationId!) {
          channels(input: { organizationId: $organizationId }) {
            id
            name
            displayName
            service
            isDisconnected
            isLocked
          }
        }
      `,
      { organizationId: organization.id }
    );
    results.push({
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channels: channelData.channels || [],
    });
  }

  return {
    instructions:
      'Copy the id from the TikTok channel into BUFFER_CHANNEL_ID in .env.',
    organizations: results,
  };
}

function publicAssetUrl(config, contentPackage, localPath) {
  const base = String(
    process.env.CONTENT_ASSET_BASE_URL ||
      config.publishing.publicAssetBaseUrl ||
      ''
  ).replace(/\/+$/, '');
  if (!base) return null;
  const fileName = path.basename(localPath);
  return `${base}/${encodeURIComponent(contentPackage.slug)}/${encodeURIComponent(
    fileName
  )}`;
}

function buildBufferDraftInput(config, contentPackage) {
  if (contentPackage.status !== 'founder_approved') {
    throw new Error('Only founder-approved packages can become Buffer drafts.');
  }
  const channelId =
    process.env.BUFFER_CHANNEL_ID || config.publishing.bufferChannelId;
  const manifest = safeJson(contentPackage.asset_manifest_json, []);
  const assets = manifest
    .filter((asset) => ['image', 'video'].includes(asset.type))
    .map((asset) => {
      const url = publicAssetUrl(config, contentPackage, asset.path);
      if (!url) return null;
      return asset.type === 'video'
        ? { video: { url } }
        : { image: { url } };
    })
    .filter(Boolean);

  const input = {
    text: contentPackage.caption_tiktok || '',
    channelId: channelId || 'BUFFER_CHANNEL_ID_REQUIRED',
    schedulingType: config.publishing.schedulingType || 'notification',
    mode: 'addToQueue',
    saveToDraft: true,
    aiAssisted: Boolean(
      safeJson(contentPackage.disclosure_json, {}).ai_generated
    ),
    assets,
  };

  if (
    contentPackage.package_type === 'video' &&
    safeJson(contentPackage.disclosure_json, {}).ai_generated
  ) {
    input.metadata = { tiktok: { isAiGenerated: true } };
  } else if (contentPackage.package_type === 'slideshow') {
    input.metadata = { tiktok: { title: contentPackage.slug.slice(0, 90) } };
  }
  return input;
}

function exportBufferFallback(config, contentPackages) {
  const rows = [
    [
      'package_id',
      'slug',
      'status',
      'caption',
      'asset_paths',
      'scheduling_type',
      'ready_for_api',
    ],
  ];
  for (const item of contentPackages) {
    const manifest = safeJson(item.asset_manifest_json, []);
    const ready = Boolean(
      (process.env.BUFFER_CHANNEL_ID || config.publishing.bufferChannelId) &&
        (process.env.CONTENT_ASSET_BASE_URL ||
          config.publishing.publicAssetBaseUrl)
    );
    rows.push([
      item.id,
      item.slug,
      item.status,
      item.caption_tiktok || '',
      manifest.map((asset) => asset.path).join('|'),
      config.publishing.schedulingType,
      ready ? 'yes' : 'no',
    ]);
  }
  const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = rows.map((row) => row.map(quote).join(',')).join('\n');
  const outputPath = path.join(config.paths.exports, 'buffer-draft-fallback.csv');
  fs.writeFileSync(outputPath, `${csv}\n`, 'utf8');
  return outputPath;
}

async function createBufferDraft(db, config, packageId, options = {}) {
  const contentPackage = db
    .prepare('SELECT * FROM packages WHERE id = ?')
    .get(packageId);
  if (!contentPackage) throw new Error(`Package not found: ${packageId}`);
  if (contentPackage.buffer_post_id) {
    return { skipped: true, bufferPostId: contentPackage.buffer_post_id };
  }
  const input = buildBufferDraftInput(config, contentPackage);
  const requestPath = path.join(
    config.paths.exports,
    `buffer-request-${contentPackage.slug}.json`
  );
  writeJson(requestPath, { query: CREATE_DRAFT_MUTATION, variables: { input } });

  if (options.dryRun) {
    return { dryRun: true, requestPath, input };
  }

  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) throw new Error('BUFFER_API_KEY is required for a live draft.');
  if (!process.env.BUFFER_CHANNEL_ID && !config.publishing.bufferChannelId) {
    throw new Error('BUFFER_CHANNEL_ID is required for a live draft.');
  }
  if (!input.assets.length) {
    throw new Error(
      'Public media URLs are required. Set CONTENT_ASSET_BASE_URL first.'
    );
  }
  for (const asset of input.assets) {
    const url = asset.image?.url || asset.video?.url;
    if (!url?.startsWith('https://')) {
      throw new Error('Buffer media URLs must be stable public HTTPS URLs.');
    }
  }

  const response = await fetch(BUFFER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: CREATE_DRAFT_MUTATION,
      variables: { input },
    }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(
      payload.errors?.map((error) => error.message).join('; ') ||
        `Buffer returned HTTP ${response.status}.`
    );
  }
  const result = payload.data?.createPost;
  if (!result?.post?.id) {
    throw new Error(result?.message || 'Buffer did not return a draft ID.');
  }

  db.prepare(
    `UPDATE packages SET buffer_post_id = ?, updated_at = ? WHERE id = ?`
  ).run(result.post.id, new Date().toISOString(), packageId);
  transitionEntity(
    db,
    'package',
    packageId,
    'buffer_draft',
    'buffer-api',
    'Created as a Buffer draft. No scheduling or publishing was authorized.'
  );
  return { bufferPostId: result.post.id, requestPath };
}

module.exports = {
  BUFFER_ENDPOINT,
  CREATE_DRAFT_MUTATION,
  buildBufferDraftInput,
  createBufferDraft,
  exportBufferFallback,
  listBufferChannels,
  publicAssetUrl,
};
