import { extractBoxRelatedStyle } from './common'

export default function Case(layer) {
  const node = {
    type: 'Case',
    state: {
      style: extractBoxRelatedStyle(layer),
    },
  }
  const next = []
  layer.iterate((sub) => {
    next.push(sub)
  })

  return [node, next]
}
