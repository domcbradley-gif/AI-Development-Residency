Feature: Access control holds at the database, not just the app
  # OWASP: Authorization, Insecure Direct Object Reference Prevention, Business Logic Security, Multi-Tenant Security
  As the platform
  I want authorization enforced by RLS, not only by server-action checks
  So that a direct API call with a valid session cannot bypass the rules

  @security @authz
  Scenario: A user cannot promote themselves to provider
    Given a signed-in community member
    When they try to set their own profile role to "provider", via the app or a direct call
    Then the change is rejected and they remain a community member

  @security @authz
  Scenario: The member roster is not readable by other users
    Given a signed-in user
    When they query the memberships table
    Then they see only their own membership, never the full roster
