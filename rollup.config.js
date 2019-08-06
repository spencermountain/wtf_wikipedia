import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/wtf_wikipedia.mjs',
        format: 'esm',
        preferBuiltins: false
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      json(),
      commonjs()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/wtf_wikipedia.js',
        format: 'umd',
        sourcemap: true,
        preferBuiltins: false,
        name: 'wtf'
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      json(),
      commonjs()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/wtf_wikipedia.min.js',
        format: 'umd',
        preferBuiltins: false,
        name: 'wtf'
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      json(),
      commonjs(),
      terser()
    ]
  }
]
