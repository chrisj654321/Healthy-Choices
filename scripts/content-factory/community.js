const { insertCommunityTask } = require('./db');
const { readJson } = require('./utils');

const VALID_PLATFORMS = new Set(['tiktok', 'instagram', 'youtube']);

function validateCommunityTask(task, index) {
  const required = ['platform', 'post_url', 'comment_excerpt', 'response_draft'];
  const missing = required.filter((field) => !task[field]);
  if (missing.length) {
    throw new Error(`Community task ${index + 1} is missing: ${missing.join(', ')}`);
  }
  if (!VALID_PLATFORMS.has(task.platform)) {
    throw new Error(`Community task ${index + 1} has an unsupported platform.`);
  }
  try {
    const url = new URL(task.post_url);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`Community task ${index + 1} has an invalid post URL.`);
  }
}

function readCommunityTasks(inputPath) {
  const payload = readJson(inputPath);
  const tasks = Array.isArray(payload) ? payload : payload.tasks;
  if (!Array.isArray(tasks)) {
    throw new Error('Community input must be an array or an object with tasks[].');
  }
  tasks.forEach(validateCommunityTask);
  return tasks;
}

function importCommunityTasks(db, inputPath) {
  return readCommunityTasks(inputPath).map((task) => insertCommunityTask(db, task));
}

function communityDecision(db, taskId, approved, note = '') {
  const task = db
    .prepare('SELECT * FROM community_tasks WHERE id = ?')
    .get(taskId);
  if (!task) throw new Error(`Community task not found: ${taskId}`);
  if (task.status !== 'pending_review') {
    throw new Error('Only pending community drafts can be reviewed.');
  }
  db.prepare(
    `UPDATE community_tasks
     SET status = ?, founder_note = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    approved ? 'approved_for_manual_reply' : 'rejected',
    note || null,
    new Date().toISOString(),
    taskId
  );
}

module.exports = {
  VALID_PLATFORMS,
  communityDecision,
  importCommunityTasks,
  readCommunityTasks,
  validateCommunityTask,
};
