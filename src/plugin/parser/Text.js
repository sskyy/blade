import { toCSSRGBA, extractPositionStyle, extractEffectStyle } from './common'

export default function Group(layer) {

  const node = {
    type: "Text",
    props: {
      text: String(layer.sketchObject.stringValue()),
      style: {
        fontSize: layer.sketchObject.fontSize(),
        color : toCSSRGBA(layer.sketchObject.textColor()),
        ...extractPositionStyle(layer)
      }
    }
  }

  return [node, []]
}
