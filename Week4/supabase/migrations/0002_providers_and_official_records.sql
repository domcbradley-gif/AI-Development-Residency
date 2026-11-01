-- =============================================================================
-- MVP #1 — Providers + Official Records  (migration 0002)
-- -----------------------------------------------------------------------------
-- These are the two inputs to "the gap": what the OFFICIAL record says about a
-- housing provider, set beside what residents actually report (the anonymous
-- `contributions` from migration 0001). SYNTHETIC DATA ONLY — every row carries
-- a `synthetic` flag defaulting to true, and the insert policies reject non-
-- synthetic rows, so there is no real-data path.
--
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- =============================================================================


-- 1. Providers ----------------------------------------------------------------
-- A housing provider the community can hold to account. The provider register is
-- PUBLIC by design (transparency), like the contributions record.
create table if not exists public.providers (
    id          uuid        primary key default gen_random_uuid(),
    name        text        not null,
    description text,
    synthetic   boolean     not null default true,
    created_at  timestamptz not null default now(),

    constraint providers_name_length check (char_length(name) between 1 and 200)
);

comment on table public.providers is
    'Housing providers under community accountability. Public-read. Synthetic only.';

alter table public.providers enable row level security;

revoke update, delete on public.providers from anon, authenticated;
grant  select on public.providers to anon, authenticated;
grant  insert on public.providers to authenticated;

drop policy if exists "providers are publicly readable" on public.providers;
create policy "providers are publicly readable"
    on public.providers for select using (true);

-- Signed-in users (body members / providers) may add providers, synthetic only.
drop policy if exists "authenticated can add synthetic providers" on public.providers;
create policy "authenticated can add synthetic providers"
    on public.providers for insert to authenticated with check (synthetic is true);


-- 2. Official records ---------------------------------------------------------
-- A claim from the official record about a provider, in a given category. The
-- category intentionally lines up with a contribution `topic` so the two can be
-- cross-checked (see the documented method in docs/). Raw inputs are retained;
-- nothing is overwritten.
create table if not exists public.official_records (
    id               uuid        primary key default gen_random_uuid(),
    provider_id      uuid        not null references public.providers(id) on delete cascade,
    source           text        not null,          -- e.g. 'City housing inspection'
    category         text        not null,          -- lines up with contribution topic
    reported_summary text        not null,          -- what the official record claims
    record_date      date,
    synthetic        boolean     not null default true,
    created_at       timestamptz not null default now(),

    constraint official_records_summary_length check (char_length(reported_summary) between 1 and 2000)
);

comment on table public.official_records is
    'Official-record claims per provider & category, for cross-check against lived accounts. Public-read. Synthetic only.';

alter table public.official_records enable row level security;

revoke update, delete on public.official_records from anon, authenticated;
grant  select on public.official_records to anon, authenticated;
grant  insert on public.official_records to authenticated;

drop policy if exists "official records are publicly readable" on public.official_records;
create policy "official records are publicly readable"
    on public.official_records for select using (true);

drop policy if exists "authenticated can add synthetic official records" on public.official_records;
create policy "authenticated can add synthetic official records"
    on public.official_records for insert to authenticated with check (synthetic is true);


-- 3. Synthetic seed -----------------------------------------------------------
-- Seeds one demo provider plus official-record claims that deliberately clash
-- with the seeded resident contributions (mold, elevator, pests, heating,
-- safety) — so the gap is visible immediately. Loads only when no provider
-- exists yet, so re-running this file won't duplicate.
with new_provider as (
    insert into public.providers (name, description, synthetic)
    select
        'Maplewood Supportive Housing',
        'Synthetic demo provider for the MVP #1 walkthrough. Not a real organization.',
        true
    where not exists (select 1 from public.providers)
    returning id
)
insert into public.official_records (provider_id, source, category, reported_summary, record_date, synthetic)
select np.id, seed.source, seed.category, seed.reported_summary, seed.record_date::date, true
from new_provider np
cross join (values
    ('City housing inspection', 'heating',  'Boiler inspection passed; no outstanding heat complaints on file.',            '2026-10-02'),
    ('City housing inspection', 'elevator', 'Elevator certified operational at last inspection.',                           '2026-09-20'),
    ('Provider self-report',    'pests',    'No open pest-control violations recorded this quarter.',                       '2026-10-01'),
    ('City housing inspection', 'mold',     'No mold or moisture complaints on record.',                                   '2026-09-15'),
    ('Provider self-report',    'safety',   'Common-area lighting and door locks reported functional.',                     '2026-10-05')
) as seed(source, category, reported_summary, record_date);
