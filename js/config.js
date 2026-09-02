/**
 * config.js — single place to tweak the portfolio.
 */
export const CONFIG = {
  /** Personal GitHub account. Change this to point the site at another user. */
  githubUsername: 'Tataneeeeeeeeeee',

  /** GitHub organisation ("JJE Corpo" → login `JJE-Corpo`). */
  githubOrg: 'JJE-Corpo',

  /** Label shown on cards coming from the organisation. */
  orgLabel: 'JJE Corpo',

  /**
   * Optional read-only personal access token.
   * Unauthenticated GitHub API = 60 req/hour, authenticated = 5000 req/hour.
   * NEVER commit a real token to a public repo — this file ships to the browser.
   * Leave empty for anonymous access (the app degrades gracefully when limited).
   */
  githubToken: '',

  /** Where the profile data lives, relative to index.html. */
  dataUrl: './data.json',

  /** Repos to never display (exact names, case-insensitive). */
  hiddenRepos: ['.github'],

  /** Hide forks from the project grids. */
  hideForks: false,

  /** localStorage cache lifetime for GitHub responses, in minutes. */
  cacheTtlMinutes: 30,

  /**
   * Traduction automatique du contenu (data.json) vers le français.
   *
   * data.json reste écrit en anglais : c'est la version de référence, et le
   * français est produit à la volée par l'API choisie puis mis en cache dans
   * localStorage. Les libellés de l'interface, eux, sont traduits à la main
   * dans js/i18n.js et ne consomment aucun quota.
   *
   * provider :
   *   'mymemory'      — sans compte. ~5 000 caractères/jour par IP (50 000 avec
   *                     `email` renseigné). Suffisant ici (~2 500 caractères),
   *                     qualité correcte mais inférieure à DeepL.
   *   'libretranslate'— renseigner `endpoint` (instance publique ou perso) et
   *                     `apiKey` si l'instance en exige une.
   *   'deepl'         — meilleure qualité, `apiKey` obligatoire. Attention : la
   *                     clé est visible dans ce fichier, qui part au navigateur.
   *                     Pour un dépôt public, passer par un proxy et pointer
   *                     `endpoint` dessus plutôt que d'exposer la clé.
   *   'none'          — désactive le français côté contenu (l'interface reste
   *                     traduite, les données restent en anglais).
   */
  translation: {
    provider: 'mymemory',
    endpoint: '',
    apiKey: '',
    /** MyMemory uniquement : relève le quota quotidien. */
    email: '',
    /** Durée de vie du cache de traduction, en jours. */
    cacheTtlDays: 30,
    /**
     * Traduire aussi les descriptions de dépôts venues de GitHub.
     * Désactivé par défaut : c'est proportionnel au nombre de dépôts, donc le
     * premier poste de consommation du quota. Les README ne sont jamais
     * traduits (trop volumineux).
     */
    translateRepoDescriptions: false,

    /**
     * Traductions écrites à la main, prioritaires sur l'API et gratuites.
     * La clé est le texte anglais exact tel qu'il apparaît dans data.json.
     *
     * À utiliser dès qu'une machine se trompe sur un terme qui compte : sigles,
     * diplômes, intitulés de poste. Les entrées ci-dessous corrigent des
     * erreurs réellement observées (« General A-levels » rendu « Niveaux A
     * généraux », « Frameworks » rendu « Cadres »).
     */
    overrides: {
      fr: {
        'TOEIC score: 700': 'TOEIC : 700',
        'General A-levels': 'Baccalauréat général',
        'Backend Frameworks & Tools': 'Frameworks & outils backend',
        'Development Tools': 'Outils de développement',
        Communication: 'Communication',
        Leadership: 'Leadership',
      },
    },
  },

  /** Contact links rendered in the Contact section. */
  contact: {
    email: 'ethanvertforest@gmail.com',
    location: 'Toulouse, France',
    github: 'https://github.com/Tataneeeeeeeeeee',
    linkedin: 'https://www.linkedin.com/in/ethan-vert-forest/',
  },
};

export default CONFIG;
