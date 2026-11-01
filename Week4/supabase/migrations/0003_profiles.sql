-- =============================================================================
-- MVP #1 — Profiles  (migration 0003)
-- -----------------------------------------------------------------------------
-- A profile row per signed-in user (community members and providers). Residents
-- who only CONTRIBUTE stay anonymous and need no account — accounts exist only
-- for roles that must be identified to act (join a community body, run a
-- provider). Row Level Security scopes every profile to its owner: each person
-- can see and edit only their own row.
--
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- =============================================================================

do $$ begin
    create type public.user_role as enum ('community_member', 'provider');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.profiles (
    id           uuid            primary key references auth.users(id) on delete cascade,
    role         public.user_role not null default 'community_member',
    display_name text,
    created_at   timestamptz     not null default now(),

    constraint profiles_display_name_length
        check (display_name is null or char_length(display_name) <= 120)
);

comment on table public.profiles is
    'One row per signed-in user. RLS: each person sees and edits only their own row.';

alter table public.profiles enable row level security;

-- The anonymous role has no business reading profiles at all.
revoke all on public.profiles from anon;
grant  select, insert, update on public.profiles to authenticated;

-- Each person can read ONLY their own profile.
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select"
    on public.profiles for select to authenticated
    using (auth.uid() = id);

-- Each person can create ONLY their own profile row.
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert"
    on public.profiles for insert to authenticated
    with check (auth.uid() = id);

-- Each person can update ONLY their own profile row.
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update"
    on public.profiles for update to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);
