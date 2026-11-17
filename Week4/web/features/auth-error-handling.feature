Feature: Authentication errors do not reveal who has an account
  As the platform
  I want sign-in and sign-up errors to be indistinguishable by account existence
  So that an attacker cannot enumerate which emails have accounts
  # OWASP: Authentication, Credential Stuffing Prevention, Error Handling
  # Supports abuse case AC-1: never confirm that a resident uses a housing-support service.

  @security @auth
  Scenario: Sign-in failures look the same whether or not the email has an account
    Given a visitor submits the sign-in form
    When the email is unknown, the password is wrong, or the account is unconfirmed
    Then the same generic message "Email or password is incorrect." is shown
    And the raw provider error is never displayed

  @security @auth
  Scenario: Sign-up does not confirm whether an email is already registered
    Given a visitor submits the sign-up form for an email that already has an account
    Then the response is the same neutral notice shown for a brand-new sign-up
