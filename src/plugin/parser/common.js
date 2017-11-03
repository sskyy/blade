function map(arr, handler) {
  const result = []
  for (let i = 0; i < arr.count(); i++) {
    result.push(handler(arr[i]))
  }
  return result
}

export function toCSSRGBA(RGBAStr) {
  return `rgba(${String(RGBAStr).replace(/[\(\)]/g, '').split(' ').map((v) => {
    const [type, value] = v.split(':')
    if (type !== 'a') {
      return Math.round(Number(value) * 256)
    }
    return Number(value)
  })
    .join(',')})`
}

function makeShadowCSS(shadow, inset) {
  return `${inset ? 'inset ' : ''}${shadow.offsetX()}px ${shadow.offsetY()}px ${shadow.blurRadius()}px ${shadow.spread()}px ${toCSSRGBA(shadow.color())}`
}

export function extractEffectStyle(layer) {
  const result = {}
  const fills = layer.sketchObject.style().fills()
  const borders = layer.sketchObject.style().borders()
  const shadows = layer.sketchObject.style().shadows()
  const innerShadows = layer.sketchObject.style().innerShadows()
  if (fills.count() > 0) {
    Object.assign(result, {
      background: map(fills, (fill) => {
        return toCSSRGBA(fill.color())
      }).join(','),
    })
  }

  if (borders.count() > 0) {
    const firstBorder = borders[0]
    Object.assign(result, {
      border: `${firstBorder.thickness()}px solid ${toCSSRGBA(firstBorder.color())}`,
    })
  }

  if ((shadows.count() + innerShadows.count()) > 0) {
    const totalShadows = map(shadows, makeShadowCSS).concat(map(innerShadows, s => makeShadowCSS(s, true)))

    Object.assign(result, {
      boxShadow: totalShadows.join(','),
    })
  }

  return result
}

export function extractBoxStyle(layer) {
  return {
    width: layer.frame.width,
    height: layer.frame.height,
  }
}

export function extractPositionStyle(layer) {
  return {
    position: 'absolute',
    left: layer.sketchObject.absoluteRect().rulerX() - layer.container.sketchObject.absoluteRect().rulerX(),
    top: layer.sketchObject.absoluteRect().rulerY() - layer.container.sketchObject.absoluteRect().rulerY(),
  }
}
export function extractBoxRelatedStyle(layer) {
  return Object.assign(extractBoxStyle(layer), extractPositionStyle(layer))
}

export function extractStyle(layer) {
  return Object.assign(
    extractBoxRelatedStyle(layer),
    extractEffectStyle(layer),
  )
}

export function layerToBase64(layer, options = {}) {
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

  const url = NSURL.fileURLWithPath(fullPath)
  const data = NSData.alloc().initWithContentsOfURL(url)
  const base64 = data.base64EncodedStringWithOptions(0)

  NSFileManager.defaultManager().removeItemAtURL_error(url, null)
  return `data:image/png;base64,${base64}`
}

export function iteratorToArray(iter) {
  const result = []
  iter.iterate((item) => result.push(item))
  return result
}
