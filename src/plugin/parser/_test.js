function getComponentName(name) {
  if (name.slice(0, 1) !== '[') return null
  let match = ''
  for( let i = 1; i < name.length(); i++) {
    const c = name.slice(i, i+1)
    if (c === ']') break
    match = match + c
  }
  return match
}

function BgImg(layerId) {
  return {
    _type: 'BgImg',
    layerId,
  }
}


function extractPositionCss(layer) {

  const frame = layer.frame

  return {
    left :layer.sketchObject.absoluteRect().rulerX(),
    top: layer.sketchObject.absoluteRect().rulerY(),
    width: frame.width,
    height: frame.height
  }
}


function extractCss(layer) {
  return Object.assign(
    {},
    extractPositionCss(layer)
  )
}



const BG_NAME = 'Bg'

function _Group(group) {
  const next = []
  let bgLayer = null
  group.iterate((layer) => {
    log(layer.name)
    if (getComponentName(layer.name) === BG_NAME) {
      bgLayer = layer
    } else {
      next.push(layer)
    }
  })

  const node = {
    type: "div",
    style: {}
  }

  if (bgLayer) {
    log('have bg')
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.style.background = new BgImg(bgLayer.id)
    } else {
      Object.assign(node.style, extractCss(bgLayer))
    }
  }

  return [node, next]
}

let first
context.api().selectedDocument.selectedLayers.iterate(function (layer) {
  if (!first) first = layer
})

// _Group(first)
log(_Group(first)[0])
