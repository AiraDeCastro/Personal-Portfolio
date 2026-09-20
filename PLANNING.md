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
  higher update frequency or multiple editors doesn't belong here yet. (An
  admin page with password-gated auth was built and then deliberately
  removed for exactly this reason — see TASKS.md, Milestone 8.)
- **Not just a showcase of output.** The engineering process — pre-commit
  quality gates, Conventional Commits, tests written alongside features — is
  itself part of what the site demonstrates to a technical reviewer who goes
  digging in the repo.

The "In Progress" badge exists for one reason: freelance client work gets
revisited after it's first shown. The site should be able to say "this
one's still being worked on" without a visitor mistaking active work for
something broken. It's just markup on the card — see CLAUDE.md.

## Architecture

Static site. No backend, no database, no user accounts, nothing to
configure beyond the build itself.

```
                          index.html
                 (hero, projects, skills, contact —
                  "In Progress" badges hardcoded into
                    whichever cards need them)
                                │
                       npm run build (Vite)
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

An earlier version of this diagram had a second branch: a password-gated
`admin.html`, three Vercel Serverless Functions for auth, and a
`projects-status.json` data file that `index.html` fetched at runtime to
decide which badges to show. It worked, but it was solving a problem Aira
wasn't actually having — she edits `index.html` directly for every other
content change anyway, so the "toggle status without touching code" premise
never got used. Removed in Milestone 8 (see TASKS.md) in favor of what's
above: the badge is just HTML.

## Technology stack

| Layer | Choice | Why |
|---|---|---|
| Markup / styling / behavior | Vanilla HTML, CSS, JS (ES modules) | No framework runtime to ship for a handful of mostly-static sections |
| Build | [Vite](https://vitejs.dev) | Fast dev server, zero-config for plain HTML/CSS/JS |
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
- **Vercel CLI** — only needed if deploying outside the GitHub-connected
  auto-deploy; the project's `main` branch already auto-deploys without it.

Nothing else needs installing globally — `npm install` pulls every build,
lint, test, and git-hook tool into `node_modules/`. No environment
variables or secrets are needed anywhere in this project.
