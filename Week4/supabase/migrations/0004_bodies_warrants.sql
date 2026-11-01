-- =============================================================================
-- MVP #1 — Community bodies, memberships, warrants + receipts  (migration 0004)
-- -----------------------------------------------------------------------------
-- The accountability core. A self-organized community BODY (no org-run
-- selection: people add themselves) can issue a WARRANT against a provider as an
-- explicit action, and revoke it. Every issue/revoke writes an append-only
-- RECEIPT so the action can be audited ("enforce, then prove"). The warrant
-- register is PUBLIC. SYNTHETIC DATA ONLY.
--
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- =============================================================================


-- 1. Community bodies ---------------------------------------------------------
create table if not exists public.community_bodies (
    id          uuid        primary key default gen_random_uuid(),
    name        text        not null,
    provider_id uuid        references public.providers(id) on delete set null,
    quorum      integer     not null default 2 check (quorum >= 1),  -- PROVISIONAL
    synthetic   boolean     not null default true,
    created_at  timestamptz not null default now(),
    constraint community_bodies_name_length check (char_length(name) between 1 and 200)
);

comment on table public.community_bodies is
    'Self-organized community bodies. Public-read. Quorum is provisional config. Synthetic only.';

alter table public.community_bodies enable row level security;
revoke update, delete on public.community_bodies from anon, authenticated;
grant  select on public.community_bodies to anon, authenticated;
grant  insert on public.community_bodies to authenticated;

drop policy if exists "bodies are publicly readable" on public.community_bodies;
create policy "bodies are publicly readable"
    on public.community_bodies for select using (true);

drop policy if exists "authenticated can add synthetic bodies" on public.community_bodies;
create policy "authenticated can add synthetic bodies"
    on public.community_bodies for insert to authenticated with check (synthetic is true);


-- 2. Memberships (self-organized — you add yourself) --------------------------
create table if not exists public.memberships (
    id        uuid        primary key default gen_random_uuid(),
    body_id   uuid        not null references public.community_bodies(id) on delete cascade,
    user_id   uuid        not null references auth.users(id) on delete cascade,
    joined_at timestamptz not null default now(),
    unique (body_id, user_id)
);

comment on table public.memberships is
    'Self-organized body membership. No org selection: a user may only add/remove THEMSELVES.';

alter table public.memberships enable row level security;
revoke update on public.memberships from anon, authenticated;
grant  select, insert, delete on public.memberships to authenticated;

-- Members (any signed-in user) can read memberships to see the body and count quorum.
drop policy if exists "memberships readable to authenticated" on public.memberships;
create policy "memberships readable to authenticated"
    on public.memberships for select to authenticated using (true);

-- Self-organized: you may only add yourself (guardrail: no org-run selection).
drop policy if exists "join as self" on public.memberships;
create policy "join as self"
    on public.memberships for insert to authenticated with check (auth.uid() = user_id);

-- And you may only remove yourself.
drop policy if exists "leave as self" on public.memberships;
create policy "leave as self"
    on public.memberships for delete to authenticated using (auth.uid() = user_id);


-- 3. Warrants (public register) ----------------------------------------------
create table if not exists public.warrants (
    id          uuid        primary key default gen_random_uuid(),
    provider_id uuid        not null references public.providers(id) on delete cascade,
    body_id     uuid        not null references public.community_bodies(id) on delete cascade,
    status      text        not null default 'issued' check (status in ('issued','revoked')),
    reason      text,
    issued_by   uuid        not null references auth.users(id),
    issued_at   timestamptz not null default now(),
    revoked_by  uuid        references auth.users(id),
    revoked_at  timestamptz,
    synthetic   boolean     not null default true,
    created_at  timestamptz not null default now()
);

comment on table public.warrants is
    'Community-issued warrants against a provider. Public register. Issue/revoke only by body members. Synthetic only.';

alter table public.warrants enable row level security;
revoke delete on public.warrants from anon, authenticated;
grant  select on public.warrants to anon, authenticated;   -- PUBLIC register
grant  insert, update on public.warrants to authenticated;

-- Anyone can read the register.
drop policy if exists "warrant register is public" on public.warrants;
create policy "warrant register is public"
    on public.warrants for select using (true);

-- Issuance is an explicit action by a MEMBER of the issuing body, as themselves.
drop policy if exists "body members issue warrants" on public.warrants;
create policy "body members issue warrants"
    on public.warrants for insert to authenticated
    with check (
        issued_by = auth.uid()
        and synthetic is true
        and exists (
            select 1 from public.memberships m
            where m.body_id = warrants.body_id and m.user_id = auth.uid()
        )
    );

-- Revocation (status change) likewise restricted to members of the body.
drop policy if exists "body members revoke warrants" on public.warrants;
create policy "body members revoke warrants"
    on public.warrants for update to authenticated
    using (
        exists (
            select 1 from public.memberships m
            where m.body_id = warrants.body_id and m.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.memberships m
            where m.body_id = warrants.body_id and m.user_id = auth.uid()
        )
    );


-- 4. Warrant events (append-only receipts) -----------------------------------
create table if not exists public.warrant_events (
    id         uuid        primary key default gen_random_uuid(),
    warrant_id uuid        not null references public.warrants(id) on delete cascade,
    event_type text        not null check (event_type in ('issued','revoked')),
    actor      uuid        references auth.users(id),
    note       text,
    created_at timestamptz not null default now()
);

comment on table public.warrant_events is
    'Append-only audit receipts for warrant issue/revoke. Public-read.';

alter table public.warrant_events enable row level security;
revoke update, delete on public.warrant_events from anon, authenticated;
grant  select on public.warrant_events to anon, authenticated;
grant  insert on public.warrant_events to authenticated;

drop policy if exists "receipts are publicly readable" on public.warrant_events;
create policy "receipts are publicly readable"
    on public.warrant_events for select using (true);

drop policy if exists "members log receipts" on public.warrant_events;
create policy "members log receipts"
    on public.warrant_events for insert to authenticated with check (actor = auth.uid());


-- 5. Seed a community body for the demo provider ------------------------------
insert into public.community_bodies (name, provider_id, quorum, synthetic)
select 'Maplewood Residents Council', p.id, 2, true
from public.providers p
where p.name = 'Maplewood Supportive Housing'
  and not exists (select 1 from public.community_bodies);
