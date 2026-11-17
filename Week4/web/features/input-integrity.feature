Feature: Contribution integrity at the data boundary
  # OWASP: Input Validation, Mass Assignment, Query Parameterization
  As the platform
  I want the database to own the fields a client must not set
  So that a direct insert cannot forge timestamps, ids, or extra columns

  @security @input
  Scenario: A client cannot set server-controlled fields on a contribution
    Given an anonymous poster
    When they insert a note with an attacker-chosen created_at, id, or synthetic=false
    Then only body and topic are accepted and the server sets the rest
