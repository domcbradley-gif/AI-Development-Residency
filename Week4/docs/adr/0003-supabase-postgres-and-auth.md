# ADR 0003 — Supabase for Postgres, Auth, and Row Level Security

- Status: Accepted
- Date: 2026-10-31

## Context

The data tier must store the record, enforce access rules close to the data, and
stay portable to a community-controlled host or data trust later. It also needs
authentication for the roles that act (community-body members, providers) while
keeping resident contributions anonymous.

## Decision

Use **Supabase** (free plan): managed **Postgres** for storage, **Supabase Auth**
(email/password) for sign-in, and **Row Level Security (RLS)** policies on every
table as the authoritative access control. The browser and server talk to
Supabase via `@supabase/ssr`; the public anon key ships to the browser and is
gated entirely by RLS, while the service-role key is never used in the app.

## Consequences

- Access rules live in the database as RLS policies, enforced no matter which
  client calls — defense in depth beyond the application tier.
- Portability is preserved: Supabase's core is open-source Postgres, so schema +
  migrations (kept in `supabase/migrations/`) re-home to any Postgres host.
- Secrets discipline: only the public URL + anon key reach the browser; there is
  no service-role key in the codebase.
- Synthetic-only is enforced in the data tier (a `synthetic` column + insert
  policies that reject non-synthetic rows), so no real-data path exists.
