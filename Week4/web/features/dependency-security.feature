Feature: Shipped dependencies are free of critical advisories
  # OWASP: Vulnerable Dependency Management, NPM Security, Nextjs Security
  As the platform
  I want production dependencies free of critical advisories, with any high/moderate
  advisory a documented, non-exploitable exception
  So that the deployed app ships nothing known-exploitable in this app's usage

  @security @dependencies
  Scenario: No critical advisory ships, and highs are tracked exceptions
    Given the app's production dependencies
    When they are audited against the advisory database
    Then no advisory of critical severity is present
    And any high or moderate advisory is a documented, non-exploitable exception (see security/dependency-exceptions.md)
