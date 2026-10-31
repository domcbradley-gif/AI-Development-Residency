// Anonymity rail test — adapted for the Supabase architecture.
//
// The invariant is unchanged from the FastAPI slice: a contribution must never
// carry identifying data. Previously this was asserted against the SQLAlchemy
// model; now the table lives in Supabase, so we assert it at the client trust
// boundary instead — the columns we read and the row we send must contain none
// of the forbidden identity fields, and every row we send is marked synthetic.
//
// Run with: npm test  (vitest). No network or Supabase env is needed because the
// logic under test is pure (contributions.js / anonymity.js).

import { describe, expect, it } from "vitest";
import { CONTRIBUTION_COLUMNS, FORBIDDEN_IDENTITY_FIELDS } from "./anonymity.js";
import { buildInsertRow } from "./contributions.js";

describe("anonymity rail", () => {
  it("the column projection carries no identifying field", () => {
    const leaked = CONTRIBUTION_COLUMNS.filter((c) =>
      FORBIDDEN_IDENTITY_FIELDS.includes(c),
    );
    expect(leaked).toEqual([]);
  });

  it("an outgoing row carries no identifying field and is marked synthetic", () => {
    const row = buildInsertRow({ body: "a synthetic note", topic: "mold" });
    const leaked = Object.keys(row).filter((k) =>
      FORBIDDEN_IDENTITY_FIELDS.includes(k),
    );
    expect(leaked).toEqual([]);
    expect(row.synthetic).toBe(true);
  });

  it("ignores any identifying field a caller tries to smuggle in", () => {
    // Even if a caller passes extra identity fields, buildInsertRow only ever
    // returns body/topic/synthetic — nothing identifying can pass through.
    const row = buildInsertRow({
      body: "another synthetic note",
      topic: "pests",
      email: "someone@example.com",
      name: "Real Person",
      ip: "203.0.113.7",
    });
    expect(Object.keys(row).sort()).toEqual(["body", "synthetic", "topic"]);
  });

  it("rejects an empty body and an out-of-range body", () => {
    expect(() => buildInsertRow({ body: "   " })).toThrow();
    expect(() => buildInsertRow({ body: "x".repeat(5001) })).toThrow();
  });

  it("rejects a topic outside the provisional allowlist", () => {
    expect(() => buildInsertRow({ body: "ok", topic: "not-a-topic" })).toThrow();
  });
});
