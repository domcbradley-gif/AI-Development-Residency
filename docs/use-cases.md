# Use Case Scenarios — MVP #1

The primary use cases for the live app, written as actor → goal → flow. Each maps
to a built feature and to backlog tickets. "Anyone" = no account needed.
All data is synthetic this phase.

Actors: **Resident** (anonymous, no account), **Community member** (signed in),
**Body member** (a community member who has joined the body), **Provider**
(signed in, provider role), **Visitor** (anyone, including the public).

---

## UC-1 — Contribute an anonymous note (Resident)
- **Goal:** put a housing experience on the community record without being identified.
- **Preconditions:** none (no account).
- **Main flow:**
  1. Resident opens the Community record page.
  2. Enters a note, optionally picks a topic.
  3. Ticks the consent checkbox.
  4. Submits; the note is stored with no identity and shown back in the record.
- **Alternatives:** empty/over-long note → inline validation; consent not ticked → submit disabled.
- **Postcondition:** an anonymous, synthetic note exists in the record. (Tickets 1.1, 1.3)

## UC-2 — View the community record (Visitor)
- **Goal:** read what residents have reported.
- **Main flow:** open the Community record page → the list of notes loads (newest first).
- **Postcondition:** none (read-only, public).

## UC-3 — See the gap for a provider (Visitor)
- **Goal:** compare the official record against residents' accounts.
- **Main flow:** open The gap → each category shows the official claim beside the
  count of resident accounts, with disagreements flagged and small counts masked.
- **Postcondition:** none. No pass/fail score is shown. (Tickets 2.3, 2.4, 1.2)

## UC-4 — Sign up / log in (Community member or Provider)
- **Goal:** get an account in order to act (join a body, run a provider).
- **Preconditions:** none.
- **Main flow:** open Log in → choose Sign up → enter email, password, role → account
  created and signed in; nav shows the user. Existing users log in.
- **Alternatives:** wrong credentials → error; email confirmation (if enabled) → confirm then log in.
- **Postcondition:** a profile row exists for the user (own-row RLS). (Ticket E7, ADR-0005)

## UC-5 — Join the community body (Community member)
- **Goal:** become a member so the body can act with representation.
- **Preconditions:** signed in.
- **Main flow:** open Community body → Join → membership recorded; member count +1.
- **Alternatives:** leave the body → membership removed.
- **Postcondition:** the user is a member (self-added; no org selection). (Ticket 4.1, 4.2)

## UC-6 — Issue a warrant (Body member)
- **Goal:** record the community's explicit verdict against a provider.
- **Preconditions:** signed in, a member of the body, quorum met, no active warrant.
- **Main flow:** open Warrants → Issue a warrant (with a reason) → warrant created
  (status issued); a receipt is logged; provider standing flips to "under warrant."
- **Alternatives:** quorum not met → issue is blocked with a message; not a member → no issue control.
- **Postcondition:** an active warrant and an audit receipt exist. (Tickets 3.1, 4.2)

## UC-7 — Revoke a warrant (Body member)
- **Goal:** take back the community's verdict.
- **Preconditions:** signed in, a member of the body, an active warrant exists.
- **Main flow:** open Warrants → Revoke → warrant status becomes revoked; a receipt
  is logged; provider standing returns to "no active warrant."
- **Postcondition:** the warrant is revoked; the register and receipts reflect it. (Ticket 3.2)

## UC-8 — View the public warrant register & provider standing (Visitor)
- **Goal:** see whether a provider holds a warrant and its history.
- **Main flow:** open Warrants (or Provider) → the register lists warrants with
  status and dates; provider standing is shown.
- **Postcondition:** none (public, read-only). (Tickets 3.3, 5.3)

## UC-9 — Report to the official record / an outcome (Provider)
- **Goal:** a provider adds to the official record or reports an outcome.
- **Preconditions:** signed in with the provider role.
- **Main flow:** open Provider → Add to the record (source, category, summary; or an
  "outcome") → stored and shown under Outcomes / in the gap.
- **Alternatives:** non-provider account → the form is hidden with a note; anonymous → prompted to log in.
- **Postcondition:** a synthetic official_record exists. (Tickets 5.1, 5.2; role-gated per ADR-0007)

## UC-10 — View funding discipline & the conflict register (Visitor)
- **Goal:** check the project's funding independence.
- **Main flow:** open Funding → funders with shares, the funder-cap and
  no-money-from-the-watched checks, and the conflict register.
- **Postcondition:** none (public, read-only). (Tickets 6.1, 6.2)

---

### Deferred use cases (not built this phase — see ADR-0008)
- Resident accesses their own data (2.2) — needs a privacy-preserving design.
- Resident captures audio/video (2.1) — capacity-gated.
- Retaliation safeguard is invoked (1.4) — community-gated.
