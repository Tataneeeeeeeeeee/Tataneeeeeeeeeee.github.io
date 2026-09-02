/**
 * ui.js — DOM helpers, profile section rendering, skeletons and navigation.
 *
 * Tous les libellés passent par `t()` : le rendu est relancé à chaque
 * changement de langue, il n'y a donc aucun texte figé ici.
 */
import { t, locale, localiseMonths } from './i18n.js';

/* ------------------------------------------------------------- DOM utils -- */

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale(), { day: '2-digit', month: 'short', year: 'numeric' });
}

export function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return '';
  const day = 86400000;
  if (diff < day) return t('time.today');
  if (diff < 2 * day) return t('time.yesterday');
  if (diff < 30 * day) return t('time.days', { n: Math.round(diff / day) });
  if (diff < 365 * day) return t('time.months', { n: Math.round(diff / (30 * day)) });
  return t('time.years', { n: Math.round(diff / (365 * day)) });
}

/* ----------------------------------------------------------------- icons -- */

const ICONS = {
  star: 'M12 3.4l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z',
  fork: 'M7 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm10 0a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM7 9v2a3 3 0 003 3h4a3 3 0 003-3V9M12 14v3m0 3a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  tag: 'M3 12l9-9h8v8l-9 9z M16.5 7.5h.01',
  eye: 'M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12zm10 2.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
  close: 'M6 6l12 12M18 6L6 18',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  pin: 'M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  github: 'M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10 10 0 0012 2z',
  linkedin: 'M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM10 9h3.8v1.7a4.2 4.2 0 013.7-2c3 0 4.5 2 4.5 5.5V21h-4v-6c0-1.6-.6-2.7-2-2.7-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21h-4z',
  leadership: 'M12 3l2.5 5 5.5.5-4 3.7 1.2 5.4L12 15l-5.2 2.6L8 12.2 4 8.5 9.5 8z',
  communication: 'M4 5h16v10H8l-4 4z',
  'problem-solving': 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.3.2.5.6.5 1V16h6v-1.1c0-.4.2-.8.5-1A6 6 0 0012 3z',
  teamwork: 'M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M12 20a6 6 0 0110 0',
  adaptability: 'M4 8h12a4 4 0 010 8H8M4 8l3-3M4 8l3 3M20 16l-3 3M20 16l-3-3',
  'time-management': 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  book: 'M4 4h9a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5H4z M20 4h-4v13.5h2.5A2.5 2.5 0 0121 20V5a1 1 0 00-1-1z',
  briefcase: 'M3 8h18v12H3z M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2 M3 13h18',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z',
  certificate: 'M12 15a5 5 0 100-10 5 5 0 000 10zM9 14l-1 7 4-2 4 2-1-7',
};

/** Inline stroked SVG icon. Unknown names fall back to a neutral dot. */
export function icon(name, { size = 16, cls = '' } = {}) {
  const path = ICONS[name] || 'M12 12h.01';
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true"><path d="${path}"/></svg>`;
}

/* ------------------------------------------------------------- skeletons -- */

export function skeletonCards(count = 4) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    frag.append(
      el('article', { class: 'card card--skeleton', 'aria-hidden': 'true' },
        el('div', { class: 'sk sk--title' }),
        el('div', { class: 'sk sk--line' }),
        el('div', { class: 'sk sk--line sk--short' }),
        el('div', { class: 'sk sk--bar' }),
        el('div', { class: 'sk sk--chips' })
      )
    );
  }
  return frag;
}

/** Inline notice used for errors, empty states and rate-limit warnings. */
export function notice(message, { tone = 'info', action } = {}) {
  const box = el('div', { class: `notice notice--${tone}`, role: tone === 'error' ? 'alert' : 'status' },
    el('p', { class: 'notice__text', text: message })
  );
  if (action) {
    box.append(el('button', { class: 'btn btn--ghost', type: 'button', onclick: action.onClick, text: action.label }));
  }
  return box;
}

/**
 * Message éphémère en bas d'écran (échec de traduction, information non
 * bloquante). Le précédent est remplacé : jamais de pile de toasts.
 */
export function toast(message, { tone = 'info', duration = 6000 } = {}) {
  document.querySelector('.toast')?.remove();
  const box = el('div', { class: `toast toast--${tone}`, role: 'status' }, message);
  document.body.append(box);
  requestAnimationFrame(() => box.classList.add('is-visible'));
  setTimeout(() => {
    box.classList.remove('is-visible');
    setTimeout(() => box.remove(), 400);
  }, duration);
  return box;
}

/* ------------------------------------------------- profile data rendering -- */

export function renderHero(data, ghProfile) {
  const { profile } = data;
  $('#hero-name').textContent = profile.name;
  $('#hero-title').textContent = profile.title;
  $('#hero-description').textContent = profile.description;
  document.title = `${profile.name} — ${profile.title || 'Portfolio'}`;

  const status = $('#hero-status');
  if (profile.status) {
    status.hidden = false;
    const state = profile.status.toLowerCase();
    status.dataset.state = state;
    const known = t(`status.${state}`);
    status.querySelector('.status__label').textContent =
      known === `status.${state}` ? profile.status.replace(/\b\w/g, (c) => c.toUpperCase()) : known;
  } else {
    status.hidden = true;
  }

  const avatar = $('#hero-avatar');
  if (ghProfile?.avatar_url) {
    avatar.innerHTML = '';
    avatar.append(el('img', { src: ghProfile.avatar_url, alt: t('hero.avatarAlt', { name: profile.name }), loading: 'lazy' }));
  } else {
    avatar.textContent = profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  }
}

