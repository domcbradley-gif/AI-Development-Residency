# ADR-0003: Use Supabase for Postgres, Auth, and Row Level Security

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0001, ADR-0002, ADR-0004

## Context

The data tier must store the record, enforce access rules close to the data, and
stay portable to a community-controlled host or data trust later. It also needs
authentication for the roles that act (community-body members, providers) while
keeping resident contributions anonymous.

## Options

1. **Supabase (free plan) — chosen.** Good: managed Postgres, built-in Auth, Row
   Level Security as authoritative access control, and an open-source core that
   re-homes to any Postgres. Bad: a managed vendor (but the core is open Postgres).
2. **Self-hosted Postgres in Docker.** Good: full control. Bad: ops overhead, and
   no managed auth — authentication would have to be built.
3. **A proprietary backend-as-a-service (e.g. Firebase).** Good: easy auth. Bad:
   non-relational, proprietary lock-in, and not portable to a community data trust.

## Decision

Use Supabase: Postgres for storage, Supabase Auth (email/password) for sign-in,
and RLS policies on every table as the authoritative access control. Only the
public anon key reaches the browser; the service-role key is never used in the app.

## Consequences

- **Easier:** access rules enforced at the data tier no matter which client calls;
  schema + migrations re-home to any Postgres.
- **Harder / accepted:** a managed dependency; mitigated by Supabase's open core
  and keeping migrations in the repo.
- **Next:** keep SQL in `supabase/migrations/`; never ship the service-role key.
