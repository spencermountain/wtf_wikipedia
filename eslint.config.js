// eslint.config.js
export default [
  {
    rules: {
      'no-console': 2,
      'no-bitwise': 2

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