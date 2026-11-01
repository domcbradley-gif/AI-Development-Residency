# Quality Engineering & Test Strategy — MVP #1

Current as of 2026-11-01. How quality is assured for the Community-Governed Data
app: what we test, at which level, what is automated versus manual today, what the
coverage goals are, and what is deferred. Phase: synthetic data only.

## Philosophy — test by risk, not by ritual

Testing effort follows harm, not a coverage number. The project has a small set of
**non-negotiables** (from the acceptance criteria and release exit criteria), and
those get the most testing because breaking one causes real harm to real people:

1. **Anonymity** of resident contributions is never broken.
2. **Synthetic-only:** no real resident data can be written this phase.
3. **Warrant integrity:** only an independent body can issue/revoke; no org capture.
4. **Least privilege:** each role sees and does only what it should.
5. **Exposure protection:** small groups can't be singled out.

The strategy below is organised so that every one of these rails is covered by an
automated test or a documented manual check — and is honest about which is which.

## The test levels (what belongs where)

| Level | What it checks | Status |
| --- | --- | --- |
| Static analysis | lint + a full `next build` | **Automated in CI** |
| Unit | pure application logic (gap, funding, anonymity shaping) | **Automated in CI** (13 tests) |
| Build-time guard | the anonymity rail (no identity can leak) | **Automated in CI** |
| Integration | Row Level Security policies at the data tier | **Manual today**, automation planned |
| End-to-end | the primary loop through the UI | **BDD scenarios written**, runner deferred |
| Accessibility | WCAG checks on the screens | Manual today, automation planned |

The shape is a wide base of fast, pure unit tests, a thin planned middle of
data-tier integration tests, and a planned top of a few end-to-end checks of the
primary loop — the classic pyramid, sized for a solo, synthetic-data phase.

## What is automated today

Run with `npm test` (Vitest, Node environment, no network or secrets needed) on
every push to `main` and every pull request, via GitHub Actions. **13 tests across
3 files**, each mapped to a rail:

- **`anonymity.test.js` (5 tests)** — the core rail. Asserts the read projection
  carries no identifying field; an outgoing contribution row carries none and is
  marked synthetic; any smuggled identity field (email, name, ip) is dropped;
  empty/over-length bodies are rejected; a topic outside the provisional allowlist
  is rejected. This is also wired as the **build-time anonymity guard** — if the
  contribution shape could ever carry identity, CI fails.
- **`gap.test.js` (4 tests)** — the gap logic. Asserts a mismatch is flagged when an
  official claim meets resident accounts; a small count is **masked** (shown as "a
  few", exact number withheld) for exposure protection; no mismatch when residents
  haven't raised a category; resident topics with no official record still appear.
- **`funding.test.js` (4 tests)** — the funding discipline. Asserts shares and
  totals compute correctly; a funder over the ~25% cap is flagged; money from the
  watched is flagged; an empty list doesn't divide by zero.

Plus, in the same CI run: **`npm run lint`** (ESLint via `eslint-config-next`) and
**`npm run build`** (a full production build, which also surfaces type/import
errors). The pipeline was verified green on a clean Linux install (13/13 tests, a
clean build). See `docs/devops.md` for the CI definition.

## What is verified manually today

Honestly marked, because these are rails that matter and are not yet automated:

- **RLS policies** — the authoritative access control (anonymous synthetic-insert
  only; own-row profiles; self-only memberships; member-gated warrant issue/revoke;
  provider-role-gated official records). Verified by hand in the Supabase SQL editor
  and by exercising the app as each role. This is the biggest automation gap (below).
- **The primary loop through the UI** — contribute → see the gap → sign in → join a
  body → issue a warrant → revoke it — walked through manually. The steps are
  written up as executable-ready BDD scenarios in `Week4/web/features/`.
- **Accessibility** — keyboard navigation, focus rings, and reduced-motion handling
  carried from the Week 3 theme; checked manually.

## Coverage goals (honest, not a vanity number)

A single blanket coverage percentage would be false precision for this phase, so the
goal is stated as rails, not a number — consistent with how the project handles KPIs
under uncertainty:

- **100% of the non-negotiable logic paths** are covered by an automated test or a
  documented manual check. (Met today for anonymity, gap/exposure, and funding via
  unit tests; RLS via manual check pending automation.)
- Every new pure helper in `lib/` ships with unit tests.
- Every change touching the `contributions` shape must keep the anonymity guard
  green — it is a merge-blocking check.
- Counts over percentages: "the anonymity rail is covered" is a stronger statement
  than "78% of lines".

A line/branch coverage report (`vitest --coverage`) is worth adding as a *secondary*
signal once integration tests exist, but it is not the target.

## Gaps & roadmap (prioritised)

1. **Automate the RLS integration tests** — the highest-value gap. Add a test harness
   that runs the migrations against a disposable Postgres (e.g. pgTAP, or Supabase's
   local stack) and asserts each policy: anon can insert only synthetic rows and
   cannot update/delete; a non-member cannot issue a warrant; a community_member
   cannot write official records; profiles are owner-only. This moves the most
   important manual checks into CI.
2. **Wire the BDD scenarios to a runner** — the `.feature` files are standard Gherkin
   and ready for `playwright-bdd` (or `cucumber-js`), giving a few end-to-end checks
   of the primary loop against a running app with seeded synthetic data.
3. **Automated accessibility checks** — add axe/Lighthouse to CI for the key screens.
4. **Coverage reporting** — turn on `vitest --coverage` as a secondary signal.

These are deferred, not forgotten; the unit tests + anonymity guard + lint + build
cover the critical logic today, and the manual checks cover the rest.

## Tooling & how to run

- **Unit tests:** `npm test` (Vitest). Config in `vitest.config.mjs` (Node env,
  `lib/**/*.test.js`).
- **Lint:** `npm run lint` (ESLint / `eslint-config-next`).
- **Build check:** `npm run build` (Next.js production build).
- **CI:** `.github/workflows/ci.yml` runs all three on every push/PR.
- **Planned:** Playwright (+ playwright-bdd) for E2E; pgTAP / Supabase local for RLS.

## Test data

All test data is **synthetic**. Unit tests use small in-code fixtures; any future
integration/E2E tests run against the synthetic seeds in
`Week4/supabase/migrations/`. There is no real resident data in any environment this
phase.

*Related: `docs/devops.md`; `docs/acceptance-criteria.md`; `Week4/web/features/`
(BDD scenarios); `docs/security.md`.*
