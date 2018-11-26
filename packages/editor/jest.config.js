module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'office-ui-fabric-react/lib/': 'office-ui-fabric-react/lib-commonjs/',
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '\\.(jsx?|tsx?)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts?(x)'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.ts',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/__*__/*',
  ],
  globals: {
    'ts-jest': { tsConfig: 'tsconfig.test.json' },
  },

  moduleDirectories: [
    'node_modules',
    // add the directory with the test-utils.js file, for example:
    'src/utils', // a utility folder
    __dirname, // the root directory
  ],
};
