# BDD scenarios — MVP #1

Behavior-driven development scenarios for the core features of the
Community-Governed Data app, written in Gherkin (Given / When / Then).

These are the **concrete, example-driven** companion to `docs/acceptance-criteria.md`:
the acceptance criteria state the rules; these scenarios walk through them with
specific, realistic data (the synthetic demo provider "Maplewood Supportive
Housing" and its seeded records), so each one reads like a worked example and is
specific enough to be automated later.

One `.feature` file per core feature, matching the seven MVP #1 epics:

| File | Epic | Priority |
| --- | --- | --- |
| `anonymous-contribution.feature` | A safe voice | P0 |
| `the-gap.feature` | The record and the gap | P0 |
| `warrant.feature` | The warrant | P0 |
| `community-body.feature` | The independent community body | P0 |
| `authentication.feature` | Platform foundations (auth) | P0 |
| `provider-official-record.feature` | The provider | P1 |
| `funding-discipline.feature` | The funding discipline | P1 |

All data this phase is **synthetic**. Tags (`@p0`, `@anonymity`,
`@warrant-integrity`, `@independence`, `@deferred`, etc.) mark priority and the
non-negotiable rails.

## Running them later (optional, not set up yet)

These are documentation-grade today. To make them executable, a BDD runner such
as `playwright-bdd` or `cucumber-js` would read this folder and bind each step to
test code. That wiring is deferred — the scenarios are written in standard Gherkin
so no rewrite is needed when it happens.
