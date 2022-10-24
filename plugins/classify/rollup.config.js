import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-classify'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    plugins: [
      commonjs()
    ],
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfClassify', sourcemap: false }],
    plugins: [
      commonjs()
    ],
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfClassify', sourcemap: false }],
    plugins: [
      commonjs(),
      terser(),
      sizeCheck({ expect: 43, warn: 10 }),
    ],
  },
]
