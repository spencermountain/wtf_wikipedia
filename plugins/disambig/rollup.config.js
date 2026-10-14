import { readFileSync } from 'node:fs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sizeCheck from 'rollup-plugin-filesize-check'

const { name, version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const banner = `/*! ${name} ${version} MIT */`

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
      name: 'wtfDisambig',
      plugins: [terser(), sizeCheck({ expect: 55, warn: 15 })],
    },
  ],
}
