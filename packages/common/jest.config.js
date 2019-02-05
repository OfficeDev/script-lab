module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'office-ui-fabric-react/lib/': 'office-ui-fabric-react/lib-commonjs/',
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
};
