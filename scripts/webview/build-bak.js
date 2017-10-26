process.env.NODE_ENV = 'production';
require('dotenv').config({silent: true});

var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var pathExists = require('path-exists');
var webpack = require('webpack');
var config = require('../../config/webview/webpack');
var paths = require('../../config/webview/paths');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
var recursive = require('recursive-readdir');
var stripAnsi = require('strip-ansi');

var useYarn = pathExists.sync(paths.yarnLockFile);

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.indexHtml, paths.indexJs])) {
  process.exit(1);
}

// Print out errors
function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

console.log('Clear old build directory...')
fs.emptyDirSync(paths.build);

// Create the production build and print the deployment instructions.
console.log('Creating an optimized production build...');
webpack(config).run((err, stats) => {
  if (err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  if (stats.compilation.errors.length) {
    printErrors('Failed to compile.', stats.compilation.errors);
    process.exit(1);
  }

  if (process.env.CI && stats.compilation.warnings.length) {
    printErrors('Failed to compile.', stats.compilation.warnings);
    process.exit(1);
  }

  console.log(chalk.green('✓ Compiled successfully.'));
});