# Portfolio

Single-page developer portfolio, themed **"Nuit Lavande"** — a soft violet night:
pale lavender and peach accents, very diffuse halos and frosted glass.
Profile content comes from `data.json`; project content is pulled live from the
GitHub REST API. Dark and light themes, English and French — the French content
is machine-translated at runtime and cached.

## Run it

The app uses ES modules and `fetch`, so it needs to be served over HTTP —
opening `index.html` from the file system will not work.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static host works (GitHub Pages, Netlify, Vercel) — there is no build step.

## Configuration

Everything tweakable lives in [`js/config.js`](js/config.js):

| Key | Meaning |
| --- | --- |
| `githubUsername` | Personal account shown under **Personal Projects** |
| `githubOrg` | Organisation whose repos are merged into **Personal Projects** (login `JJE-Corpo`) |
| `orgLabel` | Badge text shown on cards coming from that organisation |
| `githubToken` | Optional read-only PAT — raises the API quota from 60 to 5000 req/hour |
| `hiddenRepos` / `hideForks` | Repos to keep out of the grids |
| `cacheTtlMinutes` | How long GitHub responses stay fresh in `localStorage` |
| `translation` | Translation provider, key, cache TTL and manual overrides (see **Languages**) |
| `contact` | Email, location and profile links for the Contact section |

> `js/config.js` ships to the browser. Do not put a real token in it if the site
> is public — anonymous access already works, it is just rate limited.

## Structure

```
index.html          markup + section shells
css/style.css       design tokens, layout, components, responsive rules
data.json           profile source of truth
js/
  config.js         all user-editable settings
  data-loader.js    fetches + normalises data.json (missing keys degrade safely)
  github-api.js     cached GitHub client, rate-limit + ETag handling
  charts.js         dependency-free SVG donut / stacked language bars
  theme.js          dark/light switch, stored preference, system fallback
  i18n.js           current language + hand-written UI dictionary (en/fr)
  translate.js      runtime translation of data.json, with localStorage cache
  ui.js             DOM helpers, profile sections, navigation, skeletons
  projects.js       repo cards + detail modal (README, releases, chart)
  animations.js     Lenis smooth scroll + GSAP scroll reveals
  main.js           entry point wiring it all together
```

## Sections

`Home · About · Skills · Personal Projects · Contact`. Personal-account repos and
JJE Corpo repos share the single **Personal Projects** grid, sorted by most recent
push; org repos carry a `JJE Corpo` badge. If one of the two sources fails, the
other still renders — the error only surfaces when both fail.

## Behaviour notes

- **Caching.** Every GitHub response is stored in `localStorage` with its ETag.
  Fresh entries are served without a network call; stale ones are revalidated
  with `If-None-Match`, and a `304` does not count against the quota.
- **Rate limits.** A `403`/`429` with `x-ratelimit-remaining: 0` falls back to
  cached data, or shows a friendly notice with the reset time. The footer shows
  the remaining quota and a *clear cache* button.
- **Failure modes.** A missing or malformed `data.json` replaces the page with a
  readable error; a GitHub outage only affects the project grids.
- **Motion.** GSAP, Lenis, marked and DOMPurify all load from CDNs with `defer`.
  If any fail to load — or the visitor has `prefers-reduced-motion: reduce` — the
  page still renders and scrolls normally.
- **README safety.** Markdown is rendered with `marked` and sanitised with
  DOMPurify; relative links and images are rewritten to the repo's default branch.

## Theme

The palette lives entirely in the `:root` token block at the top of
`css/style.css` — change `--lavender`, `--peach`, `--mist`, `--sage` and the
`--bg*` values and the whole site follows. Colours are named rather than
aliased, so there is one scheme and no dead tokens.

The theme is deliberately low-contrast in its decoration: no neon glows, no
coloured halo rings. Depth comes from soft diffuse shadows (`--shadow`,
`--shadow-lav`), 1px borders at ~8% white, and `backdrop-filter` glass.

- `body` background — three very wide, low-opacity radial halos, fixed
- `.hero__glow` — a single blurred lavender halo behind the headline
- `.hero__grid` — a static 30px dot texture, masked to fade at the edges
- `.section + .section::before` — a barely-there gradient hairline divider
- `.section--contact::after` — a soft horizon glow closing the page

### Light mode

The toggle in the nav flips `data-theme` on `<html>`; the stored choice lives in
`localStorage` under `portfolio:theme`, and a visitor who never chooses follows
their OS setting. An inline script in `<head>` applies the theme before the first
paint, so there is no flash of the wrong palette.

`:root[data-theme='light']` **only redefines tokens** — no component rule is
duplicated. That works because every colour in the stylesheet goes through a
token or a `color-mix()` on one: surfaces become dark veils over a pale ground,
accents darken enough to stay legible, halos gain a little saturation. Add a
colour to a component and it follows both themes for free.

Under `prefers-reduced-motion: reduce` every animation and transition stops.

Fonts: **Outfit** (display), **Space Grotesk** (body), **JetBrains Mono** (code).

## Languages

`EN | FR` sits next to the theme toggle. The choice is stored under
`portfolio:lang`, and a first-time visitor gets French only if their browser
asks for it.

Two kinds of text are handled differently, on purpose:

- **Interface** (nav, section titles, buttons, errors, relative dates) — hand
  translated in [`js/i18n.js`](js/i18n.js). Short, fixed, and free: no API call.
  Missing keys fall back to English rather than to a blank.
- **Content** (`data.json`) — translated at runtime by
  [`js/translate.js`](js/translate.js) through the provider set in
  `CONFIG.translation`, then cached in `localStorage` for 30 days. `data.json`
  stays English: it is the source of truth, never mutated, so switching back to
  English is instant and costs nothing.

Three providers are wired: `mymemory` (default, no account, ~5 000 chars/day per
IP — this site needs ~2 500), `libretranslate` (public or self-hosted instance)
and `deepl` (best quality, key required). `'none'` disables content translation
while keeping the translated interface.

Switching language re-renders from memory: **zero extra GitHub API calls**.

### Limits worth knowing

- The first switch to French costs one round trip (~3 s here). After that it is
  served from cache.
- Any API key you put in `config.js` ships to the browser. For a public repo,
  proxy DeepL rather than exposing the key, or stay on MyMemory.
- Repo descriptions come from GitHub in English. Set
  `translation.translateRepoDescriptions: true` to translate them too — it scales
  with the number of repos, so it is the first thing to burn the quota. READMEs
  are never translated.
- **Machine translation gets things wrong.** Observed on this very content:
  `TOEIC score: 700` came back as `Score TOEIC :.` — the number silently
  dropped. Two guards: a translation that loses a number present in the source is
  rejected (the English is shown instead, with a console warning), and
  `translation.overrides.fr` lets you pin the exact French for any string —
  acronyms, degrees, job titles. Overrides are checked before the cache and the
  API, so they are free and instant. Read the French page before shipping it.
- If the API is unreachable, the interface still switches to French and the
  content stays English, with a discreet toast saying so.

## Third-party libraries

Loaded from CDN, no install required: GSAP + ScrollTrigger, Lenis, marked,
DOMPurify. Charts are hand-written SVG — no charting dependency.
