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

export function sendCommandToPanel(path, command, argv) {
  WebViewUtils.sendPanelAction(path, command, argv);
}

export function sendCommandToWindow(path, command, argv) {
  WebViewUtils.sendWindowAction(path, command, argv);
}

export function showWindow(path) {
  // CAUTION use path as identifier
  WebViewUtils.openWindow(path, path);
}

export function showPanel(path) {
  WebViewUtils.showPanel(path, path);
}

export function hidePanel(path) {
  WebViewUtils.hidePanel(path, path);
}

export function recursiveParse(entry, parsers) {
  const { name, query = {} } = parseNameAndQuery(entry.name)
  let resolvedName = name
  if (resolvedName === null) {
    if (entry.isArtboard) {
      resolvedName = 'App'
    } else  if (entry.isGroup) {
      resolvedName = 'Group'
    } else  if (entry.isText) {
      resolvedName = 'Text'
    } else {
      resolvedName = 'Unknown'
    }
  }

  if (parsers[resolvedName] === undefined) {
    log(`unknown parser ${resolvedName}, entry: ${entry.name}, parsers: ${Object.keys(parsers).join(',')}`)
    throw new Error(`unknown parser ${resolvedName}`)
   }

  const [result, next] = parsers[resolvedName](entry)
  if (next && next.length !==0) {
    result.children = next.map(child => recursiveParse(child, parsers))
  }
  return Object.assign(result, {props: Object.assign(result.props, query)})
}

export function isWindowOpened(path) {
  return Boolean(WebViewUtils.findWebView(path))
}
