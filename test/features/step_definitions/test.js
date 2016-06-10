
var steps = function() {
    this.Before(function(scenario, callback) {
        this.scenario = scenario;
        callback();
    });
    
    this.Then(/^this feature runs with background$/, function(callback) {
        callback();
    });

    this.Then(/^Fred runs a passing cucumber scenario$/, function(callback) {
        callback();
    });

    this.Then(/^he choose "([^"]*)" output as one of the formatter$/, function(arg1, callback) {
        callback();
    });

    this.Then(/^the output should contain test results in HTML format$/, function(callback) {
        callback();
    });

    this.Then(/^Fred runs a failing cucumber scenario$/, function(callback) {
        callback();
    });

    this.Then(/^a failing scenario captures a screenshot$/, function(callback) {
        this.scenario.attach(new Buffer('').toString('base64'), 'image/png');
        callback();
    });

    this.Then(/^the output should contain test results with screenshot in HTML format$/, function(callback) {
        callback();
    });

    this.Then(/^Fred attaches the "([^"]*)" to the Given step of passing cucumber scenario$/, function(testData, callback) {
        this.scenario.attach(testData);
        callback();
    });

    this.Then(/^the output should contain test data attached to the Given step in HTML format$/, function(callback) {
        callback();
    });
};


module.exports = steps;
