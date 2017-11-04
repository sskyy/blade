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

  throw new Error(`tag not closed: ${inputName}`)
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

export function createFolder(path) {
  const manager = NSFileManager.defaultManager()
  manager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, true, null, null)
    // [file_manager createDirectoryAtPath:[folders objectAtIndex:i] withIntermediateDirectories:true attributes:nil error:nil];
}

export function getPluginFolderPath (context) {
  // Get absolute folder path of plugin
  let split = context.scriptPath.split('/');
  split.splice(-3, 3);
  return split.join('/');
}

export function getCurrentFilePath(context) {
  return context.document.fileURL().path().replace(/\.sketch$/, '')
}

export function isFileExist(source) {
  const manager = NSFileManager.defaultManager()
  return manager.fileExistsAtPath(source)
}

export function copyFile(source, target) {
  const manager = NSFileManager.defaultManager()
  if( !manager.fileExistsAtPath(source)) throw new Error(`file not exist ${source}`)
  // [file_manager copyItemAtPath:org toPath:tar error:nil];
  manager.copyItemAtPath_toPath_error(source, target, null)
}

export function writeToFile(path, content) {
  const resultStr = NSString.stringWithFormat('%@', content)
  resultStr.writeToFile_atomically(path, true)
}

export function removeFile(path) {
  const manager = NSFileManager.defaultManager()
    // [file_manager removeItemAtPath:folder error:nil]
  manager.removeItemAtPath_error(path, null)
}

export function exportLayer(layer, targetFolder, name, options = {}) {
  const finalOptions = {
    ...options,
    'use-id-for-name': true,
    scales: '3',
    formats: 'png',
    output: targetFolder,
  }

  const tmpFullPath = `${targetFolder}/${layer.id}@${finalOptions.scales}x.${finalOptions.formats}`
  layer.export(finalOptions)
  log(`generating image: ${tmpFullPath}`)
  const manager = NSFileManager.defaultManager()
  const targetPath = `${targetFolder}/${name}.${finalOptions.formats}`
  log(`renaming image to ${targetPath}` )
  manager.moveItemAtURL_toURL_error(
    NSURL.fileURLWithPath(tmpFullPath),
    NSURL.fileURLWithPath(targetPath),
    null
  )
}


export function parseRawName(inputName) {
  const name = String(inputName)
  return name.replace(/^\[.+\]/, '')
}
