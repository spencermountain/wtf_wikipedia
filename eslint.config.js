import * as regexpPlugin from "eslint-plugin-regexp"
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['**/builds/*', '**/scratch.js', '**/rollup.config.js'] },
  regexpPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node globals
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        fetch: 'readonly',
      }
    },
    // custom rules setup
    rules: {
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'no-empty': 'warn',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'constructor-super': 'error',
      'no-this-before-super': 'error',

      'comma-dangle': ['warn', 'only-multiline'],
      'max-nested-callbacks': ['warn', 4],
      'max-params': ['warn', 5],
      'consistent-return': 'warn',
      'no-nested-ternary': 'warn',
      'no-bitwise': 'warn',
      'no-console': 'warn',
      'no-duplicate-imports': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-multi-assign': 'error',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      radix: 'warn',
      'no-shadow': 'error',
      'no-unmodified-loop-condition': 'warn',
      'no-use-before-define': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-mixed-operators': 'off',
      'no-prototype-builtins': 'off',
      'prefer-const': 'off',
      'regexp/prefer-d': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-super-linear-move': 'warn',
    }
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: { parser: tseslint.parser },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      // TypeScript resolves type names and globals through tsc.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',
    },
  }
]
