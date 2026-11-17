/** @type {import('next').NextConfig} */

// Security response headers — OWASP: Clickjacking Defense, HTTP Headers, HTTP
// Strict Transport Security, Content Security Policy. Applied to every route.
// Receipt: features/security-headers.feature (@security @headers) + the
// executable test lib/security-headers.test.js.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Starter CSP. frame-ancestors/object-src/base-uri/form-action are the hard
    // controls; script/style keep 'unsafe-inline' because MUI/Next emit inline
    // styles — TODO: move to a per-request nonce for full XSS defense-in-depth.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
