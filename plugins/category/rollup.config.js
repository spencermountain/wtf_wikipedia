import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import sizeCheck from 'rollup-plugin-filesize-check'
import resolve from '@rollup/plugin-node-resolve' //import slow

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-category'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [
      { banner: banner, file: `builds/${name}.mjs`, format: 'esm', globals: { https: 'https' } }
    ],
    external: ['https'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      })
    ]
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: `builds/${name}.js`,
        format: 'umd',
        name: 'wtfCategory',
        sourcemap: true,
        globals: { https: 'https' }
      }
    ],
    external: ['https'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      })
    ]
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: `builds/${name}.min.js`,
        format: 'umd',
        name: 'wtfCategory',
        sourcemap: false,
        globals: { https: 'https' }
      }
    ],
    external: ['https'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      terser(),
      sizeCheck({ expect: 10, warn: 10 })
    ]
  }
]
