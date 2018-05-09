const { injectBabelPlugin } = require('react-app-rewired') // 按需加载样组件和样式的插件
module.exports = function override (config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config)
  // do stuff with the webpack config...
  return config
}
