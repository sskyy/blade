var path = require('path');
var fs = require('fs-extra');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var src = resolveApp('src/plugin');
var frameworks = resolveApp('src/frameworks');

module.exports = {
  src,
  entry: resolveApp('src/plugin/index.js'),
  manifest: resolveApp('src/plugin/manifest.json'),
  build: resolveApp('Contents/Sketch'),
  bundle: resolveApp('sketch-plugin-boilerplate.sketchplugin'),
  frameworks,
  frameworksBuild: resolveApp('Contents/Resources/frameworks'),
  watch: [src, frameworks]
};
