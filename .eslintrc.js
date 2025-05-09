module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'single-quote': 'off',
    'react/no-unstable-nested-components': 'off',
    'operator-linebreak': [
      'error',
      'before',
      {
        overrides: {
          '=': 'after',
          '-': 'after',
          '+': 'after',
          '*': 'after',
          '%': 'after',
          '&&': 'after',
          '||': 'after',
        },
      },
    ],
    'arrow-parens': ['warn', 'always'],
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
};
