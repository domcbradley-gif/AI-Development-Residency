@p1 @core
Feature: Provider adds to the official record
  As a provider
  I want to add official-record entries for my organization
  So that the gap can compare them against residents' accounts

  Scenario: A provider-role user adds an official record
    Given I am signed in with the role "provider"
    When I add a synthetic official record for "Maplewood Supportive Housing"
    Then the record is saved

  Scenario: A community member cannot add to the official record
    Given I am signed in with the role "community_member"
    When I attempt to add an official record
    Then the attempt is denied

  @deferred
  Scenario: Richer outcome tracking (future-resourced)
    Given a provider wants to track housed and stayed-housed outcomes over time
    Then that fuller tracker is out of scope for MVP #1
    And only the minimal official-record stub is built this phase
