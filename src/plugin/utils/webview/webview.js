import { pluginFolderPath, document, context } from 'utils/core';
import ObjCClass from 'cocoascript-class';

// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
let windowIdentifier = 'sketch-plugin-boilerplate--window';
let panelIdentifier = 'sketch-plugin-boilerplate--panel';

// Since we now create the delegate in js, we need the enviroment
// to stick around for as long as we need a reference to that delegate
coscript.setShouldKeepAround(true);

// This is a helper delegate, that handles incoming bridge messages
export const BridgeMessageHandler = new ObjCClass({
  'userContentController:didReceiveScriptMessage:': function (controller, message) {
    try {
      const bridgeMessage = JSON.parse(String(message.body()));
      receiveAction(bridgeMessage.name, bridgeMessage.data);
    } catch (e) {
      log('Could not parse bridge message');
      log(e.message);
    }
  }
});

log('BridgeMessageHandler');
log(BridgeMessageHandler);
log(BridgeMessageHandler.userContentController_didReceiveScriptMessage);

export function initBridgedWebView (frame, bridgeName = 'SketchBridge') {
  const config = WKWebViewConfiguration.alloc().init();
  const messageHandler = BridgeMessageHandler.alloc().init();
  config.userContentController().addScriptMessageHandler_name(messageHandler, bridgeName);
  config.preferences().setValue_forKey(true, 'developerExtrasEnabled')
  return WKWebView.alloc().initWithFrame_configuration(frame, config);
}

export function getFilePath (file) {
  return `${pluginFolderPath}/Contents/Resources/webview/${file}`;
}

export function createWebView (path, frame) {
  const webView = initBridgedWebView(frame, 'Sketch');
  const url = path.slice(0, 4) === 'http' ? NSURL.URLWithString(path) : NSURL.fileURLWithPath(getFilePath(path));
  log('File URL');
  log(url);

  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
  webView.loadRequest(NSURLRequest.requestWithURL(url));

  return webView;
}

export function sendAction (webView, name, payload = {}) {
  if (!webView || !webView.evaluateJavaScript_completionHandler) {
    return;
  }
  // `sketchBridge` is the JS function exposed on window in the webview!
  const script = `sketchBridge(${JSON.stringify({name, payload})});`;
  webView.evaluateJavaScript_completionHandler(script, null);
}

export function receiveAction (name, payload = {}) {
  document.showMessage('I received a message! 😊🎉🎉');
}

export {
  windowIdentifier,
  panelIdentifier
};
