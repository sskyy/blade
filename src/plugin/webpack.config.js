const path = require('path')

module.exports = {
  entry: './index',
  output: {
    filename: 'plugin.js',
    path: path.resolve(__dirname, '../../Contents/Sketch'),
    library: 'handlers',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ]
  }
}
