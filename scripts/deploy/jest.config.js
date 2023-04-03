module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '\\.(jsx?|tsx?)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/(*.)+(spec|test).ts?(x)'],
  globals: {
    'ts-jest': { tsconfig: __dirname + '/../tsconfig.json' },
  },
};
