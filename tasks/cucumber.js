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

  grunt.registerTask('cucumberjs', 'Generates documentation from Cucumber features', function() {
    console.log('start');
    var done = this.async();

    var fileTypes = {
      html : 'html',
      json : 'js'
    };

    var options = this.options({
      format: 'html',
      css: 'node_modules/grunt-cucumberjs/templates/foundation/styles.css',
      javascript: 'node_modules/grunt-cucumberjs/templates/foundation/script.js',
      indexTemplate : 'node_modules/grunt-cucumberjs/templates/foundation/index.tmpl',
      featuresTemplate : 'node_modules/grunt-cucumberjs/templates/foundation/features.tmpl'
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
    var buffer  = [];
    var cucumber = spawn('./node_modules/.bin/cucumber-js', commands);

    cucumber.stdout.on('data', function(data) {
      buffer.push(data);
    });

    cucumber.stderr.on('data', function (data) {
      var stderr = new Buffer(data);
      grunt.log.error(sterr.toString());
    });

    cucumber.on('close', function (code) {
      var stdout = Buffer.concat(buffer);
      if(code != 0) {
        grunt.log.error('failed tests, please see the output');
        (config.format === 'html') ? publish(JSON.parse(stdout)) : grunt.log.write(stdout);
        return done(false);
      }
      if(config.format === 'html') {
        publish(JSON.parse(stdout));
        return done();
      }

      if(options.output) {
        grunt.file.write(options.output, stdout);
        return done();
      }

      grunt.log.write(stdout);
      return done();
    });

    var publish = function(features) {
      var rendered = renderFeatures(features);
      var wrapped = wrap(rendered);

      grunt.file.write(options.output || 'output.html', wrapped);
    };

    var renderFeatures = function(features) {
      var source = grunt.file.read(options.featuresTemplate);
      return _.template(source)({features : features, _ : _ });
    };

    var wrap = function(rendered) {
      var source = grunt.file.read(options.indexTemplate);
      var styles = grunt.file.read(options.css);
      var script = grunt.file.read(options.javascript);
      return _.template(source)({features : rendered, styles : styles, script: script});
    };
  });

};