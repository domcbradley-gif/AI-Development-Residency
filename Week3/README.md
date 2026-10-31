# Week 3 — Community-Governed Data (slice 1)

A thin, end-to-end slice of the accountability app: a resident submits an
**anonymous text contribution** about their housing, it is stored, and the
community record is shown back.

**Everything here is synthetic data only.** There is no code path that accepts
real resident data: anonymous inserts are constrained to `synthetic = true` by a
Row Level Security policy, and the UI says so throughout.

## Architecture (Supabase + Vercel)

The deployed app is a **Vite + React + Material UI** front end that talks
**directly to Supabase** (Postgres + Row Level Security) via
`@supabase/supabase-js`. There is no application server to run or host.

| Concern | Where it lives |
|---------|----------------|
| Presentation | Vite + React + MUI in [`web/`](web/), deployed on **Vercel** |
| Data + access rules | **Supabase** (Postgres, RLS, CHECK constraints) — [`supabase/schema.sql`](supabase/schema.sql) |

> **Legacy:** the previous FastAPI + Docker stack ([`api/`](api/),
> [`docker-compose.yml`](docker-compose.yml)) is **retired from the deployed
> path**. The code is kept for reference and still has its own CI job, but it is
> not part of the deployed app.

## Deploy

### 1. Set up Supabase (the backend)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the whole of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. That creates the
   `contributions` table, the body-length CHECK constraint, enables RLS, adds the
   anonymous SELECT/INSERT policies (no UPDATE/DELETE), and loads a few synthetic
   seed rows. It is safe to re-run.
3. From **Project Settings → API**, copy the **Project URL** and the **anon /
   public** key. (Never copy the `service_role` key into this app.)

### 2. Deploy the front end on Vercel

1. Import this Git repo into Vercel.
2. Set **Root Directory** to `Week3/web`. Vercel auto-detects the Vite preset
   (build `npm run build`, output `dist`); `web/vercel.json` pins this too.
3. Add these **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | your Supabase **Project URL** |
   | `VITE_SUPABASE_ANON_KEY` | your Supabase **anon / public** key |

4. Deploy. Submitting a note in the UI inserts into Supabase and appears in
   "The community record".

> Both env vars are **public by design** — the anon key is a publishable key and
> access is controlled by RLS. They are still read from the environment (never
> hardcoded), and real values stay out of git.

## Run locally

```bash
cd Week3/web
cp .env.example .env     # then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev              # http://localhost:5173
```

Point it at the same Supabase project you set up above (or a separate dev
project). No local database or API is required.

## Tests, lint, build

```bash
cd Week3/web
npm run lint
npm test                 # anonymity rail (vitest) — pure, no network/env needed
npm run build
```

CI (GitHub Actions, `.github/workflows/ci.yml`) runs lint + test + build for the
web app on every push and PR. The legacy API job still lint/tests `api/`.

## Safety rails (re-expressed for Supabase)

- **Anonymity by default** — the `contributions` table has **no identifying
  columns** (no resident id, name, email, phone, address, IP, device/session id).
  `web/src/anonymity.test.js` fails if the client's read projection or insert
  payload could ever carry an identity field.
- **Synthetic-only** — a `synthetic boolean not null default true` column, and an
  RLS policy that only allows anonymous inserts where `synthetic is true`. The UI
  keeps the "practice environment / all data synthetic" and "anonymous" messaging.
- **Validation at the trust boundary** — body length **1–5000** enforced both
  client-side (UX) and as a Postgres **CHECK constraint** (authoritative). The
  topic allowlist is **provisional client-side config** in `web/src/config.js`,
  labelled *"provisional — not set by the community"* and deliberately **not**
  hardcoded in the database.
- **Row Level Security** — RLS is enabled; anonymous **SELECT** and **INSERT**
  are allowed, **UPDATE/DELETE are denied** (no policy + explicit `REVOKE`).
  Resident export/delete stays deferred.
- **Secrets as env vars only** — Supabase config is read from
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; see `web/.env.example`. No real
  values committed; the `service_role` key is never used client-side.
- **Accessibility (WCAG 2.2 AA)** — semantic HTML, labelled controls, a skip
  link, visible focus, live-region announcements, AA-contrast colors, and
  `prefers-reduced-motion` honored.

## Deferred to later slices (on the backlog)

Audio/video capture · resident export & delete · official-record ingestion &
the reported-vs-lived gap · the independent community body · warrant issuance /
revocation · provider onboarding & funding discipline · authenticated roles.
