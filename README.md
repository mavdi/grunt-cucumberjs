# grunt-cucumberjs

> Generates documentation from Cucumber features

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
        output: 'my_report.html'
      },
      format: 'html'
    },
})
```

### Options

#### options.steps
Type: `String`
Default value: `''`

passes the value as ```--steps``` parameter to cucumber.

#### options.tags
Type: `String`
Default value: `''`

passes the value as ```--tags``` parameter to cucumber.

#### options.css
Type: `String`
Default value: `''`

Location of the CSS styles to be used by the html report wrapper. See ```templates/``` for details.

#### options.indexTemplate
Type: `String`
Default value: `''`

Location of html report wrapper. See ```templates/``` for details.

#### options.featuresTemplate
Type: `String`
Default value: `''`

Location of the html temoplate to be used when running each test. See ```templates/``` for details.

#### options.output
Type: `String`
Default value: `'features_report.html'`

Output file for the task. Please also include the appripriate extension. For example use ```js``` for ```json``` format.

#### format
Type: `String`
Default value: `'html'`

output format for the tests. The options are ```pretty```, ```progress```, ```json```, ```summary``` and ```html```.

```html``` will output a pretty report of your tests. You can use your own templates with this.
