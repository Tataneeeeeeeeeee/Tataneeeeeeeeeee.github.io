/**
 * translate.js — traduction automatique du contenu via une API externe.
 *
 * Le contenu éditorial (data.json, et si on l'active les descriptions de dépôts)
 * est écrit en anglais une seule fois ; cette couche le fait traduire à la volée
 * puis met le résultat en cache dans localStorage, de sorte qu'un visiteur ne
 * paie l'aller-retour réseau qu'au tout premier passage en français.
 *
 * Trois fournisseurs sont câblés (voir CONFIG.translation) :
 *  - `mymemory`      : aucun compte requis, quota quotidien modeste ;
 *  - `libretranslate`: instance publique ou auto-hébergée ;
 *  - `deepl`         : meilleure qualité, clé obligatoire.
 *
 * Limites assumées de cette approche : la clé éventuelle est visible dans le JS
 * public, la première traduction ajoute une latence, la qualité n'est pas
 * relue, et le site perd le français s'il est consulté hors-ligne avec un cache
 * vide. Les libellés de l'interface, eux, ne passent jamais par ici (i18n.js).
 */
import { CONFIG } from './config.js';

export class TranslationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TranslationError';
  }
}

const CACHE_PREFIX = 'portfolio:tr:';
const REQUEST_TIMEOUT_MS = 12000;

const settings = () => ({
  provider: 'none',
  endpoint: '',
  apiKey: '',
  email: '',
  cacheTtlDays: 30,
  overrides: {},
  ...(CONFIG.translation || {}),
});

/** Traductions écrites à la main, prioritaires sur l'API (voir CONFIG). */
const overrideFor = (text, target) => settings().overrides?.[target]?.[text] ?? null;

/**
 * Garde-fou : une traduction automatique qui perd un nombre présent dans la
 * source est rejetée. C'est le cas d'échec le plus coûteux — « TOEIC score:
 * 700 » rendu « Score TOEIC : » passe inaperçu à la relecture et fait mentir
 * le CV. On préfère afficher l'anglais.
 */
function keepsNumbers(source, translation) {
  const numbers = source.match(/\d+/g);
  if (!numbers) return true;
  return numbers.every((n) => translation.includes(n));
}

/** Le fournisseur est-il utilisable en l'état (clé présente si requise) ? */
export function isTranslationEnabled() {
  const { provider, apiKey, endpoint } = settings();
  if (provider === 'deepl') return Boolean(apiKey);
  if (provider === 'libretranslate') return Boolean(endpoint);
  return provider === 'mymemory';
}

/* ------------------------------------------------------------------ cache -- */

/** FNV-1a 32 bits : court, stable, suffisant pour indexer du texte. */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

const cacheKey = (text, target) => `${CACHE_PREFIX}${target}:${hash(text)}`;

function readCache(text, target) {
  try {
    const raw = localStorage.getItem(cacheKey(text, target));
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const ttl = settings().cacheTtlDays * 86400000;
    if (!entry || typeof entry.v !== 'string' || Date.now() - entry.t > ttl) return null;
    return entry.v;
  } catch {
    return null;
  }
}

function writeCache(text, target, value) {
  try {
    localStorage.setItem(cacheKey(text, target), JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // Quota plein : on purge nos entrées et on abandonne le cache pour ce tour.
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(CACHE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* rien de mieux à tenter */ }
  }
}

/** Vide le cache de traduction (exposé pour le bouton "vider le cache"). */
export function clearTranslationCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* stockage indisponible */ }
}

