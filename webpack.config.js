// @flow
'use strict'

const path = require('path')

module.exports = {
  entry: './src/blob-uploader.js',
  output: {
    filename: 'bm-blob-uploader.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'blobUploader'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'env']
          }
        }
      }
    ]
  }
}
