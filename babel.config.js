module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          browsers: ['ie >= 11'],
        },
        exclude: ['proposal-dynamic-import'],
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: ['babel-plugin-macros', 'syntax-jsx'],
};
