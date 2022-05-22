module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'solid'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/typescript',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    "semi": ["error", "always", {
      "omitLastInOneLineBlock": true,
    }],
    "comma-dangle": ["error", "always-multiline"],
  },
};
