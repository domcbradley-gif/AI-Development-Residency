# ADR 0005 — Accounts only for roles that must be identified

- Status: Accepted
- Date: 2026-10-31

## Context

The rubric requires sign-up/login. The project requires residents to contribute
**anonymously**. These are only in tension if every user must have an account.

## Decision

Require accounts **only for the roles that must be identified to act** — community
-body members (who join a body and issue/revoke warrants) and providers. Residents
who only contribute to the record need **no account**; contributing stays
anonymous. A `profiles` row (role: `community_member` or `provider`) is created on
sign-up, under own-row RLS.

## Consequences

- Sign-up/login exists and is required where an action must be attributable (an
  explicit community act, by a real member) — satisfying the rubric.
- Anonymity by default is preserved for the contribution flow — no account, no
  identity attached.
- Authorisation for warrants is "is this user a member of the body?", checked both
  in the application tier and by RLS.
