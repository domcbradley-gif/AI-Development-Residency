-- =============================================================================
-- Week 6 security hardening — Community-Governed Data
-- Apply in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- Fixes V2 (role escalation), V4 (member roster), C4 (insert spam),
-- de-anonymization (coarse timestamps), and governance write-breadth.
-- NOTE: capture a full policy baseline with `supabase db pull`; this file is
-- the hardening layer on top of the existing (now version-controlled) rules.
-- =============================================================================

-- 1. V2 — stop role self-escalation ------------------------------------------
-- A user may never set or change their own role. 'provider' is granted manually
-- (service role / dashboard), never self-assigned at signup.
revoke update (role) on public.profiles from anon, authenticated;

drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id and role = 'community_member');

-- 2. C4 + de-anonymization — lock down contribution inserts ------------------
-- Anonymous posts may set only body/topic/synthetic. id and created_at are
-- server-controlled, and created_at is coarsened to the DAY so a precise time
-- cannot be correlated to when a resident was around (abuse case AC-1).
revoke insert on public.contributions from anon;
grant  insert (body, topic, synthetic) on public.contributions to anon;

create or replace function public.contributions_before_insert()
returns trigger language plpgsql as $$
begin
  new.created_at := date_trunc('day', now());
  new.synthetic  := true;
  return new;
end $$;

drop trigger if exists trg_contributions_before_insert on public.contributions;
create trigger trg_contributions_before_insert
  before insert on public.contributions
  for each row execute function public.contributions_before_insert();

-- Coarsen timestamps already stored (synthetic seed).
update public.contributions set created_at = date_trunc('day', created_at);

-- 3. V4 — hide the member roster, keep quorum working ------------------------
drop policy if exists "memberships readable to authenticated" on public.memberships;
create policy "members read their own membership"
  on public.memberships for select to authenticated
  using (user_id = auth.uid());

-- Quorum needs a count without exposing who the members are.
create or replace function public.body_member_count(p_body_id uuid)
returns integer language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.memberships m where m.body_id = p_body_id;
$$;
revoke all on function public.body_member_count(uuid) from public, anon;
grant execute on function public.body_member_count(uuid) to authenticated;

-- 4. Governance write-breadth — these tables are seeded by admins, not clients.
revoke insert on public.community_bodies, public.providers,
                 public.funding_sources, public.conflict_register
  from anon, authenticated;
drop policy if exists "authenticated can add synthetic bodies"    on public.community_bodies;
drop policy if exists "authenticated can add synthetic providers" on public.providers;
drop policy if exists "authenticated add synthetic funding"       on public.funding_sources;
drop policy if exists "authenticated add synthetic conflicts"     on public.conflict_register;
