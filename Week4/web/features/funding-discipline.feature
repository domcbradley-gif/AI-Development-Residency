@p1
Feature: Funding discipline in the open
  As a visitor
  I want to inspect who funds the project and any conflicts
  So that I can check its independence

  Scenario: The conflict register is public
    When I open the conflict register
    Then I can read every disclosed conflict of interest

  Scenario: Funder records are public and support a cap check
    When I inspect the funding record
    Then each funder's name and amount are visible
    And no single funder exceeds about 25% of the budget

  Scenario: Money from the watched is disallowed
    Given a funding source is marked as coming from a watched provider
    Then it is treated as disallowed

  @deferred
  Scenario: Securing the funding (future-resourced)
    Given the discipline must hold from day one
    Then actually raising grants, dues, and earned revenue gates the post-residency launch
    And is out of scope for MVP #1
