#!/usr/bin/env node
// Security coverage gate — right-sized adaptation of techfleetworks
// owasp-secure-coding-bdd's check-security-coverage.mjs.
//
// Fails CLOSED when a security-relevant surface present in the repo has no
// matching @security BDD scenario in the feature index AND no active waiver.
// This is the "force proof of application": security-relevant code cannot ship
// without an executable scenario that tests the control (or an explicit,
// time-boxed waiver recording the decision to defer it).
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const reportOnly = process.argv.includes("--report-only");
const quiet = process.argv.includes("--quiet");
const today = new Date().toISOString().slice(0, 10);

const load = (p, fb) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return fb; } };
const config = load("security/security-coverage.config.json", { surfaces: [], featureIndex: "Week4/web/features" });
const waivers = load("security/waivers.json", { waivers: [] }).waivers;

// Collect the tag sets of every @security scenario in the feature index.
const securityTags = new Set();
let securityScenarios = 0;
const dir = config.featureIndex;
if (existsSync(dir)) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".feature"))) {
    let pending = [];
    for (const raw of readFileSync(join(dir, f), "utf8").split(/\r?\n/)) {
      const t = raw.trim();
      if (t.startsWith("@")) { pending.push(...t.split(/\s+/).filter((x) => x.startsWith("@"))); continue; }
      if (/^Scenario(\s+Outline)?:/.test(t)) {
        if (pending.includes("@security")) { securityScenarios++; pending.forEach((tag) => securityTags.add(tag)); }
        pending = [];
      } else if (/^(Feature|Background):/.test(t)) { pending = []; }
    }
  }
}

const activeWaiver = (id) => waivers.find((w) => w.surface === id && (!w.expires || w.expires >= today));

const rows = [];
let uncovered = 0, expired = 0;
for (const s of config.surfaces) {
  const triggered = (s.detect || []).some((p) => existsSync(p));
  if (!triggered) { rows.push([s.id, "not-present", "-"]); continue; }
  if (securityTags.has(s.requiredTag)) { rows.push([s.id, "COVERED", s.requiredTag]); continue; }
  const w = activeWaiver(s.id);
  if (w) { rows.push([s.id, "waived", `until ${w.expires}`]); continue; }
  const dead = waivers.find((x) => x.surface === s.id && x.expires && x.expires < today);
  if (dead) { expired++; rows.push([s.id, "WAIVER-EXPIRED", dead.expires]); }
  else { uncovered++; rows.push([s.id, "UNCOVERED", "no scenario, no waiver"]); }
}

if (!quiet) {
  console.log(`Security coverage gate — ${securityScenarios} @security scenario(s) in ${dir}\n`);
  const w0 = Math.max(...rows.map((r) => r[0].length), 8);
  for (const [id, state, note] of rows) console.log(`  ${state === "COVERED" ? "✓" : state === "UNCOVERED" || state === "WAIVER-EXPIRED" ? "x" : "·"} ${id.padEnd(w0)}  ${state.padEnd(16)} ${note}`);
}

const fail = uncovered + expired;
if (fail && !reportOnly) {
  console.error(`\nSecurity coverage FAILED: ${uncovered} uncovered surface(s), ${expired} expired waiver(s). Add a @security scenario (its requiredTag) to the feature index, or record a reasoned waiver.`);
  process.exit(1);
}
console.log(`\nSecurity coverage ${fail ? "has gaps (report-only)" : "OK"}.`);
