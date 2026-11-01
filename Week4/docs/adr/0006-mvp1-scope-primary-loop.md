# ADR 0006 — MVP #1 scope is the primary loop

- Status: Accepted
- Date: 2026-10-31

## Context

The Week 4 brief says to ship "the entire MVP #1." This project's Week 2 scoping
defines MVP #1 as the primary loop — a resident contributes safely, the gap is
shown, an independent body issues and revokes a warrant, and the provider's
standing changes — and its own 8-week build plan spreads that loop across several
weeks. The secondary audiences (full provider onboarding, funding mechanics) are
explicitly deferred in the PRD.

## Decision

Define MVP #1 for this submission as the **primary loop, built end to end on
synthetic data**, plus the platform foundations under it (auth, RLS, config,
security baseline). Secondary-audience features are included as **minimal, working
slices** where feasible (a provider standing view, a funding-discipline register),
not as full build-outs, matching the PRD's "stub / cut if short" tags.

## Consequences

- The demo-critical loop works end to end: contribution → gap → warrant issue →
  revoke → standing change, with quorum enforced.
- Lighter tickets ship as honest minimal slices rather than being faked or
  padded; what is deferred is recorded here and on the backlog, not hidden.
- Scope stays anchored to one provider, one body, synthetic data — as the build
  plan requires.
