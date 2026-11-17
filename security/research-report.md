# Security Research Report — The Authorization Layer (Access Control)

> Follows the Tech Fleet **Security Research Report Template**. The layer was
> chosen after the PenTest of the Week 4 app, where the most serious real findings
> were all access-control failures. Examples throughout are drawn from that app.

## Introduction

Authentication answers *who are you*; authorization answers *what are you allowed
to do*. A system can get authentication perfectly right — strong passwords, MFA,
secure sessions — and still be wide open, because once a user is logged in, every
action they take is an authorization decision. Those decisions are where access
control lives, and they are the hardest part of application security to get right.

This is not a niche concern. Broken Access Control is ranked **#1** in the OWASP
Top 10 (A01:2021, and again in the 2025 draft) — the most common serious weakness
found in real applications. For the app this report is based on — a
community-governed accountability record for supportive-housing residents — it is
also the highest-stakes layer. The penetration test found no exposed secrets and no
injection, but it did find three real access-control holes: a user could promote
themselves to "provider," the member roster was readable by anyone logged in, and
official-record tables accepted writes from any authenticated account. In an app
whose purpose is to protect vulnerable people from retaliation, an authorization
failure is not just a data breach — it is a path to identifying and harming a real
person. That is why this layer was chosen.

## Layer

Authorization is not a single component you can point to; it is a **cross-cutting
decision made on every request**, at several tiers at once. From a software
standpoint it spans three places:

- **The client (presentation tier).** The UI hides buttons and pages a user should
  not use. This improves the experience but is *not* security — anyone can bypass
  the UI and call the API directly.
- **The server (service tier).** Server actions and API handlers check whether the
  caller may perform an operation before doing it.
- **The database (data tier).** The last line of defense, where the data actually
  lives. In Postgres this is **Row-Level Security (RLS)**: policies attached to each
  table that decide, per row, who may select, insert, update, or delete.

The network shape of the app decides where authorization *must* be enforced. In a
classic three-tier app, the browser only ever talks to the server, so server checks
are sufficient. But this app uses Supabase, where **the browser talks directly to
the Postgres database** over the Supabase API. That collapses the usual chokepoint:
a server-action check can be skipped entirely by a client that calls the database
directly. The trust boundary therefore moves down to the database, and RLS becomes
the authoritative authorization layer — the one place an attacker cannot route
around.

Authorization decisions are modeled in a few ways. **RBAC** (role-based) grants
permissions by role ("admin," "provider," "member"). **ABAC** (attribute-based) and
**ReBAC** (relationship-based) decide using attributes of the user, resource, and
context — for example, *is this user a member of the body that owns this record*.
OWASP now recommends ABAC/ReBAC over RBAC for most application development, because
role checks scale badly and are easy to get wrong.

## Vulnerabilities

Access-control failures fall into a few recognizable families, and the PenTest of
this app produced a real example of most of them:

- **Vertical privilege escalation** — a low-privileged user gains higher
  privileges. In the app, any signed-in member could update their own profile
  `role` to `provider` and file official records (finding V2). This is the classic
  "self-service admin" bug.
- **Horizontal access / IDOR** — a user reaches data belonging to others.
  Insecure Direct Object Reference is the canonical form: if object IDs are
  guessable and access is not re-checked per object, a user can read or change
  records that are not theirs. In the app, the member roster (`memberships`) was
  readable by *any* authenticated user (finding V4) — a horizontal-access leak that
  doubled as a privacy breach.
- **Missing function-level access control** — an operation simply is not guarded.
  The governance tables (`community_bodies`, `providers`, `funding_sources`,
  `conflict_register`) accepted inserts from any authenticated user (finding V1),
  because no policy restricted who could create official records.
- **Business-logic / context-dependent failures** — the rules exist but can be
  bypassed by calling steps out of order or skipping a required condition. In the
  app, quorum for issuing an accountability action was enforced in application code
  but not at the database, and the warrant `UPDATE` policy was not column-scoped
  (finding V3) — both are logic gaps a direct API call could exploit.

The consequences are the familiar triad — unauthorized disclosure, modification,
and loss of integrity — but this app adds a fourth that is easy to overlook:
**de-anonymization**. An authorization failure that exposes *who* is a member, or
*who* issued an action, converts directly into physical-world risk for the residents
and organizers the system exists to protect. On this layer, "read access to the
wrong table" and "a person gets evicted" are closer together than they look.

