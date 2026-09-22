/* eslint-disable no-console */
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import resolve from '@rollup/plugin-node-resolve' //import spacetime

import { readFileSync } from 'node:fs'
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-person'
const banner = `/* ${name} ${version}  MIT */`
export default {
  input: 'src/index.js',
  plugins: [resolve(), commonjs({ requireReturnsDefault: 'auto' })],
  output: [
    {
      banner,
      file: `builds/${name}.mjs`,
      format: 'esm',
    },
    {
      banner,
      file: `builds/${name}.cjs`,
      format: 'cjs',
    },
    {
      banner,
      file: `builds/${name}.min.js`,
      format: 'umd',
      name: 'wtfPerson',
      plugins: [terser(), sizeCheck({ expect: 55, warn: 15 })],
    },
  ],
}
