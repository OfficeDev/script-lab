// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env)
  // Extend it as you need.
  // For example, add typescript loader:
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
  })
  config.resolve.extensions.push('.ts', '.tsx')
  config.plugins.push(new MonacoWebpackPlugin())
  return config
}
