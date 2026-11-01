# ADR-0009: Platform — web app (PWA), not native mobile or desktop

- **Status:** Accepted — 2026-11-01
- **Deciders:** Dominic Bradley (solo resident)
- **Related:** ADR-0001 (Next.js), ADR-0002 (Vercel), ADR-0003 (Supabase); and the
  project strategy (anonymity by default, un-capturability, portability)

## Context

The app's form factor has been implicit — Next.js implies a web app — but was never
recorded against the project's own principles. This matters because the choice is
strategic, not just technical. The primary audience is supportive-housing
residents: some transient, some on shared or borrowed devices, many with real
reason to fear retaliation from the provider that controls their housing. The
mission requires the instrument stay un-capturable, community-ownable, forkable,
and transferable to other communities, and it is run by one part-time operator.
Two differentiator features — offline collection and audio/video capture of
people's own accounts — are the usual reasons to reach for native, but both are
already scoped as later, bigger builds.

## Options

1. **Web app (responsive, PWA-capable) — chosen.** Good: no install, so a resident
   can open a link in a browser (even a private window on a shared machine),
   leaving minimal trace — safer against retaliation and lower-friction; no
   app-store chokepoint to pressure, remove, or sue, which protects
   un-capturability; easiest to fork and self-host, so other communities can run
   it; one codebase for a solo operator; a Progressive Web App still offers
   add-to-home-screen, offline support, and camera/mic access. Bad: offline and
   media capture are weaker than native; iOS push has historically been limited.
2. **Native mobile (iOS + Android).** Good: best offline and audio/video capture;
   home-screen presence. Bad: app stores are a capture/censorship chokepoint — a
   power the project exists to resist; an installed app is a visible trace on a
   resident's phone (retaliation risk); hard to fork and self-host; two platforms
   plus store accounts for one person to maintain.
3. **Desktop app.** Good: possible for office or library use. Bad: residents do not
   primarily use desktops; install friction; a web app already serves the
   shared-computer case better.

## Decision

Build and ship as a responsive web app, enhanced as a PWA (installable,
offline-capable, able to use the camera/mic) where a feature needs it. No native
mobile or desktop build this phase. The decision is low-regret: the backend
(Supabase) and the application logic are already web and portable, so a thin native
shell or deeper PWA work can be added later without a rewrite if rich offline or
media capture ever demand it.

## Consequences

- **Easier:** lowest-friction, lowest-trace access for vulnerable residents; no
  app-store dependency that could be captured; easiest to open-source, fork, and
  hand to other communities; one codebase for a solo operator.
- **Harder / accepted:** offline and audio/video capture will need PWA effort and
  will not match native — but these are already deferred differentiator features.
- **Next:** when offline data collection and own-account (audio/video) capture come
  up the backlog, build them as PWA capabilities first; revisit a native shell only
  if a concrete need outgrows the PWA.
