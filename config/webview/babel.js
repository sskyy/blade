module.exports = {
  presets: ['react-app'],
  plugins: [
    'transform-object-rest-spread',
    'transform-decorators-legacy',
    ['module-resolver', {
      alias: {
        webview: './src/webview',
        components: './src/webview/js/components',
        actions: './src/webview/js/actions',
        reducers: './src/webview/js/reducers',
        utils: './src/webview/js/utils',
        assets: './src/webview/assets',
        styles: './src/webview/scss'
      }
    }]
  ],
  cacheDirectory: true
}
