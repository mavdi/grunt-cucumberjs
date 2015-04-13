'use strict';

module.exports = function HandleUsingRequire(grunt, options, commands, callback) {

    var Cucumber = require('cucumber'),
        argv = ['node', 'cucumber-js'];

    argv.push.apply(argv, commands);

    function runtimeCallback() {
        var succeeded = arguments[0];
        if (succeeded) {
            callback();
        } else {
            callback(new Error("Cucumber tests failed!"));
        }
    }

    Cucumber.Cli(argv).run(runtimeCallback);
};