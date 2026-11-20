# Content Audit — MVP #1 (post-usability)

Current as of 2026-11-19. A systematic review of every piece of user-facing text in
the live app, following the usability test and the v2 copy changes it drove. The job
of this audit is to catch what the v2 pass missed — mainly places where the same idea
is worded differently from screen to screen.

Phase: **synthetic data only** (no real resident data).

## How to read this document

- **Section 1** is the content inventory: every screen and its user-facing copy.
- **Section 2** is the findings, scored against the six criteria, each with a
  recommended fix and a **Decision** column left blank — we fill it in together
  (keep / change-to / defer), then implement.
- **Section 3** is what already works and should not be broken.

### The six criteria

1. **Clarity** — plain and unambiguous (testers tripped on jargon).
2. **Voice & tone** — consistent, and right for a stressed, marginalized audience.
3. **Consistency** — one term per concept, everywhere.
4. **Accuracy** — matches what the app does and its anonymity/consent promises.
5. **Accessibility** — labels, alt text, reading level.
6. **Safety / trust** — reassures the right things (anonymity, "not a score," who runs it).

---

## 1. Content inventory

| Screen | Element | Current copy |
| --- | --- | --- |
| Global nav | Wordmark | "Community-Governed Data" |
| Global nav | Links | Community Record · Compare · Residents' Group · Accountability · About · Provider · Funding · Log in / Log out |
| Community Record (home) | Form heading | "Share your experience" |
| Community Record | Form intro | "Your note is anonymous. We don't ask for your name, and no one can trace it back to you. This is a practice space, so all data is made-up. Once sent, a note can't be edited or removed." |
| Community Record | Field label | "What's happening in your housing?" |
| Community Record | Topic field | "Topic (optional)" · "No topic" · helper "Topics are {provisional}." |
| Community Record | Consent checkbox | "I understand this is a practice space with made-up data, and my note is sent without my name." |
| Community Record | Button / success | "Send anonymously" / "Thank you. Your note was added anonymously." |
| Community Record | Errors | "Please describe what's happening before sending." · "Please keep it under N characters." · "Please confirm you understand before sending." |
| Community Record | List heading / empty | "The community record" / "No contributions yet. Be the first to add one above." |
| Community Record | Record chips | topic chip · date (date-only, UTC) · "synthetic" chip |
| Compare | H1 / sub | "Compare" / "Residents' accounts vs. the official record." |
| Compare | Not-a-score note | "This is not a score or a grade… Any numbers are self-reported context, not a grade. All data is made-up." |
| Compare | Mismatch chip / empty | "Official record disagrees with residents" / "No provider is set up yet. Add one to see the comparison." |
| Residents' Group | H1 | "Residents' Group" |
| Residents' Group | Intro | "To act, the group needs N members ({provisional}). Anyone can join — no landlord, funder, or nonprofit decides who is a member." |
| Residents' Group | States | "You are a member of this group." · "Join this group" · "Leave" · "Log in to join this residents' group." |
| Accountability | H1 / intro | "Accountability" / "When enough members agree, the residents' group can withdraw its support from a provider — a public, reversible way of saying it does not stand behind them." |
| Accountability | Standing banner | "The community has withdrawn its support from X (since …)." / "…has not withdrawn support from X." |
| Accountability | Actions | "Withdraw support" / "Restore support" · "An explicit community action. Enough members have joined (n/q)." |
| Accountability | Public record | heading "Public record" · chip "Active" / "Lifted" · "Support withdrawn {date+time} · restored {date+time}" |
| About | Sections | "About" · "What happens when you post" · "How anonymity works" · "Who runs it" · "Staying independent" (full copy on page) |
| Funding | H1 / rules | "How this is funded" / "Two rules keep this project independent…no single funder gives more than X% ({provisional})." |
| Funding | Alerts / chips | over-cap + from-a-provider warnings · "over cap" · "from a provider" · "Conflict register" · "No conflicts disclosed." |
| Provider | H1 / sub | "Provider standing" / "The community-issued credential a provider sees about itself." |
| Provider | Standing banner | "currently under a community warrant (since …)." / "in good standing — no active community warrant." |
| Provider | Independence check | "Membership is self-organized (no organization selects members)" · "No single funder is over the cap" · "No money from the watched" · "A quorum is set for the community body" |
| Provider | History | "History (receipts)" · "Warrant {event_type} · {date+time}" · "No warrant activity yet." |
| Login | H1 / intro | "Log in" / "Sign up" · "You only need an account to join a community body or to act as a provider. Adding a note to the record stays anonymous…" |
| Login | Fields | "Email" · "Password" · "Display name (optional)" · generic errors from auth-errors.js |

