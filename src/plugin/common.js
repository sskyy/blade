import * as WebViewUtils from 'utils/webview'

export function parseNameAndQuery(inputName, getDefaultValues = () => ({
})) {
  const defaultValues = getDefaultValues()
  const result = { name: '', query: defaultValues, hash: {} }
  const name = String(inputName)
  if (name[0] !== '[') return result

  // name/query/hash
  let state = 'none'
  let stack = ''

  function clearLastStack() {
    if (state === 'name') {
      result.name = stack
    } else if (state === 'query') {
      stack.split('&').forEach((subStack) => {
        const [queryName, queryValue] = subStack.split('=')

        const defaultValue = defaultValues[queryName]
        result.query[queryName] = typeof defaultValue === 'boolean' ?
          Boolean(queryValue) :
          typeof defaultValue === 'number' ?
            Number(queryValue) :
            queryValue
      })
    } else {
      // hash
      stack.split('&').forEach((subStack) => {
        const [queryName, queryValue] = subStack.split('=')

        const defaultValue = defaultValues[queryName]
        result.hash[queryName] = typeof defaultValue === 'boolean' ?
          Boolean(queryValue) :
          typeof defaultValue === 'number' ?
            Number(queryValue) :
            queryValue
      })
    }
    stack = ''
  }

  for (let i = 0; i < name.length; i++) {
    const c = name[i]
    if (c === '[' && state === 'none') {
      state = 'name'
    } else if (c === '?' && (state === 'name' || state === 'hash')) {
      clearLastStack()
      state = 'query'
    } else if (c === '#' && (state === 'name' || state === 'query')) {
      clearLastStack()
      state = 'hash'
    } else if (c === ']' && (state === 'name' || state === 'query' || state === 'hash')) {
      clearLastStack()
      state = 'end'
      return result
    } else {
      stack += c
    }

  }
}

export function sendCommandToPanel(path, command, argv) {
  WebViewUtils.sendPanelAction(path, command, argv)
}

export function sendCommandToWindow(path, command, argv) {
  WebViewUtils.sendWindowAction(path, command, argv)
}

export function showWindow(path) {
  // CAUTION use path as identifier
  WebViewUtils.openWindow(path, path)
}

export function showPanel(path) {
  WebViewUtils.showPanel(path, path)
}

export function hidePanel(path) {
  WebViewUtils.hidePanel(path, path)
}

export function recursiveParse(entry, parsers, context = {}) {
  const { name, query = {}, hash } = parseNameAndQuery(entry.name)
  let resolvedName = name
  if (resolvedName === '') {
    if (entry.isArtboard) {
      resolvedName = 'App'
    } else if (entry.isGroup) {
      resolvedName = 'Group'
    } else if (entry.isText) {
      resolvedName = 'Text'
    } else {
      // resolvedName = 'Unknown'
      resolvedName = 'Img'
    }
  }

  if (parsers[resolvedName] === undefined) {
    log(`unknown parser ${resolvedName}, entry: ${entry.name}, parsers: ${Object.keys(parsers).join(',')}`)
    throw new Error(`unknown parser ${resolvedName}`)
  }

  const [result, next] = parsers[resolvedName](entry, context)
  if (next && next.length !== 0) {
    result.children = next.map(child => recursiveParse(child, parsers, context))
  }
  return Object.assign(result, {
    state: Object.assign(result.state || {}, query),
    props: Object.assign(result.props || {}, hash),
  })
}

export function isWindowOpened(path) {
  return Boolean(WebViewUtils.findWebView(path))
}

export function exportLayer(layer, options = {}) {
  const fileFolder = NSTemporaryDirectory()

  const finalOptions = {
    ...options,
    'use-id-for-name': true,
    scales: '3',
    formats: 'png',
    output: fileFolder,
  }

  const fullPath = `${fileFolder}/${layer.id}@${finalOptions.scales}x.png`

  layer.export(finalOptions)
// TODO renameFile
//   const url = NSURL.fileURLWithPath(fullPath)
//   const data = NSData.alloc().initWithContentsOfURL(url)
//   const base64 = data.base64EncodedStringWithOptions(0)
//   NSFileManager.defaultManager().removeItemAtURL_error(url, null)
//   return `data:image/png;base64,${base64}`
}
