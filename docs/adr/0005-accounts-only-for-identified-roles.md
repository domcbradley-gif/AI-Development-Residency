# ADR-0005: Accounts only for roles that must be identified

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0004

## Context

The rubric requires sign-up/login. The project requires residents to contribute
anonymously. These only conflict if every user must have an account.

## Options

1. **Everyone must have an account.** Good: one uniform model. Bad: breaks
   anonymous contribution — a resident would have to sign in to speak.
2. **Accounts only for identified roles; residents stay anonymous — chosen.**
   Good: anonymity preserved for contribution; login exists where an action must
   be attributable (joining a body, issuing/revoking a warrant); satisfies the
   rubric. Bad: two modes (signed-in and anonymous) to reason about.
3. **No accounts at all.** Good: simplest. Bad: a warrant could not be an
   attributable, explicit community action; fails the rubric's sign-up/login need.

## Decision

Require accounts only for community-body members and providers. Residents who only
contribute need no account. A `profiles` row (role: `community_member` or
`provider`) is created on sign-up, under own-row RLS.

## Consequences

- **Easier:** sign-up/login exists where attribution matters; anonymity by default
  is preserved for the contribution flow.
- **Harder / accepted:** the app reasons about both signed-in and anonymous users.
- **Next:** authorize warrant actions by "is this user a member of the body?",
  checked in the app and by RLS.
