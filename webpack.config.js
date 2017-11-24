/**
 * Created by fed on 2017/11/19.
 */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', 'whatwg-fetch', './index.js'],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
  },
  externals: {
    'babel-polyfill': 'undefined',
    'jquery': 'window.jQuery',
    'moment': 'window.moment',
    'd3': 'window.d3',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.json/,
        loader: 'json5-loader'
      },
      {
        test: /\.png/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    compress: true,
    port: 8888,
    disableHostCheck: true,
    proxy: {
      "/Activity": "http://39.108.171.191:8085"
    }
  },
  plugins: [
    // new UglifyJsPlugin({
    //   minimize: true,
    // })
  ]
};
