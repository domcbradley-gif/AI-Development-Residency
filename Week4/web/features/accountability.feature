# User-facing language here is "withdraw / restore support" and "Accountability",
# matching the live app. The route, tables, and audit events are still named
# `warrants` / `warrant_events` under the hood, so those technical names remain.
@p0 @accountability-integrity @core
Feature: Withdraw and restore community support
  As a member of a residents' group
  I want to withdraw the community's support from a provider and restore it later
  So that the community holds a real, reversible check

  Background:
    Given the residents' group "Maplewood Residents Council" oversees "Maplewood Supportive Housing"
    And I am signed in

  Scenario: The accountability register is public
    Given a visitor who is not signed in
    When they open the accountability register
    Then they can read every entry with its provider, group, standing, and dates

  Scenario: A member withdraws the community's support
    Given I am a member of "Maplewood Residents Council"
    When I withdraw support from "Maplewood Supportive Housing"
    Then the provider's standing appears in the register as "Support withdrawn"
    And a receipt of the withdrawal is recorded
    And the entry names one provider and one group and is dated

  Scenario: A non-member cannot withdraw support
    Given I am signed in but not a member of "Maplewood Residents Council"
    When I attempt to withdraw support on that group's behalf
    Then the attempt is denied

  Scenario: A member restores support
    Given support has been withdrawn from "Maplewood Supportive Housing"
    And I am a member of the group that withdrew it
    When I restore support
    Then the provider's standing becomes "Support restored"
    And it records who restored it and when
    And a receipt of the restoration is recorded

  Scenario: Receipts cannot be rewritten
    Given support receipts exist
    When anyone attempts to edit or delete a receipt
    Then the attempt is denied
