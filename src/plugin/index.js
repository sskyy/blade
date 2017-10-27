import { initWithContext, document } from 'utils/core'
import * as WebViewUtils from 'utils/webview'
import {
  parseNameAndQuery,
  sendCommandToWindow,
  sendCommandToPanel,
  showPanel,
  hidePanel,
  showWindow,
} from './common'
import parsers from './parser'

export function openWindow (context) {
  initWithContext(context)
  showWindow()
}

export function refreshHTML (context) {
  initWithContext(context)
  sendCommandToWindow('refresh', {})
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
  const result = NSString.stringWithFormat("%@", JSON.stringify(parsers.Group(first)))

  result.writeToFile_atomically(context.document.fileURL().path().replace(/\.sketch$/, '.json'), true)
  document.showMessage("done!")
}
