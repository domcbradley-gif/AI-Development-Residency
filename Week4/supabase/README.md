# Supabase migrations

Apply these in order in the Supabase SQL Editor (New query -> paste -> Run), or
with the Supabase CLI. Every file is idempotent and safe to re-run. All data is
synthetic; insert policies reject non-synthetic rows, so there is no real-data
path in this phase.

- `migrations/0001_contributions.sql` — anonymous, public-read resident contributions.
- `migrations/0002_providers_and_official_records.sql` — providers + official records (the two sides of "the gap").
- `migrations/0003_profiles.sql` — per-user profiles with own-row RLS (community members / providers).
- `migrations/0004_bodies_warrants.sql` — community bodies, self-organized memberships, warrants (public register), and append-only receipts.
- `migrations/0005_funding_discipline.sql` — funders + public conflict register (cap + independence checks).
- `migrations/0006_provider_role_gating.sql` — only provider-role users may add to the official record.