export function renderAbout(data) {
  $('#about-presentation').textContent = data.about.presentation;

  const grid = $('#about-grid');
  grid.innerHTML = '';

  const panel = (title, iconName, items) =>
    el('div', { class: 'panel reveal' },
      el('h3', { class: 'panel__title', html: `${icon(iconName)}<span>${escapeHtml(title)}</span>` }),
      el('ul', { class: 'panel__list' }, items)
    );

  if (data.about.languages.length) {
    grid.append(panel(t('panel.languages'), 'globe', data.about.languages.map((l) =>
      el('li', {}, el('span', { class: 'panel__key', text: l.name }), el('span', { class: 'panel__val', text: l.detail || '' })))));
  }

  if (data.experience.length) {
    grid.append(panel(t('panel.experience'), 'briefcase', data.experience.map((x) =>
      el('li', { class: 'timeline__item' },
        el('span', { class: 'panel__key', text: x.title }),
        el('span', { class: 'panel__meta', text: [x.company, localiseMonths([x.dateStart, x.dateEnd].filter(Boolean).join(' – '))].filter(Boolean).join(' · ') }),
        x.description ? el('p', { class: 'panel__desc', text: x.description }) : null))));
  }

  if (data.education.length) {
    grid.append(panel(t('panel.education'), 'book', data.education.map((e) =>
      el('li', { class: 'timeline__item' },
        el('span', { class: 'panel__key', text: e.degree }),
        el('span', { class: 'panel__meta', text: [e.school, localiseMonths([e.dateStart, e.dateEnd].filter(Boolean).join(' – '))].filter(Boolean).join(' · ') }),
        e.details ? el('p', { class: 'panel__desc', text: e.details }) : null))));
  }

  if (data.about.passions.length) {
    grid.append(panel(t('panel.passions'), 'spark', data.about.passions.map((p) =>
      el('li', {}, el('span', { class: 'panel__key', text: p.name }), el('span', { class: 'panel__val', text: p.detail || '' })))));
  }

  if (data.certifications.length) {
    grid.append(panel(t('panel.certifications'), 'certificate', data.certifications.map((c) =>
      el('li', {}, el('span', { class: 'panel__key', text: c.title }), el('span', { class: 'panel__val', text: c.description || '' })))));
  }
}

export function renderSkills(data) {
  const wrap = $('#skills-grid');
  wrap.innerHTML = '';

  if (!data.skillGroups.length) {
    wrap.append(notice('No skills listed in data.json.', { tone: 'muted' }));
  }

  for (const group of data.skillGroups) {
    wrap.append(
      el('div', { class: 'skillgroup reveal' },
        el('h3', { class: 'skillgroup__title' },
          el('span', { class: 'skillgroup__index', text: String(data.skillGroups.indexOf(group) + 1).padStart(2, '0') }),
          group.title),
        el('ul', { class: 'chips' }, group.items.map((s) =>
          el('li', { class: 'chip' }, el('span', { class: 'chip__dot' }), s.name)))
      )
    );
  }

  const soft = $('#soft-skills');
  soft.innerHTML = '';
  for (const s of data.about.softSkills) {
    soft.append(
      el('li', { class: 'softskill reveal' },
        el('span', { class: 'softskill__icon', html: icon(s.icon, { size: 20 }) }),
        el('span', { class: 'softskill__body' },
          el('strong', { text: s.name }),
          s.description ? el('span', { text: s.description }) : null))
    );
  }
}

/** Strips protocol, `www.` and any trailing slash so links read cleanly. */
function prettyUrl(url) {
  return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

export function renderContact(data, contact) {
  const list = $('#contact-links');
  list.innerHTML = '';

  const link = (iconName, label, value, href) =>
    el('li', { class: 'contact__item reveal' },
      el(href ? 'a' : 'div', { class: 'contact__link', href: href || null, target: href?.startsWith('http') ? '_blank' : null, rel: href?.startsWith('http') ? 'noopener' : null },
        el('span', { class: 'contact__icon', html: icon(iconName, { size: 18 }) }),
        el('span', { class: 'contact__body' },
          el('span', { class: 'contact__label', text: label }),
          el('span', { class: 'contact__value', text: value }))));

  if (contact.email) list.append(link('mail', t('contact.email'), contact.email, `mailto:${contact.email}`));
  if (contact.github) list.append(link('github', 'GitHub', prettyUrl(contact.github), contact.github));
  if (contact.linkedin) list.append(link('linkedin', 'LinkedIn', prettyUrl(contact.linkedin), contact.linkedin));
  if (contact.location) list.append(link('pin', t('contact.basedIn'), contact.location, null));

  $('#contact-name').textContent = data.profile.name;
}

/* ------------------------------------------------------------ navigation -- */

/**
 * Wires the nav: click-to-scroll (through Lenis when available), scroll-spy
 * via IntersectionObserver, and the mobile drawer.
 * @param {{scrollTo?: (target: Element) => void}} [opts]
 */
export function initNavigation({ scrollTo } = {}) {
  const nav = $('#nav');
  const links = $$('.nav__link');
  const toggle = $('#nav-toggle');
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  const closeDrawer = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  });

  for (const link of links) {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      if (scrollTo) scrollTo(target);
      else target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeDrawer();
  });

  const setActive = (id) => {
    for (const link of links) link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  };

  // The section closest to a line ~35% down the viewport wins.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
  );
  sections.forEach((s) => observer.observe(s));

  // Progress bar + condensed header on scroll.
  const progress = $('#scroll-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    document.body.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return { closeDrawer, setActive };
}
