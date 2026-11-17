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

_(Write this yourself — no less than 2 paragraphs, with full technical detail. No AI — the instructor checks.)_

## What I Learned

_(Write this yourself — no less than 2 paragraphs: what you learned, what you'd do differently next time, and how it helps in future team work. No AI — the instructor checks.)_
