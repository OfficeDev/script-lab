const path = require('path');

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader'),
    options: { configFileName: path.resolve(__dirname, './tsconfig.json') },
  });

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
