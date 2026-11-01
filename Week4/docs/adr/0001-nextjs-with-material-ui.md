# ADR 0001 — Next.js (App Router) with Material UI

- Status: Accepted
- Date: 2026-10-31

## Context

MVP #1 is a three-tier web app: a presentation tier, an application tier (the
privacy-sensitive logic — aggregation, exposure protection, role-gated actions),
and a data tier. The Week 3 slice used Vite + React (a pure client-side SPA),
which has no server tier of its own: all logic runs in the browser or is pushed
into the database. The project's design, however, calls for real server-side
logic — "do anonymization / aggregation here, with configurable thresholds" and
"the provider can never read raw individual accounts." A client-only SPA has
nowhere trustworthy to run that.

## Decision

Build the app with **Next.js (App Router)** and the **Material UI** design
system. Next.js provides a first-class server runtime (Server Components, Server
Actions, Route Handlers, middleware) alongside React, so the application tier can
run on the server where raw data never reaches the browser. Material UI supplies
an accessible, consistent component system (carried over from Week 3).

## Consequences

- The application tier (gap aggregation with exposure thresholds, warrant
  issue/revoke with membership checks) runs server-side; only computed results
  reach the client.
- The stack matches the Week 4 requirement and the project's own build plan,
  which listed Next.js as the first-choice framework.
- Slightly more framework surface than a plain SPA (server/client component
  boundaries to reason about), accepted for the server tier it unlocks.
- Material UI keeps the accessible theme, focus rings, and reduced-motion
  handling already built in Week 3.
