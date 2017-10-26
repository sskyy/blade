var fs = require('fs-extra');
var chalk = require('chalk');
var paths = require('../../config/plugin/paths');

// Start by clearing current build folder
console.log('Remove old plugin bundle...');
fs.emptyDirSync(paths.bundle);

console.log('Copy files to new bundle...');
fs.copySync(paths.bundleSrc, paths.bundle + '/Contents');

// TODO: remove excluded files, such as Content/Resources/symbols/

console.log(chalk.green.bold('✓ Plugin bundled'));
console.log(chalk.green('You can find the plugin bundle in ' + chalk.italic(paths.bundle)));