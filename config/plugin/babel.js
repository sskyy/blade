module.exports = {
  presets: [
    ['es2015', {
      modules: false
    }]
  ],
  'plugins': [
    // 'transform-object-rest-spread',
    // ["transform-react-jsx", {
    //   "pragma": "createElement"
    // }],
    ['module-resolver', {
      alias: {
        utils: './src/plugin/utils'
      }
    }]
  ]
}