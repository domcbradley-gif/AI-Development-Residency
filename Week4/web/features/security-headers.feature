Feature: HTTP response security headers
  As the platform
  I want every response to carry hardening headers
  So that clickjacking, MIME-sniffing, and protocol-downgrade attacks are blocked
  # OWASP: Clickjacking Defense, HTTP Headers, HTTP Strict Transport Security, Content Security Policy

  @security @headers
  Scenario: Every route is protected against framing and sniffing
    Given the app serves a response for any route
    When a browser inspects the response headers
    Then "X-Frame-Options" is "DENY" and the CSP sets "frame-ancestors 'none'"
    And "X-Content-Type-Options" is "nosniff"
    And "Strict-Transport-Security" carries a max-age
    And "Referrer-Policy" and "Permissions-Policy" are set
    And the "X-Powered-By" header is not advertised
