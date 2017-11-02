import { parseNameAndQuery } from '../common'
import { extractBoxRelatedStyle, extractEffectStyle } from './common'
import { getDefaultState } from '../components/Group'

const BG_NAME = 'Bg'

export default function Group(group, { createImgRef }) {
  const next = []
  let bgLayer = null
  group.iterate((layer) => {
    // TODO 从节点上读数据
    if (parseNameAndQuery(layer.name).name === BG_NAME) {
      bgLayer = layer
    } else {
      next.push(layer)
    }
  })

  const { query } = parseNameAndQuery(group.name, getDefaultState)
  const node = {
    type: 'Group',
    state: Object.assign(query, { style: extractBoxRelatedStyle(group) }),
  }

  if (bgLayer) {
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.state.style.background = createImgRef(bgLayer)
    } else {
      Object.assign(node.state.style, extractEffectStyle(bgLayer))
    }
  }

  return [node, next]
}
