import * as regexpPlugin from "eslint-plugin-regexp"

export default [
  regexpPlugin.configs["flat/recommended"],
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
    ],
  }
];