/**
 * projects.js — repository cards and the detail modal (README, releases, chart).
 */
import { el, $, escapeHtml, icon, relativeTime, formatDate, skeletonCards, notice } from './ui.js';
import { t } from './i18n.js';
import { renderLanguageBar, renderLanguageDonut, languageColor } from './charts.js';
import { fetchRepoDetails, fetchLanguages, RateLimitError } from './github-api.js';

/** Per-repo detail cache, so reopening a modal is instant. */
const detailCache = new Map();

/* ----------------------------------------------------------------- cards -- */

function statChip(iconName, value, label) {
  return el('span', { class: 'stat', title: label, html: `${icon(iconName, { size: 14 })}<span>${escapeHtml(value)}</span>` });
}

export function renderRepoCard(repo, onOpen) {
  const card = el('article', { class: 'card reveal', tabindex: '0', role: 'button',
    'aria-label': t('card.openDetailsFor', { name: repo.name }) },
    el('header', { class: 'card__head' },
      el('h3', { class: 'card__title' },
        el('span', { class: 'card__dot', style: `background:${languageColor(repo.language || repo.name)}` }),
        repo.name),
      repo.source ? el('span', { class: 'badge badge--org', text: repo.source }) : null,
      repo.isArchived ? el('span', { class: 'badge badge--muted', text: t('badge.archived') }) : null,
      repo.isFork ? el('span', { class: 'badge badge--muted', text: t('badge.fork') }) : null
    ),
    el('p', { class: 'card__desc', text: repo.description || t('card.noDescription') }),
    el('div', { class: 'card__langbar', dataset: { repo: repo.fullName } }),
    el('ul', { class: 'card__topics' }, repo.topics.slice(0, 4).map((t) => el('li', { class: 'topic', text: t }))),
    el('footer', { class: 'card__foot' },
      el('div', { class: 'card__stats' },
        repo.language ? el('span', { class: 'stat stat--lang' },
          el('span', { class: 'chip__dot', style: `background:${languageColor(repo.language)}` }), repo.language) : null,
        statChip('star', repo.stars, t('stat.stars')),
        statChip('fork', repo.forks, t('stat.forks'))),
      el('span', { class: 'card__updated', text: t('card.updated', { when: relativeTime(repo.updatedAt) }) })
    ),
    el('span', { class: 'card__cta', html: `${escapeHtml(t('card.openDetails'))} ${icon('external', { size: 14 })}` })
  );

  const open = () => onOpen(repo);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  return card;
}

/**
 * Fills each card's language bar in the background, one repo at a time so a
 * long list does not burn the rate limit in a single burst.
 *
 * Only `/languages` is requested here (one call per repo) — the heavier README
 * and releases are left to the modal, and hit the cache by then.
 */
export async function hydrateLanguageBars(repos, container) {
  for (const repo of repos) {
    const slot = container.querySelector(`.card__langbar[data-repo="${CSS.escape(repo.fullName)}"]`);
    if (!slot) continue;
    try {
      const languages = await fetchLanguages(repo.owner, repo.name);
      slot.replaceChildren(renderLanguageBar(languages));
    } catch {
      // Rate limited or offline: drop the remaining bars, the cards still read fine.
      container.querySelectorAll('.card__langbar').forEach((n) => n.remove());
      break;
    }
  }
}

/** Fetches (and memoises) README + releases + languages for a repo. */
async function getDetails(repo) {
  if (detailCache.has(repo.fullName)) return detailCache.get(repo.fullName);
  const promise = fetchRepoDetails(repo.owner, repo.name);
  detailCache.set(repo.fullName, promise);
  try {
    const value = await promise;
    detailCache.set(repo.fullName, value);
    return value;
  } catch (err) {
    detailCache.delete(repo.fullName);
    throw err;
  }
}

/**
 * Renders a repo grid, with skeletons swapped out on resolution.
 * @param {HTMLElement} container
 * @param {Promise<object[]>} reposPromise
 */
export async function renderRepoSection(container, reposPromise, { onOpen, emptyMessage }) {
  container.replaceChildren(skeletonCards(4));
  let repos;
  try {
    repos = await reposPromise;
  } catch (err) {
    container.replaceChildren(
      notice(
        err instanceof RateLimitError
          ? `${err.message} ${t('repos.cachedFallback')}`
          : err.message || t('repos.error'),
        { tone: 'error', action: { label: t('action.retry'), onClick: () => location.reload() } }
      )
    );
    return [];
  }

  if (!repos.length) {
    container.replaceChildren(notice(emptyMessage || t('repos.error'), { tone: 'muted' }));
    return [];
  }

  container.replaceChildren(...repos.map((r) => renderRepoCard(r, onOpen)));
  hydrateLanguageBars(repos, container);
  return repos;
}

