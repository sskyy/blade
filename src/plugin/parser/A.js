import { extractPositionStyle, iteratorToArray } from './common'
import Text from './Text'

export default function A(layer, context) {
  const node = layer.isText ?
    { ...Text(layer, context)[0], type: 'A' }:
    {
      type: 'A',
      state: {
        style: extractPositionStyle(layer)
      }
    }

  const next = layer.isText ? [] : iteratorToArray(layer)

  return [node, next]
}
