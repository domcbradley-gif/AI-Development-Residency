# Presentation-Layer Spec — MVP #1

Current as of 2026-11-03. The specification for the app's **presentation layer**
(the screens the user sees and uses), written to *drive* the build and to *verify*
it afterward — the same idea as the acceptance criteria and BDD scenarios, focused
on the front end. Covers all seven screens at practical depth.

This is the **v2 baseline**: build to it, then fold usability-test findings into it
screen by screen.

## How to read this spec

- **Token-based and identity-agnostic.** The spec refers to *semantic roles and
  tokens* (e.g. "primary action," "danger," "display type"), not final brand
  visuals. So the visual identity can be swapped in later as token *values* without
  rewriting the spec.
- **Brand-dependent items are flagged `PROVISIONAL (brand)`** — finalize with the
  visual identity (name/wordmark, display typeface, final palette, imagery). Until
  then they stay on the current functional values.
- Each screen has the same sections: **Purpose · Route · Audience · Structure ·
  States · Interactions · Content & copy · Accessibility · Provisional notes.**
- Shared foundations come first; read them once, then they apply to every screen.

---

## Shared foundations (apply to every screen)

### Tokens (slots, not final values)

- **Color roles:** surface (bg `#ffffff`), text-primary (`#1a1a1a`), text-secondary
  (`#42474e`), border/divider, **primary action** (`#1565c0`), **danger** (`#b00020`),
  **success** (`#1b5e20`), **focus ring** (primary, 3px, 2px offset). All meet WCAG
  AA. Light-mode only today; a dark theme is a future token set.
- **Type scale:** base 16px; `h4` page title, `h5` section, `h6` subsection, `body1`
  body, `body2` supporting, `caption` meta. **Display/brand typeface is `PROVISIONAL
  (brand)`** — currently the Material UI default (Roboto/system).
- **Spacing:** 8px unit (page `py` 32, card `p` 16–24, rhythm in 8s). **Radius:** 4px.
- Swapping the visual identity = changing these token *values*, not the spec.

### App shell & global patterns

- **Top navigation (every screen):** app/product name on the left, then links —
  Community record · The gap · Community body · Warrants (→ “Standing”, pending rename) · Provider · Funding — then
  the signed-in user's email + **Log out**, or **Log in**. Wraps to multiple rows on
  narrow screens. The product name is `PROVISIONAL (brand)` — currently
  "Community-Governed Data"; the slot will carry the final name (provisionally
  "Many Strong").
- **Landmarks:** a "Skip to main content" link; one `#main` landmark per page; exactly
  one `h1` per screen.
- **Container width:** `sm` for forms and the record, `md` for the data views.
- **Buttons:** one **primary** (contained) action per view; **secondary** = outlined;
  **danger** = contained + danger role (revoke). Sentence case; always a visible focus
  ring; label names the action ("Send anonymously," not "Submit").
- **Forms:** every field labelled; inline validation with a reason; character counters
  where there's a limit; an explicit **consent step** before any resident submit;
  status shown in an `aria-live="polite"` region with focus moved to it after submit.
- **Feedback:** success / error / info banners (MUI Alert), never color alone — each
  carries text and, where useful, an icon/word.
- **Standard states (define for every screen):** loading, empty, error, success,
  populated. Defaults: loading = a short "Loading…" line in `aria-live`; empty = a
  plain sentence that says what will appear and how to add the first item; error =
  `role="alert"` with a plain message.
- **Motion & contrast:** honor `prefers-reduced-motion`; hold AA contrast in every
  state.
- **Voice (every string):** plain, ~6th-grade reading level, warm, dignified — write
  *with* people, not *about* them. Two registers: resident-facing stays grounded and
  simple; mission-facing (funders/press) can run bolder. Keep the domain terms
  ("the record," "the gap," "warrant," "community body") — they are being tested for
  comprehension.
- **Won't-do (brand guardrails):** nothing that reads as surveillance or policing; no
  scores/ratings/grades of people or providers; no glossy/corporate veneer; no copy
  that pities or lectures.

---

## 1. Community record — `/`

