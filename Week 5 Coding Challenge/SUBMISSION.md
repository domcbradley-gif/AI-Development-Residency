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

I asked Claude to create three different mockups based on the three different visual options that came out of the brand strategy workshop just so I could get a feel for what they looked like.

I reviewed and tightened BDD scenarios.

I set up a CI/CD pipeline in my GitHub repository to prevent mistakes from going live. Four checks run: a check that tidies the code, a check that guards the three promises that matter most--anonymity, funding rules, and no scoring of nonprofits upheld, a check that confirms the app still builds, and a check that makes sure the project's saved AI skills are all real and complete. 

I broke a piece of a skill on purpose. The checklist caught it--it turned red and blocked the change. I undid it and it went green again.

I did two tasks on the live app by hand--posting an anonymous note and checking that the funding page flags a funder who has given an amount over the cap. Both worked as expected.


## What I Learned

I learned that it is very easy to forget the loop that the add, commit, push loop to do things in GitHub. I also learned that it is easy to forget whether or not you are on the main branch in your repository or another branch. It's all very tricky. I find myself asking Claude to confirm I am moving in the right direction before I do things. I am wondering when some of this will start becoming second nature.

