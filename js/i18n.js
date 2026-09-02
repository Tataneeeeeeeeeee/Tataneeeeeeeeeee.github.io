/**
 * i18n.js — langue courante et libellés de l'interface.
 *
 * Deux natures de texte cohabitent sur le site :
 *  - le *chrome* (navigation, titres de section, boutons, messages d'erreur) →
 *    traduit ici, à la main : c'est court, figé, et une API de traduction
 *    rendrait ces libellés à la fois plus lents et moins bons ;
 *  - le *contenu* (data.json, descriptions de dépôts) → traduit à l'exécution
 *    par translate.js via une API externe.
 *
 * La langue vit dans `document.documentElement.lang` et dans localStorage.
 */

const STORAGE_KEY = 'portfolio:lang';

/** Langues proposées par le sélecteur, dans l'ordre d'affichage. */
export const LANGS = ['en', 'fr'];

const STRINGS = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.toggle': 'Toggle navigation',

    'hero.viewProjects': 'View projects',
    'hero.getInTouch': 'Get in touch',
    'hero.avatarAlt': '{name} avatar',
    'status.available': 'Available',
    'status.busy': 'Busy',
    'status.unavailable': 'Unavailable',

    'about.eyebrow': '02 — About',
    'about.title': 'About me',
    'skills.eyebrow': '03 — Skills',
    'skills.title': 'Toolbox',
    'skills.lede': 'Languages, frameworks and tooling I reach for day to day.',
    'skills.soft': 'Soft skills',
    'projects.eyebrow': '04 — Personal projects',
    'projects.title': 'Things I build',
    'projects.lede': 'Public repositories from my GitHub account and the JJE Corpo organisation.',
    'projects.count': '{n} repositories',
    'contact.eyebrow': '05 — Contact',
    'contact.title': "Let's talk",
    'contact.lede': 'Open to internships, collaborations and interesting problems.',

    'panel.languages': 'Languages',
    'panel.experience': 'Experience',
    'panel.education': 'Education',
    'panel.passions': 'Beyond code',
    'panel.certifications': 'Certifications',

    'contact.email': 'Email',
    'contact.basedIn': 'Based in',

    'card.noDescription': 'No description provided.',
    'card.updated': 'updated {when}',
    'card.openDetails': 'Open details',
    'card.openDetailsFor': 'Open details for {name}',
    'badge.archived': 'archived',
    'badge.fork': 'fork',
    'badge.prerelease': 'pre-release',
    'stat.stars': 'Stars',
    'stat.forks': 'Forks',
    'stat.watchers': 'Watchers',

    'modal.chart': 'Language breakdown',
    'modal.releases': 'Latest releases',
    'modal.readme': 'README',
    'modal.close': 'Close dialog',
    'modal.noReadme': 'This repository has no README.',
    'modal.noReleases': 'This repository has no published releases yet.',
    'modal.error': 'Could not load this repository’s details from GitHub.',
    'chart.empty': 'No language data reported for this repository.',
    'chart.aria': 'Language breakdown: {list}',

    'repos.empty': 'No public repositories found for @{user} or {org}.',
    'repos.error': 'Could not load repositories from GitHub.',
    'repos.cachedFallback': 'Cached results will be used as soon as they are available.',
    'action.retry': 'Retry',
    'action.reload': 'Reload',

    'footer.clearCache': 'clear cache',
    'footer.quotaResets': 'Quota resets at {time}',

    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',
    'lang.label': 'Language',
    'lang.switchTo': 'Switch to French',

    'translate.busy': 'Translating…',
    'translate.failed': 'Automatic translation is unavailable right now — showing the English content.',

    'time.today': 'today',
    'time.yesterday': 'yesterday',
    'time.days': '{n} days ago',
    'time.months': '{n} months ago',
    'time.years': '{n} years ago',
  },

  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'nav.toggle': 'Ouvrir la navigation',

    'hero.viewProjects': 'Voir les projets',
    'hero.getInTouch': 'Me contacter',
    'hero.avatarAlt': 'Photo de {name}',
    'status.available': 'Disponible',
    'status.busy': 'Occupé',
    'status.unavailable': 'Indisponible',

    'about.eyebrow': '02 — À propos',
    'about.title': 'À propos de moi',
    'skills.eyebrow': '03 — Compétences',
    'skills.title': 'Boîte à outils',
    'skills.lede': 'Les langages, frameworks et outils que j’utilise au quotidien.',
    'skills.soft': 'Compétences transversales',
    'projects.eyebrow': '04 — Projets personnels',
    'projects.title': 'Ce que je construis',
    'projects.lede': 'Dépôts publics de mon compte GitHub et de l’organisation JJE Corpo.',
    'projects.count': '{n} dépôts',
    'contact.eyebrow': '05 — Contact',
    'contact.title': 'Discutons',
    'contact.lede': 'Ouvert aux stages, aux collaborations et aux problèmes stimulants.',

    'panel.languages': 'Langues',
    'panel.experience': 'Expérience',
    'panel.education': 'Formation',
    'panel.passions': 'Au-delà du code',
    'panel.certifications': 'Certifications',

    'contact.email': 'E-mail',
    'contact.basedIn': 'Basé à',

    'card.noDescription': 'Aucune description fournie.',
    'card.updated': 'màj {when}',
    'card.openDetails': 'Voir le détail',
    'card.openDetailsFor': 'Voir le détail de {name}',
    'badge.archived': 'archivé',
    'badge.fork': 'fork',
    'badge.prerelease': 'pré-version',
    'stat.stars': 'Étoiles',
    'stat.forks': 'Forks',
    'stat.watchers': 'Observateurs',

    'modal.chart': 'Répartition des langages',
    'modal.releases': 'Dernières versions',
    'modal.readme': 'README',
    'modal.close': 'Fermer la fenêtre',
    'modal.noReadme': 'Ce dépôt n’a pas de README.',
    'modal.noReleases': 'Ce dépôt n’a pas encore de version publiée.',
    'modal.error': 'Impossible de charger les détails de ce dépôt depuis GitHub.',
    'chart.empty': 'Aucun langage renseigné pour ce dépôt.',
    'chart.aria': 'Répartition des langages : {list}',

    'repos.empty': 'Aucun dépôt public trouvé pour @{user} ni {org}.',
    'repos.error': 'Impossible de charger les dépôts depuis GitHub.',
    'repos.cachedFallback': 'Les résultats en cache seront utilisés dès qu’ils seront disponibles.',
    'action.retry': 'Réessayer',
    'action.reload': 'Recharger',

    'footer.clearCache': 'vider le cache',
    'footer.quotaResets': 'Quota réinitialisé à {time}',

    'theme.toLight': 'Passer en mode clair',
    'theme.toDark': 'Passer en mode sombre',
    'lang.label': 'Langue',
    'lang.switchTo': 'Passer en anglais',

    'translate.busy': 'Traduction…',
    'translate.failed': 'La traduction automatique est indisponible — contenu affiché en anglais.',

    'time.today': 'aujourd’hui',
    'time.yesterday': 'hier',
    'time.days': 'il y a {n} jours',
    'time.months': 'il y a {n} mois',
    'time.years': 'il y a {n} ans',
  },
};

