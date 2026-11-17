# Week 5 — Manual Test Cases

Two manual test scenarios run by hand against the live production app, each
tied to a BDD feature that the CI pipeline also exercises. Run on the merged
`main` deploy on 2026-11-17.

**Live app:** https://ai-development-residency.vercel.app

---

## TC-01 — A resident adds an anonymous note to the Community Record

Tied to `Week4/web/features/anonymous-contribution.feature`.

**Pre-conditions**
- Live site open at the home page (the Community Record).
- Not logged in.
- Practice space with made-up ("synthetic") data.

**Steps**
1. Open the live home page.
2. In the note box, type: "The elevator has been broken for months. I am having a hard time going up and down the stairs."
3. Pick a topic (optional).
4. Tick the consent checkbox ("I understand this is a practice space with made-up data, and my note is sent without my name.").
5. Click **Send anonymously**.

**Expected result**
- The note is added to "The community record."
- No name or identifying information is attached to it.
- A confirmation appears and the form clears.

**Actual result**
- Green confirmation banner shown: "Thank you. Your note was added anonymously."
- The form cleared (character counter returned to 0/5000).
- The note appeared at the top of "The community record" with **no name**, a topic tag ("elevator"), a timestamp (11/17/2026, 2:20:36 AM), and a **"synthetic"** chip marking it as made-up data.
- Note: the **Send anonymously** button stays disabled until the consent box is ticked, confirming consent is required.

**Status: PASS** — matched the expected result.

---

## TC-02 — The Funding page flags a funder that breaks the independence cap

Tied to `Week4/web/features/funding-discipline.feature` (including the new
"A funder over the cap is flagged" scenario).

**Pre-conditions**
- Live site open; no login needed.

**Steps**
1. In the top nav, click **Funding**.
2. Read the status banner and the Funders list.

**Expected result**
- The page explains the two independence rules (no money from watched providers; no single funder over 25%).
- A red warning flags that a single funder is over the 25% cap.
- The over-cap funder shows an "over cap" marker.
- A total is shown.

**Actual result**
- Page header "How this is funded" explains both rules: takes no money from the housing providers it holds accountable, and no single funder gives more than 25% of the budget (marked provisional).
- Red warning banner shown: "A single funder is over the 25% cap."
- Funders list:
  - **Community Justice Foundation — $40,000 · 40% — "over cap"** (red chip)
  - Resident Solidarity Fund — $25,000 · 25% (at the line, not flagged)
  - Small Donors (pooled) — $20,000 · 20%
  - Civic Tech Microgrant — $15,000 · 15%
- **Total: $100,000** shown at the bottom.
- Note on the boundary: the 40% funder is flagged while the 25% funder is not, confirming the cap triggers only above 25%.

**Status: PASS** — matched the expected result.
