import { layerToBase64 } from './common'
import { parseNameAndQuery, parseRawName } from '../common'

function makeResourcePath(id, name) {
  const idStr = String(id)
  return `${(new Array(4-idStr.length)).fill('0').join('')}${idStr}_${name}`
}

export const IMAGE_FOLDER = 'image'



export default function createParserContext() {
  const imageRefs = []
  let imgSrcId = 0
  let imgNameId = 0

  function generateName() {
    imgNameId += 1
    return String(imgNameId)
  }

  return {
    createImgRef(layer) {
      // TODO 生成真实的图片并且做重名检测
      const options = {
        scales: '2',
        formats: 'png',
        ...parseNameAndQuery(layer.name).query
      }
      if (options.formats === 'base64') return layerToBase64(layer)
      imgSrcId += 1
      const name = makeResourcePath(imgSrcId, parseRawName(layer.name) || generateName())
      imageRefs.push({ id: layer.id, name, options })
      log(`get iamge name ${name}`)
      log(`returing image ref: ${IMAGE_FOLDER}/${name}.${options.formats}`)
      return `${IMAGE_FOLDER}/${name}.${options.formats}`
    },
    getImgRefs(handler) {
      imageRefs.forEach(handler)
    },
  }
}
