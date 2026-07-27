const fs = require('node:fs');
const path = require('node:path');

const { insertMetric, transitionEntity } = require('./db');
const { readJson, writeJson } = require('./utils');

const VALID_BUCKETS = new Set(['2h', '24h', '7d']);

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function readMetricsInput(inputPath) {
  if (path.extname(inputPath).toLowerCase() === '.json') {
    const payload = readJson(inputPath);
    return Array.isArray(payload) ? payload : payload.metrics;
  }
  const lines = fs
    .readFileSync(inputPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);
  const headers = parseCsvLine(lines.shift()).map((header) => header.trim());
  return lines.map((line) =>
    Object.fromEntries(
      parseCsvLine(line).map((value, index) => [headers[index], value])
    )
  );
}

function importMetrics(db, inputPath) {
  const metrics = readMetricsInput(inputPath);
  if (!Array.isArray(metrics)) throw new Error('Metrics input is invalid.');
  for (const [index, metric] of metrics.entries()) {
    if (!metric.package_id || !VALID_BUCKETS.has(metric.bucket)) {
      throw new Error(
        `Metric ${index + 1} needs package_id and bucket 2h, 24h, or 7d.`
      );
    }
    const contentPackage = db
      .prepare('SELECT id FROM packages WHERE id = ?')
      .get(metric.package_id);
    if (!contentPackage) {
      throw new Error(`Metric ${index + 1} references an unknown package.`);
    }
    insertMetric(db, metric);
    if (metric.bucket === '7d') {
      const contentPackage = db
        .prepare('SELECT status FROM packages WHERE id = ?')
        .get(metric.package_id);
      if (contentPackage?.status === 'posted') {
        transitionEntity(
          db,
          'package',
          metric.package_id,
          'measured',
          'metrics-import',
          'Seven-day performance snapshot recorded.'
        );
      }
    }
  }
  return metrics.length;
}

function engagementRate(row) {
  if (!row.views) return 0;
  return (
    (row.likes + row.comments * 2 + row.shares * 3 + row.saves * 3) /
    row.views
  );
}

function generatePerformanceReport(db, config) {
  const rows = db
    .prepare(
      `SELECT m.*, p.slug, c.hook, c.topic, c.pillar, c.format,
              c.test_variable, c.test_variant
       FROM metrics m
       JOIN packages p ON p.id = m.package_id
       JOIN concepts c ON c.id = p.concept_id
       ORDER BY m.captured_at DESC`
    )
    .all()
    .map((row) => ({ ...row, engagement_rate: engagementRate(row) }));

  const sevenDay = rows
    .filter((row) => row.bucket === '7d')
    .sort((a, b) => b.engagement_rate - a.engagement_rate);
  const pillarMap = new Map();
  for (const row of sevenDay) {
    const current = pillarMap.get(row.pillar) || {
      pillar: row.pillar,
      posts: 0,
      views: 0,
      engagement_sum: 0,
    };
    current.posts += 1;
    current.views += row.views;
    current.engagement_sum += row.engagement_rate;
    pillarMap.set(row.pillar, current);
  }
  const pillars = [...pillarMap.values()]
    .map((item) => ({
      ...item,
      average_engagement: item.engagement_sum / item.posts,
    }))
    .sort((a, b) => b.average_engagement - a.average_engagement);

  const published = db
    .prepare(`SELECT COUNT(*) AS count FROM packages WHERE status IN ('posted','measured')`)
    .get().count;
  const with24h = new Set(
    rows.filter((row) => row.bucket === '24h').map((row) => row.package_id)
  ).size;
  const with7d = new Set(
    rows.filter((row) => row.bucket === '7d').map((row) => row.package_id)
  ).size;

  const report = {
    generated_at: new Date().toISOString(),
    coverage: {
      published,
      with_24h: with24h,
      with_7d: with7d,
      completion_rate:
        published === 0 ? 0 : Number((with7d / published).toFixed(3)),
      meets_90_percent_target:
        published > 0 && with24h / published >= 0.9 && with7d / published >= 0.9,
    },
    strongest_pillars: pillars.slice(0, 2),
    pillars,
    winning_posts: sevenDay.slice(0, 5),
    recommendations:
      pillars.length >= 2
        ? [
            `Keep ${pillars[0].pillar} and ${pillars[1].pillar} as lead pillars.`,
            'Change one declared test variable in the next comparison.',
            'Review weak posts for hook clarity before changing the subject.',
          ]
        : ['Collect more 7-day snapshots before changing the content mix.'],
  };
  const outputPath = path.join(config.paths.exports, 'performance-report.json');
  writeJson(outputPath, report);
  return { report, outputPath };
}

module.exports = {
  VALID_BUCKETS,
  engagementRate,
  generatePerformanceReport,
  importMetrics,
  parseCsvLine,
  readMetricsInput,
};
