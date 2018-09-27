const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./index.ts",
  output: {
    path: path.resolve("./build"),
    filename: "index.js"
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }]
  },
  plugins: [new CopyWebpackPlugin(["web.config"])]
};
