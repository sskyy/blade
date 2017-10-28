process.env.NODE_ENV = 'production';

var fs = require('fs-extra');
var chalk = require('chalk');
var { logError } = require('./utils/build');

var buildPlugin = require('./plugin/build');
var buildWebView = require('./webview/build');

console.log(chalk.bold('Create production build'));
console.log();

buildPlugin(error => {
  if (error) {
    logError(error);
    return;
  }

  // buildWebView(error => {
  //   if (error) {
  //     logError(error);
  //     return;
  //   }
  //
  //   console.log(chalk.green.bold('✓ FINISHED BUILD '));
  //   console.log(chalk.grey.italic('Run `yarn bundle` to create the final plugin bundle to be published.'))
  // });
});



