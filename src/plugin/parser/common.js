export function extractCss(layer) {
  return Object.assign(
    {},
    extractPositionCss(layer)
  )
}

export function extractPositionCss(layer) {
  return {
    left : layer.x,
    top: layer.y,
    width: layer.width,
    height: layer.height
  }
}
