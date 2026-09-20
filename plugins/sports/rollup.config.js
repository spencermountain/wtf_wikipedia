import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve' //import compromise
import { readFileSync } from 'node:fs'
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
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
    ]
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfSports', sourcemap: false }],
    plugins: [
      resolve(),
      commonjs(),
    ]
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfSports', sourcemap: false }],
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
]
