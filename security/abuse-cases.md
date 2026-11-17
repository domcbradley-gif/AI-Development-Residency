# Abuse Cases — Community-Governed Data

OWASP threat-modeling step 2 (determine threats) + the Abuse Case cheat sheet.
Adversary-driven scenarios, ranked by impact on the people the app protects.

## AC-1 — A watched provider de-anonymizes residents to retaliate  [HIGH]

**Adversary:** a housing provider the community is holding accountable. Sign-up is
open, so they can create an account and read the entire public record.

**Goal:** identify which residents filed complaints or organized accountability, in
order to retaliate (eviction, harassment, service denial).

**Key property:** the adversary is a *legitimate reader* — the record is public by
design. The defense is de-anonymization *resistance*, not access denial.

**Vectors (mapped to findings):**
- Timestamp correlation — precise `created_at` + newest-first order (C8).
- Member-roster exposure — `memberships` readable to any authenticated user, plus
  public `issued_by` / `actor` on warrants and receipts (V4b).
- Content self-identification — free-text `body`/`topic`, no retraction path (ADR 0010).
- Metadata side-channels — API/Postgres logs, Realtime broadcast.
- Small-group aggregates on the Gap (the masking threshold).

**Countermeasures:**
- Anonymity holds even for logged-in residents: contributions use a session-less
  anon client, so no account JWT is attached at the row or request level.
  [done — @privacy-posting]
- Coarsen `created_at` to day-level; bucket/randomize ordering. [pending migration — @privacy-deanon]
- Restrict `memberships` SELECT to own rows + aggregate counts; drop or pseudonymize
  public `issued_by` / `actor`. [pending migration — @privacy-deanon]
- No IP logging beside posts; no Realtime on these tables.
- Resident guidance + a retraction/redaction path.

**Real guarantee:** the session-less client makes a post structurally unlinkable to
an account; the DB-level time and roster controls make correlation hard even for a
reader with full access. The @security @privacy-posting and @privacy-deanon
scenarios test that these hold.
