let context = null;
let document = null;
let selection = null;
let sketch = null;

let pluginFolderPath = null;
let frameworkFolderPath = '/Contents/Resources/frameworks/';

function getPluginFolderPath () {
  // Get absolute folder path of plugin
  let split = context.scriptPath.split('/');
  split.splice(-3, 3);
  return split.join('/');
}

export function initWithContext (ctx) {
  // This function needs to be called in the beginning of every entry point!
  // Set all env variables according to current context
  context = ctx;
  document = ctx.document
    || ctx.actionContext.document
    || MSDocument.currentDocument();
  selection = document ? document.selectedLayers() : null;
  pluginFolderPath = getPluginFolderPath();

  // Here you could load custom cocoa frameworks if you need to
  // loadFramework('FrameworkName', 'ClassName');
  // => would be loaded into ClassName in global namespace!
}

export function loadFramework (frameworkName, frameworkClass) {
  // Only load framework if class not already available
  if (Mocha && NSClassFromString(frameworkClass) == null) {
    const frameworkDir = `${pluginFolderPath}${frameworkFolderPath}`;
    const mocha = Mocha.sharedRuntime();
    return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
  }
  return false;
}

export {
  context,
  document,
  selection,
  sketch,
  pluginFolderPath
};
