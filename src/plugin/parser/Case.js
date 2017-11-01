export default function Case(layer) {
  const node = {
    type: 'Case',
  }
  const next = []
  layer.iterate((sub) => {
    next.push(sub)
  })
  return [node, next]
}
