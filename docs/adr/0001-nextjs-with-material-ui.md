# ADR-0001: Use Next.js with Material UI

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0002, ADR-0003

## Context

MVP #1 is a three-tier web app: screens, an application tier for the privacy-
sensitive logic (aggregation, exposure protection, role-gated actions), and a
data tier. The Week 3 slice used Vite + React — a client-only single-page app
with no server of its own, so that logic would have to run in the browser or be
pushed into the database. The project's design calls for real server-side logic,
and the Week 4 rubric requires Next.js.

## Options

1. **Vite + React (client-only SPA).** Good: least change from Week 3; simple
   mental model. Bad: no server tier, so privacy logic runs in the browser or in
   Supabase functions; does not meet the rubric, which names Next.js.
2. **Next.js (App Router) + Material UI — chosen.** Good: a real server runtime
   (Server Components, Server Actions) where the application tier can run and the
   service key never reaches the browser; matches the rubric; Next.js was the
   first-choice framework in the build plan; deploys to Vercel with no config.
   Bad: more surface to reason about (server vs. client components).
3. **SvelteKit.** Good: also has a server tier. Bad: not React, so it throws away
   the Material UI components and theme already built in Week 3; not what the
   rubric names.

## Decision

Build with Next.js (App Router) and Material UI. It gives the application tier a
real server home, keeps the accessible MUI work from Week 3, and matches both the
rubric and the project's own build plan.

## Consequences

- **Easier:** server-side aggregation and exposure protection; auto-deploy on
  Vercel; the Week 3 theme, focus rings, and reduced-motion handling carried over.
- **Harder / accepted:** server/client component boundaries to keep straight.
- **Next:** set up the MUI App Router cache + theme; migrate the Week 3 slice.
