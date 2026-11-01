// Anonymity rail (client side).
//
// This is a safety rail, not a feature. The Supabase `contributions` table has
// NO identifying columns, so the record cannot be traced to an individual. These
// constants keep the client honest about that: we only ever read/write the
// columns below, and the anonymity test asserts none of the forbidden identity
// fields can appear in what we read or send.

// The only columns the client ever touches. Mirrors the schema exactly.
export const CONTRIBUTION_COLUMNS = ["id", "body", "topic", "created_at", "synthetic"];

// Fields that would make a contribution traceable to a person. None of these
// may appear on the table, in a read projection, or in an insert payload.
export const FORBIDDEN_IDENTITY_FIELDS = Object.freeze([
  "resident_id",
  "user_id",
  "name",
  "full_name",
  "email",
  "phone",
  "address",
  "ip",
  "ip_address",
  "device_id",
  "session_id",
]);
