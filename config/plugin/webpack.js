var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var objectAssign = require('object-assign');

var paths = require('./paths');
var babelConfig = require('./babel');

var isDevelopment = process.env.NODE_ENV !== 'production';

babelConfig = objectAssign(babelConfig, {
  cacheDirectory: isDevelopment,
});

module.exports = {
  entry: paths.entry,
  output: {
    path: paths.build,
    filename: 'plugin.js',
    library: 'handlers',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  }
}
