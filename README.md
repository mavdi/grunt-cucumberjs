# grunt-cucumberjs

> Runs cucumberjs features and output results in various formats including html.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cucumberjs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cucumberjs');
```

## The "cucumberjs" task

### Overview
In your project's Gruntfile, add a section named `cucumberjs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cucumberjs: {
    options: {
      format: 'html',
      output: 'my_report.html',
      theme: 'bootstrap'
    },
    my_features: ['features/feature1.feature', 'features/feature2.feature'],
    other_features: {
      options: {
        output: 'other_report.html'
      },
      src: ['other_features/feature1.feature', 'other_features/feature2.feature']
    }
  }
});
```

If all your feature files are located in the default location of ```features/``` then just leave the feature configuation as an empty array. See following:

```
cucumberjs: {
  options: {
    format: 'html',
    output: './public/report.html',
    theme: 'foundation'
  },
  features : []
}
```

### Usage
```bash
#runs all features specified in task
$ grunt cucumberjs

#you can override options via the cli
$ grunt cucumberjs --require=test/functional/step_definitions/ --features=features/myFeature.feature --format=pretty
```

### Options

#### options.steps
Type: `String`
Default: `''`

Passes the value as ```--steps``` parameter to cucumber.

#### options.require
Type: `String`
Default: `''`

Passes the value as ```--require``` parameter to cucumber. If an array, each item is passed as a separate ```--require``` parameter.
Use if step_definitions and hooks are NOT in default location of ```features/step_definitions```

#### options.tags
Type: `String|Array`
Default: `''`

Passes the value as ```--tags``` parameter to cucumber. If an array, each item is passed as a separate ```--tags``` parameter.

#### options.theme
Type: `String`
Default: `'foundation'`
Available: `['foundation', 'bootstrap', 'simple']`

Specifies which theme to use for the html report

#### options.templateDir
Type: `String`
Default: `'features/templates'`

Location of your custom templates. Simply name the template the same as the one you are trying to override and
grunt-cucumberjs will use it over the default template

#### options.output
Type: `String`
Default: `'features_report.html'`


#### options.format
Type: `String`
Default: `'html'`
Available: `['pretty', 'progress', 'summary', 'html']`

#### options.saveJson
Type: `Boolean`
Default: `'false'`
Available: `['true', 'false']`

To keep or not the generated json file, applicable for options.format = html only.
It will be saved as options.output + '.json'

#### options.debug
Type: `Boolean`
Default: `'false'`
Available: `['true', 'false']`

A flag to turn console log on or off

### Attaching Screenshots to grunt-cucumberjs HTML report

If you are using [WebDriverJS][1] (or related framework) along with [cucumber-js][2] for browser automation, you can attach screenshots to grunt-cucumberjs HTML report. Typically screenshots are taken after a test failure to help debug what went wrong when analyzing results, for example

```javascript
this.After(function (scenario, callback) {
        if(scenario.isFailed()){
            driver.takeScreenshot().then(function (buffer) {
                scenario.attach(new Buffer(buffer, 'base64').toString('binary'), 'image/png');
                 driver.quit().then(function () {
                                callback();
                 });
            });
        }
});
```
Below are some sample HTML reports with screenshots (note that javascript to collapse/expand a screenshots doesn't appear to respond in htmlpreview site below, but they should work fine on locally generated reports,

1. [Bootstrap Theme Reports][3]
2. [Simple Theme Reports][4]
3. [Foundation Theme Reports][5]

[1]: https://code.google.com/p/selenium/wiki/WebDriverJs "WebDriverJS"
[2]: https://github.com/cucumber/cucumber-js "cucumber-js"
[3]: http://htmlpreview.github.io/?https://github.com/nikulkarni/grunt-cucumberjs/blob/screenshot/report/cucumber_report_bootstrap.html "Bootstrap Theme Reports"
[4]: http://htmlpreview.github.io/?https://github.com/nikulkarni/grunt-cucumberjs/blob/screenshot/report/cucumber_report_simple.html "Simple Theme Reports"
[5]: http://htmlpreview.github.io/?https://github.com/nikulkarni/grunt-cucumberjs/blob/screenshot/report/cucumber_report_foundation.html "Foundation Theme Reports"