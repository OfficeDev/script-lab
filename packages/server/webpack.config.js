const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve('./build'),
    filename: 'index.js',
    clean: true,
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'web.config', to: 'web.config' }],
    }),
  ],
};
