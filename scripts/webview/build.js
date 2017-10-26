var fs = require('fs-extra');
var chalk = require('chalk');
var webpack = require('webpack');

var webpackConfig = require('../../config/webview/webpack-prod');
var paths = require('../../config/webview/paths');

function build (callback) {
  console.log(chalk.grey.italic('Build web view'));

  console.log('  ✓ Remove old build...');
  fs.emptyDirSync(paths.build);

  webpack(webpackConfig).run((err, stats) => {
    // Catch all errors
    var error = null;
    if (err) {
      error = err;
    } else if (stats.compilation.errors.length) {
      error = stats.compilation.errors;
    } else if (process.env.CI && stats.compilation.warnings.length) {
      error = stats.compilation.warnings;
    }

    if (error) {
      callback(error);
      return;
    }

    // Done :)
    console.log(chalk.green.bold('  ✓ Web view compiled successfully'));
    console.log();

    callback();
  });
}

module.exports = build;
