import { terser } from 'rollup-plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import esbuild from 'rollup-plugin-esbuild'

import fs from 'fs'
const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-image'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    plugins: [
      esbuild({ target: 'es2018' }),
    ]
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfImage', sourcemap: false }],
    plugins: [
      esbuild({ target: 'es2018' }),
    ]
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfImage', sourcemap: false }],
    plugins: [
      esbuild({ target: 'es2018' }),
      terser(),
      sizeCheck({ expect: 24, warn: 10 })
    ]
  }
]
