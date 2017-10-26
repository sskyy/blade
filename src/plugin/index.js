import { initWithContext, document } from 'utils/core'
import * as WebViewUtils from 'utils/webview'
import {
  findComponentName,
  sendCommandToWindow,
  sendCommandToPanel,
  showPanel,
  hidePanel,
  showWindow,
} from './common'

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
  const directiveName = findComponentName(selectedLayer.name())

  if (directiveName == null) {
    return hidePanel()
  }

  const command = context.command
  const lastProps = command.valueForKey_onLayer('props', selectedLayer)
  const finalProps = lastProps == null ? {} : lastProps

  showPanel()
  sendCommandToPanel('showProps', finalProps)
}
