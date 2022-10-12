import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import sizeCheck from 'rollup-plugin-filesize-check'
import { nodeResolve } from '@rollup/plugin-node-resolve' //import https

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const name = 'wtf-plugin-image'
const banner = `/* ${name} ${version}  MIT */`
export default [
  // ===  es-module ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.mjs`, format: 'esm' }],
    external: ['isomorphic-unfetch'],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" }),
    ],
  },

  // === .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.cjs`, format: 'umd', name: 'wtfImage', sourcemap: false, globals: { "isomorphic-unfetch": 'unfetch' } }],
    external: ['isomorphic-unfetch'],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" }),
    ],
  },
  // ===  min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: `builds/${name}.min.js`, format: 'umd', name: 'wtfImage', sourcemap: false, globals: { "isomorphic-unfetch": 'unfetch' } }],
    external: ['isomorphic-unfetch'],
    plugins: [
      nodeResolve(),
      commonjs({ requireReturnsDefault: "auto" }),
      terser(),
      sizeCheck({ expect: 9, warn: 10 }),
    ],
  },
]
