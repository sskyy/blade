import { extractBoxStyle } from './common'

export default function Img(layer, { createImgRef }) {
  return [{
    type: 'Img',
    props: {
      src: createImgRef(layer),
      style: extractBoxStyle(layer),
    },
  }, []]
}
