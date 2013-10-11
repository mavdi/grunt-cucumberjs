var assert = require('assert');

var steps = function() {

  this.Given(/^I am an unauthenticated user$/, function(callback) {
  // express the regexp above with the code you wish you had
    callback();
  });

  this.Given(/^I want to create an application$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback();
  });

  this.Given(/^I have an app property "([^"]*)" defined as "([^"]*)"$/, function(arg1, arg2, callback) {

    // express the regexp above with the code you wish you had
    callback();
  });

  this.When(/^I create an application$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback();
  });

  this.Then(/^I should receive a (\d+) response$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback();
  });

  this.Then(/^The response should contain a property called "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback();
  });

  this.Then(/^The response should contain a property called "([^"]*)" defined as "([^"]*)"$/, function(arg1, arg2, callback) {
    // express the regexp above with the code you wish you had
    assert.equal(true, false);
    callback();
});

}


module.exports = steps;