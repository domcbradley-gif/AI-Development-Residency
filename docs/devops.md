# Development Operations (DevOps) — MVP #1

Current as of 2026-11-01. How the project goes from a code change to a running,
verified deployment: the environments, the pipeline, the release flow, how
database changes and secrets are handled, and how to roll back.

## Environments

| Environment | Where | Purpose | Data |
| --- | --- | --- | --- |
| Local dev | developer machine (`npm run dev`) | build and test changes | synthetic (local Supabase project or shared dev project) |
| CI | GitHub Actions (ephemeral runners) | lint, test, build-check every change | none (tests are pure; build needs no secrets) |
| Production | Vercel (`*.vercel.app`) + Supabase | the live app | synthetic only, this phase |

There is no separate staging environment yet; it is not needed while all data is
synthetic and the primary loop is the only surface. (Noted under "Known gaps".)

## Source control & branching

- **`main`** is the deployable branch — whatever is on it is what production builds.
- Work happens on a **feature branch** (currently `week4-mvp`).
- Changes reach `main` through a **pull request**, which runs CI, then a merge.
- The repo root holds the whole residency (`Week1`–`Week4`); the live app is
  `Week4/web`, and docs are in `docs/`.

## Continuous integration (GitHub Actions)

Workflow: `.github/workflows/ci.yml`. It runs on every push to `main` and every
pull request; a failing check blocks the merge.

The `web` job, in `Week4/web`:

1. `npm ci` — clean install from the lockfile.
2. `npm run lint` — ESLint via `eslint-config-next`.
3. `npm test` — Vitest unit tests, including the **anonymity-rail guard** that
   fails the build if a contribution could carry an identifying field.
4. `npm run build` — a full `next build`, which needs no secrets (the server
   Supabase client is null-safe when env vars are absent).

> This workflow was repointed from the old `Week3/` targets (the Vite slice and the
> retired FastAPI tier) to `Week4/web`, so CI now actually guards the deployed app —
> closing the gap noted in `docs/system-architecture.md`.

## Continuous deployment (Vercel)

- Vercel is connected to the GitHub repo with its **root directory set to
  `Week4/web`**.
- A push to `main` triggers an automatic production deploy.
- Pull requests get automatic **preview deployments** (a unique URL per PR) so a
  change can be checked live before it merges.
- Build settings use the Next.js framework preset (no custom output directory).

## Configuration & secrets

- Runtime config is two environment variables: `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- In production they live in the **Vercel dashboard**; locally in `.env.local`
  (git-ignored). `.env.example` is the committed template.
- Only the **public anon/publishable key** is ever used client-side. The Supabase
  **service-role key is never used in the app** and never committed. Access control
  does not depend on hiding the anon key — it is enforced by Row Level Security at
  the data tier.

## Database changes (migrations)

- Schema lives as SQL files in `Week4/supabase/migrations/` (0001–0006), numbered
  in order.
- They are **applied manually** in the Supabase SQL editor (paste → run). Each file
  is **idempotent** (safe to re-run) and seeds only synthetic data when empty.
- This manual step is deliberate for a solo, synthetic-only phase; automating it
  with the Supabase CLI is a later improvement (see "Known gaps").

## The release flow, end to end

1. Create or switch to a feature branch.
2. Make the change; commit it.
3. Push the branch to GitHub.
4. Open a pull request into `main`.
5. CI runs (lint, test, build). Green is required.
6. Merge the PR.
7. Vercel auto-deploys `main` to production.
8. Verify on the live URL (and apply any new migration in Supabase first if the
   change needs one).

## Rollback

- **App:** Vercel keeps every previous deployment — promoting an earlier one is an
  instant rollback, no rebuild. A `git revert` + push achieves the same through the
  pipeline.
- **Database:** migrations are additive and idempotent, so a bad deploy of code can
  be rolled back without touching the schema. A schema change would need a new
  compensating migration (there is no automated down-migration this phase).

## Known gaps / next steps

- **Migrations are manual** — adopt the Supabase CLI to version and apply them in CI
  when the project is resourced.
- **No separate staging DB** — fine while synthetic-only; add one before real data.
- **No end-to-end tests in CI yet** — the BDD `.feature` files are ready to wire to
  a runner (see `Week4/web/features/`); unit tests + the anonymity rail cover the
  critical logic today.

*Related: `docs/system-architecture.md`; `docs/tech-stack.md`; `docs/security.md`;
`.github/workflows/ci.yml`.*
