import { extractBoxRelatedStyle } from './common'

export default function Img(layer, { createImgRef }) {
  return [{
    type: 'Img',
    state: {
      src: createImgRef(layer),
      style: extractBoxRelatedStyle(layer),
    },
  }, []]
}
