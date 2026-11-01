# ADR 0004 — Contributions are anonymous and public-read

- Status: Accepted
- Date: 2026-10-31

## Context

The Week 4 rubric says each person should see only their own information, with
RLS on every table — a pattern that assumes per-user ownership of rows. This
project's core principle is the opposite for one specific table: a resident
**contribution** is the community's record and must be **anonymous by default**,
carrying no identity and traceable to no one.

## Decision

Treat the `contributions` table as a deliberate, documented exception to
"each person sees only their own rows":

- It carries **no identifying columns** (no user_id, name, email, IP, etc.), so a
  contribution cannot be tied to a person. A build-time test
  (`anonymity.test.js`) fails if the client's read/write shape could ever carry
  identity.
- RLS allows **anonymous read of the whole record** (it is the community record,
  meant to be seen) and **anonymous insert of synthetic rows only**; update and
  delete are denied.
- Every other, identity-bearing table (`profiles`, `memberships`, and the
  warrant tables' actor columns) **does** apply per-user / per-role RLS.

## Consequences

- The rubric's intent — RLS on every table, no one seeing data they shouldn't —
  is met, while the anonymity principle is preserved where it matters.
- "Each person sees only their own information" is honoured for personal data
  (profiles) and does not wrongly apply to a record that is, by design, public and
  ownerless.
- This is a more deliberate RLS story than a blanket per-user rule, and it is why
  the policies differ table by table.
