Feature: Test Feature
  As a programmer
  I want to see if the plugin converts stories into documentation

  Scenario: Create App
    Given I am an unauthenticated user
    And I want to create an application
    And I have an app property "name" defined as "App"
    And I have an app property "platform" defined as "PlatformTest"
    And I have an app property "enabled" defined as "1"
    When I create an application
    Then I should receive a 201 response
    And The response should contain a property called "id"
    And The response should contain a property called "name" defined as "App"