# ADR-0006: MVP #1 scope is the primary loop

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident); confirmed with the instructor
- **Related:** ADR-0007, ADR-0008

## Context

The Week 4 brief says to ship "the entire MVP #1." The project's Week 2 scoping
defines MVP #1 as the primary loop — a resident contributes safely, the gap is
shown, an independent body issues and revokes a warrant, the provider's standing
changes — and its own 8-week build plan spreads that across several weeks.

## Options

1. **Build literally every backlog ticket this week.** Good: matches "entire MVP
   #1" word for word. Bad: the project's own plan says the full loop cannot be
   stood up by one person on a residency clock in a week.
2. **Primary loop end to end + minimal slices; stub or defer the rest — chosen.**
   Good: the demo-critical loop works end to end; defensible; delivered on time.
   Bad: a few tickets are stubbed or deferred (recorded in ADR 0007 / 0008).
3. **Thinnest minimum viable demo only.** Good: least work. Bad: under-delivers
   against the instructor's "entire MVP #1."

## Decision

Define MVP #1 for this submission as the primary loop built end to end on
synthetic data, plus the platform foundations under it. The instructor confirmed
building the full primary loop; light tickets ship as stubs (ADR 0007) and three
heavier ones are scoped out with reasons (ADR 0008).

## Consequences

- **Easier:** the loop works end to end: contribution → gap → warrant issue →
  revoke → standing change, with quorum enforced.
- **Harder / accepted:** some tickets are stubbed or deferred — recorded, not
  hidden, and kept on the backlog.
- **Next:** stay anchored to one provider, one body, synthetic data.
