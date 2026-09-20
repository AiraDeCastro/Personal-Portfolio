# Personal Portfolio Website

Aira De Castro's personal portfolio: a single-page site (hero, projects,
skills, contact) styled after gapcanada.ca's editorial look. Full product
context — goals, rejected alternatives, known limitations — lives in the
PRD; this file is the day-to-day operating guide.

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

- Vanilla HTML/CSS/JS. No framework, no backend, no database — fully
  static, one entry point (`index.html`).
- Built with Vite (`npm run dev` / `npm run build`).
- Hosted on Vercel, tracking `main`. Every push to `main` auto-deploys — there
  is no separate staging step.
- Live: https://personal-portfolio-aira-de-castro.vercel.app
- Repo: https://github.com/AiraDeCastro/Personal-Portfolio

**Stay backend-free.** An earlier version of this site had a password-gated
admin page (three Vercel Serverless Functions) for toggling projects
"in progress" without editing HTML. It was deliberately removed (see
TASKS.md, Milestone 8) once it became clear Aira edits `index.html` directly
for every other content change anyway, so the admin tool wasn't saving the
step it was built for — it was solving a workflow she wasn't using, at the
cost of a real auth system to build and maintain. Don't reintroduce a
database, API route, or admin UI to make status toggling "easier" without
raising it as a product decision first; the bar is high, because this exact
tradeoff was already made once.

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
3. `npm run build` — `index.html` must compile clean
4. `npm run security` — fails on any high-severity `npm audit` finding
5. `npm test` — the full Cypress suite must pass
6. `commit-msg` hook — commitlint enforces **Conventional Commits**
   (`feat:`, `fix:`, `build:`, `chore:`, etc. — see `commitlint.config.js`)

If a gate fails, fix the underlying issue — don't bypass with `--no-verify`.
If tests don't yet cover new behavior, write them before committing rather
than shipping uncovered code (this is a standing requirement, not a
per-task ask).

## The "In Progress" badge

Whether a project card shows an "In Progress" badge is just markup — a
`<span class="project-badge">In Progress</span>` written directly inside
that card's `.project-media` in `index.html`. There's no data file, no
fetch, no admin UI: to change a project's status, add or remove that span
in the card's HTML, same as any other content edit, and commit/push through
the gates above like normal.

- The two live project thumbnails (`public/projects/*.jpg`) are real
  screenshots of the deployed client sites, not generic placeholders — the
  other cards use CSS gradient tiles. Keep that distinction in mind before
  regenerating images wholesale.

## Conventions

- Commit messages: Conventional Commits, enforced by commitlint. Use
  `npm run commit` if unsure of the format.
- CSS: custom properties for the design tokens at the top of `css/style.css`
  (`--color-*`, `--gutter`, etc.) — reuse them rather than hardcoding colors.
- JS stays framework-free and un-bundled beyond what Vite does automatically
  — no build step should become a requirement for editing a single page.
- Cypress specs live in `cypress/e2e/`; `portfolio.cy.js` covers the whole
  site. Add new specs there, not ad hoc scratch scripts.

## Known open items

(Full detail in the PRD — summarized here so they aren't rediscovered as
"bugs.")

- No Lighthouse/perf/accessibility budget wired into the pipeline.
