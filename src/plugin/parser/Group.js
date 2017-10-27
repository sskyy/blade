import { parseNameAndQuery } from '../common'
import { BgImg } from './reference'
import { extractBoxRelatedStyle, extractEffectStyle } from './common'
import { getDefaultState } from '../components/Group'

const BG_NAME = 'Bg'

export default function Group(group) {
  const next = []
  let bgLayer = null
  group.iterate((layer) => {
    // TODO 从节点上读数据
    // TODO Parse 直接写在名字上的配置
    if (parseNameAndQuery(layer.name).name === BG_NAME) {
      bgLayer = layer
    } else {
      next.push(layer)
    }
  })

  const { query } = parseNameAndQuery(group.name, getDefaultState)
  const node = {
    type: "Group",
    props: Object.assign(query, extractBoxRelatedStyle(group)),
  }

  if (bgLayer) {
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.props.style.background = new BgImg(bgLayer.id)
    } else {
      // TODO 配置 style 上去
      Object.assign(node.props.style, extractEffectStyle(bgLayer))
    }
  }

  return [node, next]
}
