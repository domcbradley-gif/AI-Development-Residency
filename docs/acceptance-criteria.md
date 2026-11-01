# Acceptance Criteria — MVP #1

Current as of 2026-11-01. Phase: **synthetic data only** (no real resident data).
Covers the deployed app: Next.js on Vercel + Supabase (Postgres + Auth + RLS).

Acceptance criteria are the checkable conditions that must be true for a piece of
MVP #1 to count as done. They are written in **Given / When / Then** form so they
are testable and so they feed directly into the BDD scenarios (next deliverable).

## How to read this document

- Organised by the **seven MVP #1 epics** (the stages of the primary loop, plus
  the provider, the funding discipline, and the platform foundations beneath).
- Each criterion is grounded in what the app actually does — the Supabase
  migrations, the Row Level Security policies, and the client checks — not in
  aspiration.
- Each epic carries a **priority and clock tag**, matching the Scope deliverable:
  - **P0 — residency-now:** the primary loop; the must-prove set.
  - **P1 — split:** the discipline/stub belongs in the residency now; the fuller
    build (securing money, richer provider outcome tracking) is **DEFERRED** to a
    resourced phase. Deferred criteria are written now, and marked, so a future
    team inherits the intent rather than reconstructing it.
  - **P2 — deferred:** later-phase audiences; criteria noted, not built now.
- **Non-negotiables** (the hard lines that fail the whole release) are called out
  per epic: anonymity never broken, synthetic-only, warrant integrity, least
  privilege.

## Actors

- **Resident** — anonymous, no account.
- **Visitor** — anyone, including the public (read-only).
- **Community member** — signed in, role `community_member`.
- **Body member** — a community member who has joined a community body.
- **Provider** — signed in, role `provider`.

---

## Epic 1 — A safe voice (anonymous contribution)

**Priority:** P0 — residency-now. **Non-negotiable:** anonymity is never broken.
Grounded in migration `0001_contributions.sql`, `anonymity.test.js`, ADR-0004/0005.

```gherkin
Scenario: A resident contributes without an account or identity
  Given a resident is on the Community record page
  And they are not signed in
  When they enter a note, optionally pick a topic, tick the consent checkbox, and submit
  Then the note is stored with no identifying data of any kind
  And no resident_id, name, email, phone, address, IP, device id, or session id is recorded
  And the note is shown back in the public record

Scenario: Consent is required before a contribution can be sent
  Given a resident has written a note
  When the consent checkbox is not ticked
  Then the submit control is disabled
  And no contribution is sent

Scenario: The contribution body is validated at the boundary
  Given a resident is composing a note
  When the body is empty or longer than 5000 characters
  Then submission is rejected with inline validation
  And the server CHECK constraint (1–5000 characters) also rejects it independently

Scenario: A smuggled identity field is dropped, not stored
  Given an insert payload is constructed for a contribution
  When it includes any forbidden identity field (e.g. email, name, ip)
  Then that field is stripped before the row is sent
  And the outgoing row contains only body, topic, and synthetic
  And the build-time anonymity test fails CI if the projection or payload could carry an identity field

Scenario: Residents cannot alter or remove the record
  Given the anonymous role on the contributions table
  Then it may select and insert only
  And update and delete are denied by RLS (no policy exists for them)

Scenario: Only synthetic contributions can be written this phase
  Given any insert into contributions
  When synthetic is not true
  Then the RLS insert policy rejects the row
```

> **Deferred (P2):** resident self-service export and delete of their own
> contributions. Not built this phase (noted in `0001`); criteria to be written
> when the consent model is ratified.

---

## Epic 2 — The record and the gap

**Priority:** P0 — residency-now. Grounded in `0002_providers_and_official_records.sql`,
the gap view, and `GAP_MIN_DISPLAY_COUNT = 3` in `lib/config.js`.

```gherkin
Scenario: Anyone can read the community record
  Given a visitor opens the Community record page
  Then the list of resident notes loads, newest first
  And no account is required

Scenario: The gap sets the official claim beside residents' accounts
  Given a provider with official records and resident contributions
  When a visitor opens The gap
  Then each category shows the official claim beside the count of resident accounts
  And categories where the official claim and the accounts disagree are flagged

Scenario: Small groups are masked to protect residents (exposure protection)
  Given a category whose resident-account count is below the display threshold (3)
  When the gap is displayed
  Then the count is shown as "a few" rather than an exact number
  So that a very small group cannot be singled out

Scenario: The gap shows no score
  Given the gap for any provider
  Then no pass/fail or numeric rating of the provider is displayed
  And the output is the comparison itself, never a verdict-by-number
```

---

## Epic 3 — The warrant (issue and revoke)

**Priority:** P0 — residency-now. **Non-negotiable:** warrant integrity.
Grounded in `0004_bodies_warrants.sql` (warrants + append-only `warrant_events`).

```gherkin
Scenario: The warrant register is public
  Given any visitor
  When they open the warrant register
  Then they can read every warrant, its provider, its body, status, and dates
  And no account is required to read it

Scenario: Only a member of the issuing body can issue a warrant
  Given a signed-in user
  When they attempt to issue a warrant for a body
  Then the action succeeds only if they are a member of that body and issue as themselves
  And the warrant must be synthetic this phase
  And a non-member's attempt is rejected by RLS

Scenario: Only a member of the body can revoke the warrant
  Given an issued warrant
  When a user changes its status to revoked
  Then the change succeeds only if they are a member of the issuing body
  And the warrant carries who revoked it and when

Scenario: Every issue and revoke writes an append-only receipt
  Given a warrant is issued or revoked
  Then a matching receipt (issued/revoked) is appended to warrant_events
  And receipts are public-read and cannot be updated or deleted

Scenario: A warrant is scoped and dated
  Given any warrant in the register
  Then it names exactly one provider and one issuing body
  And it records issued_at, and revoked_at when revoked
```

