import { describe, it, expect } from "vitest";
import { ANON_CONTRIBUTIONS_AUTH } from "./anon-client-config.js";
import { CONTRIBUTION_COLUMNS, FORBIDDEN_IDENTITY_FIELDS } from "./anonymity.js";

// @security @privacy-posting — executable receipt: the contributions client is
// session-less (no account JWT persisted/sent) and no identifying column is read.
describe("@security anonymity holds for authenticated users", () => {
  it("configures the contributions client to never persist or send a session", () => {
    expect(ANON_CONTRIBUTIONS_AUTH.persistSession).toBe(false);
    expect(ANON_CONTRIBUTIONS_AUTH.autoRefreshToken).toBe(false);
    expect(ANON_CONTRIBUTIONS_AUTH.detectSessionInUrl).toBe(false);
  });
  it("never reads or writes an identifying column", () => {
    for (const f of FORBIDDEN_IDENTITY_FIELDS) {
      expect(CONTRIBUTION_COLUMNS).not.toContain(f);
    }
  });
});
