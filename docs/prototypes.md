# Prototypes — MVP #1

Current as of 2026-11-01. A low-fidelity, **clickable wireframe prototype** of the
Community-Governed Data app.

## What this is (and isn't)

Because the real app is already built and deployed, this prototype is deliberately
**low-fidelity** — grayscale, sketch-font, placeholder blocks — so it reads as a
design artifact, not a second copy of the product. Its job is to show the design
*thinking*: the screens, the flow between them, and the rail each screen protects.

It covers two things:

1. **The primary loop that exists today** — so it stands on its own as a complete
   prototype you can click through.
2. **The features scoped for later** — clearly marked "Future — not built in MVP #1"
   — so the same artifact doubles as a roadmap sketch for what comes after the
   residency.

## Where to open it

- **Live, clickable version:** published as a private Claude artifact —
  <https://claude.ai/artifact/7oAQKfbdaJMCYJFWG1CJb3>
- **In this repo (standalone, opens in any browser):**
  [`docs/prototype/index.html`](prototype/index.html) — double-click to open; no
  build or server needed.

## Screens

**Primary loop (built):**

1. **Community record** — anonymous contribution form + the public record.
2. **The gap** — official claim beside residents' accounts, small counts masked.
3. **Log in / sign up** — accounts only for identified roles.
4. **Community body** — self-organized membership; provisional quorum.
5. **Warrants** — public register, issue/revoke, append-only receipts.
6. **Provider** — role-gated official-record intake; standing.
7. **Funding** — public funder list with the cap flag; conflict register.

**Future — not built in MVP #1:**

8. **My own accounts** — privacy-preserving access to one's own notes (claim token).
9. **Record your account** — audio/video capture.
10. **Retaliation safeguard** — report retaliation; auto-grounds to revoke.
11. **Offline / install** — PWA: add to home screen, post offline.

## How to read it

Each screen carries a margin **"design rail" note** tying it back to the principle
it enforces (anonymity, exposure protection, self-organized bodies, member-gated
warrants, funding discipline) and, where relevant, to the ADR that decided it. A few
controls are genuinely clickable — posting a note, joining the body, issuing and
revoking a warrant, and the links that move between screens — so the core flow can
be walked end to end. All data shown is synthetic (the "Maplewood Supportive
Housing" demo), matching the seeds in the live app.

## Relationship to the other deliverables

The wireframes visualise the same flows written up in `docs/use-cases.md` and
`docs/flowcharts.md`, and the screens map one-to-one to the acceptance-criteria and
BDD epics. The deferred screens match the scope-outs recorded in ADR-0007 / 0008 and
the platform choice in ADR-0009.

*Related: `docs/use-cases.md`; `docs/flowcharts.md`; `docs/acceptance-criteria.md`;
`docs/adr/`.*
