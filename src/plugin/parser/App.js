import Group from './Group'

export default function App(...argv) {
  const [result, next ]= Group(...argv)
  return [Object.assign(result, {
    type: 'App',
  }), next]
}
