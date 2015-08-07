/*
 * grunt-cucumberjs
 * https://github.com/mavdi/grunt-cucumberjs
 *
 * Copyright (c) 2013 Mehdi Avdi
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {
    grunt.registerMultiTask('cucumberjs', 'Run cucumber.js features', function() {
        var done = this.async();

        var options = this.options({
            output: 'features_report.html',
            format: 'html',
            saveJson: false,
            theme: 'foundation',
            templateDir: 'features/templates',
            tags: '',
            require: '',
            debug: false,
            debugger: false
        });

        var handler = options.debugger ? require('../lib/requireHandler') : require('../lib/processHandler');

        // resolve options set via cli
        for (var key in options) {
            if (grunt.option(key)) {
                options[key] = grunt.option(key);
            }
        }

        var commands = [];

        if (options.executeParallel && options.workers) {
            commands.push('-w', options.workers);
        }

        if (options.steps) {
            commands.push('-r', options.steps);
        }

        if (options.tags) {
            if (options.tags instanceof Array) {
                options.tags.forEach(function (element, index, array) {
                    commands.push('-t', element);
                });
            } else {
                commands.push('-t', options.tags);
            }
        }

        if (options.format === 'html') {
            if (options.executeParallel) {
                commands.push('-f', 'json:' + options.output + '.json');
            } else {
                commands.push('-f', 'json');
            }
        } else {
            commands.push('-f', options.format);
        }

        if (options.require) {
            if (options.require instanceof Array) {
                options.require.forEach(function (element, index, array) {
                    commands.push('--require', element);
                });
            } else {
                commands.push('--require', options.require);
            }
        }

        if (grunt.option('require')) {
            commands.push('--require', grunt.option('require'));
        }

        if (grunt.option('features')) {
            commands.push(grunt.option('features'));
        } else {
            this.files.forEach(function (f) {
                f.src.forEach(function (filepath) {
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return;
                    }

                    commands.push(filepath);
                });
            });
        }

        handler(grunt, options, commands, function handlerCallback(err) {
            if (err) {
                grunt.log.error('failed tests, please see the output');
                return done(false);
            } else {
                return done();
            }
        });

    });
};
