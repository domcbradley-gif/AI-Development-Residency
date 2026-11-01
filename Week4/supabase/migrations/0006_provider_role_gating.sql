-- =============================================================================
-- MVP #1 — Provider role-gating  (migration 0006)
-- -----------------------------------------------------------------------------
-- Only provider-role users may add to the official record from the app. This
-- replaces the earlier "any authenticated user" insert policy on
-- official_records with one that also requires the caller's profile role to be
-- 'provider'. (The SQL seed in 0002 runs as the service role in the SQL Editor,
-- which bypasses RLS, so seeding is unaffected.)
--
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- =============================================================================

drop policy if exists "authenticated can add synthetic official records" on public.official_records;
drop policy if exists "providers add synthetic official records" on public.official_records;

create policy "providers add synthetic official records"
    on public.official_records for insert to authenticated
    with check (
        synthetic is true
        and exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'provider'
        )
    );
