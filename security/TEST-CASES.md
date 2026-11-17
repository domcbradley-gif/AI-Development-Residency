# Week 6 — Manual Security Test Cases

Manual verification of the Week 6 PenTest fixes, run by hand against the live
production app and the repo. Each case is tied to a `@security` BDD feature that
the CI coverage gate also exercises. Record the Actual result and Status as you
run each one.

**Live app:** https://ai-development-residency.vercel.app

---

## TC-01 — Security headers are present (C1)

Tied to `Week4/web/features/security-headers.feature` (`@headers`).

**Pre-conditions**
- Live site open; any browser.

**Steps**
1. Open the live app.
2. Open DevTools -> Network, reload, click the top document request.
3. Read the Response Headers (or use a header checker such as securityheaders.com).

**Expected result**
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, a `Content-Security-Policy` with `frame-ancestors 'none'`,
  and `Strict-Transport-Security` are all present.
- No `X-Powered-By` header is sent.

**Actual result**
- Run 2026-11-17: all five headers present (X-Frame-Options: DENY, X-Content-Type-Options:
  nosniff, Referrer-Policy, a CSP with frame-ancestors 'none', and HSTS) and no
  X-Powered-By header.

**Status: PASS**

---

## TC-02 — A logged-in resident's post carries no identity (AC-1)

Tied to `Week4/web/features/anonymity-authenticated.feature` (`@privacy-posting`).

**Pre-conditions**
- Logged in as a community member. Practice (synthetic) data only.

**Steps**
1. Log in, then add a note to the Community Record.
2. View the record and locate the note.
3. (Optional, technical) In DevTools -> Network, inspect the insert request to
   Supabase and confirm it carries no user `Authorization` bearer token.

**Expected result**
- The note appears with no name and no identifying information, exactly as an
  anonymous post would — even though you are logged in.
- The insert is made by the session-less anon client (no account JWT attached).

**Actual result**
- _(run and record)_

**Status: ___**

---

## TC-03 — Login errors do not reveal whether an account exists (C3)

Tied to `Week4/web/features/auth-error-handling.feature` (`@auth`).

**Pre-conditions**
- Logged out, on the login page.

**Steps**
1. Enter a real account's email with a wrong password; submit. Note the message.
2. Enter a clearly non-existent email with any password; submit. Note the message.
3. Compare the two messages.

**Expected result**
- Both show the same generic message ("Email or password is incorrect.").
- Nothing distinguishes "no such account" from "wrong password."

**Actual result**
- Run 2026-11-17. Test A (real email, wrong password): "Email or password is incorrect."
  Test B (non-existent email): "Email or password is incorrect." The two messages are
  identical, so login does not reveal whether an account exists.

**Status: PASS**

---

## TC-04 — A user cannot self-select or self-promote to provider (V2)

Tied to `Week4/web/features/access-control.feature` (`@authz`).

**Pre-conditions**
- Logged out, on the sign-up page.

**Steps**
1. Open the sign-up form and look for a role / "I am a..." selector.
2. (Optional, technical) As a signed-in member, attempt a direct Supabase update
   setting your own profile `role` to `provider`.

**Expected result**
- There is no role selector on sign-up; new accounts are community members.
- The direct role update is rejected; the user stays a community member.

**Actual result**
- Sign-up form checked on 2026-11-17: the "I am a..." provider dropdown is gone;
  new accounts are created as community members.
- _(direct-update attempt: run and record)_

**Status: PASS (UI); direct-call check pending**

---

## TC-05 — The member roster is not readable by other users (V4)

Tied to `Week4/web/features/access-control.feature` (`@authz`).

**Pre-conditions**
- Signed in as a community member (technical check via Supabase).

**Steps**
1. As a signed-in user, query the `memberships` table (e.g. `select * from memberships;`
   via the app's client or the Supabase SQL editor under that user's RLS).

**Expected result**
- Only your own membership row is returned, never the full roster.
- An aggregate member count is still available via the `body_member_count()` function.

**Actual result**
- _(run and record)_

**Status: ___**

---

## TC-06 — Contribution timestamps show the day only, in UTC (C8)

Tied to `Week4/web/features/deanonymization.feature` (`@privacy-deanon`).

**Pre-conditions**
- Live site open at the Community Record.

**Steps**
1. View any contribution in the record.
2. Read its timestamp.

**Expected result**
- The timestamp shows a date only (no hour/minute/second).
- The date is correct (the UTC day the note was created), not shifted a day.

**Actual result**
- Confirmed on 2026-11-17 after the UTC fix: contributions show a date only, and
  the date reflects the correct (UTC) day rather than the prior day.

**Status: PASS**

---

## TC-07 — The database owns server-controlled fields (C4 / C9)

Tied to `Week4/web/features/input-integrity.feature` (`@input`).

**Pre-conditions**
- Technical check: a direct insert against the contributions table.

**Steps**
1. Attempt a direct contribution insert that also tries to set `created_at` to a
   chosen past date, a chosen `id`, and `synthetic = false`.

**Expected result**
- Only `body` and `topic` are accepted from the client.
- The server sets `created_at` to today's (day-truncated) date and `synthetic = true`;
  the attacker-chosen values are ignored or rejected.

**Actual result**
- _(run and record)_

**Status: ___**

---

## TC-08 — The coverage gate and dependency audit pass in CI (C2 / C5 / all)

Tied to `Week4/web/features/dependency-security.feature` (`@dependencies`) and
`scripts/check-security-coverage.mjs`.

**Pre-conditions**
- Latest CI run open on GitHub Actions.

**Steps**
1. Open the most recent CI run for the branch.
2. Open the **Security coverage gate** job and the production **npm audit** step.

**Expected result**
- The Security coverage gate passes: 7 of 8 surfaces COVERED, `anti-automation`
  waived (with a documented reason).
- The production audit shows no advisory of critical severity.

**Actual result**
- Run 2026-11-17 (CI #76): all jobs green. The Security coverage gate shows 7/8
  surfaces COVERED with anti-automation waived, and the production audit reports no
  advisory of critical severity.

**Status: PASS**
