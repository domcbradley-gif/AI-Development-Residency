@p0 @anonymity @core
Feature: A resident contributes anonymously
  As a supportive-housing resident
  I want to put my experience on the community record without being identified
  So that I can speak up without risking my housing

  Background:
    Given the Community record page is open
    And I am not signed in

  Scenario: Posting a note without an account
    When I type "Black mold has been spreading in my bedroom for months"
    And I choose the topic "mold"
    And I tick the consent checkbox
    And I submit
    Then my note appears at the top of the record
    And the stored note carries no name, email, phone, address, IP, or device id

  Scenario: Consent is required
    Given I have typed "No heat since the cold snap"
    When I have not ticked the consent checkbox
    Then the submit button is disabled

  Scenario Outline: The note body is validated
    When I type a note of "<length>"
    And I tick consent and try to submit
    Then the result is "<result>"

    Examples:
      | length            | result               |
      | empty             | rejected, inline error |
      | 1 character       | accepted             |
      | 5000 characters   | accepted             |
      | 5001 characters   | rejected, inline error |

  Scenario: An identity field cannot be smuggled in
    When a note is submitted with an extra "email" field attached
    Then the email is stripped before the row is saved
    And the saved row contains only the body, topic, and the synthetic flag

  Scenario: Residents cannot edit or delete the record
    Given notes exist on the record
    When an anonymous visitor attempts to change or remove a note
    Then the attempt is denied
