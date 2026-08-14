const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');

const { assertTransition } = require('./state');
const { contentFingerprint, safeJson } = require('./utils');

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_account TEXT,
  observed_at TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok',
  hook TEXT NOT NULL,
  topic TEXT NOT NULL,
  format TEXT,
  visual_structure TEXT,
  public_signals_json TEXT NOT NULL DEFAULT '{}',
  comment_insights_json TEXT NOT NULL DEFAULT '[]',
  product_angle TEXT,
  engagement_reason TEXT,
  test_notes TEXT,
  scores_json TEXT NOT NULL DEFAULT '{}',
  total_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'researched',
  rejection_reasons_json TEXT NOT NULL DEFAULT '[]',
  fingerprint TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  claim_text TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_title TEXT,
  publisher TEXT,
  published_at TEXT,
  accessed_at TEXT NOT NULL,
  evidence_excerpt TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  rights_status TEXT NOT NULL DEFAULT 'not_applicable',
  reviewer TEXT,
  reviewed_at TEXT,
  expires_at TEXT,
  fingerprint TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY,
  finding_id TEXT REFERENCES findings(id),
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  topic TEXT NOT NULL,
  pillar TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'slideshow',
  product_angle TEXT,
  test_variable TEXT NOT NULL,
  test_variant TEXT,
  storyboard_json TEXT NOT NULL DEFAULT '[]',
  caption_tiktok TEXT,
  caption_reels TEXT,
  caption_shorts TEXT,
  source_claim_ids_json TEXT NOT NULL DEFAULT '[]',
  ai_generated INTEGER NOT NULL DEFAULT 0,
  promotes_own_business INTEGER NOT NULL DEFAULT 1,
  rights_status TEXT NOT NULL DEFAULT 'ai_generated',
  status TEXT NOT NULL DEFAULT 'sourced',
  score INTEGER NOT NULL DEFAULT 0,
  fingerprint TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  slug TEXT NOT NULL UNIQUE,
  package_type TEXT NOT NULL,
  package_dir TEXT NOT NULL,
  caption_tiktok TEXT,
  caption_reels TEXT,
  caption_shorts TEXT,
  disclosure_json TEXT NOT NULL DEFAULT '{}',
  asset_manifest_json TEXT NOT NULL DEFAULT '[]',
  generation_cost REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'generated',
  buffer_post_id TEXT,
  scheduled_at TEXT,
  posted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS slides (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  headline TEXT NOT NULL,
  body TEXT,
  alt_text TEXT NOT NULL,
  image_prompt TEXT,
  source_asset TEXT,
  rendered_path TEXT NOT NULL,
  asset_rights TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  content_hash TEXT NOT NULL,
  UNIQUE(package_id, slide_number)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  reviewer TEXT NOT NULL,
  review_type TEXT NOT NULL,
  independent INTEGER NOT NULL DEFAULT 0,
  verdict TEXT NOT NULL,
  findings_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  captured_at TEXT NOT NULL,
  bucket TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  saves INTEGER NOT NULL DEFAULT 0,
  watch_time_seconds REAL,
  profile_visits INTEGER,
  link_clicks INTEGER,
  app_downloads INTEGER,
  UNIQUE(package_id, bucket)
);

