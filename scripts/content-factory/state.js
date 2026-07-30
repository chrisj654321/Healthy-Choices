const STATE_ORDER = Object.freeze([
  'researched',
  'sourced',
  'concept_approved',
  'generated',
  'qa_passed',
  'founder_approved',
  'buffer_draft',
  'scheduled',
  'posted',
  'measured',
]);

const ALLOWED_TRANSITIONS = Object.freeze({
  researched: ['sourced', 'rejected'],
  sourced: ['concept_approved', 'rejected'],
  concept_approved: ['generated', 'rejected'],
  generated: ['qa_passed', 'revision_requested', 'rejected'],
  revision_requested: ['generated', 'rejected'],
  qa_passed: ['founder_approved', 'revision_requested', 'rejected'],
  founder_approved: ['buffer_draft', 'revision_requested'],
  buffer_draft: ['scheduled', 'revision_requested'],
  scheduled: ['posted', 'failed'],
  posted: ['measured'],
  measured: [],
  failed: ['buffer_draft', 'scheduled'],
  rejected: [],
});

function assertTransition(from, to) {
  if (from === to) return;
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid content state transition: ${from} -> ${to}`);
  }
}

function stateAtLeast(state, target) {
  return STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf(target);
}

module.exports = {
  ALLOWED_TRANSITIONS,
  STATE_ORDER,
  assertTransition,
  stateAtLeast,
};
