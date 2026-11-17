# C5 — Anti-automation (rate limiting): reasoned risk acceptance

**Surface:** anti-automation (`@ratelimit`)
**Status:** ACCEPTED / deferred, time-boxed. Re-review by 2026-12-15.
**Owner:** Dominic Bradley
**OWASP:** Bot Management and Anti-Automation, Denial of Service

## Threat
An attacker scripts automated mass submissions to flood or poison the record —
burying genuine resident reports in noise, or stuffing the accountability layer
with fabricated entries (a Sybil / quorum-gaming attack on community governance).

## Why the usual fixes are rejected here
1. **Client-side controls are bypassable.** Contribution writes go directly from
   the browser to Supabase through the session-less anon client (AC-1). A bot can
   call the Supabase REST endpoint directly and never load the app's form, so a
   honeypot field or a JavaScript cooldown stops nothing.
2. **A database hard cap becomes a censorship weapon.** A trigger such as "no more
   than N contributions per body per minute" can be *deliberately* tripped by an
   attacker to lock legitimate residents out of posting about a specific provider.
   For a tool whose purpose is protecting residents' ability to speak, a naive rate
   limit hands the watched party a mute button — a worse outcome than the spam.

## Mitigations already in place (reduce impact today)
- **Append-only record:** contributions cannot be edited or deleted by others, so
  automation cannot tamper with or erase genuine entries — only add noise.
- **Synthetic-flagging + coarsened timestamps:** inserted rows are marked and their
  `created_at` is truncated to the day (migration 20261117), limiting the
  intelligence value and correlation power of any scripted dump.
- **Supabase platform baseline:** connection and request limits at the Supabase /
  PostgREST layer provide a coarse floor against trivial floods.

## Correct remediation (deferred — requires infrastructure)
Route anonymous writes through a server-side proxy — a Supabase Edge Function or a
Next.js Route Handler — and apply **per-IP sliding-window rate limiting** (Upstash
or Vercel KV) plus a **Cloudflare Turnstile** verification token. Per-client
throttling slows automation without ever blocking a whole body, preserving every
resident's ability to post. This needs KV/edge provisioning and an external CAPTCHA
account, and is a deliberate post-submission change rather than a rushed one.

## Decision
The partial, mission-safe mitigations above are accepted for now; the effective
control is deferred to the edge-proxy design above. Tracked by the waiver in
`security/waivers.json`; the `anti-automation` surface shows **waived (with reason)**
in the coverage gate until that control ships.
