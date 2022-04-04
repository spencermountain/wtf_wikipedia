import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-api'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" })
    ]
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfApi', sourcemap: false }],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" })
    ]
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfApi', sourcemap: false }],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" }),
      terser(),
      sizeCheck({ expect: 24, warn: 10 })
    ]
  }
]
