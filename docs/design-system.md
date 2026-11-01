# Design System — MVP #1

Current as of 2026-11-01. The documented, reusable design decisions behind the
Community-Governed Data app — the colors, type, spacing, components, accessibility
standards, and voice — so new screens look and sound consistent and anyone can
build on them. Mostly **descriptive** (what the app is today), with a short
"where this grows" note at the end.

It has two layers: the **brand** (who we are and how we sound) sits on top of the
**system** (the concrete tokens and components). Full brand reasoning lives in the
Brand Strategy / Brand Brief; full token source is `Week4/web/app/theme.js`.

## Brand snapshot (the layer above the tokens)

- **Name (provisional):** **Many Strong** — tagline **"held in trust."** (Pending
  domain + trademark clearance; see the name-securing plan.)
- **Archetype:** Everyman (primary — the warm, everyday, resident-facing voice) +
  Magician (the transformational mission voice), sharpened as **"The Organizer."**
  Shorthand: *Everyman manners, Magician mission.*
- **North Star:** a trusted neighbor with a backbone — warm, plain-spoken, unafraid.
- **Personality:** serious, warm, grassroots, peer, humble, open, dependable,
  principled-rebellious, unique, accessible.
- **We are NOT:** surveillant/policing, corporate/slick, savior/paternalistic,
  preachy, clinical. *(These are design guardrails, not just copy rules — e.g. no
  dashboards that feel like monitoring people; no glossy marketing veneer.)*

## Color

Functional, accessibility-first palette (AA contrast is deliberate — see
Accessibility). Defined in `theme.js`.

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| Primary (brand blue) | `#1565c0` | primary actions, links, focus ring | ~5.1:1 on white (AA); white text on it |
| Error | `#b00020` | errors only — never the sole signal | ~6.5:1 on white |
| Success | `#1b5e20` | success states | AA on white |
| Text primary | `#1a1a1a` | body text | — |
| Text secondary | `#42474e` | supporting text | AA on white |
| Background | `#ffffff` | page surface | — |
| Focus ring | `#1565c0`, 3px solid, 2px offset | keyboard focus on all interactive elements | highly visible |

Notes: the app is **light-mode only** today (no dark theme in code). Color never
carries meaning alone (always paired with text/icon). Semantic colors (error/
success) are separate from the brand blue accent.

## Typography

- **Base size:** 16px.
- **Family:** Material UI default stack (Roboto / system fallback). No custom brand
  typeface yet — that's a future brand decision.
- **Buttons:** sentence case, never ALL CAPS (`textTransform: none`).
- **Scale (as used):** `h5` for section titles, `h6` for the app title, `body1` for
  body, `body2` for supporting/secondary text. Keep running text readable (~65 chars).

## Spacing, shape & layout

- **Spacing unit:** 8px (MUI default). Common usage: page padding `py: 4` (32px),
  card padding `p: 2`–`p: 3` (16–24px), vertical rhythm in 8px steps (`mb: 1/2/3/4`),
  `gap: 1/2` for rows.
- **Corner radius:** 4px (MUI default).
- **Layout:** centered content container with generous vertical padding; rows wrap/
  stack on narrow screens; nav wraps on small widths.

## Components (and how to use them)

- **Top navigation** — `AppBar` + `Toolbar`, `color="default"`, `elevation={1}`,
  wraps on narrow. Shows the signed-in user + Log out, or a Log in button.
- **Buttons** — `contained` for the one primary action on a view; `outlined` for
  secondary (e.g. Log in/out); sentence case; always a visible focus ring. Labels
  name the action ("Send anonymously", not "Submit").
- **Text fields** — `TextField`, `fullWidth`; multiline for long input; `select`
  for choices; always with a label; show a character counter and inline error text;
  error state never by color alone.
- **Consent checkbox** — `Checkbox` + `FormControlLabel`; an explicit, informed step
  before anything is submitted (data-minimization pattern).
- **Alerts** — `Alert` (success/error) inside an `aria-live="polite"` region, with
  focus moved to it after submit, so screen-reader users hear the result.
- **Cards** — `Paper`/card for list items (e.g. contributions), modest padding,
  no heavy shadow.
- **Tables** — for the gap and funding views; keep them scrollable on narrow screens.

## Accessibility standards (committed: WCAG AA)

The app is built to **WCAG 2.1 AA**, and this is a standing commitment, not a
nice-to-have — the audience includes people in stressful situations, on old or
shared devices, sometimes reading in a second language.

- **Contrast:** text and controls meet AA (colors chosen for it on purpose).
- **Keyboard:** every interactive element has a clearly visible focus ring.
- **Motion:** `prefers-reduced-motion` is honored globally (animations/transitions cut).
- **Structure:** semantic headings, every field labelled, `aria-describedby` for help text.
- **Status:** `aria-live` regions announce success/error; focus is moved to them.
- **Errors:** always text + state, never color alone.
- **Consent & minimization:** explicit consent before submit; we collect only what's needed.
- **Language:** `lang="en"` set; copy written plainly for low-literacy and ESL readers.

## Voice & tone (verbal identity)

Plain, warm, direct. Short sentences. Name things the way the people we serve would
("your housing", not "service provision"). Active voice; controls say exactly what
happens. Concrete over clever. Honest about limits and about what's synthetic.
Dignity in every line — write *with* people, not *about* them. Never clinical,
preachy, or pitying. **Two registers:** the everyday, resident-facing voice stays
grounded and warm (Everyman); the mission voice (funders, movement, press) can run
bolder and more visionary (Magician) — same values, different volume.

## Where this grows (aspirational)

The system today is functional and accessible but visually minimal. As the brand
matures (and once "Many Strong" clears):

- a **dark theme** (tokens are ready to be duplicated for it);
- a **brand typeface** to replace the default stack;
- **warmer brand neutrals** layered onto the functional palette;
- tokens pulled into **CSS variables / a shared Figma library** so design and code
  share one source of truth;
- the full **Many Strong visual identity** (logo/wordmark, imagery guidance) built
  on this foundation.

*Related: Brand Strategy Workshop / Brand Brief; `Week4/web/app/theme.js`;
`docs/security.md` (accessibility + consent rails); `docs/system-architecture.md`.*
