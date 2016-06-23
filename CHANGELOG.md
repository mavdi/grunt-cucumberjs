### 0.10.2 (2016-06-23)

* Show Project Name and Project Version on Foundation theme report
* Fixed the report generation time-stamp on Bootstrap & Foundation themes
    * e.g. Generated 2 days ago
* Fixed custom user defined HTML template
* Added a tests to validate number of scenarios reported on JSON


### 0.10.1 (2016-06-22)

* Fixed `chai` dependencies for /test

### 0.10.0 (2016-06-21)

#### New Features

* Report Suite As a Scenarios
    * `options.reportSuiteAsScenarios`
        
        Type: `Boolean`
        Default: `'false'`
        Available: `['true', 'false']`

        Reports total number of failed/passed Scenarios in headers if set to `true`. 
        Reports total number of failed/passed Features in headers if set to `false` or `undefined`.
        
        e.g. 
        
        ```
        cucumberjs: {
            options: {
                formats: ['html', 'pretty'],
                output: 'test/report/cucumber_report.html',
                theme: 'bootstrap',
                debug: true,
                reportSuiteAsScenarios: true,
                executeParallel: grunt.option('executeParallel') || false,
                require: grunt.option('require', 'test/step_definitions/'),
            },
            src: ['test/features']
        }
        ```

* Support for Cucumber@^1.0.0

* Print Scenarios Data Table on the HTML report

* Deprecated Console logs on HTML report. Instead, use `scenario.attach('text')` 

* Deprecated `options.saveJson` as JSON will be saved by default to the file specified in `options.output`
