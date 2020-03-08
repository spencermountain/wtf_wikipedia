import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import alias from '@rollup/plugin-alias'
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
      alias({
        //remove a bunch of imports with no-ops
        entries: [
          { find: './_data', replacement: __dirname + '/scripts/build/no-ops/_object' },
          { find: '../02-tagger', replacement: __dirname + '/src/02-tagger/tiny' },
          { find: 'efrt-unpack', replacement: __dirname + '/scripts/build/no-ops/_function' }
        ]
      }),
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
