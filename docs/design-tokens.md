# Design Tokens — Visual Identity Swap Worksheet

Current as of 2026-11-03. This is the bridge between the three workshop directions
and the app's actual theme. When the brand workshop lands on a direction (or a
blend), copy that direction's values into the MUI theme and you're done — the
WCAG AA contrast checks are already run, with the ratios recorded below.

Pairs with the **swap list** in `docs/presentation-spec.md`: this file fills that
table in with real, checked values.

## How to use this

1. **Workshop decides** a direction, or a blend ("B's warmth on A's calm").
2. **Clear the name + wordmark first.** Don't lock a wordmark until "Many Strong"
   (or whatever wins) clears trademark + domain. This step is yours to do.
3. **Apply it:** paste the chosen palette block into `Week4/web/app/theme.js`, set
   the two typefaces and the wordmark, then verify the built screens against
   `presentation-spec.md` and the BDD scenarios. Because the spec is
   identity-agnostic, this is a value swap — not a rewrite.

> Sequencing: run the usability test and fold its findings into the spec *before*
> applying the visual identity, so the screen isn't re-skinned twice.

## Token roles (what the app actually consumes)

The app theme is Material UI, so the brand resolves to these palette keys:

| MUI key | Role | Notes |
| --- | --- | --- |
| `background.default` | App/page background | |
| `background.paper` | Card / form surface | |
| `text.primary` | Body text | |
| `text.secondary` | Supporting / meta text | |
| `primary.main` | Primary action — buttons, links, focus ring | |
| `primary.contrastText` | Text sitting on `primary.main` | |
| `error.main` | Danger / destructive (revoke, validation) | Must read as danger |
| `success.main` | Success / "standing OK" | |
| `divider` | Subtle separators between cards | Decorative |
| *(custom)* field border | Input outlines | Needs ≥3:1 to be perceivable |
| `secondary.main` | Accent, used sparingly | Optional |

**One correction carried over from the mock:** the mock used a single "signal"
slot. In real tokens that splits into `error.main` (a true danger hue) and an
optional `secondary.main` accent. Don't let the brand accent stand in for the
error color.

---

## A — On the Record (blues)

Display **Hanken Grotesk**, body **Public Sans**. Grounded, civic, trustworthy.

| Role | Value |
| --- | --- |
| background.default | `#dbe9ee` |
| background.paper | `#ffffff` |
| text.primary | `#15303c` |
| text.secondary | `#3f5c6a` |
| primary.main | `#166088` |
| primary.contrastText | `#ffffff` |
| error.main | `#b5503f` |
| success.main | `#1b6e4f` |
| divider (subtle) | `#c0d6df` |
| field border (AA) | `#5f8698` |

AA checks (ratio): body on surface **13.82** · body on page **11.12** · secondary
on surface **7.12** / on page **5.73** · button label on primary **6.86** · primary
as link **6.86** · error **5.02** · success **6.19** · chip **5.52** · field border
**3.93** (≥3) · focus ring on page **5.52** (≥3). All pass.

```js
palette: {
  mode: 'light',
  background: { default: '#dbe9ee', paper: '#ffffff' },
  text: { primary: '#15303c', secondary: '#3f5c6a' },
  primary: { main: '#166088', contrastText: '#ffffff' },
  error: { main: '#b5503f' },
  success: { main: '#1b6e4f' },
  divider: '#c0d6df',
},
// input outline + focus ring: field border #5f8698, focus ring = primary.main (3px, 2px offset)
// fonts: display 'Hanken Grotesk', body 'Public Sans'
```

---

## B — Many voices (purple + yellow)

Display **Bricolage Grotesque**, body **Public Sans**. Warm, bold, collective.

**Layout caveat — more than a value swap.** B puts light content cards on a deep
purple ground, so `background.default` is *dark* while `background.paper` is light.
The MUI `mode` stays `light`, but the app shell (nav) needs its own light-on-dark
text tokens. Budget a little layout work for this direction, not just a recolor.

| Role | Value |
| --- | --- |
| background.default (ground) | `#3a0057` |
| background.paper (cards) | `#f7f1fb` |
| text.primary | `#2d0b44` |
| text.secondary | `#6a5280` |
| primary.main | `#f9d402` |
| primary.contrastText | `#3a0057` |
| secondary.main (accent) | `#660099` |
| error.main | `#c0392b` |
| success.main | `#1b6e4f` |
| divider (subtle) | `#e7d9f0` |
| field border (AA) | `#8f7aa1` |
| nav ground | `#2d0043` |
| nav wordmark / login | `#fff200` |
| nav links | `#cdb4e0` |

