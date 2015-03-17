/*
* grunt-cucumberjs
* https://github.com/mavdi/grunt-cucumberjs
*
* Copyright (c) 2013 Mehdi Avdi
* Licensed under the MIT license.
*/

'use strict';
var fs = require('fs');
module.exports = function(grunt) {

  var version = grunt.file.readJSON('./package.json').version;
  var projectPkg = grunt.file.readJSON('package.json');
  var spawn = require('child_process').spawn;
  var _ = require('underscore');
  var commondir = require('commondir');

  var WIN32_BIN_PATH = 'node_modules\\.bin\\cucumber-js.cmd';
  var UNIX_BIN_PATH = 'node_modules/cucumber/bin/cucumber.js';

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
      debug: false
    });

    // resolve options set via cli
    for (var key in options) {
      if (grunt.option(key)) {
        options[key] = grunt.option(key);
      }
    }

    var commands = [];

    if (options.steps) {
      commands.push('-r', options.steps);
    }

    if (options.tags) {
      if (options.tags instanceof Array) {
        options.tags.forEach(function(element, index, array) {
          commands.push('-t', element);
        });
      } else {
        commands.push('-t', options.tags);
      }
    }

    if (options.format === 'html') {
      commands.push('-f', 'json');
    } else {
      commands.push('-f', options.format);
    }

    if (options.require) {
      if (options.require instanceof Array) {
        options.require.forEach(function(element, index, array) {
          commands.push('--require', element);
        });
      } else {
        commands.push('--require', options.require);
      }
    }

    if(grunt.option('require')) {
      commands.push('--require', grunt.option('require'));
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
    var cucumber;
    var binPath = '';

    if (process.platform === 'win32') {
      binPath = WIN32_BIN_PATH;
    } else {
      binPath = UNIX_BIN_PATH;
    }

    if(!grunt.file.exists(binPath)) {
      grunt.log.error('cucumberjs binary not found at path ' + binPath + '\n NOTE: You cannot install grunt-cucumberjs without bin links on windows');
      return done(false);
    }

    cucumber = spawn(binPath, commands);

    cucumber.stdout.on('data', function(data) {
      if (options.format === 'html') {
        if (options.debug) {
         process.stdout.write(data);
        }
        buffer.push(data);
      } else {
        grunt.log.write(data);
      }
    });

    cucumber.stderr.on('data', function (data) {
      if (options.debug) {
         process.stdout.write(data);
      }
      var stderr = new Buffer(data);
      grunt.log.error(stderr.toString());
    });

    cucumber.on('close', function (code) {
      if (options.format === 'html') {
        var featureJsonOutput;

        var output = Buffer.concat(buffer).toString();

        var featureStartIndex = output.substring(0, output.indexOf('"keyword": "Feature"')).lastIndexOf('[');

        var logOutput = output.substring(0, featureStartIndex - 1);

        var featureOutput = output.substring(featureStartIndex);

        try {
          featureJsonOutput = JSON.parse(featureOutput);
        } catch (e) {
          grunt.log.error('Unable to parse cucumberjs output into json.');

          return done(false);
        }

        generateReport(featureJsonOutput, logOutput);
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
      var rootDir = commondir(_.pluck(features, 'uri'));
      var scrshotDir;
      if(options.output.lastIndexOf('/')>-1) {
        scrshotDir  = options.output.substring(0, options.output.lastIndexOf('/')) + '/screenshot/';
      } else {
        scrshotDir = 'screenshot/';
      }
      features.forEach(function(feature) {
        feature.passed = 0;
        feature.failed = 0;
        feature.relativeFolder = feature.uri.slice(rootDir.length);

        if(!feature.elements) {
          return;
        }

        feature.elements.forEach(function(element) {
          element.passed = 0;
          element.failed = 0;
          element.notdefined = 0;
          element.skipped = 0;

          element.steps.forEach(function(step) {
            if (step.embeddings !== undefined) {
              if(!fs.existsSync(scrshotDir)){
                fs.mkdirSync(scrshotDir);
              }
              var stepData = step.embeddings[0],
                  name= step.name && step.name.split(' ').join('_')|| step.keyword.trim(),
                  name = name + Math.round(Math.random() * 10000) + '.png', //randomize the file name
                  filename = scrshotDir + name;
              fs.writeFile(filename, new Buffer(stepData.data, 'base64'), function(err) {
                  if(err){
                    console.error('Error saving screenshot '+filename); //asynchronously save screenshot
                  }
              });
              step.image = 'screenshot/'+ name;
            }
            if(!step.result) {
              return 0;
            }
            if(step.result.status === 'passed') {
              return element.passed++;
            }
            if(step.result.status === 'failed') {
              return element.failed++;
            }
            if(step.result.status === 'undefined') {
              return element.notdefined++;
            }

            element.skipped ++;
          });

          if(element.failed > 0) {
            return feature.failed++;
          }
          if (element.passed > 0) {
            return feature.passed++;
          }
        });

        if(feature.failed > 0) {
          return suite.failed++;
        }
        if(feature.passed > 0) {
          return suite.passed++;
        }
      });

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
    * @param {object} featureOutput Features result object
    * @param {string} logOutput Contains any console statements captured during the test run
    */
    var generateReport = function(featureOutput, logOutput) {
      var suite = {
        name: projectPkg.name,
        features: featureOutput,
        passed: 0,
        failed: 0,
        logOutput: logOutput
      };

      suite = setStats(suite);

      if (options.saveJson) {
        grunt.file.write(options.output+'.json', JSON.stringify(featureOutput, null, '\t'));
      }
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
