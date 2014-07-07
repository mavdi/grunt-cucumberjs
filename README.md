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
$ grunt cucumberjs --features=features/myFeature.feature --format=pretty
```

### Options

#### options.steps
Type: `String`
Default: `''`

passes the value as ```--steps``` parameter to cucumber.

#### options.tags
Type: `String`
Default: `''`

passes the value as ```--tags``` parameter to cucumber.

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
