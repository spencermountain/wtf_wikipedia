import * as regexpPlugin from "eslint-plugin-regexp"
import compat from "eslint-plugin-compat";
import tseslint from "typescript-eslint";

export default [
  regexpPlugin.configs["flat/recommended"],
  compat.configs["flat/recommended"],
  {
    // parse our .ts files - we don't use the typescript-eslint rules
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    rules: {
      'no-console': 2,
      'no-bitwise': 2,
      "regexp/prefer-d": 0,
      "regexp/prefer-w": 0,
      "regexp/no-unused-capturing-group": 0
    }
  },
  {
    ignores: [
      "**/node_modules/",
      "node_modules/",
      "**/builds/",
      "*.test.js",
      "**/scratch.js",
      "**/rollup.config.js",
      "scripts/*",
    ],
  }
];
