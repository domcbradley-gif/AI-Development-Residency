# ADR-0010: Defer resident edit/retract of their own posts

- Status: Accepted
- Date: 2026-11-17
- Relates to: ADR-0008 (resident access to their own notes deferred)

## Context

Usability testing (P1) showed a resident looking for a way to edit or retract a
post and finding none. Being able to take something back is a safety and control
need, especially for a marginalized audience posting about their housing.

But posts are anonymous by design: nothing identifying is attached, and a post is
not tied to any account. That is the core promise of the tool. A straightforward
"edit/delete my post" feature needs a way to prove you are the author, which
reintroduces exactly the identity link that anonymity removes.

## Decision

Defer a true edit/retract feature for this version. For now, state plainly on the
contribution form and the About page that a note cannot be edited or removed once
sent, and why (it is anonymous, so there is no account to tie it to).

## Options for a future version (not built now)

- A one-time, anonymous edit/delete token shown to the author at post time (not
  stored against identity) that can later retract that single post.
- A short post-submit window during which the just-created note can be removed
  from the same browser session.

Both need design and a security review to be sure they do not weaken anonymity.
Until then, the honest in-product message sets the right expectation.

## Consequences

- No schema or data changes now.
- Residents know up front that posting is final, which supports informed consent.
- A follow-up ticket should revisit the token approach for a later version.
