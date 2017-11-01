import { toCSSRGBA, extractPositionStyle } from './common'

export default function TextGroup(layer) {
  const node = {
    type: 'Text',
    state: {
      text: String(layer.sketchObject.stringValue()),
      style: {
        fontSize: layer.sketchObject.fontSize(),
        color: toCSSRGBA(layer.sketchObject.textColor()),
        ...extractPositionStyle(layer),
        // TODO align 翻译
        align: layer.sketchObject.textAlignment(),
        // TODO line spacing 翻译成 line height
        // lineHeight: layer.sketchObject.lineSpacing(),
        letterSpacing: layer.sketchObject.characterSpacing() || 'inherit',
        fontFamily: String(layer.sketchObject.fontPostscriptName()),
      },
    },
  }

  return [node, []]
}
