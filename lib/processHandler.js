'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var reporter = require('cucumber-html-reporter');

module.exports = function HandleUsingProcess(grunt, options, commands, callback) {

    function getBinPath(winBinPath, unixBinPath) {
        return process.platform === 'win32' ? winBinPath : unixBinPath;
    }

    var WIN32_BIN_PATH,
        UNIX_BIN_PATH;

    if (options.executeParallel) {
        UNIX_BIN_PATH = 'node_modules/grunt-cucumberjs/node_modules/cucumber-parallel/bin/cucumber-parallel';
        WIN32_BIN_PATH = 'node_modules\\grunt-cucumberjs\\node_modules\\cucumber-parallel\\bin\\cucumber-parallel';
        if (!grunt.file.exists(getBinPath(WIN32_BIN_PATH, UNIX_BIN_PATH))) {
            UNIX_BIN_PATH = 'node_modules/cucumber-parallel/bin/cucumber-parallel';
            WIN32_BIN_PATH = 'node_modules\\cucumber-parallel\\bin\\cucumber-parallel';
        }
    } else {
        WIN32_BIN_PATH = 'node_modules\\.bin\\cucumber-js.cmd';
        UNIX_BIN_PATH = 'node_modules/cucumber/bin/cucumber.js';
    }

    var buffer = [];
    var cucumber;
    var binPath = getBinPath(WIN32_BIN_PATH, UNIX_BIN_PATH);

    if (!grunt.file.exists(binPath)) {
        if (options.executeParallel) {
            grunt.log.error('cucumber parallel binary not found at path ' + binPath + '\n NOTE: You cannot install grunt-cucumberjs without bin links on windows');
        } else {
            grunt.log.error('cucumberjs binary not found at path ' + binPath + '\n NOTE: You cannot install grunt-cucumberjs without bin links on windows');
        }
        return callback(false);
    }

    cucumber = spawn(binPath, commands);

    cucumber.stdout.on('data', function(data) {
        if (options.isHtml) {
            if (options.debug) {
                process.stdout.write(data);
            }
            buffer.push(data);
        } else {
            grunt.log.write(data);
        }
    });

    cucumber.stderr.on('data', function(data) {
        if (options.debug) {
            process.stdout.write(data);
        }
        var stderr = new Buffer(data);
        grunt.log.error(stderr.toString());
    });

    cucumber.on('close', function(code) {

        if (options.isHtml) {
            reporter.generate(options);
        }

        return callback(code);
    });
};
