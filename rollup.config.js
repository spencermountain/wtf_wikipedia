import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const banner = '/* wtf_wikipedia ' + version + ' MIT */'
export default [
  // === server-side .mjs (typescript)===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia.mjs', format: 'esm' }],
    external: ['isomorphic-unfetch'],
    plugins: [
      commonjs()
    ],
  },

  // === server-side .js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia.cjs', format: 'umd', name: 'wtf', globals: { "isomorphic-unfetch": 'unfetch' } }],
    external: ['isomorphic-unfetch'],
    plugins: [
      commonjs()
    ],
  },

  // === client-side min.js ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia-client.min.js', format: 'umd', name: 'wtf', sourcemap: false }],
    plugins: [
      nodeResolve({
        browser: true
      }),
      commonjs(),
      terser(),
    ],
  },
  // === client-side .mjs ===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia-client.mjs', format: 'esm', name: 'wtf', sourcemap: false }],
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      terser(),
    ],
  },
]