AA checks (ratio): body on surface **15.23** · secondary on surface **6.05** ·
button label on yellow primary **10.96** · purple accent **9.35** · chip **7.76** ·
error on surface **4.90** · success **5.58** · field border **3.46** (≥3) ·
wordmark on nav **15.05** (≥3) · nav links on nav **9.39** · login on nav **15.05**.
All pass.

```js
palette: {
  mode: 'light',
  background: { default: '#3a0057', paper: '#f7f1fb' },
  text: { primary: '#2d0b44', secondary: '#6a5280' },
  primary: { main: '#f9d402', contrastText: '#3a0057' },
  secondary: { main: '#660099' },
  error: { main: '#c0392b' },
  success: { main: '#1b6e4f' },
  divider: '#e7d9f0',
},
// app shell (nav): ground #2d0043, wordmark/login #fff200, links #cdb4e0
// input outline #8f7aa1, focus ring = primary.main
// fonts: display 'Bricolage Grotesque', body 'Public Sans'
```

---

## C — Held in Trust (sage)

Display + body **Figtree**. Quiet, weighty, dignified.

| Role | Value |
| --- | --- |
| background.default | `#def2c8` |
| background.paper | `#ffffff` |
| text.primary | `#2c322b` |
| text.secondary | `#565c54` |
| primary.main | `#3b463a` |
| primary.contrastText | `#eef5e2` |
| error.main | `#a7402e` |
| success.main | `#1b6e4f` |
| divider (subtle) | `#bcd0c7` |
| field border (AA) | `#728d71` |
| warm accent (optional) | `#8a5a44` |

AA checks (ratio): body on surface **13.14** / on page **11.04** · secondary on
surface **6.87** / on page **5.78** · button label on primary **8.85** · error
**6.15** · success **6.19** · chip **6.86** · ghost-chip text **5.92** · field
border **3.12** (≥3) · focus ring on page **8.31** (≥3). All pass.

Two fixes vs. the mock: the mock's clay "signal" `#8a5a44` reads too soft for a
danger color — use **`#a7402e`** for `error.main` and keep `#8a5a44` only as a warm
non-error accent. And the small "Practice space" tag at `#5c6a46` on the note tile
is **3.93** (large-text only) — darken to about `#49552f` if it stays small.

```js
palette: {
  mode: 'light',
  background: { default: '#def2c8', paper: '#ffffff' },
  text: { primary: '#2c322b', secondary: '#565c54' },
  primary: { main: '#3b463a', contrastText: '#eef5e2' },
  error: { main: '#a7402e' },
  success: { main: '#1b6e4f' },
  divider: '#bcd0c7',
},
// input outline #728d71, focus ring = primary.main; optional warm accent #8a5a44
// fonts: display + body 'Figtree'
```

---

## Rules that apply whichever direction wins

- **Dividers vs. field outlines.** Card dividers are intentionally subtle (below
  3:1) and that's fine — cards also carry a fill and shadow, so the border isn't
  the only cue. Form-field outlines *are* the cue, so they use the field-border
  token (≥3:1). Keep the two separate.
- **Error stays a danger hue.** Don't reuse the brand accent for `error.main`.
- **Success and error can be shared** functional values across directions
  (`#1b6e4f` / per-direction danger). Only `primary`, the neutrals, and the type
  really change per direction.
- **Focus ring** = `primary.main`, 3px, 2px offset (already in the spec). All three
  clear ≥3:1 on their own grounds.
- **Dark theme** is still deferred (the app ships light-only). When built, it's a
  second token set, not an edit of these.
- **Name + wordmark** stay provisional until trademark + domain clear.

## Decision — fill in after the workshop

**Chosen direction**

| Field | Value |
| --- | --- |
| Direction (A / B / C / blend) |  |
| Blend notes |  |
| Final name (post-clearance) |  |
| Display typeface (locked + web-licensed) |  |
| Decided on / by |  |

**Before applying it — gates to clear**

- [ ] Name clears trademark + domain
- [ ] Display + body typefaces licensed for web
- [ ] Usability-test findings folded into the spec
- [ ] Palette re-verified for AA after the swap
- [ ] Dark-theme decision made (build now or defer)

**Workshop reactions** — one row per person per direction (A / B / C)

| Participant | Dir | First feeling (1 word) | Safe & respected? | Accountable, not policing/pity? | Most / least "us"? |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## Related

`docs/presentation-spec.md` (swap list) · `docs/design-system.md` ·
`Week4/web/app/theme.js` · the Visual Directions stimulus (Artifact) ·
Brand Strategy / Brand Brief (Notion).
