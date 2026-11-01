# Database Architecture — MVP #1

Current as of 2026-11-01. The written companion to the entity-relationship
diagram in [`database-diagram.md`](database-diagram.md) /
[`database-diagram.svg`](database-diagram.svg): the diagram shows the shape; this
explains the tables, the relationships, and — most importantly — the access model.

All tables live in Supabase (Postgres). **Row Level Security (RLS) is enabled on
every table**, and all data is synthetic this phase (every table has a `synthetic`
flag; insert policies reject non-synthetic rows). Schema lives in
`Week4/supabase/migrations/` (0001–0006).

## The tables, grouped by role

**The record (anonymous):**

- `contributions` — residents' own accounts of their housing. The core table, and
  a deliberate exception to per-user ownership: it carries **no identifying
  columns** (no user_id, name, email, phone, address, IP, device/session id) and
  is linked to no one. Public-read; anonymous insert of synthetic rows only; no
  update or delete. (ADR-0004.)

**Identity & governance:**

- `profiles` — one row per signed-in user, with a `role` (`community_member` or
  `provider`). Accounts exist only for roles that must be identified to act; a
  resident who only contributes never needs one. (ADR-0005.)
- `community_bodies` — the self-organized groups that oversee a provider; carries a
  provisional `quorum`.
- `memberships` — who belongs to which body. Enforces self-organization: a user may
  add or remove **only themselves**.

**Accountability:**

- `providers` — the housing providers under community accountability (public
  register).
- `official_records` — what the official record claims about a provider, per
  category; the input that the gap sets beside residents' accounts.
- `warrants` — the community-issued warrants against a provider (public register),
  with `status` (`issued` / `revoked`) and who issued/revoked and when.
- `warrant_events` — an **append-only** audit receipt for every issue and revoke.

**Funding discipline:**

- `funding_sources` — funder records (name, amount, `from_watched` flag) for the
  open cap check (no single funder over ~25%).
- `conflict_register` — the public register of disclosed conflicts of interest.

(`auth.users` is Supabase's built-in auth table, referenced by `profiles`,
`memberships`, and the warrant actor columns.)

## Relationships

- A provider **has many** official records, community bodies, and warrants.
- A community body **has many** memberships and issues many warrants.
- A warrant **belongs to** one provider and one body, and **logs** many events.
- A user (`auth.users`) **has one** profile, **joins** many bodies via
  memberships, and **issues/revokes** warrants.
- `contributions`, `funding_sources`, and `conflict_register` stand alone by
  design — the record is unlinked to any user (anonymity), and the funding tables
  are public, standalone registers.

## The access model (RLS patterns)

Access control is enforced at the data tier, so it holds no matter which client
calls. Six patterns cover every table:

1. **Public-read, synthetic-insert** — `providers`, `official_records`,
   `community_bodies`, `warrants`, `warrant_events`, `funding_sources`,
   `conflict_register`: anyone can read; inserts must be `synthetic = true`.
2. **Anonymous append-only** — `contributions`: anonymous read + insert (synthetic
   only); no update/delete policy exists, so those are denied.
3. **Own-row only** — `profiles`: a user can select/insert/update only the row
   where `auth.uid() = id`; the anonymous role cannot read profiles at all.
4. **Self only** — `memberships`: a user can insert/delete only rows where
   `auth.uid() = user_id` (no one adds or removes anyone else).
5. **Member-gated** — `warrants`: insert (issue) and update (revoke) succeed only
   if the caller is a member of the issuing body, acting as themselves.
6. **Role-gated** — `official_records`: inserts succeed only if the caller's
   profile role is `provider`. (ADR-0007.)

## The synthetic-only guarantee

Every table has `synthetic boolean not null default true`, and every insert policy
includes `with check (synthetic is true)`. There is therefore no code path that
writes real data this phase. Real data remains a no-go gate until the consent model
and hosting are ratified by the community.

## Integrity & validation at the data tier

- Length checks as Postgres `CHECK` constraints (e.g. contribution body 1–5000),
  authoritative alongside the client-side checks.
- Foreign keys with `on delete cascade` / `set null` keep the graph consistent.
- `warrant.status` constrained to `issued` / `revoked`; `warrant_events.event_type`
  to `issued` / `revoked`.
- A build-time anonymity test (`anonymity.test.js`) fails CI if the contribution
  read projection or insert payload could carry an identity field.

*Related: `docs/database-diagram.md`; `docs/adr/0003`–`0007`; `docs/security.md`.*
