# ADR-0004: Contributions are anonymous and public-read

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0003, ADR-0005

## Context

The Week 4 rubric says each person should see only their own information, with RLS
on every table — a pattern that assumes per-user ownership of rows. This project's
core principle is the opposite for one table: a resident contribution is the
community's record and must be anonymous by default, traceable to no one.

## Options

1. **Per-user ownership on every table, contributions included.** Good: matches
   the rubric's default literally. Bad: requires an identity column on
   contributions — which breaks anonymity by default, the project's core rail.
2. **Anonymous, public-read contributions + per-user RLS on identity tables —
   chosen.** Good: preserves anonymity; still has RLS on every table; meets the
   rubric's intent (no one sees data they shouldn't). Bad: the contributions table
   is a documented exception that must be explained.
3. **Private per-user contributions (each sees only their own).** Good: simple,
   uniform RLS. Bad: the record stops being a shared community record — it defeats
   the whole purpose of the project.

## Decision

Treat `contributions` as a deliberate exception: no identifying columns (enforced
by a build-time test), anonymous public read, anonymous insert of synthetic rows
only, no update/delete. Every identity-bearing table (`profiles`, `memberships`,
the warrant tables' actor columns) applies per-user / per-role RLS.

## Consequences

- **Easier:** the rubric's intent is met while anonymity is preserved where it
  matters; "each person sees only their own information" holds for personal data.
- **Harder / accepted:** policies differ table by table, so each one is documented.
- **Next:** keep the anonymity test in CI; review any new column on `contributions`
  against the anonymity rail first.
