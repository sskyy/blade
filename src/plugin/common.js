import * as WebViewUtils from 'utils/webview';

// TODO
export function parseNameAndQuery(inputName, getDefaultValues = () => {}) {
  const defaultValues = getDefaultValues()
  const result = { name: null, query: defaultValues }
  const name = String(inputName)
  if (name[0] !== '[') return result

  let state = 'none'
  let stack = ''

  for( let i = 0; i < name.length; i++) {
    const c = name[i]
    if (c === '[') {
      state = 'start'
    } else if (c === '?' || (state === 'start' && c === ']')) {
      result.name = stack
      stack = ''
      state = c === ']' ? 'end' : 'query'
    } else if (c === '&' || c === ']') {
      if (stack.length !== 0) {
        const arr = stack.split('=')
        const queryName = arr[0]
        const queryValue = arr[1]

        const defaultValue = defaultValues[queryName]
        result.query[queryName] = typeof defaultValue === 'boolean' ?
          Boolean(queryValue) :
          typeof defaultValue === 'number' ?
            Number(queryValue) :
            queryValue
        stack = ''
      }
      state = c === '&' ? 'queryItem' : 'end'
    } else {
      stack = stack + c
    }
  }
  if (state !== 'end') throw new Error(`state not end ${state}`)
  return result
}

export function sendCommandToPanel(command, argv) {
  WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, command, argv);
}

export function sendCommandToWindow(command, argv) {
  WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, command, argv);
}

export function showWindow(file) {
  WebViewUtils.openWindow(WebViewUtils.windowIdentifier, file);
}

export function showPanel() {
  WebViewUtils.showPanel(WebViewUtils.panelIdentifier);
}

export function hidePanel() {
  WebViewUtils.hidePanel(WebViewUtils.panelIdentifier);
}
