# Security Requirements Spec — Week 6 (PenTest-driven)

Generated from the Week 6 penetration test. Each change the PenTest identified is
written as a **user requirement** (the need it serves) and a **technical requirement**
(the implementation that satisfies it), grounded in the actual migration, RLS policy,
or code, and tied to the `@security` scenario that proves it. Format follows the
project's `docs/acceptance-criteria.md` and `docs/use-cases.md` style.

Current as of 2026-11-18. Phase: **synthetic data only** (no real resident data).

## How to read this document

- Each requirement has an ID (`SR-n`), the **finding(s)** it answers, a **priority /
  clock tag**, a **user requirement**, a **technical requirement**, and its **receipt**
  (the `@security` scenario and any unit test).
- Priority tags match the project's convention:
  - **P0 — residency-now:** must hold now; several are non-negotiables.
  - **P1 — split:** mitigated now, fuller build **DEFERRED** to a resourced phase.
- **Non-negotiables** (hard lines that fail the release): anonymity never broken,
  least privilege, synthetic-only, warrant integrity.

## Actors

- **Resident** — anonymous, no account.
- **Visitor** — anyone, including the public (read-only).
- **Community member** — signed in, role `community_member`.
- **Body member** — a community member who has joined a community body.
- **Provider** — signed in, role `provider`.
- **Adversary** — e.g. a watched provider with a legitimate account (see `abuse-cases.md`).

---

## SR-1 — Anonymous posting holds for logged-in residents
**Finding:** AC-1 · **Priority:** P0 — non-negotiable (anonymity).

- **User requirement:** As a resident, even when I am signed in, my contribution must
  carry no trace of my account, so a watched provider cannot tie a post back to me.
- **Technical requirement:** Contributions are written through a session-less Supabase
  client with `persistSession:false`, `autoRefreshToken:false`, `detectSessionInUrl:false`
  (`lib/anon-client-config.js`, `getAnonContributionsClient()` in `lib/supabaseClient.js`,
  used by `lib/api.js`), so no account JWT is attached at the row or request level.
- **Receipt:** `@privacy-posting` (`anonymity-authenticated.feature`), `lib/anon-posting.test.js`.

## SR-2 — De-anonymization resistance
**Findings:** C8, V4, V4b · **Priority:** P0 (timestamps, roster) / P1 (actor fields).

- **User requirement:** As a resident, a reader with full access to the public record must
  not be able to correlate posts back to me through precise timestamps or the member roster.
- **Technical requirement:** `created_at` is coarsened to the day (`date_trunc('day', now())`
  in the before-insert trigger) and displayed date-only in UTC; `memberships` SELECT is
  restricted to the caller's own row, with only an aggregate exposed via the
  `body_member_count()` security-definer function. **Deferred (V4b):** pseudonymize or
  drop public `issued_by` / `actor` on warrants and receipts.
- **Receipt:** `@privacy-deanon` (`deanonymization.feature`).

## SR-3 — No self-escalation to provider
**Finding:** V2 · **Priority:** P0 — non-negotiable (least privilege).

- **User requirement:** As the platform, a community member must not be able to grant
  themselves provider powers and file official records.
- **Technical requirement:** `update(role)` on `profiles` is revoked; the "own profile
  insert" policy checks `role = 'community_member'`; the self-select role control was
  removed from sign-up so new accounts are always community members.
- **Receipt:** `@authz` (`access-control.feature` — "A user cannot promote themselves to provider").

## SR-4 — Governance records are write-protected
**Finding:** V1 · **Priority:** P0.

- **User requirement:** Only authorized actors may create official governance records;
  an ordinary signed-in user must not be able to forge them.
- **Technical requirement:** `insert` revoked and insert policies dropped on
  `community_bodies`, `providers`, `funding_sources`, and `conflict_register`.
- **Receipt:** `@authz` (`access-control.feature`).

## SR-5 — Data-boundary integrity (the DB owns server fields)
**Findings:** C4, C9 · **Priority:** P0.

- **User requirement:** A client must not be able to forge server-owned fields or flood
  the record with fake-dated or mislabelled posts.
- **Technical requirement:** A before-insert trigger sets `created_at` and `synthetic`
  server-side; column-level insert grants are limited to `body` and `topic`, so a direct
  insert cannot set `id`, `created_at`, or `synthetic`.
- **Receipt:** `@input` (`input-integrity.feature`).

## SR-6 — HTTP response security headers
**Finding:** C1 · **Priority:** P0.

- **User requirement:** As a visitor, I am protected from clickjacking, MIME sniffing, and
  transport downgrade when I use the app.
- **Technical requirement:** `next.config.mjs` sends `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, and a
  CSP with `frame-ancestors 'none'`; `poweredByHeader` is disabled.
- **Receipt:** `@headers` (`security-headers.feature`), `lib/security-headers.test.js`.

## SR-7 — Enumeration-safe authentication
**Finding:** C3 · **Priority:** P1.

- **User requirement:** Login must not reveal whether an email already has an account, so
  it cannot be used to discover who is a member.
- **Technical requirement:** `lib/auth-errors.js` returns a single generic sign-in message
  ("Email or password is incorrect."), surfacing a specific message only for non-enumerating
  cases (rate limit, weak password).
- **Receipt:** `@auth` (`auth-error-handling.feature`), `lib/auth-errors.test.js`.

## SR-8 — Dependency hygiene
**Finding:** C2 · **Priority:** P1.

- **User requirement:** The deployed app must not ship a dependency with a known critical
  advisory.
- **Technical requirement:** `next` pinned to a supported 15.x; CI runs
  `npm audit --omit=dev --audit-level=critical`; the one high postcss advisory is a
  documented, non-exploitable exception (`dependency-exceptions.md`), re-review 2026-12-15.
- **Receipt:** `@dependencies` (`dependency-security.feature`).

## SR-9 — Anti-automation  [DEFERRED]
**Finding:** C5 · **Priority:** P1 — deferred (requires infrastructure).

- **User requirement:** Residents must be protected from automated flooding of the record,
  **without** giving a watched provider a way to silence a whole community body.
- **Technical requirement (deferred):** route anonymous writes through a server-side proxy
  (Supabase Edge Function or Next route handler) with per-IP sliding-window rate limiting
  (Upstash / Vercel KV) plus a Cloudflare Turnstile check. A naive DB rate cap is rejected
  as censorship-prone. Interim mitigations: append-only record, synthetic-flagging,
  coarsened timestamps, Supabase platform limits.
- **Receipt:** tracked waiver in `waivers.json`; see `anti-automation.md`.

## SR-10 — Residual authorization hardening  [DEFERRED]
**Finding:** V3 · **Priority:** P1 — deferred (decision).

- **User requirement:** Governance actions (quorum, warrant updates) must enforce their
  rules at the database, not only in the app, so a direct API call cannot bypass them.
- **Technical requirement (deferred):** enforce quorum in the database; column-scope the
  warrant `UPDATE` policy.
- **Receipt:** documented as an open decision in `pentest-report.md`.

---

## Traceability

Every requirement above maps to a PenTest finding, a code or migration change, and an
executable `@security` scenario. The CI coverage gate (`scripts/check-security-coverage.mjs`)
fails the build if any security surface loses its scenario — so these requirements stay
enforced, not just written. Current state: 7 of 8 surfaces COVERED, anti-automation waived
with a dated reason.