/** Mois abrégés tels qu'écrits dans data.json → équivalent français. */
const MONTHS_FR = {
  Jan: 'janv.', Feb: 'févr.', Mar: 'mars', Apr: 'avr.', May: 'mai', Jun: 'juin',
  Jul: 'juil.', Aug: 'août', Sep: 'sept.', Oct: 'oct.', Nov: 'nov.', Dec: 'déc.',
};

let current = 'en';
const listeners = new Set();

/** Langue mémorisée, ou déduite du navigateur au premier passage. */
export function preferredLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* stockage indisponible */ }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export const getLang = () => current;

export function setLang(lang) {
  if (!LANGS.includes(lang) || lang === current) return;
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch { /* le choix ne survivra pas au rechargement */ }
  for (const fn of listeners) fn(lang);
}

/** Pose la langue sans notifier (amorçage), pour éviter un double rendu. */
export function initLang(lang = preferredLang()) {
  current = LANGS.includes(lang) ? lang : 'en';
  document.documentElement.lang = current;
  return current;
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Libellé traduit. Les valeurs de `params` remplacent les jetons `{clé}`.
 * Une clé inconnue est renvoyée telle quelle : le texte reste lisible même
 * si le dictionnaire prend du retard.
 */
export function t(key, params) {
  const raw = STRINGS[current]?.[key] ?? STRINGS.en[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m));
}

/** Locale BCP-47 pour les dates et les nombres. */
export const locale = () => (current === 'fr' ? 'fr-FR' : 'en-GB');

/** Traduit les mois abrégés d'une période ("Jul 2025" → "juil. 2025"). */
export function localiseMonths(text) {
  if (current !== 'fr' || !text) return text;
  return String(text).replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => MONTHS_FR[m] || m);
}

/**
 * Câble le sélecteur EN/FR. `onSelect` reçoit la langue demandée ; c'est à
 * l'appelant de traduire puis de relancer le rendu.
 */
export function initLangSwitch(onSelect) {
  const box = document.querySelector('#lang-switch');
  if (!box) return;

  const buttons = Array.from(box.querySelectorAll('[data-lang]'));
  const sync = () => {
    for (const btn of buttons) {
      const active = btn.dataset.lang === current;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    }
  };

  sync();
  onLangChange(sync);
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== current) onSelect(btn.dataset.lang);
    });
  }
}

/** Grise le sélecteur pendant un aller-retour vers l'API de traduction. */
export function setLangBusy(busy) {
  document.querySelector('#lang-switch')?.setAttribute('aria-busy', String(Boolean(busy)));
}

/**
 * Applique le dictionnaire au HTML statique.
 * `data-i18n` remplace le texte, `data-i18n-aria` le libellé accessible.
 */
export function applyStaticText(root = document) {
  for (const node of root.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of root.querySelectorAll('[data-i18n-aria]')) {
    node.setAttribute('aria-label', t(node.dataset.i18nAria));
  }
}
