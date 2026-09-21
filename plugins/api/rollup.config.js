/* eslint-disable no-console */
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { readFileSync } from 'node:fs'
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-api'
const banner = `/* ${name} ${version}  MIT */`
export default {
  input: 'src/index.js',
  plugins: [nodeResolve(), commonjs({ requireReturnsDefault: 'auto' })],
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
      name: 'wtfApi',
      plugins: [terser(), sizeCheck({ expect: 24, warn: 10 })],
    },
  ],
}
