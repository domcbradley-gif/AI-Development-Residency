// Pure contribution logic — no network, no Supabase client, no env needed.
//
// Kept separate from api.js so it is trivially unit-testable (see
// anonymity.test.js) and so the trust-boundary shaping of an outgoing row lives
// in one place. The authoritative validation still happens in Postgres (the
// body-length CHECK constraint and RLS); these checks are the client's UX layer.

import { CONTRIBUTION_COLUMNS } from "./anonymity.js";
import { MAX_BODY_LENGTH, MIN_BODY_LENGTH, TOPIC_ALLOWLIST } from "./config.js";

// Column list used for every select/insert projection.
export const PROJECTION = CONTRIBUTION_COLUMNS.join(", ");

// Shape the row we send to Supabase. Anonymous and synthetic by construction:
// no identity field is ever added here, and `synthetic` is always true.
// Throws a clean, user-facing Error on invalid input (no internals leaked).
export function buildInsertRow({ body, topic } = {}) {
  const trimmed = (body ?? "").trim();
  if (trimmed.length < MIN_BODY_LENGTH || trimmed.length > MAX_BODY_LENGTH) {
    throw new Error(
      `Please keep your note between ${MIN_BODY_LENGTH} and ${MAX_BODY_LENGTH} characters.`,
    );
  }

  // Allowlist, not blocklist: only a known topic (or none) is accepted.
  const cleanTopic = topic ? String(topic) : null;
  if (cleanTopic !== null && !TOPIC_ALLOWLIST.includes(cleanTopic)) {
    throw new Error("Please choose a topic from the list.");
  }

  return { body: trimmed, topic: cleanTopic, synthetic: true };
}
