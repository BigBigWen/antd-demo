const path = require('path')
const webpack = require('webpack')
const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    vendor: [
      'antd',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'react-router-redux',
      'redux',
      'redux-thunk',
      'react-amap',
      'echarts-for-react',
      // 'bootstrap',
      'jquery',
      'moment',
      // 'react-bootstrap-table',
      // 'react-bootstrap',
      // 'react-redux-form',
      'lodash'
    ]
  },
  output: {
    publicPath: '/',
    path: paths.appPublic,
    filename: '[name].[chunkhash:8].dll.js',
    library: '[name]_[chunkhash:8]_library'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        drop_console: true
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true
      }
    }),
    new webpack.DllPlugin({
      path: path.resolve(paths.appPublic, '[name]-[chunkhash:8]-manifest.json'),
      name: '[name]_[chunkhash:8]_library'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.templateHtml,
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ]
}
