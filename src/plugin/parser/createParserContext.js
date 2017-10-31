import { layerToBase64 } from './common'

export default function createParserContext() {
  const imageRefs = []

  return {
    createImgRef(layer) {
      // TODO 重名检测
      // const name = String(layer.name)
      // imageRefs.push({ id: layer.id, name })
      return layerToBase64(layer)
    },
    getImgRefs(handler) {
      imageRefs.forEach(handler)
    },
  }
}
