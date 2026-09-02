/**
 * main.js — application entry point. Wires data, GitHub, i18n, UI and animations.
 *
 * data.json est la version anglaise de référence. Le passage en français
 * traduit une copie via l'API configurée (translate.js), la mémorise pour la
 * session, puis relance simplement le rendu : aucun composant ne connaît la
 * langue, ils reçoivent des données déjà traduites et lisent leurs libellés
 * dans i18n.js.
 */
import { CONFIG } from './config.js';
import { loadProfileData } from './data-loader.js';
import { fetchUserRepos, fetchOrgRepos, fetchProfile, clearCache, rateLimit, RateLimitError } from './github-api.js';
import { $, el, notice, toast, renderHero, renderAbout, renderSkills, renderContact, initNavigation, icon } from './ui.js';
import { renderRepoSection, initModal, openRepoModal } from './projects.js';
import { initSmoothScroll, initScrollAnimations, animateHero, initCardHover, animateModalOpen, refreshScrollTriggers } from './animations.js';
import { initTheme } from './theme.js';
import { initLang, setLang, getLang, applyStaticText, initLangSwitch, setLangBusy, t } from './i18n.js';
import { translateData, translateRepos, isTranslationEnabled, clearTranslationCache } from './translate.js';

/** Tout ce qu'un changement de langue doit pouvoir redessiner sans refetch. */
const state = {
  /** Données anglaises issues de data.json — jamais modifiées. */
  source: null,
  /** Données affichées (anglaises ou traduites). */
  data: null,
  /** Profil GitHub, pour l'avatar. */
  gh: null,
  /** Dépôts chargés depuis GitHub, descriptions anglaises d'origine. */
  repos: [],
  scroller: null,
};

/** Traductions déjà obtenues, par langue : un aller-retour réseau par session. */
const translated = new Map();

async function boot() {
  initLang();
  applyStaticText();
  initTheme();

  state.scroller = initSmoothScroll();
  initNavigation({ scrollTo: state.scroller.scrollTo });
  initModal();
  initCardHover();
  initLangSwitch(switchLanguage);

  /* ---------------------------------------------------- 1. local profile -- */
  try {
    state.source = await loadProfileData();
  } catch (err) {
    $('#app-error').replaceChildren(
      notice(err.message, { tone: 'error', action: { label: t('action.reload'), onClick: () => location.reload() } })
    );
    $('#app-error').hidden = false;
    document.body.classList.add('has-fatal-error');
    return;
  }

  state.data = await dataForLang(getLang());
  renderProfile();
  animateHero();
  initScrollAnimations();

  /* ----------------------------------------------------- 2. github data -- */
  fetchProfile(CONFIG.githubUsername)
    .then((gh) => {
      if (!gh) return;
      state.gh = gh;
      renderHero(state.data, gh);
    })
    .catch(() => { /* avatar is optional */ });

  state.repos = await renderRepoSection($('#personal-projects'), collectRepos(), {
    onOpen: openModal,
    emptyMessage: t('repos.empty', { user: CONFIG.githubUsername, org: CONFIG.githubOrg }),
  });
  // Les cartes viennent d'être posées en anglais ; on ne les redessine que si
  // la traduction des descriptions est demandée.
  if (getLang() !== 'en' && CONFIG.translation?.translateRepoDescriptions) await renderRepos(getLang());

  renderRepoCount();
  initScrollAnimations();
  refreshScrollTriggers();
  renderRateLimitBadge();
}

const openModal = (repo) => openRepoModal(repo, {
  onOpen: () => { state.scroller?.stop?.(); animateModalOpen(); },
  onClose: () => state.scroller?.start?.(),
});

/* ------------------------------------------------------------------ i18n -- */

/**
 * Données dans la langue demandée. L'anglais sort de data.json tel quel ; toute
 * autre langue passe par l'API de traduction, avec repli sur l'anglais en cas
 * d'échec (le visiteur garde une page complète, juste pas traduite).
 */
