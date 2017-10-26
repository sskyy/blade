module.exports = {
  presets: [
    ['es2015', {
      modules: false
    }]
  ],
  'plugins': [
    'transform-object-rest-spread',
    ['module-resolver', {
      alias: {
        utils: './src/plugin/utils'
      }
    }]
  ]
}