const fs = require('node:fs');
const path = require('node:path');

const { writeJson } = require('./utils');

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backupLedger(db, config) {
  db.exec('PRAGMA wal_checkpoint(FULL)');
  const stamp = timestampSlug();
  const databaseBackup = path.join(
    config.paths.backups,
    `content-factory-${stamp}.db`
  );
  const configBackup = path.join(
    config.paths.backups,
    `content-factory-${stamp}.config.json`
  );
  fs.copyFileSync(config.paths.database, databaseBackup);
  fs.copyFileSync(config.paths.config, configBackup);
  return { databaseBackup, configBackup };
}

function healthReport(db, config) {
  const integrity = db.prepare('PRAGMA integrity_check').get().integrity_check;
  const failureCount = db
    .prepare('SELECT COUNT(*) AS count FROM failures WHERE resolved_at IS NULL')
    .get().count;
  const staleGenerated = db
    .prepare(
      `SELECT COUNT(*) AS count FROM packages
       WHERE status IN ('generated','qa_passed','founder_approved')
       AND updated_at < datetime('now', '-14 days')`
    )
    .get().count;
  const published = db
    .prepare(`SELECT COUNT(*) AS count FROM packages WHERE status IN ('posted','measured')`)
    .get().count;
  const metrics24h = db
    .prepare(`SELECT COUNT(DISTINCT package_id) AS count FROM metrics WHERE bucket = '24h'`)
    .get().count;
  const metrics7d = db
    .prepare(`SELECT COUNT(DISTINCT package_id) AS count FROM metrics WHERE bucket = '7d'`)
    .get().count;
  const report = {
    generated_at: new Date().toISOString(),
    database_integrity: integrity,
    unresolved_failures: failureCount,
    packages_waiting_over_14_days: staleGenerated,
    metrics_coverage: {
      published,
      with_24h: metrics24h,
      with_7d: metrics7d,
      target: 0.9,
    },
    secrets: {
      supabase_service_role_configured: Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
      buffer_api_key_configured: Boolean(process.env.BUFFER_API_KEY),
      buffer_channel_configured: Boolean(
        process.env.BUFFER_CHANNEL_ID || config.publishing.bufferChannelId
      ),
      public_asset_host_configured: Boolean(
        process.env.CONTENT_ASSET_BASE_URL ||
          config.publishing.publicAssetBaseUrl
      ),
    },
  };
  const outputPath = path.join(config.paths.exports, 'health-report.json');
  writeJson(outputPath, report);
  return { report, outputPath };
}

module.exports = { backupLedger, healthReport, timestampSlug };
