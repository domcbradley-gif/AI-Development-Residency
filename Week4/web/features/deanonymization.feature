Feature: De-anonymization resistance
  # OWASP: User Privacy Protection, Abuse Case (AC-1)
  As a resident
  I want the public record to make it hard to tie a post to me
  So that a watched provider cannot identify and retaliate against me

  @security @privacy-deanon
  Scenario: Public post timestamps are coarse
    Given a note in the community record
    When any viewer reads its timestamp
    Then it is reported at day granularity, not an exact time

  @security @privacy-deanon
  Scenario: The member roster is not exposed to the public or to peers
    Given the memberships that drive quorum
    When a non-owner tries to read them
    Then the roster is not returned; only an aggregate count function is available