---

## Epic 4 — The independent community body

**Priority:** P0 — residency-now. **Non-negotiable:** no org-run selection.
Grounded in `0004_bodies_warrants.sql` (community_bodies, memberships, quorum).

```gherkin
Scenario: A community body is self-organized
  Given a signed-in community member
  When they join a body
  Then membership is created only for themselves (auth.uid() = user_id)
  And no user can add another person to a body

Scenario: A member can leave on their own
  Given a body member
  When they leave the body
  Then only their own membership is removed
  And no user can remove another person's membership

Scenario: Quorum is community-governed, provisional config
  Given a community body
  Then its quorum is stored as configuration (default provisional value), not hard-coded
  And it is labelled "provisional — not set by the community" until ratified

Scenario: The body, not the provider, controls who speaks
  Given the memberships model
  Then there is no code path or policy by which a provider or org selects, vetoes, or removes members
```

---

## Epic 5 — The provider

**Priority:** P1 — stub now, fuller build DEFERRED. Grounded in `0003_profiles.sql`
(roles) and `0006_provider_role_gating.sql` (role-gated official records).

```gherkin
Scenario: Only a provider-role user can add to the official record
  Given a signed-in user
  When they attempt to insert an official record from the app
  Then it succeeds only if their profile role is 'provider'
  And the row must be synthetic
  And a community_member's attempt is rejected by RLS

Scenario: A provider has an identified account
  Given a user who must act as a provider
  Then they have a profile row with role 'provider'
  And residents who only contribute never need an account
```

> **Deferred (future-resourced):** richer provider outcome tracking (housed and
> stayed-housed measures, longitudinal outcomes). Only the minimal official-record
> stub is in scope now. Acceptance criteria for the full tracker to be written
> when the provider is recruited and the phase is resourced.

---

## Epic 6 — The funding discipline

**Priority:** P1 — discipline residency-now, securing funds DEFERRED.
Grounded in `0005_funding_discipline.sql` and `FUNDER_CAP_FRACTION = 0.25`.

```gherkin
Scenario: The conflict register is public
  Given any visitor
  When they open the conflict register
  Then they can read every disclosed conflict of interest

Scenario: Funder records support an open cap check
  Given the public funding_sources record
  When a visitor inspects it
  Then each funder's name and amount are visible
  And no single funder exceeds ~25% of the budget (the provisional cap)

Scenario: No money from the watched
  Given any funding source
  Then a source marked from_watched is treated as disallowed
  And the independence rule can be checked in the open

Scenario: Funding data is synthetic this phase
  Given any insert into funding_sources or conflict_register
  When synthetic is not true
  Then RLS rejects the row
```

> **Deferred (future-resourced):** actually securing grants, dues, and earned
> revenue; enforcing the cap against a real budget. The *discipline* holds from
> day one; the *fundraising* gates the post-residency launch.

---

## Epic 7 — Platform foundations

**Priority:** P0 — cross-cutting, residency-now. **Non-negotiables:** least
privilege; secrets never reach the browser; synthetic-only. Grounded in
`0003_profiles.sql`, `security.md`, and the `@supabase/ssr` auth setup.

```gherkin
Scenario: Authentication uses cookie-based sessions
  Given a user signs up or logs in (email/password via Supabase Auth)
  Then a cookie-based session is established via @supabase/ssr
  And middleware refreshes the session on each request

Scenario: Row Level Security is enabled on every table
  Given any table in the public schema
  Then RLS is enabled
  And access is governed by explicit policies, not default-open grants

Scenario: Least privilege — profiles are private to their owner
  Given a signed-in user
  When they read or update a profile
  Then they can see and edit only their own row (auth.uid() = id)
  And the anonymous role cannot read profiles at all

Scenario: Secrets never reach the browser or the repository
  Given the deployed client
  Then only the public anon/publishable key is present client-side
  And the Supabase service_role key is never used in the app or committed

Scenario: The synthetic-only guarantee holds system-wide
  Given every table
  Then it has a synthetic boolean (default true)
  And insert policies reject non-synthetic rows
  So that there is no code path that writes real data this phase
```

---

## Release-level non-negotiables (summary)

These fail the whole release if they fail, however many other criteria pass —
mirroring the Release Exit Criteria and Kill/No-Go gates:

1. **Anonymity** of resident contributions is never broken.
2. **Synthetic-only:** no real resident data exists this phase.
3. **Warrant integrity:** an independent body can issue and revoke; no org-run selection.
4. **Least privilege:** each actor sees and does only what their role allows.
5. **Zero retaliation / zero privacy breaches** remain the standing floors.

## Traceability

Each epic maps up to a Scope value and down to the MVP #1 Backlog epics/features/
tasks, and across to the Use Case Scenarios (`docs/use-cases.md`). The next
deliverable, BDD scenarios, will express these same criteria as executable
Given/When/Then feature files.
