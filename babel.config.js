module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        targets: {
          browsers: [">0.25%", "not IE", "not op_mini all", "not dead"],
        },
        exclude: ["proposal-dynamic-import"],
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: ["babel-plugin-macros", "syntax-jsx"],
};
