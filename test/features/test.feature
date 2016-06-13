Feature: Grunt Cucumberjs Feature

  In order to review cucumber reports
  Fred, a cucumber user
  Wants to have cucumber reports in HTML

  Background:
    When this feature runs with background

  Scenario: Fred wants to have passing scenarios in the HTML reports
    Given Fred runs a passing cucumber scenario
    When he choose "html" output as one of the formatter
    Then the output should contain test results in HTML format

  Scenario: Fred wants to have failing scenarios in the HTML reports
    Given Fred runs a failing cucumber scenario
    When he choose "html" output as one of the formatter
    And a failing scenario captures a screenshot
    Then the output should contain test results with screenshot in HTML format

  Scenario: Fred wants to print test data in the HTML reports for debugging purpose
    Given Fred attaches the "test data to be printed" to the Given step of passing cucumber scenario
    When he choose "html" output as one of the formatter
    Then the output should contain test data attached to the Given step in HTML format

  Scenario: Fred wants to use data table and print it on HTML report
    Given Fred runs a passing scenario for the following data set
      | id | name   |
      | 1  | data-A |
      | 2  | data-B |
    When he choose "html" output as one of the formatter
    Then the output should contain test table attached in HTML format
