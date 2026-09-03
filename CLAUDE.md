# Personal Portfolio Website

Aira De Castro's personal portfolio: a single-page site (hero, projects, skills,
contact) styled after gapcanada.ca's editorial look, plus a small internal tool
for flagging projects as "in progress." Full product context — goals, rejected
alternatives, known limitations — lives in the PRD; this file is the
day-to-day operating guide.

## Start of every session

1. Read [`PLANNING.md`](PLANNING.md) — vision, architecture, stack, required
   tools. It doesn't change often, but don't assume you already know it.
2. Read [`TASKS.md`](TASKS.md) before starting work — check whether what
   you're about to do is already tracked (as open or done) so you're not
   duplicating or contradicting it.

## Working on a task

- Mark a task's checkbox done in `TASKS.md` **immediately** once it's
  actually done (built, gates passing) — not batched at the end of a
  session, and not marked done speculatively before it is.
- If you discover a task along the way that isn't already in `TASKS.md`
  (a bug, a missing piece, a follow-up worth tracking) — add it under the
  relevant milestone, or under Milestone 7 if it doesn't fit an existing
  one, as soon as you notice it.

## Stack & architecture

- Vanilla HTML/CSS/JS. No framework, no database. One narrow exception to
  "no backend" — see below.
- Vite builds two entry points: `index.html` (public site) and `admin.html`
  (internal status editor) — see `vite.config.js` `rollupOptions.input`.
- `api/*.js` are Vercel Serverless Functions (Node, zero-config — Vercel
  auto-detects anything under `api/`). Vite doesn't touch this folder at all;
  it's deployed by Vercel separately from the static build.
- Hosted on Vercel, tracking `main`. Every push to `main` auto-deploys — there
  is no separate staging step.
- Live: https://personal-portfolio-aira-de-castro.vercel.app
- Repo: https://github.com/AiraDeCastro/Personal-Portfolio

**The no-backend constraint is deliberate, but not absolute.** Don't add a
database, user accounts, or an API route to "improve" the admin *publish*
workflow below — that tradeoff was considered and rejected in the PRD
(real-time persistence wasn't worth a new service + upkeep for a
solo-maintained site), and still holds. The one exception, made deliberately
by Aira, is `api/admin-*.js`: three small stateless functions that gate
*access* to `admin.html` behind a password (see "Admin access control"
below). That's not a database and not user accounts — don't grow it into
either without raising it as a product decision first.

## Commands

```
npm run dev          # Vite dev server
npm run build         # production build -> dist/
npm run lint           # eslint + stylelint, whole repo
npm run lint:fix       # same, auto-fixing
npm run security       # npm audit --audit-level=high
npm test               # build, then run the Cypress suite against the preview server
npm run cy:open        # Cypress interactive runner
npm run commit          # commitizen prompt for a Conventional Commit message
```

`npm test` runs through `scripts/run-e2e.js`, not `start-server-and-test`.
That's intentional: on Windows 11 24H2+, `start-server-and-test`'s cleanup
shells out to `wmic.exe`, which Microsoft removed, so it crashes on teardown
even when every test passes. Don't reintroduce that dependency.

## Before every commit

A Husky `pre-commit` hook already enforces all of this — you don't need to
run these manually, but know what will run and why a commit might get
blocked:

1. `lint-staged` — auto-fixes staged `.js`/`.css` files
2. Full `npm run lint` — whole-repo ESLint + Stylelint
3. `npm run build` — both `index.html` and `admin.html` must compile clean
4. `npm run security` — fails on any high-severity `npm audit` finding
5. `npm test` — the full Cypress suite (16 tests across 2 spec files) must
   pass
6. `commit-msg` hook — commitlint enforces **Conventional Commits**
   (`feat:`, `fix:`, `build:`, `chore:`, etc. — see `commitlint.config.js`)

If a gate fails, fix the underlying issue — don't bypass with `--no-verify`.
If tests don't yet cover new behavior, write them before committing rather
than shipping uncovered code (this is a standing requirement, not a
per-task ask).

## The projects grid ↔ status file contract

