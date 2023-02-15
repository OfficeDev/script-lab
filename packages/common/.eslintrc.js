module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-types': 'off',

    // We prefer having an `I` prefacing Interface names, and this rule explicitly disallows
    // this naming convention.
    '@typescript-eslint/interface-name-prefix': 'off',

    // This rule would disable hoisting. By disabling this rule, it allows helper functions and
    // styled components to be placed at the bottom of the file.
    '@typescript-eslint/no-use-before-define': 'off',

    // Allows us to use "!" because occasionally it's useful.
    '@typescript-eslint/no-non-null-assertion': 'off',

    // It is occasionally necessary to use "any." We may eventually change this to "warn"
    // rather than "off."
    '@typescript-eslint/no-explicit-any': 'off',

    // Empty interfaces should be allowed because sometimes you extend two interfaces
    // but don't add anything yourself.
    '@typescript-eslint/no-empty-interface': 'off',

    // We don't want to limit type assertions to primitive types. There are several
    // cases where asserting as an object or interface is helpful.
    '@typescript-eslint/no-object-literal-type-assertion': 'off',

    '@typescript-eslint/no-unused-vars': 'off',

    '@typescript-eslint/no-namespace': 'off',

    '@typescript-eslint/no-empty-function': 'off',

    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