---

## 2. Findings

Scored against the six criteria. Decision left blank — fill with keep / change-to / defer.

| ID | Criterion | Where | Current | Issue | Recommended fix | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| CA-1 | Voice | Nav wordmark + page `<title>`s | "Community-Governed Data" | The app's name shown to residents is the internal project term; a stressed tenant lands on a dry data-governance phrase. Usability tested a real name ("Many Strong"). | Decide the resident-facing name; set it in the nav wordmark and page titles. | Change — rename to "Many Strong" (nav wordmark + page titles) |
| CA-2 | Consistency | Accountability vs Provider pages | "withdraw / restore support" (Accountability) vs "community warrant" / "in good standing" (Provider) | **The warrant rename never reached the Provider page** — it still uses the carceral term the usability test flagged. | Rewrite the Provider page to the "support withdrawn / restored" vocabulary; drop "warrant." | Change — Provider page reworded to "support withdrawn/restored"; "warrant" dropped |
| CA-3 | Consistency | Accountability public-record chip | chip "Active" / "Lifted" beside "Support withdrawn …" | A third vocabulary; "Active" is ambiguous (active support? active withdrawal?). | Chip reads "Support withdrawn" / "Support restored" (or "Standing" / "Support restored"). | Change — chip reads "Support withdrawn" / "Support restored" |
| CA-4 | Consistency | Login intro | "join a community body" | Group is called "Residents' Group" everywhere else. | "join a residents' group." | Change — "residents' group" everywhere "community body" appeared |
| CA-5 | Consistency | Record chip vs copy | "synthetic" chip vs "made-up data" | Two words for one idea; "synthetic" is the technical one. | One resident-facing word on the chip ("made-up" or "example"). | Change — chip + copy use "example" / "example data" (less deceptive than "made-up") |
| CA-6 | Safety / Consistency | Accountability + Provider timestamps | `toLocaleString()` → full date **+ time**, local zone | Contributions show date-only UTC (the de-anon fix); these screens re-introduce precise local timestamps. | Use the same date-only UTC format across the app. | Change — date-only, UTC across the app |
| CA-7 | Clarity | Topics, quorum, funding, gap | "{provisional}" as a bare label | "provisional" is jargon shown with no explanation. | Plainer phrasing or a one-line gloss ("still being finalized"). | Change — "provisional" → "still being finalized" |
| CA-8 | Clarity | Provider independence check | "no organization selects members" | P2 found this confusing ("which organizations?"). Carryover from usability. | Rephrase (e.g., "Members join themselves; no landlord, funder, or nonprofit picks them"). | Change — "Members join themselves; no landlord, funder, or nonprofit picks them" |
| CA-9 | Clarity | Provider page framing | "Provider standing" / "the community-issued credential a provider sees about itself" | "credential" is jargon; the framing is abstract. | Plain-language intro of what a provider sees and why. | Change — plain intro: "What the community record shows about this provider" |
| CA-10 | Accuracy | Compare empty state | "No provider is set up yet. Add one to see the comparison." | Instruction aimed at an admin, but read by residents/visitors who can't add a provider. | Reword to describe, not instruct ("No provider is set up yet — nothing to compare."). | Change — "No provider is set up yet — nothing to compare yet." |
| CA-11 | Consistency | Home list heading | "The community record" (sentence case) | Nav label is "Community Record" (title case); P2 flagged lowercase labels feeling "in development." | Align casing. | Change — "The Community Record" (title case) |
| CA-12 | Clarity | Home form intro + consent checkbox | both state "practice space / made-up / anonymous" | Near-duplicate messaging (usability kept the checkbox deliberately). | Trim overlap so the checkbox adds, not repeats. | Change (light) — trimmed form intro; consent checkbox kept, wording aligned to "example" |

---

## 3. What works (keep)

- The **About page** is clear, warm, and on-message — covers purpose, what happens
  after posting, anonymity, who runs it, and independence.
- The **anonymity copy** on the form and About is consistent and reassuring.
- **Error messages** share one calm "Please…" voice.
- The **"not a score"** framing on Compare is explicit and does its job.
- **Accessibility basics** are in place: form fields have labels and `aria`
  wiring, status regions use `aria-live`.

---

## 4. Next steps

- [ ] Fill the Decision column (keep / change-to / defer) for each finding.
- [ ] Implement the agreed changes, one screen at a time.
- [ ] Relaunch (merge to main → Vercel).
- [ ] Spot re-check the changed screens.
