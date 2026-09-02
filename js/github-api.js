/**
 * github-api.js — thin, cached wrapper around the GitHub REST API.
 *
 * - Every GET goes through `ghFetch`, which reads/writes a localStorage cache.
 * - Rate limiting (403/429 with x-ratelimit-remaining: 0) raises a RateLimitError
 *   carrying the reset time so the UI can show a friendly countdown.
 * - Stale cache is served as a fallback whenever the network or the quota fails.
 */
import { CONFIG } from './config.js';

const API = 'https://api.github.com';
const CACHE_PREFIX = 'ghcache:v1:';

export class RateLimitError extends Error {
  constructor(resetDate) {
    const when = resetDate ? resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    super(when ? `GitHub API rate limit reached. It resets around ${when}.` : 'GitHub API rate limit reached.');
    this.name = 'RateLimitError';
    this.resetDate = resetDate || null;
  }
}

export class NotFoundError extends Error {
  constructor(path) {
    super(`Not found: ${path}`);
    this.name = 'NotFoundError';
  }
}

/** Live snapshot of the quota, updated from response headers. */
export const rateLimit = { limit: null, remaining: null, reset: null };

/* ------------------------------------------------------------------ cache -- */

function cacheKey(path) {
  return CACHE_PREFIX + path;
}

function readCache(path) {
  try {
    const raw = localStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.t !== 'number') return null;
    const ageMinutes = (Date.now() - entry.t) / 60000;
    return { data: entry.d, etag: entry.e || null, fresh: ageMinutes < CONFIG.cacheTtlMinutes };
  } catch {
    return null;
  }
}

function writeCache(path, data, etag) {
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify({ t: Date.now(), d: data, e: etag }));
  } catch {
    // Quota exceeded — drop our own entries and give up silently.
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(CACHE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }
}

/** Wipes every cached GitHub response (exposed for a manual "refresh" action). */
export function clearCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ fetch -- */

function trackRateLimit(headers) {
  const remaining = headers.get('x-ratelimit-remaining');
  const limit = headers.get('x-ratelimit-limit');
  const reset = headers.get('x-ratelimit-reset');
  if (remaining !== null) rateLimit.remaining = Number(remaining);
  if (limit !== null) rateLimit.limit = Number(limit);
  if (reset !== null) rateLimit.reset = new Date(Number(reset) * 1000);
}

/**
 * GETs `path` (relative to api.github.com) as JSON.
 * @param {string} path
 * @param {{accept?: string, allow404?: boolean}} [opts]
 */
export async function ghFetch(path, opts = {}) {
  const cached = readCache(path);
  if (cached?.fresh) return cached.data;

  const headers = { Accept: opts.accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (CONFIG.githubToken) headers.Authorization = `Bearer ${CONFIG.githubToken}`;
  // Conditional request: a 304 does not count against the rate limit.
  if (cached?.etag) headers['If-None-Match'] = cached.etag;

  let res;
  try {
    res = await fetch(API + path, { headers });
  } catch (err) {
    if (cached) return cached.data; // offline → stale is better than nothing
    throw new Error('Could not reach the GitHub API. Check your connection and retry.');
  }

  trackRateLimit(res.headers);

  if (res.status === 304 && cached) {
    writeCache(path, cached.data, cached.etag); // refresh the timestamp
    return cached.data;
  }

  if (res.status === 404) {
    if (opts.allow404) return null;
    throw new NotFoundError(path);
  }

  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    if (cached) return cached.data;
    throw new RateLimitError(rateLimit.reset);
  }

  if (!res.ok) {
    if (cached) return cached.data;
    throw new Error(`GitHub API error ${res.status} on ${path}`);
  }

  const etag = res.headers.get('etag');
  const data = await res.json();
  writeCache(path, data, etag);
  return data;
}

/* ---------------------------------------------------------------- helpers -- */

function isHidden(repo) {
  const hidden = (CONFIG.hiddenRepos || []).map((n) => n.toLowerCase());
  if (hidden.includes(repo.name.toLowerCase())) return true;
  if (CONFIG.hideForks && repo.fork) return true;
  return false;
}

/** Keeps only the fields the UI needs, so cached payloads stay small. */
function slimRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner?.login,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.subscribers_count ?? repo.watchers_count,
    openIssues: repo.open_issues_count,
    topics: repo.topics || [],
    isFork: repo.fork,
    isArchived: repo.archived,
    license: repo.license?.spdx_id || null,
    createdAt: repo.created_at,
    updatedAt: repo.pushed_at || repo.updated_at,
    defaultBranch: repo.default_branch,
  };
}

const byRecency = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);

/** Public repos of a user, newest push first. */
export async function fetchUserRepos(username) {
  const data = await ghFetch(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`);
  return (data || []).filter((r) => !isHidden(r)).map(slimRepo).sort(byRecency);
}

/** Public repos of an organisation, newest push first. */
export async function fetchOrgRepos(org) {
  const data = await ghFetch(`/orgs/${encodeURIComponent(org)}/repos?per_page=100&sort=updated&type=public`);
  return (data || []).filter((r) => !isHidden(r)).map(slimRepo).sort(byRecency);
}

/** Public profile of a user or org (used for the avatar in the hero). */
export async function fetchProfile(login) {
  return ghFetch(`/users/${encodeURIComponent(login)}`, { allow404: true });
}

/** README as raw markdown, or null when the repo has none. */
export async function fetchReadme(owner, repo) {
  const data = await ghFetch(`/repos/${owner}/${repo}/readme`, { allow404: true });
  if (!data || !data.content) return null;
  try {
    // atob() is latin1 — round-trip through TextDecoder to keep UTF-8 intact.
    const binary = atob(data.content.replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { markdown: new TextDecoder('utf-8').decode(bytes), path: data.path, url: data.html_url };
  } catch {
    return null;
  }
}

/** Up to `limit` most recent releases. Empty array when the repo has none. */
export async function fetchReleases(owner, repo, limit = 5) {
  const data = await ghFetch(`/repos/${owner}/${repo}/releases?per_page=${limit}`, { allow404: true });
  if (!Array.isArray(data)) return [];
  return data.map((r) => ({
    id: r.id,
    name: r.name || r.tag_name,
    tag: r.tag_name,
    url: r.html_url,
    publishedAt: r.published_at || r.created_at,
    isPrerelease: r.prerelease,
    isDraft: r.draft,
    body: r.body || '',
    assets: (r.assets || []).length,
  }));
}

/** Byte counts per language, sorted descending. */
export async function fetchLanguages(owner, repo) {
  const data = await ghFetch(`/repos/${owner}/${repo}/languages`, { allow404: true });
  if (!data || typeof data !== 'object') return [];
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (!total) return [];
  return Object.entries(data)
    .map(([name, bytes]) => ({ name, bytes, percent: (bytes / total) * 100 }))
    .sort((a, b) => b.bytes - a.bytes);
}

/** Everything the detail modal needs, fetched in parallel. */
export async function fetchRepoDetails(owner, repo) {
  const [readme, releases, languages] = await Promise.all([
    fetchReadme(owner, repo).catch(() => null),
    fetchReleases(owner, repo).catch(() => []),
    fetchLanguages(owner, repo).catch(() => []),
  ]);
  return { readme, releases, languages };
}
