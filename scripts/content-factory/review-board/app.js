const elements = {
  concepts: document.querySelector('#concepts'),
  packages: document.querySelector('#packages'),
  conceptCount: document.querySelector('#concept-count'),
  packageCount: document.querySelector('#package-count'),
  bufferCount: document.querySelector('#buffer-count'),
  communityCount: document.querySelector('#community-count'),
  community: document.querySelector('#community'),
  toast: document.querySelector('#toast'),
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

async function post(url, body = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

function renderConcepts(concepts) {
  const pending = concepts.filter((item) => item.status === 'sourced');
  elements.concepts.innerHTML = pending.length
    ? pending
        .map(
          (item) => `
      <article class="work-row">
        <div class="row-head">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="meta">${escapeHtml(item.format)} · ${escapeHtml(
              item.pillar
            )} · test: ${escapeHtml(item.test_variable)}</p>
          </div>
          <span class="badge">${escapeHtml(item.status)}</span>
        </div>
        <p>${escapeHtml(item.hook)}</p>
        ${
          item.source_url
            ? `<a class="source" href="${escapeHtml(
                item.source_url
              )}" target="_blank" rel="noreferrer">Open research source</a>`
            : ''
        }
        <div class="actions">
          <button class="primary" data-concept="${escapeHtml(item.id)}">Approve concept</button>
        </div>
      </article>`
        )
        .join('')
    : '<p class="empty">No concepts are waiting for approval.</p>';
}

function renderPackages(packages) {
  elements.packages.innerHTML = packages.length
    ? packages
        .map((item) => {
          const reviews = item.reviews
            .map(
              (review) =>
                `<p class="review-line ${
                  review.verdict === 'PASS' ? 'pass' : 'fail'
                }">${escapeHtml(review.review_type)}: ${escapeHtml(
                  review.verdict
                )} · ${escapeHtml(review.reviewer)}</p>`
            )
            .join('');
          const slides = item.slides
            .map(
              (slide) =>
                `<img src="${escapeHtml(slide.media_url)}" alt="${escapeHtml(
                  slide.alt_text
                )}" />`
            )
            .join('');
          const claims = item.claims
            .map(
              (claim) =>
                `<li><a href="${escapeHtml(
                  claim.source_url
                )}" target="_blank" rel="noreferrer">${escapeHtml(
                  claim.claim_text
                )}</a> · ${escapeHtml(claim.verification_status)}</li>`
            )
            .join('');
          const prompts = item.storyboard
            .map((beat) => beat.image_prompt)
            .filter(Boolean)
            .map((prompt) => `<li>${escapeHtml(prompt)}</li>`)
            .join('');
          const canApprove = item.status === 'qa_passed';
          return `
          <article class="work-row">
            <div class="row-head">
              <div>
                <h3>${escapeHtml(item.title)}</h3>
                <p class="meta">${escapeHtml(item.package_type)} · ${escapeHtml(
                  item.pillar
                )} · $${Number(item.generation_cost).toFixed(2)}</p>
              </div>
              <span class="badge">${escapeHtml(item.status)}</span>
            </div>
            <div class="slides">${slides}</div>
            ${reviews || '<p class="note">No reviews recorded yet.</p>'}
            <details>
              <summary>Evidence, prompts, and disclosures</summary>
              <h4>Claims</h4>
              <ul>${claims || '<li>No factual claims linked.</li>'}</ul>
              <h4>Visual prompts</h4>
              <ul>${prompts || '<li>No generated-visual prompts.</li>'}</ul>
              <p class="note">${escapeHtml(
                JSON.stringify(item.disclosure)
              )}</p>
            </details>
            <p>${escapeHtml(item.caption_tiktok || '')}</p>
            ${
              canApprove
                ? `<div class="actions">
                    <button class="primary" data-package="${escapeHtml(
                      item.id
                    )}" data-approved="true">Approve final</button>
                    <button class="danger" data-package="${escapeHtml(
                      item.id
                    )}" data-approved="false">Request revision</button>
                  </div>`
                : ''
            }
          </article>`;
        })
        .join('')
    : '<p class="empty">No packages have been generated.</p>';
}

function renderCommunity(tasks) {
  elements.community.innerHTML = tasks.length
    ? tasks
        .map(
          (task) => `
      <article class="work-row">
        <div class="row-head">
          <div>
            <h3>${escapeHtml(task.platform)} comment</h3>
            <p class="meta">${escapeHtml(task.commenter || 'Unknown commenter')} · ${escapeHtml(
              task.priority
            )} priority</p>
          </div>
          <span class="badge">${escapeHtml(task.status)}</span>
        </div>
        <p><strong>Comment:</strong> ${escapeHtml(task.comment_excerpt)}</p>
        <p><strong>Draft reply:</strong> ${escapeHtml(task.response_draft)}</p>
        <a class="source" href="${escapeHtml(
          task.comment_url || task.post_url
        )}" target="_blank" rel="noreferrer">Open conversation</a>
        <div class="actions">
          <button class="primary" data-community="${escapeHtml(
            task.id
          )}" data-approved="true">Approve for manual reply</button>
          <button class="danger" data-community="${escapeHtml(
            task.id
          )}" data-approved="false">Reject</button>
        </div>
      </article>`
        )
        .join('')
    : '<p class="empty">No community replies are waiting.</p>';
}

async function load() {
  const response = await fetch('/api/dashboard');
  const data = await response.json();
  elements.conceptCount.textContent = data.summary.concepts_waiting;
  elements.packageCount.textContent = data.summary.packages_waiting;
  elements.bufferCount.textContent = data.summary.approved_for_buffer;
  elements.communityCount.textContent = data.summary.community_waiting;
  renderConcepts(data.concepts);
  renderPackages(data.packages);
  renderCommunity(data.community);
}

document.addEventListener('click', async (event) => {
  const conceptId = event.target.dataset.concept;
  const packageId = event.target.dataset.package;
  const communityId = event.target.dataset.community;
  try {
    if (conceptId) {
      await post(`/api/concepts/${encodeURIComponent(conceptId)}/approve`);
      toast('Concept approved for production.');
      await load();
    }
    if (packageId) {
      const approved = event.target.dataset.approved === 'true';
      const note = approved ? '' : window.prompt('What should be revised?') || '';
      await post(`/api/packages/${encodeURIComponent(packageId)}/decision`, {
        approved,
        note,
      });
      toast(approved ? 'Final package approved.' : 'Revision requested.');
      await load();
    }
    if (communityId) {
      const approved = event.target.dataset.approved === 'true';
      await post(`/api/community/${encodeURIComponent(communityId)}/decision`, {
        approved,
      });
      toast(
        approved
          ? 'Reply approved. Copy it into the native app.'
          : 'Reply rejected.'
      );
      await load();
    }
  } catch (error) {
    toast(error.message);
  }
});

document.querySelector('#refresh').addEventListener('click', load);
load().catch((error) => toast(error.message));
