const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const { getDashboardData } = require('./db');
const { communityDecision } = require('./community');
const { approveConcept } = require('./producer');
const { founderDecision } = require('./review');
const { safeJson } = require('./utils');

const BOARD_ROOT = path.join(__dirname, 'review-board');

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function dashboardPayload(db) {
  const concepts = db
    .prepare(
      `SELECT c.*, f.source_url
       FROM concepts c
       LEFT JOIN findings f ON f.id = c.finding_id
       ORDER BY c.updated_at DESC`
    )
    .all()
    .map((item) => ({
      ...item,
      storyboard: safeJson(item.storyboard_json, []),
      source_claim_ids: safeJson(item.source_claim_ids_json, []),
    }));
  const packages = getDashboardData(db).map((item) => ({
      ...item,
      slides: item.slides.map((slide) => ({
      ...slide,
      media_url: `/media/${encodeURIComponent(item.id)}/${encodeURIComponent(
        path.basename(slide.rendered_path)
      )}`,
      })),
  }));
  const community = db
    .prepare(
      `SELECT * FROM community_tasks
       WHERE status = 'pending_review'
       ORDER BY CASE priority WHEN 'high' THEN 0 ELSE 1 END, created_at ASC`
    )
    .all();
  return {
    generated_at: new Date().toISOString(),
    concepts,
    packages,
    community,
    summary: {
      concepts_waiting: concepts.filter((item) => item.status === 'sourced').length,
      packages_waiting: packages.filter((item) => item.status === 'qa_passed').length,
      approved_for_buffer: packages.filter(
        (item) => item.status === 'founder_approved'
      ).length,
      community_waiting: community.length,
    },
  };
}

function serveStatic(response, filePath, contentType) {
  if (!fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(response);
}

function serveMedia(db, response, pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const packageId = decodeURIComponent(parts[1] || '');
  const fileName = path.basename(decodeURIComponent(parts[2] || ''));
  const contentPackage = db
    .prepare('SELECT package_dir FROM packages WHERE id = ?')
    .get(packageId);
  if (!contentPackage || !fileName) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  const root = path.resolve(contentPackage.package_dir);
  const filePath = path.resolve(root, fileName);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  serveStatic(response, filePath, 'image/jpeg');
}

function createReviewServer(db, config) {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    try {
      if (request.method === 'GET' && url.pathname === '/api/dashboard') {
        sendJson(response, 200, dashboardPayload(db));
        return;
      }
      if (request.method === 'GET' && url.pathname.startsWith('/media/')) {
        serveMedia(db, response, url.pathname);
        return;
      }
      const conceptMatch = url.pathname.match(/^\/api\/concepts\/([^/]+)\/approve$/);
      if (request.method === 'POST' && conceptMatch) {
        approveConcept(db, decodeURIComponent(conceptMatch[1]), 'founder');
        sendJson(response, 200, { ok: true });
        return;
      }
      const packageMatch = url.pathname.match(/^\/api\/packages\/([^/]+)\/decision$/);
      if (request.method === 'POST' && packageMatch) {
        const body = await readBody(request);
        founderDecision(
          db,
          decodeURIComponent(packageMatch[1]),
          Boolean(body.approved),
          body.note || ''
        );
        sendJson(response, 200, { ok: true });
        return;
      }
      const communityMatch = url.pathname.match(
        /^\/api\/community\/([^/]+)\/decision$/
      );
      if (request.method === 'POST' && communityMatch) {
        const body = await readBody(request);
        communityDecision(
          db,
          decodeURIComponent(communityMatch[1]),
          Boolean(body.approved),
          body.note || ''
        );
        sendJson(response, 200, { ok: true });
        return;
      }
      if (request.method === 'GET' && url.pathname === '/') {
        serveStatic(
          response,
          path.join(BOARD_ROOT, 'index.html'),
          'text/html; charset=utf-8'
        );
        return;
      }
      if (request.method === 'GET' && url.pathname === '/app.js') {
        serveStatic(
          response,
          path.join(BOARD_ROOT, 'app.js'),
          'application/javascript; charset=utf-8'
        );
        return;
      }
      if (request.method === 'GET' && url.pathname === '/styles.css') {
        serveStatic(
          response,
          path.join(BOARD_ROOT, 'styles.css'),
          'text/css; charset=utf-8'
        );
        return;
      }
      response.writeHead(404);
      response.end('Not found');
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
  });
}

function startReviewBoard(db, config) {
  const server = createReviewServer(db, config);
  const { host, port } = config.reviewBoard;
  server.listen(port, host, () => {
    console.log(`Food Expos\u00e9 review board: http://${host}:${port}`);
  });
  return server;
}

module.exports = {
  createReviewServer,
  dashboardPayload,
  startReviewBoard,
};