CREATE TABLE IF NOT EXISTS state_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  actor TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS failures (
  id TEXT PRIMARY KEY,
  command TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  error_message TEXT NOT NULL,
  retryable INTEGER NOT NULL DEFAULT 0,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS community_tasks (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  post_url TEXT NOT NULL,
  comment_url TEXT,
  commenter TEXT,
  comment_excerpt TEXT NOT NULL,
  response_draft TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending_review',
  founder_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  fingerprint TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_findings_status_score
  ON findings(status, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_concepts_status
  ON concepts(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_packages_status
  ON packages(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_package
  ON metrics(package_id, captured_at);
CREATE INDEX IF NOT EXISTS idx_community_status
  ON community_tasks(status, priority, created_at);
`;

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function openFactoryDb(databasePath) {
  const db = new DatabaseSync(databasePath);
  db.exec(SCHEMA);
  const slideColumns = db.prepare('PRAGMA table_info(slides)').all();
  if (!slideColumns.some((column) => column.name === 'alt_text')) {
    db.exec(`ALTER TABLE slides ADD COLUMN alt_text TEXT NOT NULL DEFAULT ''`);
  }
  return db;
}

function insertFinding(db, finding) {
  const id = finding.id || createId('finding');
  const fingerprint =
    finding.fingerprint ||
    contentFingerprint(finding.source_url, finding.hook, finding.topic);
  const capturedAt = finding.captured_at || nowIso();
  const statement = db.prepare(`
    INSERT INTO findings (
      id, source_url, source_account, observed_at, captured_at, platform,
      hook, topic, format, visual_structure, public_signals_json,
      comment_insights_json, product_angle, engagement_reason, test_notes,
      scores_json, total_score, status, rejection_reasons_json, fingerprint
    ) VALUES (
      @id, @source_url, @source_account, @observed_at, @captured_at, @platform,
      @hook, @topic, @format, @visual_structure, @public_signals_json,
      @comment_insights_json, @product_angle, @engagement_reason, @test_notes,
      @scores_json, @total_score, @status, @rejection_reasons_json, @fingerprint
    )
    ON CONFLICT(fingerprint) DO UPDATE SET
      public_signals_json = excluded.public_signals_json,
      comment_insights_json = excluded.comment_insights_json,
      scores_json = excluded.scores_json,
      total_score = excluded.total_score,
      rejection_reasons_json = excluded.rejection_reasons_json,
      captured_at = excluded.captured_at
  `);

  statement.run({
    id,
    source_url: finding.source_url,
    source_account: finding.source_account || null,
    observed_at: finding.observed_at,
    captured_at: capturedAt,
    platform: finding.platform || 'tiktok',
    hook: finding.hook,
    topic: finding.topic,
    format: finding.format || null,
    visual_structure: finding.visual_structure || null,
    public_signals_json: JSON.stringify(finding.public_signals || {}),
    comment_insights_json: JSON.stringify(finding.comment_insights || []),
    product_angle: finding.product_angle || null,
    engagement_reason: finding.engagement_reason || null,
    test_notes: finding.test_notes || null,
    scores_json: JSON.stringify(finding.scores || {}),
    total_score: Number(finding.total_score || 0),
    status: finding.status || 'researched',
    rejection_reasons_json: JSON.stringify(finding.rejection_reasons || []),
    fingerprint,
  });

  return db.prepare('SELECT * FROM findings WHERE fingerprint = ?').get(fingerprint);
}

function insertClaim(db, claim) {
  const id = claim.id || createId('claim');
  const fingerprint =
    claim.fingerprint || contentFingerprint(claim.claim_text, claim.source_url);
  db.prepare(`
    INSERT INTO claims (
      id, claim_text, claim_type, source_url, source_title, publisher,
      published_at, accessed_at, evidence_excerpt, verification_status,
      rights_status, reviewer, reviewed_at, expires_at, fingerprint
    ) VALUES (
      @id, @claim_text, @claim_type, @source_url, @source_title, @publisher,
      @published_at, @accessed_at, @evidence_excerpt, @verification_status,
      @rights_status, @reviewer, @reviewed_at, @expires_at, @fingerprint
    )
    ON CONFLICT(fingerprint) DO UPDATE SET
      verification_status = excluded.verification_status,
      reviewer = excluded.reviewer,
      reviewed_at = excluded.reviewed_at,
      evidence_excerpt = excluded.evidence_excerpt,
      expires_at = excluded.expires_at
  `).run({
    id,
    claim_text: claim.claim_text,
    claim_type: claim.claim_type,
    source_url: claim.source_url,
    source_title: claim.source_title || null,
    publisher: claim.publisher || null,
    published_at: claim.published_at || null,
    accessed_at: claim.accessed_at || nowIso(),
    evidence_excerpt: claim.evidence_excerpt || null,
    verification_status: claim.verification_status || 'pending',
    rights_status: claim.rights_status || 'not_applicable',
    reviewer: claim.reviewer || null,
    reviewed_at: claim.reviewed_at || null,
    expires_at: claim.expires_at || null,
    fingerprint,
  });
  return db.prepare('SELECT * FROM claims WHERE fingerprint = ?').get(fingerprint);
}

function insertConcept(db, concept) {
  const id = concept.id || createId('concept');
  const timestamp = nowIso();
  const fingerprint =
    concept.fingerprint ||
    contentFingerprint(concept.hook, concept.topic, concept.product_angle);
  db.prepare(`
    INSERT INTO concepts (
      id, finding_id, title, hook, topic, pillar, format, product_angle,
      test_variable, test_variant, storyboard_json, caption_tiktok,
      caption_reels, caption_shorts, source_claim_ids_json, ai_generated,
      promotes_own_business, rights_status, status, score, fingerprint,
      created_at, updated_at
    ) VALUES (
      @id, @finding_id, @title, @hook, @topic, @pillar, @format, @product_angle,
      @test_variable, @test_variant, @storyboard_json, @caption_tiktok,
      @caption_reels, @caption_shorts, @source_claim_ids_json, @ai_generated,
      @promotes_own_business, @rights_status, @status, @score, @fingerprint,
      @created_at, @updated_at
    )
    ON CONFLICT(fingerprint) DO NOTHING
  `).run({
    id,
    finding_id: concept.finding_id || null,
    title: concept.title,
    hook: concept.hook,
    topic: concept.topic,
    pillar: concept.pillar,
    format: concept.format || 'slideshow',
    product_angle: concept.product_angle || null,
    test_variable: concept.test_variable,
    test_variant: concept.test_variant || null,
    storyboard_json: JSON.stringify(concept.storyboard || []),
    caption_tiktok: concept.caption_tiktok || null,
    caption_reels: concept.caption_reels || null,
    caption_shorts: concept.caption_shorts || null,
    source_claim_ids_json: JSON.stringify(concept.source_claim_ids || []),
    ai_generated: concept.ai_generated ? 1 : 0,
    promotes_own_business: concept.promotes_own_business === false ? 0 : 1,
    rights_status: concept.rights_status || 'ai_generated',
    status: concept.status || 'sourced',
    score: Number(concept.score || 0),
    fingerprint,
    created_at: timestamp,
    updated_at: timestamp,
  });
  return db.prepare('SELECT * FROM concepts WHERE fingerprint = ?').get(fingerprint);
}

function insertPackage(db, contentPackage) {
  const id = contentPackage.id || createId('package');
  const timestamp = nowIso();
  db.prepare(`
    INSERT INTO packages (
      id, concept_id, slug, package_type, package_dir, caption_tiktok,
      caption_reels, caption_shorts, disclosure_json, asset_manifest_json,
      generation_cost, status, created_at, updated_at
    ) VALUES (
      @id, @concept_id, @slug, @package_type, @package_dir, @caption_tiktok,
      @caption_reels, @caption_shorts, @disclosure_json, @asset_manifest_json,
      @generation_cost, @status, @created_at, @updated_at
    )
    ON CONFLICT(slug) DO UPDATE SET
      package_type = excluded.package_type,
      package_dir = excluded.package_dir,
      caption_tiktok = excluded.caption_tiktok,
      caption_reels = excluded.caption_reels,
      caption_shorts = excluded.caption_shorts,
      asset_manifest_json = excluded.asset_manifest_json,
      disclosure_json = excluded.disclosure_json,
      generation_cost = excluded.generation_cost,
      updated_at = excluded.updated_at
  `).run({
    id,
    concept_id: contentPackage.concept_id,
    slug: contentPackage.slug,
    package_type: contentPackage.package_type,
    package_dir: contentPackage.package_dir,
    caption_tiktok: contentPackage.caption_tiktok || null,
    caption_reels: contentPackage.caption_reels || null,
    caption_shorts: contentPackage.caption_shorts || null,
    disclosure_json: JSON.stringify(contentPackage.disclosure || {}),
    asset_manifest_json: JSON.stringify(contentPackage.asset_manifest || []),
    generation_cost: Number(contentPackage.generation_cost || 0),
    status: contentPackage.status || 'generated',
    created_at: timestamp,
    updated_at: timestamp,
  });
  return db.prepare('SELECT * FROM packages WHERE slug = ?').get(contentPackage.slug);
}

function insertSlide(db, slide) {
  const id = slide.id || createId('slide');
  db.prepare(`
    INSERT INTO slides (
      id, package_id, slide_number, headline, body, alt_text, image_prompt,
      source_asset, rendered_path, asset_rights, width, height, content_hash
    ) VALUES (
      @id, @package_id, @slide_number, @headline, @body, @alt_text, @image_prompt,
      @source_asset, @rendered_path, @asset_rights, @width, @height, @content_hash
    )
    ON CONFLICT(package_id, slide_number) DO UPDATE SET
      headline = excluded.headline,
      body = excluded.body,
      alt_text = excluded.alt_text,
      image_prompt = excluded.image_prompt,
      source_asset = excluded.source_asset,
      rendered_path = excluded.rendered_path,
      asset_rights = excluded.asset_rights,
      width = excluded.width,
      height = excluded.height,
      content_hash = excluded.content_hash
  `).run({
    id,
    package_id: slide.package_id,
    slide_number: slide.slide_number,
    headline: slide.headline,
    body: slide.body || null,
    alt_text: slide.alt_text,
    image_prompt: slide.image_prompt || null,
    source_asset: slide.source_asset || null,
    rendered_path: slide.rendered_path,
    asset_rights: slide.asset_rights,
    width: slide.width,
    height: slide.height,
    content_hash: slide.content_hash,
  });
}

function insertReview(db, review) {
  const id = review.id || createId('review');
  db.prepare(`
    INSERT INTO reviews (
      id, package_id, reviewer, review_type, independent, verdict,
      findings_json, created_at
    ) VALUES (
      @id, @package_id, @reviewer, @review_type, @independent, @verdict,
      @findings_json, @created_at
    )
  `).run({
    id,
    package_id: review.package_id,
    reviewer: review.reviewer,
    review_type: review.review_type,
    independent: review.independent ? 1 : 0,
    verdict: review.verdict,
    findings_json: JSON.stringify(review.findings || []),
    created_at: nowIso(),
  });
  return id;
}

function insertMetric(db, metric) {
  const id = metric.id || createId('metric');
  db.prepare(`
    INSERT INTO metrics (
      id, package_id, captured_at, bucket, views, likes, comments, shares,
      saves, watch_time_seconds, profile_visits, link_clicks, app_downloads
    ) VALUES (
      @id, @package_id, @captured_at, @bucket, @views, @likes, @comments,
      @shares, @saves, @watch_time_seconds, @profile_visits, @link_clicks,
      @app_downloads
    )
    ON CONFLICT(package_id, bucket) DO UPDATE SET
      captured_at = excluded.captured_at,
      views = excluded.views,
      likes = excluded.likes,
      comments = excluded.comments,
      shares = excluded.shares,
      saves = excluded.saves,
      watch_time_seconds = excluded.watch_time_seconds,
      profile_visits = excluded.profile_visits,
      link_clicks = excluded.link_clicks,
      app_downloads = excluded.app_downloads
  `).run({
    id,
    package_id: metric.package_id,
    captured_at: metric.captured_at || nowIso(),
    bucket: metric.bucket,
    views: Number(metric.views || 0),
    likes: Number(metric.likes || 0),
    comments: Number(metric.comments || 0),
    shares: Number(metric.shares || 0),
    saves: Number(metric.saves || 0),
    watch_time_seconds:
      metric.watch_time_seconds == null
        ? null
        : Number(metric.watch_time_seconds),
    profile_visits:
      metric.profile_visits == null ? null : Number(metric.profile_visits),
    link_clicks:
      metric.link_clicks == null ? null : Number(metric.link_clicks),
    app_downloads:
      metric.app_downloads == null ? null : Number(metric.app_downloads),
  });
}

function insertCommunityTask(db, task) {
  const id = task.id || createId('community');
  const timestamp = nowIso();
  const fingerprint =
    task.fingerprint ||
    contentFingerprint(task.platform, task.comment_url || task.post_url, task.comment_excerpt);
  db.prepare(`
    INSERT INTO community_tasks (
      id, platform, post_url, comment_url, commenter, comment_excerpt,
      response_draft, priority, status, founder_note, created_at, updated_at,
      fingerprint
    ) VALUES (
      @id, @platform, @post_url, @comment_url, @commenter, @comment_excerpt,
      @response_draft, @priority, @status, @founder_note, @created_at,
      @updated_at, @fingerprint
    )
    ON CONFLICT(fingerprint) DO UPDATE SET
      response_draft = excluded.response_draft,
      priority = excluded.priority,
      updated_at = excluded.updated_at
  `).run({
    id,
    platform: task.platform,
    post_url: task.post_url,
    comment_url: task.comment_url || null,
    commenter: task.commenter || null,
    comment_excerpt: task.comment_excerpt,
    response_draft: task.response_draft,
    priority: task.priority || 'normal',
    status: task.status || 'pending_review',
    founder_note: task.founder_note || null,
    created_at: timestamp,
    updated_at: timestamp,
    fingerprint,
  });
  return db
    .prepare('SELECT * FROM community_tasks WHERE fingerprint = ?')
    .get(fingerprint);
}

function transitionEntity(db, entityType, entityId, toState, actor, note) {
  if (!['finding', 'concept', 'package'].includes(entityType)) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }
  const table = `${entityType}s`;
  const row = db.prepare(`SELECT status FROM ${table} WHERE id = ?`).get(entityId);
  if (!row) throw new Error(`${entityType} not found: ${entityId}`);
  assertTransition(row.status, toState);

  if (entityType === 'package' || entityType === 'concept') {
    db.prepare(`UPDATE ${table} SET status = ?, updated_at = ? WHERE id = ?`).run(
      toState,
      nowIso(),
      entityId
    );
  } else {
    db.prepare(`UPDATE ${table} SET status = ? WHERE id = ?`).run(
      toState,
      entityId
    );
  }
  db.prepare(`
    INSERT INTO state_events (
      id, entity_type, entity_id, from_state, to_state, actor, note, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    createId('event'),
    entityType,
    entityId,
    row.status,
    toState,
    actor,
    note || null,
    nowIso()
  );
}

function getRecentConcepts(db, sinceIso) {
  return db
    .prepare(
      `SELECT hook, topic, format FROM concepts
       WHERE created_at >= ? AND status != 'rejected'`
    )
    .all(sinceIso);
}

function getDashboardData(db) {
  const packages = db.prepare(`
    SELECT p.*, c.title, c.hook, c.topic, c.pillar, c.test_variable,
           c.storyboard_json, c.source_claim_ids_json, c.ai_generated,
           c.promotes_own_business, c.rights_status
    FROM packages p
    JOIN concepts c ON c.id = p.concept_id
    ORDER BY p.updated_at DESC
  `).all();
  return packages.map((item) => {
    const sourceClaimIds = safeJson(item.source_claim_ids_json, []);
    const placeholders = sourceClaimIds.map(() => '?').join(',');
    const claims = sourceClaimIds.length
      ? db
          .prepare(
            `SELECT id, claim_text, claim_type, source_url, source_title,
                    publisher, verification_status, reviewer, reviewed_at
             FROM claims WHERE id IN (${placeholders})`
          )
          .all(...sourceClaimIds)
      : [];
    return {
      ...item,
      disclosure: safeJson(item.disclosure_json, {}),
      asset_manifest: safeJson(item.asset_manifest_json, []),
      storyboard: safeJson(item.storyboard_json, []),
      source_claim_ids: sourceClaimIds,
      claims,
      slides: db
        .prepare('SELECT * FROM slides WHERE package_id = ? ORDER BY slide_number')
        .all(item.id),
      reviews: db
        .prepare(
          'SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC'
        )
        .all(item.id)
        .map((review) => ({
          ...review,
          findings: safeJson(review.findings_json, []),
        })),
    };
  });
}

function recordFailure(db, failure) {
  db.prepare(`
    INSERT INTO failures (
      id, command, entity_type, entity_id, error_message, retryable, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    createId('failure'),
    failure.command,
    failure.entity_type || null,
    failure.entity_id || null,
    failure.error_message,
    failure.retryable ? 1 : 0,
    nowIso()
  );
}

module.exports = {
  SCHEMA,
  createId,
  getDashboardData,
  getRecentConcepts,
  insertClaim,
  insertConcept,
  insertCommunityTask,
  insertFinding,
  insertMetric,
  insertPackage,
  insertReview,
  insertSlide,
  nowIso,
  openFactoryDb,
  recordFailure,
  transitionEntity,
};
