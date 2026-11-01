-- =============================================================================
-- Community-Governed Data — Supabase schema for the anonymous contribution slice
-- -----------------------------------------------------------------------------
-- Paste this whole file into your Supabase project:
--   Supabase Studio  ->  SQL Editor  ->  New query  ->  paste  ->  Run.
--
-- Safe to re-run: table/policies are created idempotently and the synthetic
-- seed only loads when the table is empty.
--
-- EVERYTHING HERE IS SYNTHETIC-DATA-ONLY. There is no real-data path. Do not
-- store data about a real person in this table.
-- =============================================================================


-- 1. Table --------------------------------------------------------------------
-- ANONYMITY BY DEFAULT — READ BEFORE ADDING A COLUMN.
-- A contribution carries NO identifying data and must never be traceable to an
-- individual. There is deliberately no resident_id, name, full_name, email,
-- phone, address, ip / ip_address, device_id, or session_id column here. Keep
-- this table minimal; any new column must be reviewed against this rail first.
create table if not exists public.contributions (
    id          uuid         primary key default gen_random_uuid(),

    -- The resident's own words about their housing. No identity is attached.
    body        text         not null,

    -- Optional, non-identifying topic tag. See the note below: the DB does NOT
    -- constrain its values — the allowlist is provisional client-side config.
    topic       text,

    created_at  timestamptz  not null default now(),

    -- Every row this phase is synthetic. Stored explicitly, defaulting to true,
    -- so the guarantee is visible in the data and not only in code.
    synthetic   boolean      not null default true,

    -- VALIDATION at the data boundary: body length 1–5000 characters. This
    -- mirrors the client-side check and is the authoritative server-side rule
    -- now that the FastAPI tier is retired from the deployed path.
    constraint contributions_body_length
        check (char_length(body) between 1 and 5000)
);

comment on table public.contributions is
    'Anonymous, synthetic-only resident contributions. No identifying columns — ever.';

-- NOTE ON `topic`: it is intentionally NOT constrained by the database. The
-- topic list is PROVISIONAL ("provisional — not set by the community") and lives
-- in the front-end config so a Tier-1 community can ratify or replace it without
-- a migration. Do not add a CHECK constraint or enum for topic here.


-- 2. Row Level Security -------------------------------------------------------
alter table public.contributions enable row level security;

-- Defense in depth alongside RLS: the anonymous role may read and insert, and
-- is explicitly denied the ability to modify or remove rows.
revoke update, delete on public.contributions from anon;
grant  select, insert on public.contributions to   anon;

-- Anonymous visitors may READ the whole record.
drop policy if exists "anon can read contributions" on public.contributions;
create policy "anon can read contributions"
    on public.contributions
    for select
    to anon
    using (true);

-- Anonymous visitors may ADD a contribution — but only a synthetic one. An
-- attempt to insert a row with synthetic = false is rejected by this policy.
drop policy if exists "anon can insert synthetic contributions" on public.contributions;
create policy "anon can insert synthetic contributions"
    on public.contributions
    for insert
    to anon
    with check (synthetic is true);

-- There is deliberately NO update or delete policy for the anon role, so with
-- RLS enabled those operations are denied by default. Resident export and
-- delete are DEFERRED to a later slice.


-- 3. Synthetic seed rows ------------------------------------------------------
-- Loads only when the table is empty, so re-running this file won't duplicate.
insert into public.contributions (body, topic, synthetic)
select body, topic, synthetic
from (
    values
        ('Black mold has been creeping down the bedroom wall for three months. I''ve reported it twice and nothing has changed.', 'mold', true),
        ('The elevator has been out for two weeks. I''m on the 6th floor and can barely manage the stairs.', 'elevator', true),
        ('Roaches everywhere in the kitchen. Management says it''s my fault for leaving food out, but the whole building has them.', 'pests', true),
        ('No heat since the cold snap started. We''ve been using the oven to stay warm, which I know isn''t safe.', 'heating', true),
        ('The back stairwell light has been out for a month and the main door lock is broken. It doesn''t feel safe at night.', 'safety', true)
) as seed(body, topic, synthetic)
where not exists (select 1 from public.contributions);
