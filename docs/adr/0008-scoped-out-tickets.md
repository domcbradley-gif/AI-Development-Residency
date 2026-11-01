# ADR-0008: Three tickets scoped out of MVP #1 for now

- **Status:** Accepted — 2026-10-31
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0006

## Context

Three backlog tickets are tagged "cut if short" in the PRD and are either heavy or
in tension with the design: retaliation safeguard (1.4), multi-format (audio/video)
capture (2.1), and resident access to own data (2.2).

## Options

1. **Build all three now.** Good: a fully complete backlog. Bad: audio/video is a
   large lift (object storage, transcoding, accessible players), and resident
   access to own data conflicts with anonymity by default.
2. **Scope them out with written reasons, keep them on the backlog — chosen.**
   Good: honest, delivered on time, and principled (protects anonymity). Bad: MVP
   #1 is not 100% of the original backlog.
3. **Fake them (empty or placeholder screens).** Good: looks complete. Bad: the
   rubric forbids fake/empty screens; dishonest.

## Decision

Scope these three out of the MVP #1 submission for now, on the record:

- **1.4 Retaliation safeguard** — depends on a mature warrant + body; deferred.
- **2.1 Multi-format capture** — audio/video is a large lift; text capture ships
  now, richer formats later.
- **2.2 Resident access to own data** — pulls against anonymity by default. Showing
  a resident "their" contributions requires linking contributions to an identity,
  which the design forbids this phase. Revisit only with a privacy-preserving
  design (e.g. a local claim token on the resident's device), never by adding
  identity to the record.

## Consequences

- **Easier:** MVP #1 stays focused on the primary loop and ships on time.
- **Harder / accepted:** three tickets remain open on the backlog, with reasons.
- **Next:** revisit 2.2 only with a privacy-preserving design; it is a principled
  deferral, not an oversight.
