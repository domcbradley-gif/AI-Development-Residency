#!/usr/bin/env node
// Gate-check for the Week 1 Claude Skills in .claude/skills/.
// Exits non-zero (fails CI) if any skill is missing, malformed, or a stub,
// so a push that breaks a skill does not pass.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = ".claude/skills";
const MIN_DESCRIPTION = 20; // a description must be more than a few words
const MIN_BODY = 40;        // the body must be real instructions, not a stub

const errors = [];
const fail = (skill, msg) => errors.push(`  x ${skill}: ${msg}`);

if (!existsSync(SKILLS_DIR)) {
  console.error(`No skills directory at ${SKILLS_DIR}`);
  process.exit(1);
}

const dirs = readdirSync(SKILLS_DIR).filter((d) =>
  statSync(join(SKILLS_DIR, d)).isDirectory()
);

if (dirs.length === 0) {
  console.error("No skills found to check.");
  process.exit(1);
}

for (const dir of dirs) {
  const file = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(file)) { fail(dir, "SKILL.md is missing"); continue; }

  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) { fail(dir, "no valid --- frontmatter --- block"); continue; }

  const [, front, body] = m;
  const field = (key) => {
    const line = front.split("\n").find((l) => l.trim().startsWith(key + ":"));
    return line ? line.slice(line.indexOf(":") + 1).trim() : "";
  };
  const name = field("name");
  const description = field("description");

  // Backbone: the structure must be valid.
  if (!name) fail(dir, "frontmatter is missing a name");
  if (!description) fail(dir, "frontmatter is missing a description");

  // Light sanity rules.
  if (name && name !== dir) fail(dir, `name "${name}" does not match folder "${dir}"`);
  if (description && description.length < MIN_DESCRIPTION)
    fail(dir, `description is too short (needs ${MIN_DESCRIPTION}+ characters)`);
  if (body.trim().length < MIN_BODY)
    fail(dir, "body is empty or a stub (needs real instructions)");
}

if (errors.length) {
  console.error(`Claude Skills gate FAILED (${dirs.length} skill(s) checked):`);
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Claude Skills gate passed - ${dirs.length} skill(s) valid: ${dirs.join(", ")}`);
