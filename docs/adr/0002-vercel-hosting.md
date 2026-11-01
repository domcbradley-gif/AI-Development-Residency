# ADR-0002: Host on Vercel

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0001, ADR-0003

## Context

The app must be publicly reachable with minimal operational burden for a solo,
part-time developer, on free resources, and stay portable. The earlier build plan
considered self-hosting with Docker on Fly.io or Oracle Cloud.

## Options

1. **Vercel (free plan) — chosen.** Good: first-class, zero-config Next.js host;
   automatic deploys on git push; environment variables managed in the dashboard;
   free `*.vercel.app` URL. Bad: a managed platform (but lock-in is low — a
   Next.js app runs on any Node host).
2. **Self-host Docker on Fly.io / Oracle Cloud (original plan).** Good: full
   control; container portability. Bad: real ops overhead for one person —
   containers, a VM, a PaaS to maintain and patch.
3. **Another static/Node host.** Good: possible. Bad: more configuration than
   Vercel for a Next.js app, with no upside here.

## Decision

Host on Vercel, deploying from GitHub. This supersedes the Docker / Fly.io idea
for the residency phase.

## Consequences

- **Easier:** no servers to run or patch; deploys happen on push; secrets live in
  Vercel env vars, not the repo.
- **Harder / accepted:** an external dependency on Vercel; mitigated because the
  app is standard Next.js + Postgres with no Vercel-proprietary APIs, so it can
  re-home later.
- **Next:** point the Vercel project's root directory at `Week4/web`; set the
  Supabase env vars.
