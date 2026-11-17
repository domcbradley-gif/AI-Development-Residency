import { describe, it, expect } from "vitest";
import { GENERIC_SIGNIN, SIGNUP_NOTICE, specificSafeMessage } from "./auth-errors.js";

// @security @auth — executable receipt: sign-in errors never reveal whether an
// account exists; only rate-limit / weak-password yield a specific message.
describe("@security auth errors do not enable account enumeration", () => {
  it("returns no specific message for unknown email, wrong password, or unconfirmed account", () => {
    expect(specificSafeMessage({ code: "invalid_credentials", message: "Invalid login credentials" })).toBeNull();
    expect(specificSafeMessage({ code: "email_not_confirmed", message: "Email not confirmed" })).toBeNull();
    expect(specificSafeMessage({ code: "user_already_exists", message: "User already registered" })).toBeNull();
  });
  it("falls back to one identical generic sign-in message", () => {
    expect(GENERIC_SIGNIN).toBe("Email or password is incorrect.");
    expect(SIGNUP_NOTICE).not.toMatch(/already|exists|registered/i);
  });
  it("only reveals safe, non-enumerating reasons", () => {
    expect(specificSafeMessage({ status: 429 })).toMatch(/too many/i);
    expect(specificSafeMessage({ code: "weak_password" })).toMatch(/stronger password/i);
  });
});
