import { initWithContext, document } from 'utils/core'
import * as WebViewUtils from 'utils/webview'
import {
  parseNameAndQuery,
  sendCommandToWindow,
  sendCommandToPanel,
  showPanel,
  hidePanel,
  showWindow,
  recursiveParse,
  isWindowOpened
} from './common'
import parsers from './parser'

const RUNNER_URL = 'http://127.0.0.1:8080/runner.html'

export function openRunner (context) {
  initWithContext(context)
  // showWindow('runner.html')
  showWindow(RUNNER_URL)
}

export function sendDataToRunner (context) {
  initWithContext(context)
  if (!context.api) return document.showMessage("error context.api!")
  if (!isWindowOpened(RUNNER_URL)) {
    showWindow(RUNNER_URL)
  }

  let firstArtboard
  context.api().selectedDocument.selectedPage.iterate(function (page) {
    if (!firstArtboard) firstArtboard = page
  })

  if (!firstArtboard || !firstArtboard.isArtboard) return document.showMEssage('please select an artboard')
  // const resultStr = NSString.stringWithFormat("%@", JSON.stringify(recursiveParse(firstArtboard, parsers)))
  // resultStr.writeToFile_atomically(context.document.fileURL().path().replace(/\.sketch$/, '.json'), true)
  const result = recursiveParse(firstArtboard, parsers)
  sendCommandToWindow(RUNNER_URL, 'config', result)
  document.showMessage("done!")
}

export function testSendAction(context) {
  initWithContext(context)
  WebViewUtils.sendAction("aaa", {value: true})
}

export function onSelectionChanged (context) {
  initWithContext(context)
  const document = context.actionContext.document
  const selectedLayers = document.selectedLayers()

  if (!selectedLayers.containsLayers() || selectedLayers.containsMultipleLayers()) {
    return hidePanel()
  }


  const selectedLayer = selectedLayers.firstLayer()
  const directiveName = parseNameAndQuery(selectedLayer.name()).name

  if (directiveName == null) {
    return hidePanel()
  }

  const command = context.command
  const lastProps = command.valueForKey_onLayer('props', selectedLayer)
  const finalProps = lastProps == null ? {} : lastProps

  showPanel()
  sendCommandToPanel('showProps', finalProps)
}

export function exportLayer(context) {
  initWithContext(context)
  let sketch = context.api()
  let options = { "scales" : "3", "formats" : "png" }
        sketch.selectedDocument.selectedLayers.iterate(function(layer) {
        layer.export(options)
    })
  document.showMessage("done!")
}

export function parseLayer(context) {
  initWithContext(context)
  let first
  context.api().selectedDocument.selectedLayers.iterate(function (layer) {
    if (!first) first = layer
  })
  // TODO recursive parse layer
  const result = NSString.stringWithFormat("%@", JSON.stringify(parsers.Group(first)))

  result.writeToFile_atomically(context.document.fileURL().path().replace(/\.sketch$/, '.json'), true)
  document.showMessage("done!")
}
