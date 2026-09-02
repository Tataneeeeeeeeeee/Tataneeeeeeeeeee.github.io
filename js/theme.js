/**
 * theme.js — bascule sombre / clair.
 *
 * Le thème vit dans `data-theme` sur <html> ; index.html le pose déjà avant le
 * premier rendu (script inline) pour éviter un flash. Ce module ne gère que la
 * suite : le bouton, la mémorisation et le suivi des préférences système.
 */

import { t, onLangChange } from './i18n.js';

const STORAGE_KEY = 'portfolio:theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';

const systemTheme = () => (window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark');

function storedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null; // navigation privée ou stockage bloqué
  }
}

function apply(theme, button) {
  document.documentElement.dataset.theme = theme;
  label(button);
}

/** Libellé du bouton : il annonce le mode vers lequel on bascule. */
function label(button) {
  if (!button) return;
  const light = document.documentElement.dataset.theme === 'light';
  const text = t(light ? 'theme.toDark' : 'theme.toLight');
  button.setAttribute('aria-pressed', String(light));
  button.setAttribute('aria-label', text);
  button.title = text;
}

export function initTheme() {
  const button = document.querySelector('#theme-toggle');
  apply(storedTheme() || systemTheme(), button);
  onLangChange(() => label(button));

  button?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next, button);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* le choix ne survivra pas au rechargement, tant pis */ }
  });

  // Tant que l'utilisateur n'a pas choisi, on suit le réglage du système.
  window.matchMedia(LIGHT_QUERY).addEventListener('change', (e) => {
    if (!storedTheme()) apply(e.matches ? 'light' : 'dark', button);
  });
}
