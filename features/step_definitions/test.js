var assert = require('assert');

var steps = function() {
    this.Given(/^I have a test scenario$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.Given(/^I want to create test a feature$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.Given(/^the future is testable$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.When(/^I choose "([^"]*)" output$/, function(arg1, callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.Then(/^I should see an "([^"]*)"$/, function(arg1, callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.Then(/^the output should contain test results$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback();
    });
};


module.exports = steps;
