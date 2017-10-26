var path = require('path');
var fs = require('fs-extra');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp);

module.exports = {
  src: resolveApp('src/webview/'),
  build: resolveApp('Contents/Resources/webview/'),
  buildBundleJs: 'Contents/Resources/webview/js/index.js',
  indexHtml: resolveApp('src/webview/index.html'),
  indexJs: resolveApp('src/webview/js/index.js'),
  packageJson: resolveApp('package.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths,
  yarnLockFile: resolveApp('yarn.lock'),
  homepage: './'
};