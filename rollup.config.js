import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sizeCheck from 'rollup-plugin-filesize-check'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const banner = '/* wtf_wikipedia ' + version + ' MIT */'
export default [
  {
    input: 'src/index.js',
    output: [
      { banner: banner, file: 'builds/wtf_wikipedia.mjs', format: 'esm', preferBuiltins: false }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      json(),
      commonjs(),
      sizeCheck()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
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
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      sizeCheck()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
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
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      terser(),
      sizeCheck()
    ]
  }
]
