/*
 * grunt-cucumberjs
 * https://github.com/mavdi/grunt-cucumberjs
 *
 * Copyright (c) 2013 Mehdi Avdi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var version = grunt.file.readJSON('./package.json').version;
  var projectPkg = grunt.file.readJSON('package.json');
  var spawn = require('child_process').spawn;
  var _ = require('underscore');

  grunt.registerMultiTask('cucumberjs', 'Run cucumber.js features', function() {
    var done = this.async();

    var options = this.options({
      output: 'features_report.html',
      format: 'html',
      theme: 'foundation',
      templateDir: 'features/templates'
    });

    var commands = [];

    if (options.steps) {
      commands.push('-r', options.steps);
    }

    if (options.tags) {
      commands.push('-t', options.tags);
    }

    if (options.format === 'html') {
      commands.push('-f', 'json');
    } else {
      commands.push('-f', options.format);
    }

    if (grunt.option('features')) {
      commands.push(grunt.option('features'));
    } else {
      this.files.forEach(function(f) {
        f.src.forEach(function(filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return;
          }

          commands.push(filepath);
        });
      });
    }

    var buffer  = [];
    var cucumber = spawn('./node_modules/.bin/cucumber-js', commands);

    cucumber.stdout.on('data', function(data) {
      if (options.format === 'html') {
        buffer.push(data);
      } else {
        grunt.log.write(data);
      }
    });

    cucumber.stderr.on('data', function (data) {
      var stderr = new Buffer(data);
      grunt.log.error(stderr.toString());
    });

    cucumber.on('close', function (code) {
      if (options.format === 'html') {
        generateReport(JSON.parse(Buffer.concat(buffer)));
      }

      if (code !== 0) {
        grunt.log.error('failed tests, please see the output');

        return done(false);
      } else {
        return done();
      }
    });

    /**
     * Adds passed/failed properties on features/scenarios
     *
     * @param {object} suite The test suite object
     */
    var setStats = function(suite) {
      var features = suite.features;

      for (var i=0; i<features.length; i++) {
        features[i].passed = 0;
        features[i].failed = 0;

        for (var j=0; j<features[i].elements.length; j++) {
          features[i].elements[j].passed = 0;
          features[i].elements[j].failed = 0;
          features[i].elements[j].notdefined = 0;
          features[i].elements[j].skipped = 0;
          for (var k=0; k<features[i].elements[j].steps.length; k++) {
            if (features[i].elements[j].steps[k].result.status === 'passed') {
              features[i].elements[j].passed += 1;
            } else if (features[i].elements[j].steps[k].result.status === 'failed') {
              features[i].elements[j].failed += 1;
            } else if (features[i].elements[j].steps[k].result.status === 'undefined') {
              features[i].elements[j].notdefined += 1;
            } else {
              features[i].elements[j].skipped += 1;
            }
          }

          if (features[i].elements[j].failed > 0) {
            features[i].failed += 1;
          } else {
            features[i].passed += 1;
          }
        }

        if (features[i].failed > 0) {
          suite.failed += 1;
        } else {
          suite.passed += 1;
        }
      }

      suite.features = features;

      return suite;
    };

    /**
     * Returns the path of a template
     *
     * @param {string} name The template name
     */
    var getPath = function(name) {
      var path = 'node_modules/grunt-cucumberjs/templates/' + options.theme + '/' + name;

      // return the users custom template if it has been defined
      if (grunt.file.exists(options.templateDir + '/' + name)) {
        path = options.templateDir + '/' + name;
      }

      return path;
    };

    /**
     * Generate html report
     *
     * @param {object} features Features result object
     */
    var generateReport = function(features) {
      var suite = {
        name: projectPkg.name,
        features: features,
        passed: 0,
        failed: 0
      };

      suite = setStats(suite);

      grunt.file.write(
        options.output,
        _.template(grunt.file.read(getPath('index.tmpl')))({
          suite: suite,
          version: version,
          time: new Date(),
          features: _.template(grunt.file.read(getPath('features.tmpl')))({suite : suite, _ : _ }),
          styles: grunt.file.read(getPath('style.css')),
          script: grunt.file.read(getPath('script.js'))
        })
      );

      grunt.log.writeln('Generated ' + options.output + ' successfully.');
    };

  });
};
