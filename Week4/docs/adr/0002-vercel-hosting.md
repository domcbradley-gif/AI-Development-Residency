# ADR 0002 — Host on Vercel

- Status: Accepted
- Date: 2026-10-31

## Context

The app must be publicly reachable with minimal operational burden for a solo,
part-time developer, and the build plan requires everything to run on free
resources and stay portable. The earlier plan considered self-hosting via Docker
on Fly.io / Oracle Cloud; that carries real ops overhead (containers, a VM, a
PaaS) for one person.

## Decision

Host the front end and its server runtime on **Vercel** (free plan), deploying
from the GitHub repository. Vercel is the first-class host for Next.js: zero-
config builds, automatic deploys on push, environment variables managed in the
dashboard, and a free `*.vercel.app` URL.

## Consequences

- No servers to run or patch; deploys happen on git push.
- Secrets (the Supabase URL and anon key) live in Vercel project env vars, never
  in the repo.
- This supersedes the Docker / Fly.io idea in the original build plan for the
  residency phase. Portability is preserved because the app is standard Next.js +
  Postgres with no Vercel-proprietary APIs, so it can re-home later.
- Vendor consideration: Vercel is a managed platform. The lock-in is low (a
  Next.js app runs on any Node host), and the data tier (the part that matters
  for community ownership) is separate and portable (see ADR 0003).
