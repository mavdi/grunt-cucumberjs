/*
 * grunt-cucumberjs
 * https://github.com/mavdi/grunt-cucumberjs
 *
 * Copyright (c) 2013 Mehdi Avdi
 * Licensed under the MIT license.
 */

/*jshint curly: false */

'use strict';

module.exports = function(grunt) {

  var version = grunt.file.readJSON('./package.json').version;

  grunt.registerTask('cucumberjs', 'Generates documentation from Cucumber features', function() {
    var done = this.async();

    var fileTypes = {
      html : 'html',
      json : 'js'
    };

    var options = this.options({
      output: 'features_report.html',
      format: 'html',
      css: 'node_modules/grunt-cucumberjs/templates/foundation/styles.css',
      javascript: 'node_modules/grunt-cucumberjs/templates/foundation/script.js',
      moment: 'node_modules/grunt-cucumberjs/templates/foundation/moment.min.js',
      indexTemplate : 'node_modules/grunt-cucumberjs/templates/foundation/index.tmpl',
      featuresTemplate : 'node_modules/grunt-cucumberjs/templates/foundation/features.tmpl',
      buildTemplate : 'node_modules/grunt-cucumberjs/templates/foundation/build.tmpl'
    });
    var config = grunt.config.get('cucumberjs');

    var spawn = require('child_process').spawn;
    var _ = require('underscore');

    var commands = [];

    if(options.steps) commands.push('-r', options.steps);
    if(options.tags) commands.push('-t', options.tags);
    if(config.format && config.format !== 'html') {
      commands.push('-f', config.format);
    } else if(config.format === 'html') {
      commands.push('-f', 'json');
    }

    var features = grunt.option('features') || config.features;

    if (features) {
      commands.push(features);
      grunt.log.writeln('Running ' + features);
    } else {
      grunt.log.writeln('Running all features');
    }

    var buffer  = [];
    var cucumber = spawn('./node_modules/.bin/cucumber-js', commands);

    cucumber.stdout.on('data', function(data) {
      buffer.push(data);
    });

    cucumber.stderr.on('data', function (data) {
      var stderr = new Buffer(data);
      grunt.log.error(stderr.toString());
    });

    cucumber.on('close', function (code) {
      var stdout = Buffer.concat(buffer);
      if(code != 0) {
        grunt.log.error('failed tests, please see the output');
        (config.format === 'html') ? publish(JSON.parse(stdout)) : grunt.log.write(stdout);
        return done(false);
      }

      publish(JSON.parse(stdout));
      return done();
    });

    var publish = function(features) {
      var renderedFeatures = renderFeatures(features);
      var renderedBuild = renderBuild({
        version: version,
        time: new Date()
      });
      var wrapped = wrap(renderedFeatures, renderedBuild);

      grunt.file.write(options.output, wrapped);
    };

    var renderFeatures = function(features) {
      var source = grunt.file.read(options.featuresTemplate);
      return _.template(source)({features : features, _ : _ });
    };

    var renderBuild = function(build) {
      var source = grunt.file.read(options.buildTemplate);
      return _.template(source)({build : build });
    };

    var wrap = function(renderedFeatures, renderedBuild) {
      var source = grunt.file.read(options.indexTemplate);
      var styles = grunt.file.read(options.css);
      var script = grunt.file.read(options.javascript) + grunt.file.read(options.moment);
      return _.template(source)({features : renderedFeatures, build: renderedBuild, styles : styles, script: script});
    };
  });

};