`public/data/projects-status.json` is the single source of truth for which
projects are flagged "in progress." Each project card in `index.html` has a
`data-project-id` attribute; `js/script.js` fetches the status file at
runtime and injects a `.project-badge` ("In Progress") into any card whose id
maps to `"in-progress"`.

- Adding a project = adding a card in `index.html` **and** a matching key in
  `projects-status.json` (default `"live"`) **and** an entry in the
  `PROJECTS` array in `js/admin.js` (id + display title) — all three, or the
  admin page and the badge system silently drift out of sync with the grid.
- The two live project thumbnails (`public/projects/*.jpg`) are real
  screenshots of the deployed client sites, not generic placeholders — the
  other three cards use CSS gradient tiles. Keep that distinction in mind
  before regenerating images wholesale.

## Admin workflow (`admin.html`)

Static hosting means the admin page **cannot publish on its own**. It fetches
the current status file, lets Aira toggle projects, and on save downloads an
updated `projects-status.json` — which then has to be moved into
`public/data/`, committed (through the gates above), and pushed before it's
live. If asked to "make the admin page save automatically," point back to
this constraint rather than trying to fetch/POST from a static page.

It's also still `noindex` and unlinked from the public nav, on top of the
access control below — belt and suspenders, not redundant.

## Admin access control

`admin.html` is gated by a password checked server-side in
`api/admin-login.js`, not in the browser:

- `POST /api/admin-login` compares the submitted password to the
  `ADMIN_PASSWORD` environment variable (set in the Vercel dashboard —
  **never committed to the repo**) using `crypto.timingSafeEqual`, and on
  success sets an `HttpOnly`, `Secure`, signed session cookie (12h expiry).
- `GET /api/admin-check` tells `admin.html` on load whether to show the
  password form or the project list.
- `POST /api/admin-logout` clears the cookie.
- The cookie's signature is an HMAC of its expiry timestamp, keyed on
  `ADMIN_PASSWORD` (see `api/_session.js`) — it can't be forged without that
  secret, so this is real access control, not obscurity. `_session.js` is
  prefixed with `_` deliberately: Vercel excludes underscore-prefixed files
  under `api/` from becoming their own routes, so it's safe as a shared
  import instead of a fourth endpoint.
- The password itself is never sent to the browser in any form, including
  as a hash — client-side JS only ever sees success/failure.

**Local dev gap**: `npm run dev` / `npm run preview` (plain Vite) don't
execute `/api/*` — those routes only run on Vercel or under `vercel dev`.
Cypress specs cover the auth flow entirely with `cy.intercept` against
`/api/admin-*`, so `npm test` doesn't need a real server or password. To
exercise the real login locally, use `vercel dev` (requires `vercel login`
and linking the project) with `ADMIN_PASSWORD` set in `.env.local` — never
commit that file (already in `.gitignore`).

## Conventions

- Commit messages: Conventional Commits, enforced by commitlint. Use
  `npm run commit` if unsure of the format.
- CSS: custom properties for the design tokens at the top of `css/style.css`
  (`--color-*`, `--gutter`, etc.) — reuse them rather than hardcoding colors.
  `css/admin.css` layers on top of `css/style.css` (both are linked in
  `admin.html`) rather than duplicating tokens.
- JS stays framework-free and un-bundled beyond what Vite does automatically
  — no build step should become a requirement for editing a single page.
- Cypress specs live in `cypress/e2e/`; `portfolio.cy.js` covers the public
  site, `admin.cy.js` covers the admin tool. Add new specs there, not ad hoc
  scratch scripts.

## Known open items

(Full detail in the PRD — summarized here so they aren't rediscovered as
"bugs.")

- No hero video asset yet — `index.html` already points `.hero-video` at
  `/video/hero.mp4` (+ `/video/hero-poster.jpg`), but `public/video/` is
  empty, so the section renders on its solid dark fallback until those files
  are added.
- No Lighthouse/perf/accessibility budget wired into the pipeline.
- `ADMIN_PASSWORD` must be set in the Vercel dashboard before the admin
  login works in production — Claude can't set Vercel environment variables;
  this is on Aira.
