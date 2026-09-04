# Tasks

Work broken into milestones, in the order they actually happened (or, for
Milestone 7, the order they're expected to). Checked items are done and
live; unchecked items are open. See [PLANNING.md](PLANNING.md) for
architecture/stack and the
[PRD](https://claude.ai/code/artifact/a409695c-d0e3-4b99-bb38-8e8842d2a9b2)
for the reasoning behind each.

## Milestone 1 — Site foundation

- [x] Redesign the site as a single-page portfolio in the gapcanada.ca
      editorial style — full-bleed hero, uppercase type, grid tiles
- [x] Build the Hero section (video background with a solid-fallback ground,
      headline, sub-copy, two CTAs)
- [x] Build the About section (bio summary + stat callouts)
- [x] Build the Work/Projects grid with tags and links
- [x] Build the Skills section (6 categories, sourced from résumé)
- [x] Build the Contact section (email, phone, LinkedIn, GitHub)
- [x] Sticky, scroll-aware nav with a mobile slide-down menu
- [x] `.gitignore` for local tooling config
- [x] Supply the real hero video asset — `public/video/hero.mp4`, with a
      matching `hero-poster.jpg` frame grabbed via canvas from the video
      itself
- [x] Swapped the hero video to "Sea Waves at Sunset" by Engin Akyurt
      (Pexels, free for commercial use), replacing the original "Sea Water
      Surface with Ripples" clip. Aira trimmed and re-encoded it herself
      (1920×1080, 10s, 27.5MB) after the original HD/SD Pexels exports of
      this clip came back impractically large (172MB / 62.7MB) — this
      footage's sparkle/highlight detail compresses far worse than the
      first clip did at a similar size

## Milestone 2 — Engineering pipeline

- [x] Migrate to a Vite build (`npm run dev` / `npm run build`)
- [x] Add ESLint (flat config) for JS
- [x] Add Stylelint for CSS
- [x] Add a Cypress end-to-end suite covering the public site
- [x] Wire up Husky `pre-commit`: lint-staged → full lint → build → `npm
      audit --audit-level=high` → Cypress
- [x] Enforce Conventional Commits via commitlint (`commit-msg` hook) +
      commitizen (`npm run commit`)
- [x] Work around the Windows `start-server-and-test`/`wmic.exe` crash with
      a custom `scripts/run-e2e.js` runner

## Milestone 3 — Content & project grid

- [x] Pull real project data from GitHub (Lavender Refreshments, Jordyn's
      Bakes, Tic-Tac-Toe, Inspiration, Ticket Pricing)
- [x] Swap the featured set to the five current projects
- [x] Capture and compress real hero screenshots for the two live client
      sites (Lavender Refreshments, Jordyn's Bakes)
- [x] Confirm the other three project tiles' gradient treatment reads
      intentionally, not as a missing image
- [x] Swap Ticket Pricing out for Set It Up (Next.js/Prisma/NextAuth
      scheduling app, still in active development) in the project grid
- [x] Re-color the Tic-Tac-Toe tile to teal and give Set It Up a blue
      gradient rooted in its own app's `scheduleColor` default (`#0072B2`)
- [x] Add Gunita (private, Netflix-style photo/video album app — Next.js,
      Supabase, RLS) as a real card, queued from the Backlog; gradient
      tile in near-black/red, rooted in its own "Netflix-style" pitch
- [x] Tic-Tac-Toe was rebuilt since it was first added — now a React app
      with an Easy/Medium/Hard robot opponent, deployed live via GitHub
      Actions to GitHub Pages. Replaced its gradient tile with a real
      screenshot of the live board, and rewrote its description/tags/
      links to match (added a Live Site link)
- [x] Corrected Tic-Tac-Toe's status back to `"live"` in
      `projects-status.json` — it had been flagged in-progress before
      confirming the rebuild was actually live and feature-complete

## Milestone 4 — In-progress status system

- [x] Design the status data model (`public/data/projects-status.json`,
      project id → `"live"` \| `"in-progress"`)
- [x] Wire `data-project-id` attributes on every project card
- [x] Render an "In Progress" badge from the status file at runtime
- [x] Build `admin.html` — local status editor with a toggle per project
- [x] Implement the download-updated-JSON publish flow (no backend to save
      to, so export → replace file → commit → push)
- [x] Mark the admin page `noindex` and keep it out of the public nav
- [x] Cypress coverage for the admin page and the badge rendering
- [x] Gate `admin.html` behind a real password check — three Vercel
      Serverless Functions (`api/admin-login.js`, `admin-check.js`,
      `admin-logout.js`) verify against the `ADMIN_PASSWORD` env var and
      set a signed, HttpOnly session cookie; the password never reaches
      the browser
- [x] Cypress coverage for the sign-in flow (signed out, wrong password,
      correct password, sign out) via `cy.intercept` on `/api/admin-*`

## Milestone 5 — Deployment

- [x] Connect the repo to Vercel, production tracking `main`
- [x] Verify the live deployment matches source (hero, all 5 project cards,
      skills, contact, admin page) after a push
- [x] Confirm auto-deploy fires on every push to `main` — no manual step

## Milestone 6 — Documentation

- [x] Write the PRD (vision, requirements, architecture, data model,
      quality gates, admin workflow decision, limitations, release history)
- [x] Write `CLAUDE.md` — operating guide for Claude Code sessions working
      in this repo
- [x] Write `PLANNING.md` — vision, architecture, tech stack, required tools
- [x] Write this file
- [x] Add the "Backlog — Projects to add" section below, as a lightweight
      alternative to a full add/edit admin UI

## Milestone 7 — Open work

- [ ] Content edits made directly on GitHub's web UI (as with the
      Jordyn's Bakes status flip) skip the pre-commit gates entirely —
      decide whether that's acceptable for content-only changes or worth
      guarding against
- [ ] Add a Lighthouse (or equivalent) performance/accessibility budget to
      the pipeline
- [ ] Point a custom domain at the Vercel deployment
- [x] **Set `ADMIN_PASSWORD` in the Vercel project's Environment Variables**
      — confirmed working: a real sign-in produced the status-file download
      used for the Jordyn's Bakes/Set It Up/Tic-Tac-Toe/Inspiration update
- [ ] Add new projects to the grid as freelance/personal work ships (see
      the Backlog below for repos already queued)

## Backlog — Projects to add

Repos you want featured eventually, noted here whenever you think of one —
add a line yourself (even straight from GitHub's web editor, like the status
flip). No admin UI needed: I read this file at the start of every session
(see CLAUDE.md) and turn each line into a proper card — real description,
tags, colors, screenshot — the same way Set It Up got added. Check it off
once the card ships.

- [ ] <repo-name> — <github-url> — <optional: one-line note on what it is
      or why it's worth featuring>
- [x] Gunita — https://github.com/AiraDeCastro/Gunita-Photo-Album — private
      Netflix-style photo/video album app (Next.js, Supabase Postgres/Auth/
      Storage, Row Level Security-backed roles, Vitest); v1 feature-complete,
      not yet deployed. Card added — see Milestone 3