## Challenges of Securing This Layer

Authorization is hard to fully secure for reasons that are structural, not sloppy:

- **It is everywhere.** Every request, on every object, is a decision. As the OWASP
  cheat sheet puts it, an attacker only needs to find one unguarded path, while the
  developer must guard them all. Checking *most* requests correctly is still a
  vulnerability.
- **Client-side checks masquerade as security.** Hiding a button feels like
  protection, but enforcement that is not on the server or database is not
  enforcement at all. Teams routinely ship UI gating and believe the feature is
  protected.
- **The "direct API" problem.** In a Supabase/BaaS architecture, the database is
  directly reachable, so any check that lives only in a server action can be
  bypassed. Authorization has to be pushed down into RLS, which many teams treat as
  an afterthought.
- **Role brittleness and role explosion.** Hardcoded checks like
  `if (user.hasAnyRole("ADMIN", "MANAGER"))` are easy to miss on a new endpoint and
  multiply into unmanageable numbers of roles. RBAC also handles per-object and
  multi-tenant decisions poorly.
- **IDOR via guessable identifiers.** Sequential or predictable IDs invite
  tampering, and obscurity is not a control; each object access must be re-checked
  for the specific caller.
- **Mission tension.** This app is *public by design* for transparency, yet must
  minimize identity exposure for safety. Securing the layer is not "lock it down"
  but a careful balance of what is visible to whom.
- **Testing is combinatorial.** The space of (user type × resource × operation) is
  large, so authorization bugs hide in the paths no one thought to test.

## How to Fix the Vulnerabilities

The OWASP Authorization and IDOR Prevention cheat sheets converge on a short list of
principles. Below each is mapped to what the app actually did to close its findings.

1. **Deny by default.** Start from no access and grant explicitly. New tables and
   endpoints should reject access until a policy allows it. *(The app's RLS now
   denies writes to governance tables and roster reads unless a policy grants them.)*
2. **Enforce least privilege.** Give each user the minimum needed. *(Members can read
   only their own membership; an aggregate count is exposed through a narrow
   `security-definer` function instead of the whole roster.)*
3. **Validate permissions on every request, globally.** Prefer one enforcement
   mechanism over scattered per-handler checks. *(RLS runs on every query to the
   table, regardless of which client sent it.)*
4. **Enforce at a trusted layer, never the client.** For this architecture that
   means the database. *(Authorization moved into RLS, so a direct API call cannot
   bypass it — the fix for the self-promotion bug was a database policy, not a UI
   change.)*
5. **Prefer attribute/relationship checks over hardcoded roles.** Decide by
   *relationship to the resource* ("is this user a member of this body"), not a
   brittle global role test. *(Membership-based policies replaced broad role
   assumptions; the self-select role control was removed and new accounts are fixed
   to `community_member`.)*
6. **Protect lookup IDs against IDOR.** Re-check access per object; do not rely on
   IDs being secret. *(Row-level policies tie each row to the caller's identity.)*
7. **Exit safely on failure and do not leak details.** A denied check should fail
   closed and reveal nothing useful. *(This also drove the fix for enumeration-safe
   login errors.)*
8. **Log and monitor authorization decisions,** so bypass attempts are visible.
9. **Test authorization explicitly.** Write default-deny and fail-safe tests;
   automated tests do not replace penetration testing. *(Each fix ships an
   executable `@security @authz` BDD scenario, and a CI coverage gate blocks any
   security surface that lacks one — turning "we handle that" into a test that runs
   on every push.)*

The throughline is simple: **authorization must be enforced at the layer an attacker
cannot route around, denied by default, checked on every request, and proven by
tests.** For a directly-reachable database that means RLS, written deny-first and
backed by executable scenarios — which is exactly how the app's access-control
findings were closed.

## References

- OWASP Cheat Sheet Series — *Authorization Cheat Sheet*:
  https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Cheat Sheet Series — *Insecure Direct Object Reference Prevention*:
  https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- OWASP Top 10 — *A01: Broken Access Control*: https://owasp.org/Top10/
- OWASP Cheat Sheet Series — *Multi-Tenant / Database Security*, *Business Logic
  Security*, *Transaction Authorization*.
