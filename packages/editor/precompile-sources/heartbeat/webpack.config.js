// cspell:ignore devtool, nosources

const path = require('path');

module.exports = {
  entry: './index.ts',
  devtool: 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '../../../../node_modules')],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/webpack'),
  },
};
