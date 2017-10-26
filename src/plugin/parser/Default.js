import { getComponentName } from '../common'
import { BgImg } from './reference'
import { extractCss } from './common'

const BG_NAME = 'Bg'


export default function Default(group) {
  const next = []
  let bgLayer = null
  group.iterate((layer) => {
    // TODO Parse 直接写在名字上的配置
    // TODO 从节点上读数据
    if (getComponentName(layer) === BG_NAME) {
      bgLayer = layer
    } else {
      next.push(layer)
    }
  })

  // TODO 配置位置信息
  const node = {
    type: "div",
    style: {}
  }

  if (bgLayer) {
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.style.background = new BgImg(bgLayer.id)
    } else {
      // TODO 配置 style 上去
      Object.assign(node.style, extractCss(bgLayer))
    }
  }

  return [node, next]
}
