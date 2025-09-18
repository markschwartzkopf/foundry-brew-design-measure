// eslint.config.js (ESM, ESLint v9)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import promise from 'eslint-plugin-promise';

export default [
  { ignores: ['dist', 'bundle', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Promise plugin (pick ONE of the two blocks below)

  // If your eslint-plugin-promise exposes a flat config:
  // promise.configs['flat/recommended'],

  // Otherwise, fall back to applying the rules explicitly:
  {
    plugins: { promise },
    rules: {
      ...promise.configs.recommended?.rules, // works with most versions
    },
  },

  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { window: 'readonly', document: 'readonly' },
    },
    rules: {
      'prefer-const': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'warn',
      'promise/no-return-wrap': 'warn',
      'promise/param-names': 'warn',
    },
  },
];
