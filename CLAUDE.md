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

- Vanilla HTML/CSS/JS. No framework, no backend, no database.
- Vite builds two entry points: `index.html` (public site) and `admin.html`
  (internal status editor) — see `vite.config.js` `rollupOptions.input`.
- Hosted on Vercel, tracking `main`. Every push to `main` auto-deploys — there
  is no separate staging step.
- Live: https://personal-portfolio-aira-de-castro.vercel.app
- Repo: https://github.com/AiraDeCastro/Personal-Portfolio

**The no-backend constraint is deliberate**, not a gap to fill in. Don't add a
server, database, or API route to "improve" the admin workflow below — that
tradeoff was already considered and rejected in the PRD (real-time persistence
wasn't worth the new service + auth + upkeep for a solo-maintained site). If
that calculus changes, it's a product decision to raise with Aira, not one to
make mid-task.

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
5. `npm test` — the full Cypress suite (12 specs) must pass
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

The page is intentionally unauthenticated (`<meta name="robots"
content="noindex, nofollow">`, not linked from the public nav) — obscurity,
not access control. That's a known, accepted tradeoff, not a bug to silently
"fix" with a login screen.

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
- Admin page has no real authentication (see above — accepted, not open).
