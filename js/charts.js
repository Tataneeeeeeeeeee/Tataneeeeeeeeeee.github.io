/**
 * charts.js — dependency-free SVG charts for the language breakdown.
 *
 * A donut for the modal (with a legend) and a thin stacked bar for the cards.
 * Colours follow GitHub's own linguist palette, with a deterministic HSL
 * fallback so an unknown language still gets a stable colour.
 */
import { t } from './i18n.js';

const LANGUAGE_COLORS = {
  C: '#555555', 'C++': '#f34b7d', 'C#': '#178600', Rust: '#dea584', Python: '#3572A5',
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c',
  Haskell: '#5e5086', Shell: '#89e051', Makefile: '#427819', Go: '#00ADD8', Java: '#b07219',
  Kotlin: '#A97BFF', Swift: '#F05138', Ruby: '#701516', PHP: '#4F5D95', Lua: '#000080',
  Dockerfile: '#384d54', Vue: '#41b883', Svelte: '#ff3e00', Dart: '#00B4AB', R: '#198CE7',
  Assembly: '#6E4C13', Nix: '#7e7eff', CMake: '#DA3434', Perl: '#0298c3', Elixir: '#6e4a7e',
  Zig: '#ec915c', OCaml: '#ef7a08', Scala: '#c22d40', 'Vim Script': '#199f4b', Batchfile: '#C1F12E',
  'Jupyter Notebook': '#DA5B0B', TeX: '#3D6117', SQLPL: '#e38c00', 'Objective-C': '#438eff',
};

/** Stable colour for any language name. */
export function languageColor(name) {
  if (LANGUAGE_COLORS[name]) return LANGUAGE_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${hash} 62% 58%)`;
}

const fmtPercent = (p) => (p >= 10 ? p.toFixed(0) : p.toFixed(1));

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const svgEl = (tag, attrs = {}) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

/**
 * Donut chart of language shares.
 * Drawn with stroke-dasharray on concentric circles — no path maths, and each
 * arc animates in by transitioning its dash offset.
 * @param {{name:string, bytes:number, percent:number}[]} languages
 */
export function renderLanguageDonut(languages, { size = 190, thickness = 22 } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'chart chart--donut';

  if (!languages.length) {
    wrap.innerHTML = `<p class="chart__empty">${escapeHtml(t('chart.empty'))}</p>`;
    return wrap;
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${size} ${size}`,
    class: 'chart__svg',
    role: 'img',
    'aria-label': t('chart.aria', { list: languages.map((l) => `${l.name} ${fmtPercent(l.percent)}%`).join(', ') }),
  });

  svg.appendChild(
    svgEl('circle', {
      cx: size / 2, cy: size / 2, r: radius, fill: 'none',
      stroke: 'var(--surface-3)', 'stroke-width': thickness,
    })
  );

  let offset = 0;
  languages.forEach((lang, i) => {
    const length = (lang.percent / 100) * circumference;
    const arc = svgEl('circle', {
      cx: size / 2, cy: size / 2, r: radius, fill: 'none',
      stroke: languageColor(lang.name),
      'stroke-width': thickness,
      'stroke-dasharray': `${length} ${circumference - length}`,
      'stroke-dashoffset': -offset,
      transform: `rotate(-90 ${size / 2} ${size / 2})`,
      class: 'chart__arc',
      style: `--arc-len:${length}px; --arc-delay:${i * 90}ms`,
    });
    const title = svgEl('title');
    title.textContent = `${lang.name} — ${fmtPercent(lang.percent)}% (${formatBytes(lang.bytes)})`;
    arc.appendChild(title);
    svg.appendChild(arc);
    offset += length;
  });

  const top = languages[0];
  const center = document.createElement('div');
  center.className = 'chart__center';
  center.innerHTML = `<strong>${fmtPercent(top.percent)}%</strong><span>${escapeHtml(top.name)}</span>`;

  const figure = document.createElement('div');
  figure.className = 'chart__figure';
  figure.append(svg, center);

  const legend = document.createElement('ul');
  legend.className = 'chart__legend';
  for (const lang of languages) {
    const li = document.createElement('li');
    li.innerHTML =
      `<span class="chart__dot" style="background:${languageColor(lang.name)}"></span>` +
      `<span class="chart__name">${escapeHtml(lang.name)}</span>` +
      `<span class="chart__value">${fmtPercent(lang.percent)}%</span>` +
      `<span class="chart__bytes">${formatBytes(lang.bytes)}</span>`;
    legend.appendChild(li);
  }

  wrap.append(figure, legend);
  return wrap;
}

/** Compact stacked bar used on project cards. */
export function renderLanguageBar(languages) {
  const bar = document.createElement('div');
  bar.className = 'langbar';
  if (!languages.length) {
    bar.classList.add('langbar--empty');
    return bar;
  }
  for (const lang of languages) {
    const seg = document.createElement('span');
    seg.className = 'langbar__seg';
    seg.style.width = `${lang.percent}%`;
    seg.style.background = languageColor(lang.name);
    seg.title = `${lang.name} — ${fmtPercent(lang.percent)}%`;
    bar.appendChild(seg);
  }
  return bar;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
