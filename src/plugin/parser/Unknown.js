export default function Unknown(layer) {
  return [{
    type: 'Unknown',
    props: {
      originName: String(layer.name),
    }
  }, []]
}
