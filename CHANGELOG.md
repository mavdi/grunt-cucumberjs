### 1.0.0 (2016-06-20)

#### New Features

* Report Suite As a Scenarios
    * options.reportSuiteAsScenarios
        
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
            }
            src: ['test/features']
        }
        ```

* Support for Cucumber@^1.0.0

* Print Scenarios Data Table on the HTML report

* Deprecated Console logs on HTML report. Instead, use `scenario.attach('text')` 

* Deprecated `options.saveJson` as JSON will be saved by default to the file specified in `options.output`