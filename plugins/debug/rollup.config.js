/* eslint-disable no-console */
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

import { readFileSync } from 'node:fs'
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-debug'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    plugins: [commonjs()]
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: `builds/${name}.cjs`,
        format: 'umd',
        name: 'wtfDebug',
        sourcemap: false
      }
    ],
    plugins: [commonjs()]
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: `builds/${name}.min.js`,
        format: 'umd',
        name: 'wtfDebug',
        sourcemap: false
      }
    ],
    plugins: [commonjs(), terser()]
  }
]
