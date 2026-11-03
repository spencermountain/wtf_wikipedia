import { readFileSync } from 'node:fs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sizeCheck from 'rollup-plugin-filesize-check'

const { name, version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
)
const banner = `/*! ${name} ${version} MIT */`

export default [
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf-plugin-nsfw.mjs', format: 'esm' }],
    plugins: [nodeResolve(), terser()]
  },
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf-plugin-nsfw.cjs',
        format: 'umd',
        sourcemap: false,
        name: 'wtfNsfw'
      }
    ],
    plugins: [nodeResolve()]
  },
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf-plugin-nsfw.min.js',
        format: 'umd',
        name: 'wtfNsfw'
      }
    ],
    plugins: [nodeResolve(), terser(), sizeCheck({ expect: 28, warn: 15 })]
  }
]
