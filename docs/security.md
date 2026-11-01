# Security Protocol — MVP #1

Current as of 2026-11-01. Phase: **synthetic data only** (no real resident data).
Covers the deployed app: Next.js on Vercel + Supabase (Postgres).

## 1. Security goals (in priority order)

1. Anonymity of resident contributions is never broken.
2. No real resident data exists in this phase — synthetic only.
3. Each person can act and see only what their role allows (least privilege).
4. Secrets never reach the browser or the repository.
5. Community actions (warrants) are attributable and auditable.

## 2. Data classification & the synthetic-only guarantee

- All data this phase is synthetic. Every table has a `synthetic boolean not null default true` column.
- Insert policies reject non-synthetic rows (`with check (synthetic is true)`), so there is no code path that writes real data.
- Real data stays a **no-go gate** until the consent model and hosting decisions are ratified (see the Consent & Ethics Review and the build plan).

## 3. Anonymity by default (the core rail)

- The `contributions` table carries **no identifying columns** — no user_id, name, email, phone, address, IP, device/session id — ever (ADR-0004).
- A build-time test (`anonymity.test.js`, run in CI) fails the build if the client's read projection or insert payload could carry any forbidden identity field.
- Contributions are public-read and insert-only for the anonymous role; update/delete are denied.
- Accounts exist **only** for roles that must be identified to act (community-body members, providers). Residents who only contribute never need one (ADR-0005).

## 4. Authentication

- Supabase Auth (email/password) via `@supabase/ssr`; cookie-based sessions refreshed by middleware on each request.
- Only the **public** anon/publishable key is present client-side. The Supabase **service_role** key is never used in the app.
- Email confirmation is currently **disabled** for the synthetic demo — it must be enabled before any real-data phase.

## 5. Authorization — Row Level Security on every table

RLS is enabled on every table; access control lives in the database and is enforced no matter which client calls.

| Table | Read | Write |
| --- | --- | --- |
| `contributions` | public | anon insert, synthetic only; no update/delete |
| `profiles` | own row only | own row only (insert/update) |
| `providers` | public | authenticated insert, synthetic only |
| `official_records` | public | **provider-role** insert, synthetic only |
| `community_bodies` | public | authenticated insert, synthetic only |
| `memberships` | authenticated | self only (insert/delete) |
| `warrants` | public (register) | body members only (insert/update) |
| `warrant_events` | public | members only (insert); append-only |
| `funding_sources` | public | authenticated insert, synthetic only |
| `conflict_register` | public | authenticated insert, synthetic only |

**Defense in depth:** server actions also check role/membership before writing (provider-only intake; body-member warrant issue/revoke; quorum enforced), so the rule exists in both the app and the database.

## 6. Secrets management

- Only public values reach the browser: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the anon key is gated by RLS and designed to be public).
- The service_role key is not in the codebase or in the app's environment.
- `.env*` is git-ignored; `.env.example` holds placeholders only; real values live in Vercel project env vars.

## 7. Input validation

- Client-side UX checks plus authoritative server-side rules: Postgres CHECK constraints (e.g. body length 1–5000), a client topic allowlist, and row shaping centralized in one module.
- User-facing error messages never echo server internals.

## 8. Transport & hosting

- All traffic over HTTPS/TLS (managed by Vercel and Supabase).
- No self-managed servers; the platforms handle patching.

## 9. Aggregation & exposure protection

- The gap is computed **server-side**; raw contributions never reach the browser — only counts.
- Small resident-account counts are masked ("a few, fewer than N") below a provisional, community-owned threshold, so a tiny group can't be singled out.

## 10. Audit — enforce, then prove

- Warrant issue/revoke write append-only receipts (`warrant_events`), so community actions can be audited after the fact.

## 11. Known gaps & planned safeguards (for Week 5 pen-testing and beyond)

- **Rate limiting / abuse protection** on anonymous inserts — not yet implemented.
- **Bot / spam protection** on the contribution form — not yet implemented.
- **Retaliation safeguard** (ticket 1.4) — deferred; to be designed with the community (ADR-0008).
- **Resident access to own data** (ticket 2.2) — deferred pending a privacy-preserving design that does not break anonymity (ADR-0008).
- **Email confirmation** — enable before the real-data phase.
- **Dependency scanning** (e.g. Dependabot) — to add.
- **Formal RLS policy review / penetration test** — scheduled for Week 5.

## 12. Breach response

- This phase stores no real personal data, so there is no personal-data breach risk now.
- A breach-response plan is to be finalized before the real-data phase (per the build plan).

## References

ADR-0003 (Supabase + RLS), ADR-0004 (anonymous contributions), ADR-0005 (accounts for identified roles), ADR-0008 (deferred safeguards); the SQL in `supabase/migrations/`; and `Week4/web/lib/anonymity.test.js`.
