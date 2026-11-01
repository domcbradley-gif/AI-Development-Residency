@p0 @independence @core
Feature: Self-organized community body
  As a community member
  I want to join and leave a community body myself
  So that the body stays independent of the provider

  Background:
    Given I am signed in as a community member

  Scenario: Joining a body as myself
    When I join "Maplewood Residents Council"
    Then my membership is created for me
    And it is recorded under my own account

  Scenario: No one can add another person
    When I attempt to add a different user to a body
    Then the attempt is denied

  Scenario: Leaving is self-service
    Given I am a member of "Maplewood Residents Council"
    When I leave the body
    Then only my own membership is removed

  Scenario: No one can remove another person
    When I attempt to remove a different user from a body
    Then the attempt is denied

  Scenario: Quorum is community-governed config
    When I view the body's quorum
    Then it is shown as a provisional value labelled "provisional — not set by the community"
