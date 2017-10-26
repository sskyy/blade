import { receiveAction } from 'actions/bridge';

/**
 * Bridge function that allows the plugin to send data to the
 * web view by calling this function.
 * It is globally defined on the window object in index.js!
 */
export const bridge = (jsonString) => {
  try {
    let jsonData = jsonString ? JSON.parse(jsonString) : {};
    alert( jsonString )
  } catch (error) {
    console.error(error);
  }
};

/**
 * Check if message handler is available
 * The message handler gets registered with the config we use
 * in the plugin to create the web view
 */
export const check = () => {
  return window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.Sketch;
};

/**
 * Send message to plugin using the message handler
 * Uses promise structure
 */
export const sendAction = (name, payload = {}) => {
  return new Promise((resolve, reject) => {
    if (!check()) {
      reject(new Error('Could not connect to Sketch!'));
    }
    window.webkit.messageHandlers.Sketch.postMessage(JSON.stringify({name, payload}));
    resolve();
  });
};