/* -------------------------------------------------------------- transport -- */

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new TranslationError(`Translation API answered ${res.status} ${res.statusText}.`);
    return await res.json();
  } catch (err) {
    if (err instanceof TranslationError) throw err;
    throw new TranslationError(
      err.name === 'AbortError'
        ? 'The translation API timed out.'
        : 'Could not reach the translation API (network, CORS or quota).'
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Exécute `fn` sur chaque élément, `limit` en vol à la fois, ordre préservé. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

/**
 * Découpe un texte trop long pour l'API en morceaux qui tombent sur une fin de
 * phrase (et, en dernier recours, sur une espace).
 */
function chunk(text, max) {
  if (text.length <= max) return [text];
  const parts = [];
  let rest = text;
  while (rest.length > max) {
    const window = rest.slice(0, max);
    const cut = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
    const at = cut > max * 0.4 ? cut + 1 : (window.lastIndexOf(' ') > 0 ? window.lastIndexOf(' ') : max);
    parts.push(rest.slice(0, at).trim());
    rest = rest.slice(at).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

/* ------------------------------------------------------------ fournisseurs -- */

const PROVIDERS = {
  /** MyMemory : une requête GET par texte, 500 octets maximum par requête. */
  async mymemory(texts, target) {
    const { email } = settings();
    return mapLimit(texts, 4, async (text) => {
      const pieces = await mapLimit(chunk(text, 460), 2, async (piece) => {
        const url = new URL('https://api.mymemory.translated.net/get');
        url.searchParams.set('q', piece);
        url.searchParams.set('langpair', `en|${target}`);
        if (email) url.searchParams.set('de', email);
        const body = await request(url);
        if (body.responseStatus && Number(body.responseStatus) !== 200) {
          throw new TranslationError(body.responseDetails || 'Translation refused by MyMemory.');
        }
        return body.responseData?.translatedText || piece;
      });
      return pieces.join(' ');
    });
  },

  /** LibreTranslate : un seul POST, tableau de textes. */
  async libretranslate(texts, target) {
    const { endpoint, apiKey } = settings();
    const body = await request(endpoint.replace(/\/+$/, '') + '/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts, source: 'en', target, format: 'text', api_key: apiKey || undefined }),
    });
    const out = body.translatedText;
    if (!Array.isArray(out) || out.length !== texts.length) {
      throw new TranslationError('Unexpected answer from LibreTranslate.');
    }
    return out;
  },

  /**
   * DeepL : un POST, un paramètre `text` répété.
   * Selon le plan, l'API peut refuser les appels directs depuis un navigateur
   * (CORS) — il faut alors passer par un petit proxy et pointer `endpoint`
   * dessus.
   */
  async deepl(texts, target) {
    const { apiKey, endpoint } = settings();
    const params = new URLSearchParams();
    for (const text of texts) params.append('text', text);
    params.set('source_lang', 'EN');
    params.set('target_lang', target.toUpperCase());
    const url = endpoint || (apiKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate');
    const body = await request(url, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const out = body.translations?.map((tr) => tr.text);
    if (!out || out.length !== texts.length) throw new TranslationError('Unexpected answer from DeepL.');
    return out;
  },
};

/* --------------------------------------------------------------- API haute -- */

/**
 * Traduit une liste de textes vers `target`.
 * Les doublons ne sont demandés qu'une fois, le cache court-circuite le réseau,
 * et un échec ne laisse rien de partiel : l'appelant retombe sur l'anglais.
 * @returns {Promise<Map<string, string>>} source → traduction
 */
export async function translateTexts(texts, target) {
  const result = new Map();
  const missing = [];

  for (const text of new Set(texts.filter((s) => s && s.trim()))) {
    const manual = overrideFor(text, target);
    if (manual) { result.set(text, manual); continue; }
    const cached = readCache(text, target);
    if (cached !== null) result.set(text, cached);
    else missing.push(text);
  }

  if (!missing.length) return result;
  if (!isTranslationEnabled()) throw new TranslationError('No translation provider configured.');

  const provider = PROVIDERS[settings().provider];
  const translated = await provider(missing, target);

  missing.forEach((source, i) => {
    let value = translated[i] || source;
    if (!keepsNumbers(source, value)) {
      console.warn(`[portfolio] traduction rejetée (nombre perdu) : "${source}" → "${value}"`);
      value = source;
    }
    writeCache(source, target, value);
    result.set(source, value);
  });

  return result;
}

/* ------------------------------------------------- traduction des données -- */

/** Champs traduisibles de la forme normalisée produite par data-loader.js. */
function translatableRefs(data) {
  const refs = [];
  const push = (obj, key) => {
    if (obj && typeof obj[key] === 'string' && obj[key].trim()) refs.push([obj, key]);
  };
  const pushAll = (list, keys) => {
    for (const item of list || []) for (const key of keys) push(item, key);
  };

  // Ni le nom, ni les noms d'écoles/entreprises, ni les technologies : traduire
  // « Django REST Framework » ou « Epitech » ne peut que les abîmer.
  push(data.profile, 'title');
  push(data.profile, 'description');
  push(data.about, 'presentation');
  pushAll(data.about?.languages, ['name', 'detail']);
  pushAll(data.about?.softSkills, ['name', 'description']);
  pushAll(data.about?.passions, ['name', 'detail']);
  pushAll(data.experience, ['title', 'description']);
  pushAll(data.education, ['degree', 'details']);
  pushAll(data.certifications, ['title', 'description']);
  pushAll(data.skillGroups, ['title']);

  return refs;
}

/**
 * Renvoie une copie de `data` traduite dans `target`.
 * L'objet d'origine n'est jamais modifié : il reste la version anglaise de
 * référence, réutilisée telle quelle quand on repasse en anglais.
 */
export async function translateData(data, target) {
  const clone = structuredClone(data);
  const refs = translatableRefs(clone);
  const dictionary = await translateTexts(refs.map(([obj, key]) => obj[key]), target);
  for (const [obj, key] of refs) obj[key] = dictionary.get(obj[key]) || obj[key];
  return clone;
}

/** Traduit les descriptions de dépôts GitHub (désactivé par défaut : quota). */
export async function translateRepos(repos, target) {
  const descriptions = repos.map((r) => r.description).filter(Boolean);
  if (!descriptions.length) return repos;
  const dictionary = await translateTexts(descriptions, target);
  return repos.map((r) => (r.description ? { ...r, description: dictionary.get(r.description) || r.description } : r));
}