- **Purpose:** a resident puts an anonymous note on the record; anyone can read the record.
- **Audience:** Resident (no account); Visitor.
- **Structure:** skip link → container `sm` → `h1` "Community record" → one-line intro (community-owned) → a **"Practice space / made-up data"** note box → **contribution form** (multiline "What's happening in your housing?"; optional topic select; **consent checkbox**; primary button "Send anonymously"; `aria-live` status) → **the record** (`h2` "The community record"; list of outlined cards: note body, optional topic chip, timestamp, "synthetic" chip).
- **States:** form — idle / submitting ("Sending…") / success (confirmation, field cleared) / validation error. Record — loading ("Loading the record…") / empty ("No contributions yet. Be the first to add one above.") / error (`role="alert"`) / populated.
- **Interactions:** consent gates submit (button disabled until ticked); submit validates body length (1–5000) → inserts → clears → success alert, focus to status, record refreshes. Topic optional. Nothing identifying is sent (anonymity rail).
- **Content & copy:** lead with safety ("Your note is anonymous…"); plain practice-space framing; keep "the record."
- **Accessibility:** labelled fields; char counter via `aria-describedby`; `aria-live` status + focus move; errors as text; skip link; single `h1`.
- **Provisional notes:** the "synthetic/practice" chip and wording may soften once real; resident access to *their own* notes is deferred (ADR-0008). `PROVISIONAL (brand)`: none on-screen beyond the shell name.

## 2. The gap — `/gap`

- **Purpose:** show the official record beside what residents report, per category — a comparison, **not** a score.
- **Audience:** Visitor.
- **Structure:** container `md` → `h1` "The gap" → provider subtitle → explainer ("This is not a score or a grade…") → stack of outlined cards per category: category `h2` (capitalized), a **disagreement chip** when they differ, "Official record" label + claim (source · date), "Residents" label + count line → divider → caption on small-count masking and server-side counts.
- **States:** no provider ("No provider is set up yet.") → per row: no official record / 0 resident accounts / **masked** (fewer than the threshold → "a few," exact number hidden) / normal counts.
- **Interactions:** read-only.
- **Content & copy:** hammer "comparison, not verdict"; the masking line frames it as resident safety; keep "the gap."
- **Accessibility:** a heading per category; the disagreement signal is a text chip (not color alone); explanatory caption.
- **Provisional notes:** a likely v2 improvement (pending the usability test) is a clearer side-by-side of claim vs. accounts. `PROVISIONAL (brand)`: shell name only.

## 3. Log in / Sign up — `/login`

- **Purpose:** an account for the roles that must be identified (community-body members, providers); residents never need one.
- **Audience:** Community member, Provider.
- **Structure:** container `xs` → `h1` ("Log in" / "Sign up") → intro ("You only need an account to join a community body or to act as a provider…") → mode toggle (Log in / Sign up) → email, password; sign-up adds optional display name + role select (Community member / Provider) → primary button → `aria-live` status.
- **States:** idle / submitting ("Please wait…") / success (sign-up: "Account created. Check your email to confirm, then come back and log in.") / error (plain message).
- **Interactions:** toggle mode; submit → auth; create profile row if missing; redirect to `/` on an active session.
- **Content & copy:** plainly explain *why* an account is needed, and that contributing stays anonymous.
- **Accessibility:** labelled fields with autocomplete; labelled toggle group; `aria-live` status.
- **Provisional notes:** `PROVISIONAL (brand)`: shell name only.

## 4. Community body — `/body`

- **Purpose:** the self-organized body; people join/leave themselves; shows how many have joined and whether that's enough to act.
- **Audience:** Community member (signed in); Visitor (prompted to log in).
- **Structure:** container `sm` → `h1` "Community body" → outlined panel: body name `h2`; "Holds {provider} to account."; a line — "To act, the body needs {N} members (provisional). People join themselves — no organization picks who is on the body."; **signed-in:** member count + "enough / not enough to issue a warrant" + Join or Leave; **signed-out:** info alert with a Log-in link.
- **States:** no body exists → signed-out (prompt) → signed-in non-member (Join) → signed-in member (success alert + Leave).
- **Interactions:** Join / Leave server actions, each acting only on the current user (self-organized rail).
- **Content & copy:** foreground independence ("no organization picks who is on the body"); plain wording for the member threshold (no "quorum" jargon).
- **Accessibility:** headings; info/success alerts; button focus.
- **Provisional notes:** the member-threshold number is community-set (provisional config). `PROVISIONAL (brand)`: shell name only.

## 5. Warrants — `/warrants`

> **Pending rename (leaning — confirm in the usability test).** “Warrant” reads as cop-like, which conflicts with the won’t-do guardrail (nothing that reads as policing). Planned replacement: **“no confidence”** — the community body *declares no confidence* in a provider and *restores confidence* when things improve. The nav tab + page title become **“Standing”** (keep `/warrants` working as a redirect to `/standing`). Alternative still under test: *“withdraw support” / “restore support.”* Nothing is locked until the usability test’s term-comprehension check. On-screen swaps: the standing banner, **Issue → Declare no confidence**, **Revoke → Restore confidence**, **“Public warrant register” → “Public record,”** and the register card labels. See the before/after stimulus (Artifact) and `docs/design-tokens.md`.