async function dataForLang(lang) {
  if (lang === 'en' || !state.source) return state.source;
  if (translated.has(lang)) return translated.get(lang);

  if (!isTranslationEnabled()) {
    toast(t('translate.failed'), { tone: 'warn' });
    return state.source;
  }

  setLangBusy(true);
  try {
    const data = await translateData(state.source, lang);
    translated.set(lang, data);
    return data;
  } catch (err) {
    console.warn('[portfolio]', err);
    toast(t('translate.failed'), { tone: 'warn' });
    return state.source;
  } finally {
    setLangBusy(false);
  }
}

/** Descriptions de dépôts : traduites seulement si la config l'autorise. */
async function translateReposIfEnabled(repos, lang) {
  if (lang === 'en' || !repos.length) return repos;
  if (!CONFIG.translation?.translateRepoDescriptions || !isTranslationEnabled()) return repos;
  try {
    return await translateRepos(repos, lang);
  } catch (err) {
    console.warn('[portfolio]', err);
    return repos;
  }
}

/**
 * Bascule de langue : libellés statiques, contenu traduit, puis re-rendu.
 * Les dépôts sont redessinés depuis la liste déjà en mémoire — aucun appel
 * supplémentaire à l'API GitHub.
 */
async function switchLanguage(lang) {
  setLang(lang);
  applyStaticText();

  state.data = await dataForLang(lang);
  renderProfile();

  if (state.repos.length) await renderRepos(lang);

  renderRepoCount();
  renderRateLimitBadge();
  initScrollAnimations();
  refreshScrollTriggers();
}

/* ----------------------------------------------------------------- rendu -- */

function renderProfile() {
  renderAbout(state.data);
  renderSkills(state.data);
  renderContact(state.data, CONFIG.contact);
  renderHero(state.data, state.gh);
}

/** Redessine la grille de dépôts depuis la liste en mémoire (zéro appel API). */
async function renderRepos(lang) {
  const repos = await translateReposIfEnabled(state.repos, lang);
  await renderRepoSection($('#personal-projects'), Promise.resolve(repos), {
    onOpen: openModal,
    emptyMessage: t('repos.empty', { user: CONFIG.githubUsername, org: CONFIG.githubOrg }),
  });
}

function renderRepoCount() {
  $('#personal-count').textContent = state.repos.length ? t('projects.count', { n: state.repos.length }) : '';
}

/**
 * Personal + organisation repositories merged into one list, newest push first.
 * Org repos are tagged with `source` so their cards carry a label.
 *
 * One source failing (rate limit, deleted org) must not hide the other, so the
 * error is only re-thrown when both sides fail.
 */
async function collectRepos() {
  const [personal, org] = await Promise.allSettled([
    fetchUserRepos(CONFIG.githubUsername),
    fetchOrgRepos(CONFIG.githubOrg),
  ]);

  if (personal.status === 'rejected' && org.status === 'rejected') throw personal.reason;

  return [
    ...(personal.value || []),
    ...(org.value || []).map((repo) => ({ ...repo, source: CONFIG.orgLabel })),
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/** Small footer badge showing the remaining GitHub quota, with a cache reset. */
function renderRateLimitBadge() {
  const slot = $('#rate-status');
  if (!slot || rateLimit.remaining === null) return;
  const low = rateLimit.remaining <= 5;
  slot.replaceChildren(
    el('span', { class: `ratepill ${low ? 'ratepill--low' : ''}`,
      title: rateLimit.reset ? t('footer.quotaResets', { time: rateLimit.reset.toLocaleTimeString() }) : '',
      html: `${icon('github', { size: 13 })}<span>API ${rateLimit.remaining}/${rateLimit.limit ?? '?'}</span>` }),
    el('button', { class: 'linkbtn', type: 'button', text: t('footer.clearCache'),
      onclick: () => { clearCache(); clearTranslationCache(); location.reload(); } })
  );
}

// Unhandled async failures should never leave the page silently half-built.
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason instanceof RateLimitError) console.warn('[portfolio]', e.reason.message);
  else console.error('[portfolio]', e.reason);
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
