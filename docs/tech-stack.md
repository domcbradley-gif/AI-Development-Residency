# Technology Stack & Tool Selection — MVP #1

Current as of 2026-11-01. A single overview of what the project is built with and
why, consolidating ADR-0001 (framework), ADR-0002 (hosting), and ADR-0003 (data +
auth). Each decision has a fuller record in `docs/adr/`.

The app is a **three-tier web app**: a presentation tier (the screens), an
application tier (the privacy-sensitive logic — aggregation, exposure protection,
role-gated actions), and a data tier (storage + access rules). The tool choices
follow those tiers.

## At a glance

| Tier | Choice | Why, in one line |
| --- | --- | --- |
| Framework / UI | **Next.js 14 (App Router) + Material UI 6** | A real server runtime for the privacy logic; keeps the accessible MUI work; matches the rubric. |
| Hosting | **Vercel (free)** | Zero-config Next.js host; auto-deploy on push; secrets in env vars, not the repo. |
| Data + Auth | **Supabase (free): Postgres + Auth + RLS** | Managed Postgres with access rules enforced at the data tier; open core re-homes to any Postgres. |
| Content / data | **Synthetic only, this phase** | No real resident data exists yet; every table carries a `synthetic` flag and rejects non-synthetic rows. |

## Framework & UI — Next.js (App Router) + Material UI

The Week 3 slice was a client-only Vite + React single-page app, which left the
privacy-sensitive logic with nowhere to run but the browser or the database.
Next.js gives the application tier a real server home — Server Components and
Server Actions — so aggregation, exposure protection, and role-gated writes run on
the server and the Supabase service key never reaches the browser. It also kept the
accessible Material UI components, theme, focus rings, and reduced-motion handling
built in Week 3, and it was both the rubric's named framework and the project's
own first-choice in the build plan. The accepted cost is keeping server vs. client
component boundaries straight. (ADR-0001.)

## Hosting — Vercel

The app has to be publicly reachable with minimal operational burden for one
part-time developer, on free resources, and stay portable. Vercel is a
first-class, zero-config Next.js host: deploys happen automatically on git push,
environment variables live in the dashboard (not the repo), and it serves a free
`*.vercel.app` URL. This superseded an earlier idea of self-hosting Docker on
Fly.io / Oracle Cloud, which carried real ops overhead. Lock-in is low because the
app is standard Next.js + Postgres with no Vercel-proprietary APIs, so it can
re-home later. (ADR-0002.)

## Data & Auth — Supabase (Postgres + Auth + Row Level Security)

The data tier must store the record, enforce access rules close to the data, and
stay portable to a community-controlled host or data trust later. Supabase
provides managed Postgres, built-in email/password Auth, and **Row Level Security
as the authoritative access control** — rules enforced at the data tier no matter
which client calls. Only the public anon key reaches the browser; the service-role
key is never used in the app. The open-source core and in-repo migrations mean the
whole schema re-homes to any Postgres. This was chosen over self-hosted Postgres
(ops overhead, no managed auth) and over a proprietary backend like Firebase
(non-relational, locked-in, not portable to a community data trust). (ADR-0003.)

## Content — synthetic data only

"Content" this phase is **synthetic only** — there is no real-data path. Every
table has a `synthetic boolean not null default true` column, and every insert
policy rejects non-synthetic rows, so no code path can write real resident data.
Real data stays a no-go gate until the consent model and hosting are ratified by
the community. The seeded demo content (the provider "Maplewood Supportive
Housing" and its clashing official records and resident notes) exists so the gap,
the warrant, and the rest of the loop are legible immediately.

## Supporting tools

- **Testing:** Vitest (unit tests + the anonymity-rail guard).
- **Linting:** ESLint via `eslint-config-next`.
- **CI:** GitHub Actions (lint, test, build-check).
- **Auth/session plumbing:** `@supabase/ssr` (browser client + server client +
  session-refresh middleware), cookie-based sessions.

## Portability (the throughline)

Each managed choice was made with an exit in mind, because the project's mission
requires it can move to community-controlled infrastructure: the app is standard
Next.js (runs on any Node host), the database is standard Postgres with migrations
in the repo (re-homes to any Postgres), and the open cores of both Next.js and
Supabase mean no proprietary lock-in. Portability is a mission requirement, not
just a convenience.

*Related: `docs/adr/0001`–`0003`; `docs/system-architecture.md`;
`docs/database-architecture.md`.*
