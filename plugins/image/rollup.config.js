import terser from '@rollup/plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import esbuild from 'rollup-plugin-esbuild'

import fs from 'node:fs'
const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-image'
const banner = `/* ${name} ${version}  MIT */`
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
