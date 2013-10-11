/*
 * grunt-cudoc
 * https://github.com/mavdi/cudoc
 *
 * Copyright (c) 2013 Mehdi Avdi
 * Licensed under the MIT license.
 */

/*jshint curly: false */

'use strict';

module.exports = function(grunt) {

  grunt.registerTask('cudoc', 'Generates documentation from Cucumber features', function() {
    console.log('start');
    var done = this.async();

    var options = this.options({
      format: 'html',
      css: 'tasks/templates/styles.css',
      indexTemplate : 'tasks/templates/index.tmpl',
      featuresTemplate : 'tasks/templates/features.tmpl'
    });
    var config = grunt.config.get('cudoc');

    var exec = require('child_process').exec;
    var _ = require('underscore');

    var commands = [];

    if(options.steps) commands.push('-r', options.steps);
    if(options.tags) commands.push('-t', options.tags);
    if(options.format && options.format !== 'html') {
      commands.push('-f', options.format);
    } else if(options.format === 'html') {
      commands.push('-f', 'json');
    }

    exec('./node_modules/.bin/cucumber-js ' + commands.join(' '), function(error, stdout, stderr){
      if(options.format === 'html') {
        publish(JSON.parse(stdout));
      } else {
        grunt.log.write(stdout);
      }
      done();
    });

    var publish = function(features) {
      var rendered = renderFeatures(features);
      var wrapped = wrap(rendered);

      grunt.file.write(config.output || 'output.html', wrapped);
    };

    var renderFeatures = function(features) {
      var source = grunt.file.read('tasks/templates/features.tmpl');
      return _.template(source)({features : features, _ : _ });
    };

    var wrap = function(rendered) {
      var source = grunt.file.read('tasks/templates/index.tmpl');
      var styles = grunt.file.read('tasks/templates/styles.css');
      return _.template(source)({features : rendered, styles : styles});
    };
  });

};