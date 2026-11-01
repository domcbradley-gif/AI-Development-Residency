@p0 @warrant-integrity @core
Feature: Issue and revoke a community warrant
  As a member of a community body
  I want to issue a warrant against a provider and revoke it later
  So that the community holds a real, reversible check

  Background:
    Given the community body "Maplewood Residents Council" oversees "Maplewood Supportive Housing"
    And I am signed in

  Scenario: The register is public
    Given a visitor who is not signed in
    When they open the warrant register
    Then they can read every warrant with its provider, body, status, and dates

  Scenario: A body member issues a warrant
    Given I am a member of "Maplewood Residents Council"
    When I issue a warrant against "Maplewood Supportive Housing"
    Then the warrant appears in the register with status "issued"
    And a receipt of type "issued" is recorded
    And the warrant names one provider and one body and is dated

  Scenario: A non-member cannot issue a warrant
    Given I am signed in but not a member of "Maplewood Residents Council"
    When I attempt to issue a warrant on that body's behalf
    Then the attempt is denied

  Scenario: A body member revokes a warrant
    Given an issued warrant exists for "Maplewood Supportive Housing"
    And I am a member of the issuing body
    When I revoke the warrant
    Then its status becomes "revoked"
    And it records who revoked it and when
    And a receipt of type "revoked" is recorded

  Scenario: Receipts cannot be rewritten
    Given warrant receipts exist
    When anyone attempts to edit or delete a receipt
    Then the attempt is denied
