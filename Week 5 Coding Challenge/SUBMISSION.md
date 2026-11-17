# Week 5 Coding Challenge — Submission

**Name:** Dominic Bradley
**Track:** Premium / Advanced Residency
**Challenge:** Build a CI/CD Pipeline
**Date:** 2026-11-17

---

## Links

- **GitHub repo:** https://github.com/domcbradley-gif/AI-Development-Residency
- **Live app (Vercel):** https://ai-development-residency.vercel.app
- **CI workflow file:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- **Skills gate script:** [`scripts/check-skills.mjs`](../scripts/check-skills.mjs)
- **DevOps write-up:** [`docs/devops.md`](../docs/devops.md)
- **Database diagram:** [`docs/database-diagram.svg`](../docs/database-diagram.svg)
- **Manual test cases + results:** [`TEST-CASES.md`](./TEST-CASES.md)
- **GitHub Actions runs:** https://github.com/domcbradley-gif/AI-Development-Residency/actions

---

## The pipeline at a glance

The CI workflow runs on **every push (any branch) and every pull request**. It has
two jobs with four checks total, each derived from the project's MVP requirements
and BDD features:

| Check | What it guards |
|-------|----------------|
| **Lint** (`next lint`) | Code quality / consistency across `Week4/web`. |
| **Test** (`vitest run`) | Unit tests for the three core MVP rules — anonymity, funding discipline, and the gap. |
| **Build** (`next build`) | The app compiles and all routes build. |
| **Claude Skills gate** (`node scripts/check-skills.mjs`) | Every Week 1 Claude Skill in `.claude/skills/` exists, has valid frontmatter, and isn't a stub. |

**Break-it test evidence:** a deliberately broken skill produced a **red** run
(CI #43), and reverting it produced a **green** run (CI #44) — proving the
pipeline catches failures. See the Actions history.

**Manual testing:** two scenarios run by hand on the live app, both PASS —
see [`TEST-CASES.md`](./TEST-CASES.md).

---

## Submission checklist

- [x] CI/CD pipeline that runs on every push
- [x] 3+ checks derived from MVP requirements / BDD features (4 checks)
- [x] Gate-check for the Week 1 Claude Skills
- [x] Pushed and watched a run go green
- [x] Break-it test (red run, then fixed to green)
- [x] Two manual test scenarios documented with results
- [x] Live app verified working after merge to `main`

---

## What I Did

_(Write this yourself — in your own words. What did you build this week and how?
A few sentences.)_

## What I Learned

_(Write this yourself — in your own words. What was new, tricky, or surprising?
e.g. the every-push trigger, the skills gate, the break-it test, the branch/merge
workflow, the manual test cases.)_

