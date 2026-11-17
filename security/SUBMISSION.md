# Week 6 Coding Challenge — Submission

**Name:** Dominic Bradley
**Track:** Premium / Advanced Residency
**Challenge:** PenTest a Code Base
**Date:** 2026-11-17

## Links

- **GitHub repo:** https://github.com/domcbradley-gif/AI-Development-Residency
- **Live app:** https://ai-development-residency.vercel.app

**Deliverable 1 — Penetration test**
- PenTest Report: `security/pentest-report.md`
- Manual security test cases: `security/TEST-CASES.md`
- Abuse case (AC-1): `security/abuse-cases.md`
- Accepted risks: `security/anti-automation.md`, `security/dependency-exceptions.md`
- Coverage gate: `scripts/check-security-coverage.mjs` · config in `security/`
- Executable `@security` scenarios: `Week4/web/features/` · unit tests: `Week4/web/lib/*.test.js`

**Deliverable 2 — Security research report + deck**
- Research Report (Authorization layer): `security/research-report.md`
- Slide deck: `security/authorization-layer-deck.pdf`

> The PenTest Audit and PenTest Findings are also mirrored to the team Notion workspace
> (Week 6 Coding Challenge -> PenTest Report Template).

## What was delivered (factual summary)

- A full penetration test of the Week 4 app across every software layer and network tier,
  using Claude agents and a live Row-Level-Security audit.
- Fixes for every confirmed finding: security headers (C1), anonymous posting for
  logged-in residents (AC-1), enumeration-safe login errors (C3), a database hardening
  migration (V1/V2/V4 + C4/C8/C9), a Next 15 pin with a production audit gate (C2), and a
  documented acceptance for anti-automation (C5).
- A coverage gate that fails CI when a security surface has no @security scenario and no
  waiver — currently 7 of 8 surfaces covered, anti-automation waived with a dated reason.
- A 3-5 page research report on the Authorization layer and a slide deck built from it.

## What I Did

I did a PenTest and a research report on an area of security. I focused on the weakest area: the authorization layer, which cuts across the data, service, and presentation tiers. I acted like a white-hat hacker and reviewed all tiers for weaknesses. The single biggest threat could be a housing provider the community wants to hold accountable trying to determine which residents spoke up so they could retaliate--an "abuse case." I made it so every security fix ships with an automatic test that proves the protection is working, plus a gate in the pipeline that blocks any security-relevant change that doesn't have one. Anything not yet fixed is logged as an explicit, dated waiver. The app now tells browsers to block clickjacking, stop guessing file types, and force a secure connection. A logged-in resident can read and post, but the post carries no trace of their account. The login page no longer reveals whether an email has an account, so it can't be used to find out who is a member. People can't self-promote to a provider role, the member roster is hidden, fake-dated spam is blocked, and timestamps are blurred to the day so residents can't be de-anonymized. The app is pinned to a supported Next.js version, and the pipeline blocks any critical dependency advisory. I am having a per-user edge throttling plus a bot check as a dated, deferred item and mitigations already in place are recorded.

The research report goes into the stakes, vulnerability, and fixes in more detail. Everything has been checked against the Open Worldwide Application Security Project, or OWASP, standards.

## What I Learned

One thing I learned was when to stop. I'm the kind of person who tries to push through and get things done all at once.Working with Claude is teaching me that it is ok to park certain things that are not critical and deal with them another day. For example, Claude stopped me from forcing a Next update that would have broken my UI library.

Something else I learned was how to reorient myself when I became confused and overwhelmed with tasks and decision-making.Claude taught me how to use $LASTEXITCODE to see if VS Code was printing a success message. I was also able to ask for more detailed steps to do manual security tests. If I was unclear about whether or not a commit happened, I could use git log --oneline -5 to print the five most recent commits.
