Feature: Anonymity holds for logged-in residents
  As a resident who also has an account (e.g. a community-body member)
  I want to read and post to the record without my post being linked to me
  So that organizing publicly never exposes who filed a complaint
  # OWASP: User Privacy Protection, Abuse Case
  # Abuse case AC-1: a watched provider tries to de-anonymize residents to retaliate.

  @security @privacy-posting
  Scenario: A logged-in resident posts without attaching their identity
    Given a resident is signed in to an account
    When they post a note to the community record
    Then the note is saved and visible in the record
    And the request is made as the anonymous role, carrying no account JWT
    And the stored row contains no column that identifies the account
