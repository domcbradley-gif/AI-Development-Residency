import { describe, it, expect } from "vitest";
import nextConfig from "../next.config.mjs";

// @security @headers — executable receipt for the HTTP security-headers control.
describe("@security HTTP response security headers", () => {
  it("sets clickjacking, MIME, HSTS, referrer, permissions and CSP headers on every route", async () => {
    const rules = await nextConfig.headers();
    expect(rules.some((r) => r.source === "/:path*")).toBe(true);
    const all = rules.flatMap((r) => r.headers);
    const get = (k) => all.find((h) => h.key.toLowerCase() === k.toLowerCase())?.value;
    expect(get("X-Frame-Options")).toBe("DENY");
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("Strict-Transport-Security")).toMatch(/max-age=\d+/);
    expect(get("Referrer-Policy")).toBeTruthy();
    expect(get("Permissions-Policy")).toBeTruthy();
    expect(get("Content-Security-Policy")).toMatch(/frame-ancestors 'none'/);
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
