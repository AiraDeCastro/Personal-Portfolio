# Aira De Castro — Personal Portfolio

A single-page portfolio — hero, projects, skills, contact — styled after
gapcanada.ca's editorial look.

**Live:** https://personal-portfolio-aira-de-castro.vercel.app

## Stack

Vanilla HTML/CSS/JS, built with [Vite](https://vitejs.dev). No framework,
no backend, no database — fully static.

Hosted on [Vercel](https://vercel.com), auto-deploying on every push to
`main`.

## Getting started

```bash
npm install
npm run dev       # Vite dev server
```

```bash
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Quality gates

Every commit runs through a Husky `pre-commit` hook before it's allowed to
land:

1. `lint-staged` — auto-fixes staged `.js`/`.css` files
2. `npm run lint` — ESLint + Stylelint across the whole repo
3. `npm run build` — `index.html` must compile clean
4. `npm run security` — `npm audit --audit-level=high`
5. `npm test` — the full [Cypress](https://www.cypress.io) suite (8 tests
   in `cypress/e2e/`)
6. A `commit-msg` hook enforces [Conventional
   Commits](https://www.conventionalcommits.org) via commitlint

Run any of these yourself with `npm run lint`, `npm run security`, or
`npm test`.

## Project docs

- [`PLANNING.md`](PLANNING.md) — vision, architecture, tech stack, required
  tools
- [`TASKS.md`](TASKS.md) — build history by milestone, plus open work and a
  backlog of projects to add
- [`CLAUDE.md`](CLAUDE.md) — day-to-day operating guide (commands,
  conventions, how the "In Progress" badge works)
- [Product Requirements
  Document](https://claude.ai/code/artifact/a409695c-d0e3-4b99-bb38-8e8842d2a9b2) —
  full feature spec, decision log, and known limitations
