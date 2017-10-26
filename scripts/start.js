process.env.NODE_ENV = 'development';

var fs = require('fs-extra');
var chalk = require('chalk');
var clear = require('clear');

var { logError, observe } = require('./utils/build');

var buildPlugin = require('./plugin/build');
var pluginPaths = require('../config/plugin/paths');

var watching = false;
var timer = null;

// Run build
build();

function build () {
  clear();
  console.log(chalk.bold('Create development build and watch'));
  console.log();

  // Clear interval on rebuild, to set new interval
  // in observe
  clearInterval(timer);

  buildPlugin(error => {
    if (error) {
      logError(error);
      clearInterval(timer);
      return;
    }

    timer = observe({
      interval: 10000, 
      callback: build, 
      watching,
      paths: pluginPaths.watch
    });
    watching = true;
  });
}

