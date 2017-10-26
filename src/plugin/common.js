import * as WebViewUtils from 'utils/webview';

export function getComponentName(name) {
  if (name.slice(0, 1) !== '[') return null
  let match = ''
  for( let i = 1; i < name.length(); i++) {
    const c = name.slice(i, i+1)
    if (c === ']') break
    match = match + c
  }
  return match
}

export function sendCommandToPanel(command, argv) {
  WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, command, argv);
}

export function sendCommandToWindow(command, argv) {
  WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, command, argv);
}

export function showWindow() {
  WebViewUtils.openWindow(WebViewUtils.windowIdentifier);
}

export function showPanel() {
  WebViewUtils.showPanel(WebViewUtils.panelIdentifier);
}

export function hidePanel() {
  WebViewUtils.hidePanel(WebViewUtils.panelIdentifier);
}
