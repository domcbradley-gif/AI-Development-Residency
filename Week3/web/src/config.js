// Provisional, community-owned values — PROVISIONAL CLIENT-SIDE CONFIG.
//
// PROVISIONAL — NOT SET BY THE COMMUNITY. These are placeholders chosen by the
// solo developer so the slice runs. They are deliberately NOT encoded as
// database constraints (the Supabase schema does not restrict `topic`); a Tier-1
// community decision must ratify or replace them. The UI shows the label below
// next to anything governed by these values.

export const PROVISIONAL_LABEL = "provisional — not set by the community";

// Body length bounds. These mirror the Postgres CHECK constraint
// (char_length(body) between 1 and 5000), which is the authoritative server-side
// rule; the checks here are for UX only.
export const MIN_BODY_LENGTH = 1;
export const MAX_BODY_LENGTH = 5000;

// Optional, non-identifying topic tags a resident may pick. "other" is the
// catch-all. Not stored as a DB constraint on purpose — see note above.
export const TOPIC_ALLOWLIST = [
  "mold",
  "pests",
  "heating",
  "elevator",
  "safety",
  "repairs",
  "other",
];
