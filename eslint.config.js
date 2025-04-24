const { defineConfig } = require('eslint/config');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

/** @type {import("eslint").Linter.Config} */
module.exports = defineConfig({
  files: ['src/**/*.ts', 'apps/**/*.ts', 'libs/**/*.ts', 'test/**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    prettier: prettierPlugin,
  },
  ignores: ['.eslintrc.js'],
  rules: {
    ...tsPlugin.configs.recommended.rules,
    ...prettierPlugin.configs.recommended.rules,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
