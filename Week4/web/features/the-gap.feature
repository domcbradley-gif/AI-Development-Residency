@p0 @core
Feature: See the gap between the official record and residents' accounts
  As a visitor
  I want to compare what the official record claims against what residents report
  So that I can see where they disagree

  Background:
    Given the provider "Maplewood Supportive Housing" exists
    And it has official records and resident contributions

  Scenario: The gap shows claim beside lived accounts
    When I open The gap for "Maplewood Supportive Housing"
    Then each category shows the official claim next to the count of resident accounts
    And for "mold" the official claim "No mold or moisture complaints on record" is shown beside residents' reports
    And that category is flagged as a disagreement

  Scenario: Small groups are masked to protect residents
    Given a category has only 2 resident accounts
    When I open The gap
    Then the count is shown as "a few" rather than the exact number

  Scenario: The gap never shows a score
    When I open The gap for any provider
    Then no pass/fail mark or numeric rating of the provider is shown
