'use strict';

module.exports = function HandleUsingProcess(grunt, options, commands, callback) {

    var fs = require('fs');
	var jsonFile = require('jsonfile');
    var version = grunt.file.readJSON('./package.json').version;
    var projectPkg = grunt.file.readJSON('package.json');
    var spawn = require('child_process').spawn;
    var _ = require('underscore');
    var commondir = require('commondir');

    var WIN32_BIN_PATH,
		UNIX_BIN_PATH;

	if (options.executeParallel) {
		UNIX_BIN_PATH = 'node_modules/parallel-cucumber/bin/parallel-cucumber-js';
		WIN32_BIN_PATH = 'node_modules\\parallel-cucumber\\bin\\parallel-cucumber-js';
	} else {
		WIN32_BIN_PATH = 'node_modules\\.bin\\cucumber-js.cmd';
		UNIX_BIN_PATH = 'node_modules/cucumber/bin/cucumber.js';
	}

    var buffer = [];
    var cucumber;
    var binPath = '';

    if (process.platform === 'win32') {
        binPath = WIN32_BIN_PATH;
    } else {
        binPath = UNIX_BIN_PATH;
    }

    if (!grunt.file.exists(binPath)) {
		if(options.executeParallel) {
			grunt.log.error('parallel-cucumber-js binary not found at path ' + binPath + '\n NOTE: You cannot install grunt-cucumberjs without bin links on windows');
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

			var featureJsonOutput,
				featureOutput;

			if (options.executeParallel) {
				featureOutput = JSON.stringify(jsonFile.readFileSync(options.output + '.json'));
			} else {
				var jsonOutputFilePath = options.output + '.json';
				var jsonOutput;

				if (fs.existsSync(options.output + '.json')) {
					jsonOutput= JSON.stringify(jsonFile.readFileSync(jsonOutputFilePath));
				} else {
					jsonOutput = Buffer.concat(buffer).toString();
				}

				var featureStartIndex = jsonOutput.search(/\[\s*{\s*\"id\"/g);

				var logOutput = jsonOutput.substring(0, featureStartIndex - 1);

				featureOutput = jsonOutput.substring(featureStartIndex);
			}

            try {
				featureJsonOutput = JSON.parse(featureOutput);
            } catch (e) {
                grunt.log.error('Unable to parse cucumberjs output into json.');

                return callback(false);
            }

            generateReport(featureJsonOutput, logOutput);
        }

        return callback(code);
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
        if (options.output.lastIndexOf('/') > -1) {
            scrshotDir = options.output.substring(0, options.output.lastIndexOf('/')) + '/screenshot/';
        } else {
            scrshotDir = 'screenshot/';
        }
        features.forEach(function(feature) {
            feature.passed = 0;
            feature.failed = 0;
            feature.notdefined = 0;
            feature.skipped = 0;
            feature.relativeFolder = feature.uri.slice(rootDir.length);

            if (!feature.elements) {
                return;
            }

            feature.elements.forEach(function(element) {
                element.passed = 0;
                element.failed = 0;
                element.notdefined = 0;
                element.skipped = 0;

                element.steps.forEach(function(step) {
                    if (step.embeddings !== undefined) {
                        var Base64 = require('js-base64').Base64;
                        step.embeddings.forEach(function (embedding) {
                            if (embedding.mime_type === "text/plain") {
                                if (!step.text) {
                                    step.text = Base64.decode(embedding.data)
                                } else {
                                    step.text = step.text.concat('<br>' + Base64.decode(embedding.data));
                        }
                            }else {
                                var stepData = step.embeddings[0],
                                    name = step.name && step.name.split(' ').join('_') || step.keyword.trim();
                                if (!fs.existsSync(scrshotDir)) {
                                    fs.mkdirSync(scrshotDir);
                                }
                                name = name + Math.round(Math.random() * 10000) + '.png'; //randomize the file name
                                var filename = scrshotDir + name;
                                fs.writeFile(filename, new Buffer(embedding.data, 'base64'), function (err) {
                                    if (err) {
                                        console.error('Error saving screenshot ' + filename); //asynchronously save screenshot
                                    }
                                });
                                step.image = 'screenshot/' + name;
                            }
                        });
                    }

                    if (!step.result) {
                        return 0;
                    }
                    if (step.result.status === 'passed') {
                        return element.passed++;
                    }
                    if (step.result.status === 'failed') {
                        return element.failed++;
                    }
                    if (step.result.status === 'undefined') {
                        return element.notdefined++;
                    }

                    element.skipped++;
                });

                if (element.notdefined > 0) {
                    suite.scenarios.notdefined++;
                    return feature.notdefined++;
                }

                if (element.failed > 0) {
                    suite.scenarios.failed++;
                    return feature.failed++;
                }

                if (element.skipped > 0) {
                    suite.scenarios.skipped++;
                    return feature.skipped++;
                }

                if (element.passed > 0) {
                    suite.scenarios.passed++;
                    return feature.passed++;
                }
            });

            if (feature.failed > 0) {
                return suite.failed++;
            }
            if (feature.passed > 0) {
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
            scenarios: {
                passed: 0,
                failed: 0,
                skipped: 0,
                notdefined: 0
            },
            logOutput: logOutput
        };

        suite = setStats(suite);

        if (options.saveJson) {
            grunt.file.write(options.output + '.json', JSON.stringify(featureOutput, null, '\t'));
        }
        grunt.file.write(
            options.output,
            _.template(grunt.file.read(getPath('index.tmpl')))({
                suite: suite,
                version: version,
                time: new Date(),
                features: _.template(grunt.file.read(getPath('features.tmpl')))({
                    suite: suite,
                    _: _
                }),
                styles: grunt.file.read(getPath('style.css')),
                script: grunt.file.read(getPath('script.js')),
                piechart: (options.theme === 'bootstrap')? grunt.file.read(getPath('piechart.js')) : undefined
            })
        );

        grunt.log.writeln('Generated ' + options.output + ' successfully.');
    };

};
