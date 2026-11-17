// Enumeration-safe auth messaging — OWASP: Authentication, Credential Stuffing
// Prevention, Error Handling. The sign-in failure message is identical for a
// wrong email, a wrong password, or an unconfirmed account, so no one can learn
// which emails have accounts. specificSafeMessage() returns an actionable
// message ONLY for reasons that are safe to reveal (rate limiting, weak
// password); otherwise null, and the caller shows the generic message. Raw
// provider errors are never shown. Supports abuse case AC-1 (don't confirm that
// a resident uses a housing-support service).

export const GENERIC_SIGNIN = "Email or password is incorrect.";
export const SIGNUP_NOTICE =
  "If this email can be used, we've emailed a confirmation link. Check your inbox to finish setting up your account.";

export function specificSafeMessage(err) {
  const code = (err?.code || "").toLowerCase();
  const text = (err?.message || "").toLowerCase();
  if (err?.status === 429 || code.includes("rate") || text.includes("rate limit")) {
    return "Too many attempts. Please wait a bit and try again.";
  }
  if (code.includes("weak_password") || text.includes("password should") || text.includes("at least 6")) {
    return "Please choose a stronger password (at least 6 characters).";
  }
  return null;
}