/* ----------------------------------------------------------------- modal -- */

let modalState = { lastFocused: null, onClose: null };

function markdownToHtml(markdown, repo) {
  if (!window.marked) return `<pre class="readme__raw">${escapeHtml(markdown)}</pre>`;
  window.marked.setOptions({ gfm: true, breaks: false });
  const html = window.marked.parse(markdown);
  const clean = window.DOMPurify
    ? window.DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })
    : html;
  // Rewrite relative links/images so they resolve against the repo.
  const holder = document.createElement('div');
  holder.innerHTML = clean;
  const raw = `https://raw.githubusercontent.com/${repo.fullName}/${repo.defaultBranch || 'HEAD'}/`;
  const blob = `https://github.com/${repo.fullName}/blob/${repo.defaultBranch || 'HEAD'}/`;
  holder.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:)?\/\//.test(src) && !src.startsWith('data:')) img.src = raw + src.replace(/^\.?\//, '');
    img.loading = 'lazy';
  });
  holder.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!/^(https?:|mailto:|#)/.test(href)) a.href = blob + href.replace(/^\.?\//, '');
    if (a.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  });
  return holder.innerHTML;
}

function releaseList(releases) {
  if (!releases.length) return notice(t('modal.noReleases'), { tone: 'muted' });
  return el('ul', { class: 'releases' }, releases.map((r) =>
    el('li', { class: 'release' },
      el('div', { class: 'release__head' },
        el('a', { class: 'release__tag', href: r.url, target: '_blank', rel: 'noopener', html: `${icon('tag', { size: 14 })}<span>${escapeHtml(r.tag)}</span>` }),
        el('span', { class: 'release__name', text: r.name !== r.tag ? r.name : '' }),
        r.isPrerelease ? el('span', { class: 'badge badge--warn', text: t('badge.prerelease') }) : null,
        el('time', { class: 'release__date', text: formatDate(r.publishedAt) })),
      r.body ? el('p', { class: 'release__body', text: r.body.slice(0, 320).trim() + (r.body.length > 320 ? '…' : '') }) : null)));
}

export function initModal() {
  const modal = $('#modal');
  const closeBtn = $('#modal-close');

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    modalState.onClose?.();
    modalState.lastFocused?.focus?.();
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.classList.contains('modal__backdrop')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });

  // Keep tab focus inside the dialog while it is open.
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { close };
}

/** Opens the detail modal for a repo and lazily loads its content. */
export async function openRepoModal(repo, { onOpen, onClose } = {}) {
  const modal = $('#modal');
  modalState.lastFocused = document.activeElement;
  modalState.onClose = onClose;

  $('#modal-title').textContent = repo.name;
  $('#modal-owner').textContent = repo.owner;
  $('#modal-desc').textContent = repo.description || t('card.noDescription');
  $('#modal-link').href = repo.url;

  const meta = $('#modal-meta');
  meta.replaceChildren(
    statChip('star', repo.stars, t('stat.stars')),
    statChip('fork', repo.forks, t('stat.forks')),
    repo.watchers != null ? statChip('eye', repo.watchers, t('stat.watchers')) : null,
    repo.license ? el('span', { class: 'stat', text: repo.license }) : null,
    el('span', { class: 'stat', text: t('card.updated', { when: relativeTime(repo.updatedAt) }) })
  );

  const chartSlot = $('#modal-chart');
  const releasesSlot = $('#modal-releases');
  const readmeSlot = $('#modal-readme');
  chartSlot.replaceChildren(el('div', { class: 'sk sk--donut' }));
  releasesSlot.replaceChildren(el('div', { class: 'sk sk--line' }), el('div', { class: 'sk sk--line sk--short' }));
  readmeSlot.replaceChildren(el('div', { class: 'sk sk--line' }), el('div', { class: 'sk sk--line' }), el('div', { class: 'sk sk--line sk--short' }));

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  $('#modal-close').focus();
  onOpen?.();

  try {
    const { readme, releases, languages } = await getDetails(repo);
    chartSlot.replaceChildren(renderLanguageDonut(languages));
    releasesSlot.replaceChildren(releaseList(releases));
    readmeSlot.innerHTML = readme
      ? `<div class="readme">${markdownToHtml(readme.markdown, repo)}</div>`
      : '';
    if (!readme) readmeSlot.replaceChildren(notice(t('modal.noReadme'), { tone: 'muted' }));
  } catch (err) {
    const message = err instanceof RateLimitError
      ? err.message
      : t('modal.error');
    chartSlot.replaceChildren();
    releasesSlot.replaceChildren();
    readmeSlot.replaceChildren(notice(message, { tone: 'error' }));
  }
}
