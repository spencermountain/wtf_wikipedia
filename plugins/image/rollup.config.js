import { readFileSync } from 'node:fs'
import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import sizeCheck from 'rollup-plugin-filesize-check'

const { name, version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const banner = `/*! ${name} ${version} MIT */`

export default {
  input: 'src/index.js',
  plugins: [esbuild({ target: 'es2018' })],
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
      name: 'wtfImage',
      plugins: [terser(), sizeCheck({ expect: 24, warn: 10 })],
    },
  ],
}