- **Purpose:** a body member issues or revokes a warrant; anyone can read the public register.
- **Audience:** Body member (to act); Visitor (to read); others prompted.
- **Structure:** container `md` → `h1` "Warrants" → **provider-standing banner** (danger when under an active warrant, success when not) → **member action panel**: if active → Revoke (one step); if no active + enough members → Issue (optional reason); if not enough members → info note; non-members → info note with a Join/Log-in link → divider → `h2` "Public warrant register" → stack of warrant cards (status chip, issued/revoked dates, optional reason).
- **States:** no provider → member+active (revoke) → member+enough+none (issue) → member+not-enough (info) → non-member (info) → register empty / populated.
- **Interactions:** issue (reason optional) / revoke (immediate), both member-gated; the register is public-read.
- **Content & copy:** frame issuing as "an explicit community action"; keep "warrant" (tested term); make revocation's immediacy clear.
- **Accessibility:** the standing banner carries text (not color alone); headings; the action form is labelled.
- **Provisional notes:** `PROVISIONAL (brand)`: shell name only. A v2 candidate: show *who* can act more clearly if testing shows confusion.

## 6. Provider standing — `/provider`

- **Purpose:** what a provider sees about itself — its standing, an independence check, outcomes (stub), a way to add to the record (provider-role only), and the receipt history.
- **Audience:** Provider (to act); Community member / Visitor (read-limited, prompted).
- **Structure:** container `md` → `h1` "Provider standing" → subtitle → **standing banner** (danger/success) → `h2` "Independence check" (list of ✓/✗ items, each with a text mark + color) → divider → `h2` "Outcomes" (stub: empty or cards) → `h2` "Add to the record" (provider intake form if provider role; else an info alert) → divider → `h2` "History (receipts)" (event cards).
- **States:** no provider → signed-out (log-in-as-provider note) → signed-in non-provider (info) → provider (intake form); outcomes empty/populated; receipts empty/populated.
- **Interactions:** add-to-record server action (provider-role only); category select includes an "outcome" option.
- **Content & copy:** plain; label the stubbed parts honestly.
- **Accessibility:** the ✓/✗ marks are glyph + color (not color alone); headings per section.
- **Provisional notes:** outcomes + intake are deliberate stubs (ADR-0007) — a v2 could deepen outcome tracking. `PROVISIONAL (brand)`: shell name only.

## 7. Funding discipline — `/funding`

- **Purpose:** show the funding guardrails in the open — no money from the watched, no single funder over the cap — plus the conflict register.
- **Audience:** Visitor (esp. funders, press, the community).
- **Structure:** container `md` → `h1` "Funding discipline" → explainer (the rule + the cap %) → **status banner** (danger if any funder is over-cap or from-the-watched; success if within the rules) → `h2` "Funders" (cards: name, amount, share %, "over cap" / "from the watched" chips; total line) → divider → `h2` "Conflict register" (disclosure cards).
- **States:** empty (total 0, no success banner) / within-rules (success) / breach (danger).
- **Interactions:** read-only.
- **Content & copy:** plain; this screen can carry the bolder mission register (it speaks to funders/press); keep "the watched" glossed as "the people being watched."
- **Accessibility:** breach chips carry text (not color alone); headings.
- **Provisional notes:** the cap % is provisional config. `PROVISIONAL (brand)`: shell name only.

---

## Brand-dependent items (the swap list)

When the visual identity is settled (after the workshop + name clearance), these
token slots get their final values — no structural change to the spec:

| Slot | Current (provisional) | Finalize with |
| --- | --- | --- |
| Product name / wordmark | "Community-Governed Data" (nav); "Many Strong" proposed | Name clearance + visual identity |
| Display / brand typeface | Material UI default (Roboto/system) | Visual identity |
| Palette / brand neutrals | Functional AA palette from `theme.js` | Visual identity |
| Imagery / illustration style | none | Visual identity |
| Dark theme | not built | Later token set |

## How this drives v2 and verification

1. Build each screen to its section here, one at a time.
2. Verify the built screen against this spec **and** the acceptance criteria / BDD.
3. After the usability test, fold each prioritized finding into the relevant screen
   section (edit the spec first), then rebuild from the revised spec.
4. Apply the visual identity as a token-value swap when it lands — not a rewrite.

*Related: `docs/design-system.md`; `docs/acceptance-criteria.md`;
`Week4/web/features/` (BDD); the Brand Strategy / Brand Brief and the name action
plan (Notion); `docs/prototypes.md`.*
