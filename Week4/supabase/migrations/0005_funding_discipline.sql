-- =============================================================================
-- MVP #1 — Funding discipline  (migration 0005)
-- -----------------------------------------------------------------------------
-- The funding guardrails, made visible: a PUBLIC conflict register and funder
-- records so a cap (no single funder over ~25%) and "no money from the watched"
-- can be checked in the open. SYNTHETIC DATA ONLY.
--
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- =============================================================================

create table if not exists public.funding_sources (
    id           uuid        primary key default gen_random_uuid(),
    name         text        not null,
    amount       numeric     not null check (amount >= 0),
    from_watched boolean     not null default false,  -- money from the watched = disallowed
    synthetic    boolean     not null default true,
    created_at   timestamptz not null default now(),
    constraint funding_sources_name_length check (char_length(name) between 1 and 200)
);

comment on table public.funding_sources is
    'Funder records for cap + independence checks. Public-read. Synthetic only.';

alter table public.funding_sources enable row level security;
revoke update, delete on public.funding_sources from anon, authenticated;
grant  select on public.funding_sources to anon, authenticated;
grant  insert on public.funding_sources to authenticated;

drop policy if exists "funding sources public read" on public.funding_sources;
create policy "funding sources public read"
    on public.funding_sources for select using (true);
drop policy if exists "authenticated add synthetic funding" on public.funding_sources;
create policy "authenticated add synthetic funding"
    on public.funding_sources for insert to authenticated with check (synthetic is true);


create table if not exists public.conflict_register (
    id          uuid        primary key default gen_random_uuid(),
    description text        not null,
    disclosed_at timestamptz not null default now(),
    synthetic   boolean     not null default true,
    constraint conflict_register_desc_length check (char_length(description) between 1 and 2000)
);

comment on table public.conflict_register is
    'Public register of disclosed conflicts of interest. Public-read. Synthetic only.';

alter table public.conflict_register enable row level security;
revoke update, delete on public.conflict_register from anon, authenticated;
grant  select on public.conflict_register to anon, authenticated;
grant  insert on public.conflict_register to authenticated;

drop policy if exists "conflict register public read" on public.conflict_register;
create policy "conflict register public read"
    on public.conflict_register for select using (true);
drop policy if exists "authenticated add synthetic conflicts" on public.conflict_register;
create policy "authenticated add synthetic conflicts"
    on public.conflict_register for insert to authenticated with check (synthetic is true);


-- Synthetic seed (loads only when empty) -------------------------------------
insert into public.funding_sources (name, amount, from_watched, synthetic)
select * from (values
    ('Community Justice Foundation', 40000::numeric, false, true),
    ('Resident Solidarity Fund',     25000::numeric, false, true),
    ('Small Donors (pooled)',        20000::numeric, false, true),
    ('Civic Tech Microgrant',        15000::numeric, false, true)
) as seed(name, amount, from_watched, synthetic)
where not exists (select 1 from public.funding_sources);

insert into public.conflict_register (description, synthetic)
select * from (values
    ('A board advisor previously consulted for a housing provider in the sector (unpaid, disclosed).', true),
    ('No funder has editorial input into the record, the gap method, or warrant decisions.', true)
) as seed(description, synthetic)
where not exists (select 1 from public.conflict_register);
