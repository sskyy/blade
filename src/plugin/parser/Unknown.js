export default function Unknown(layer) {
  return [{
    type: 'Unknown',
    state: {
      originName: String(layer.name),
    },
  }, []]
}
