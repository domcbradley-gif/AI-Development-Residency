# Dependency exceptions (accepted advisories)

OWASP Vulnerable Dependency Management permits a documented, reasoned exception
when an advisory is not reachable in the application's usage and the only fix is
a breaking change. Each entry is reviewed and time-boxed.

## postcss (transitive via next → @mui/material-nextjs) — HIGH + 2 moderate

- **Advisories:** GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-fxqj-rqcc-2cmp,
  GHSA-r28c-9q8g-f849 (XSS in CSS stringify output; arbitrary `.map` file read /
  path traversal via attacker-controlled `sourceMappingURL` in CSS comments).
- **Where it comes from:** bundled with Next.js (`next` → `postcss`), pulled in
  through the `@mui/material-nextjs` adapter.
- **Why it is not exploitable here:** postcss runs only at **build time**, on the
  project's own stylesheets and those vendored in `node_modules` (MUI). The app
  never processes attacker-controlled CSS or `sourceMappingURL` input at runtime,
  so the vulnerable code path is never reached by an attacker.
- **Why not fixed now:** the only available fix bumps Next.js to 16, which is
  outside the `@mui/material-nextjs` supported peer range (`^13 || ^14 || ^15`)
  and removes the synchronous `cookies()` API the app relies on. That is a
  breaking change we will not take mid-submission.
- **Decision:** ACCEPTED, time-boxed. **Plan:** upgrade `@mui/material-nextjs`
  (to a version supporting Next 16) and Next.js together, then remove this
  exception. Re-review by: 2026-12-15.
- **Monitoring:** CI runs `npm audit --omit=dev --audit-level=critical`, so any
  CRITICAL shipped advisory still fails the build.
