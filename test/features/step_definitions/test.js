var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Before, Given, Then}) {

    Before(function(scenario, callback) {
        console.log('console logs should not break the report');
        callback();
    });

    Then(/^this feature runs with background$/, function(callback) {
        callback();
    });

    Then(/^Fred runs a passing cucumber scenario$/, function(callback) {
        callback();
    });

    Given(/^Fred runs a passing cucumber scenario on behalf of "([^"]*)"/, function(name, callback) {
        callback();
    });

    Then(/^he choose "([^"]*)" output as one of the formatter$/, function(arg1, callback) {
        callback();
    });

    Then(/^the output should contain test results in HTML format$/, function(callback) {
        callback();
    });

    Then(/^Fred runs a failing cucumber scenario$/, function(callback) {
        callback();
    });

    Then(/^a failing scenario captures a screenshot$/, function(callback) {
        this.attach('', 'image/png');
        callback();
    });

    Then(/^the output should contain test results with screenshot in HTML format$/, function(callback) {
        callback();
    });

    Then(/^he left one of the step as a pending$/, function(callback) {
        callback();
    });

    Then(/^the output should contain the pending test in the HTML pie chart$/, function(callback) {
        callback(null, 'pending');
    });

    Then(/^the output should contain the skipped steps in the HTML pie chart$/, function(callback) {
        callback();
    });

    Then(/^Fred attaches the "([^"]*)" to the Given step of passing cucumber scenario$/, function(testData, callback) {
        this.attach(testData);
        callback();
    });

    Then(/^the output should contain test data attached to the Given step in HTML format$/, function(callback) {
        callback();
    });

    Given(/^Fred runs a passing scenario for the following data set$/, function(table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });

    Then(/^the output should contain data table attached in HTML format$/, function(callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });
});
