# Planning

High-level orientation for this project: why it exists, how it's put
together, what it's built with, and what you need installed to work on it.
For the detailed feature spec, decision log, and known limitations, see the
[Portfolio Site PRD](https://claude.ai/code/artifact/a409695c-d0e3-4b99-bb38-8e8842d2a9b2).
For day-to-day operating rules (commands, commit conventions, gotchas), see
[CLAUDE.md](CLAUDE.md).

## Vision

Give a hiring manager everything they need to say yes, in one scroll: what
Aira De Castro builds, what she knows, and how to reach her — presented with
the same editorial confidence as gapcanada.ca, not a template.

Two things this project is not trying to be:

- **Not a CMS.** It's a portfolio for one person, updated by that person,
  a handful of times a month at most. Any complexity that only pays off at
  higher update frequency or multiple editors doesn't belong here yet.
- **Not just a showcase of output.** The engineering process — pre-commit
  quality gates, Conventional Commits, tests written alongside features — is
  itself part of what the site demonstrates to a technical reviewer who goes
  digging in the repo.

The "in progress" status system exists for one reason: freelance client work
gets revisited after it's first shown. The site should be able to say
"this one's still being worked on" without a visitor mistaking active work
for something broken.

## Architecture

Static site, no database, no user accounts. The one deliberate exception is
three small stateless Vercel Serverless Functions that gate access to
`admin.html` behind a password — everything else is a client-side fetch
against a JSON file.

```
  admin.html ──POST password──▶ api/admin-login.js ──compares to──▶ ADMIN_PASSWORD
      ▲                              │                               (Vercel env var,
      │                       sets signed session cookie              never sent to
      │                              │                                 the browser)
      └───────── shows project list only if cookie is valid ◀─────────┘

                    ┌─────────────────────────────┐
                    │   public/data/               │
                    │   projects-status.json        │  ← single source of truth
                    │   { "id": "live"|"in-progress" }
                    └───────────────┬───────────────┘
                                    │ fetch() at runtime
                     ┌──────────────┴───────────────┐
                     ▼                               ▼
            index.html (public site)         admin.html, once signed in
            renders project cards,           lists projects, toggles
            injects "In Progress"            status, downloads an
            badge when flagged               updated JSON file
                     │                               │
                     └──────────────┬────────────────┘
                                    │
                          npm run build (Vite)
                       two entry points → dist/
                    (api/*.js deployed separately by
                     Vercel — Vite never touches it)
                                    │
                          git commit  (pre-commit gates:
                             │         lint → build → audit →
                             │         Cypress → commitlint)
                             ▼
                        push to origin/main
                                    │
                                    ▼
                       Vercel (tracks main, auto-deploy)
                                    │
                                    ▼
          https://personal-portfolio-aira-de-castro.vercel.app
```

The admin page still cannot *publish* a status change on its own — the
serverless functions above only gate who can open and use the page, not
where a change gets written. A status change only goes live after the
downloaded file is committed and pushed through the same pipeline as any
code change. Keeping publish backend-free (vs. write-through persistence)
was a deliberate tradeoff (see the PRD, §8); gating *access* with a password
was a separate, later decision Aira made explicitly, not a reversal of it.

## Technology stack

| Layer | Choice | Why |
|---|---|---|
| Markup / styling / behavior | Vanilla HTML, CSS, JS (ES modules) | No framework runtime to ship for a handful of mostly-static sections |
| Build | [Vite](https://vitejs.dev) | Multi-page build (`index.html` + `admin.html`), fast dev server, zero-config for plain HTML/CSS/JS |
| Admin auth | [Vercel Serverless Functions](https://vercel.com/docs/functions) (`api/*.js`, Node built-ins only) | A password check needs *something* server-side to check the password against — the smallest unit of "backend" that still isn't a database or accounts |
| Type/font | Inter (Google Fonts) | Loaded directly, no local font files |
| Linting | [ESLint](https://eslint.org) (flat config) + [Stylelint](https://stylelint.io) | JS and CSS correctness/consistency, run in the pre-commit gate |
| Testing | [Cypress](https://www.cypress.io) | End-to-end specs against the built site (`cypress/e2e/`) |
| Git hooks | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged) | Enforces the quality gates locally, before a commit can land |
| Commit convention | [Conventional Commits](https://www.conventionalcommits.org) via [commitlint](https://commitlint.js.org) + [commitizen](https://github.com/commitizen/cz-cli) | Enforced message format; `npm run commit` for a guided prompt |
| Hosting | [Vercel](https://vercel.com) | Auto-deploys on push to `main`, zero config for a Vite project |
| Source control | [GitHub](https://github.com) — `AiraDeCastro/Personal-Portfolio` | — |

No runtime dependencies — everything above is a dev dependency or a hosted
service. `package.json` has zero entries under `dependencies`.

## Required tools

To work on this repo locally, you need:

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 LTS or newer | Developed against 24.15.0. Required for Vite 8 / ESLint 9's flat config. |
| npm | 10+ (ships with Node) | Used directly — no pnpm/yarn lockfiles in this repo. |
| [Git](https://git-scm.com) | any recent version | Husky hooks need a real Git working tree (`git init` already done). |
| A code editor | — | No editor-specific config is checked in; use whatever you like. |
| A Chromium-based browser | — | Cypress runs headless Electron by default (`npm test`); `npm run cy:open` will want a real browser installed for the interactive runner. |

Optional, not required for local development:

- **GitHub CLI (`gh`)** — convenient for PRs/issues, not used by any script here.
- **Vercel CLI** — needed only to run the real `api/admin-*.js` functions
  locally (`vercel dev`), since plain `vite dev`/`vite preview` don't
  execute them; `npm test` doesn't need it, as the Cypress specs stub those
  routes with `cy.intercept`.

Nothing else needs installing globally — `npm install` pulls every build,
lint, test, and git-hook tool into `node_modules/`.

One environment variable, set in the Vercel dashboard (never in the repo):
`ADMIN_PASSWORD`, the password `admin.html`'s login checks against. Without
it, `/api/admin-login` returns a 500 and sign-in can't succeed.
