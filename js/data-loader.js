/**
 * data-loader.js — loads and normalises data.json.
 *
 * Everything downstream reads the normalised shape, so a missing or malformed
 * key in data.json degrades into an empty section instead of a crash.
 */
import { CONFIG } from './config.js';

const asArray = (v) => (Array.isArray(v) ? v : []);
const asObject = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

/**
 * Flattens `skills` + `skillCategories` into an ordered list of groups.
 * Categories declared in `skillCategories` come first (they carry the titles);
 * any extra key found in `skills` is appended with a humanised title.
 */
function normaliseSkills(raw) {
  const skills = asObject(raw.skills);
  const declared = asArray(raw.skillCategories);
  const seen = new Set();
  const groups = [];

  for (const cat of declared) {
    const id = cat?.id;
    if (!id || !Array.isArray(skills[id]) || !skills[id].length) continue;
    seen.add(id);
    groups.push({ id, title: cat.title || id, items: skills[id] });
  }

  for (const [id, items] of Object.entries(skills)) {
    if (seen.has(id) || !Array.isArray(items) || !items.length) continue;
    groups.push({ id, title: id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), items });
  }

  return groups;
}

function normalise(raw) {
  const profile = asObject(raw.profile);
  const about = asObject(raw.aboutMe);

  return {
    profile: {
      name: profile.name || 'Developer',
      title: profile.title || '',
      description: profile.description || '',
      status: profile.profileStatus || '',
    },
    about: {
      presentation: asObject(about.presentation).content || profile.description || '',
      languages: asArray(asObject(about.languages).items),
      softSkills: asArray(asObject(about.softSkills).items),
      passions: asArray(asObject(about.passions).items),
    },
    experience: asArray(raw.experience),
    education: asArray(raw.education),
    certifications: asArray(raw.certifications),
    skillGroups: normaliseSkills(raw),
  };
}

/**
 * Fetches data.json. Throws a human-readable Error the UI can render.
 */
export async function loadProfileData(url = CONFIG.dataUrl) {
  let res;
  try {
    res = await fetch(url, { cache: 'no-cache' });
  } catch (err) {
    throw new Error(
      `Could not load ${url}. If you opened this file directly, serve the folder over HTTP ` +
        `(e.g. "python3 -m http.server") — browsers block fetch on file:// URLs.`
    );
  }

  if (!res.ok) throw new Error(`Could not load ${url} — the server answered ${res.status} ${res.statusText}.`);

  let raw;
  try {
    raw = await res.json();
  } catch {
    throw new Error(`${url} is not valid JSON. Check it with a linter and reload.`);
  }

  return normalise(raw);
}

export default loadProfileData;
