// Provisional, community-owned values — PROVISIONAL CLIENT-SIDE CONFIG.
//
// PROVISIONAL — NOT SET BY THE COMMUNITY. These are placeholders chosen by the
// solo developer so the slice runs. A Tier-1 community decision must ratify or
// replace them. The UI shows the label below next to anything governed by these.

export const PROVISIONAL_LABEL = "provisional — not set by the community";

// Body length bounds. These mirror the Postgres CHECK constraint
// (char_length(body) between 1 and 5000), which is the authoritative server-side
// rule; the checks here are for UX only.
export const MIN_BODY_LENGTH = 1;
export const MAX_BODY_LENGTH = 5000;

// Optional, non-identifying topic tags a resident may pick. "other" is the
// catch-all. Not stored as a DB constraint on purpose.
export const TOPIC_ALLOWLIST = [
  "mold",
  "pests",
  "heating",
  "elevator",
  "safety",
  "repairs",
  "other",
];

// Gap display — exposure protection (PROVISIONAL).
// A resident-account count below this threshold is shown as "a few" rather than
// an exact number, so a very small group can't be singled out. Set low here so
// the synthetic demo is legible; a real deployment would set it higher, and the
// value belongs to the community, not the developer.
export const GAP_MIN_DISPLAY_COUNT = 3;
