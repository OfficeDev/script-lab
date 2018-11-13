module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'office-ui-fabric-react/lib/': 'office-ui-fabric-react/lib-commonjs/',
  },
  transform: {
    '\\.(jsx?|tsx?)$': '<rootDir>/../../node_modules/ts-jest/preprocessor.js',
  },
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.ts',

  globals: {
    'ts-jest': { tsConfig: 'tsconfig.test.json' },
  },
};
