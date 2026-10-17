module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  ignorePatterns: ['.next', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  rules: {},
}
