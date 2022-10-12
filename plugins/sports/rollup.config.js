import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import resolve from '@rollup/plugin-node-resolve' //import compromise

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-sports'
const banner = `/*! ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    plugins: [
      resolve(),
      commonjs(),
    ],
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfSports', sourcemap: false }],
    plugins: [
      resolve(),
      commonjs(),
    ],
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfSports', sourcemap: false }],
    plugins: [
      resolve(),
      commonjs(),
      terser(),
      sizeCheck({ expect: 9, warn: 10 }),
    ],
  },
]
