# ADR-0007: Minimal stubs for provider intake, outcomes, and independence re-check

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0006

## Context

Three MVP #1 backlog tickets are tagged "stub if short" in the PRD: provider
record intake (5.1), the minimal outcome stub (5.2), and the independence re-check
(4.3). Full build-outs are more than this week needs, but leaving them empty would
make the loop feel incomplete (and the rubric forbids empty screens).

## Options

1. **Full build-outs now.** Good: complete features. Bad: a provider onboarding
   flow, an outcomes data model, and a governance workflow are too much for the
   week.
2. **Minimal working stubs reusing existing tables — chosen.** Good: each ticket
   is genuinely functional and needs no extra schema. Bad: simplifications —
   outcomes piggyback on `official_records`; the independence re-check is a
   computed display, not a workflow.
3. **Leave them empty / "coming soon."** Good: no work. Bad: the rubric forbids
   fake or empty screens, and the loop would look unfinished.

## Decision

Ship minimal but working versions: provider intake writes to `official_records`
(provider-role only); outcomes are `official_records` in an "outcome" category,
shown on the provider page; the independence re-check computes a status from
existing data (self-organized membership, funder cap, no money from the watched,
quorum set).

## Consequences

- **Easier:** each ticket works, with no new tables.
- **Harder / accepted:** the simplifications are explicit — recorded here so a
  successor knows what to deepen.
- **Next:** deepen outcomes into their own model and independence into a real
  review workflow in a later phase.
