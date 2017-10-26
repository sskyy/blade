import {
  windowIdentifier,
  panelIdentifier,
  getFilePath,
  createWebView,
  sendAction as sendActionToWebView,
  receiveAction
} from './webview';

import {
  open as openWindow,
  sendAction as sendWindowAction
} from './window';

import {
  toggle as togglePanel,
  open as openPanel,
  close as closePanel,
  isOpen as isPanelOpen,
  show as showPanel,
  hide as hidePanel,
  sendAction as sendPanelAction
} from './panel';

export {
  windowIdentifier,
  panelIdentifier,
  getFilePath,
  createWebView,
  sendActionToWebView,
  receiveAction,

  openWindow,
  sendWindowAction,

  togglePanel,
  openPanel,
  closePanel,
  showPanel,
  hidePanel,
  isPanelOpen,
  sendPanelAction
};
