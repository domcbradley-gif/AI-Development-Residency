@p0 @platform
Feature: Sign up and log in
  As someone who must act (join a body or run a provider)
  I want an account
  So that my actions are attributable

  Scenario: Signing up
    Given I am on the Log in page
    When I choose Sign up and enter an email, password, and role
    Then my account is created and I am signed in
    And the navigation shows me as signed in

  Scenario: Logging in
    Given I already have an account
    When I enter my correct email and password
    Then I am signed in

  Scenario: Wrong credentials are rejected
    Given I already have an account
    When I enter the wrong password
    Then I see an error and am not signed in

  @least-privilege
  Scenario: A profile is private to its owner
    Given I am signed in
    When profiles are read
    Then I can see and edit only my own profile
    And an anonymous visitor cannot read any profile
