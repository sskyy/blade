import * as WebViewUtils from 'utils/webview';

export function findComponentName(name) {
  const match = name.match(/^\[(\w+)\]/)
  return match == null ? null : match[1]
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
